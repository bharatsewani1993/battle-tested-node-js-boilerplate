const { success, failure } = require('../objects/return.objects');
const organizationModel = require('../models/organizationModel');
const organizationUserModel = require('../models/organizationUserModel.js');
const roleModel = require('../models/roleModel');
const permissionModel = require('../models/permissionModel');
const rolePermissionModel = require('../models/rolePermissionModel');
const userModel = require('../models/userModel');
const { catchBlockErrorHandler } = require('../utils/errorHandler');
const { set } = require('./redisService.js');
const emailService = require('./emailService');
const ENV = require('../env/index').envSettings();
const emailTemplates = require('../templates/email');

const createOrganization = async (orgObj) => {
    try {
        // Create organization object
        const insertObj = {
            name: orgObj.name,
            description: orgObj.description,
            ownerId: orgObj.ownerId,
            status:'DRAFT'
        };

        // Create organization in database
        const createdOrg = await organizationModel.create(insertObj);

        // Create owner role for the organization
        const ownerRole = await roleModel.create({
            name: 'owner',
            description: 'Organization owner with all permissions',
            isDefault: 0,  // Not a default role, but a custom one
            organizationId: createdOrg.id,
            createdBy: orgObj.ownerId,
        });

        // Add owner to organization_users table with the new roleId
        await organizationUserModel.create({
            organizationId: createdOrg.id,
            userId: orgObj.ownerId,
            roleId: ownerRole.id,
            inviteStatus: 'accepted'
        });

        // Get all permissions and assign them to the owner role        
        const allPermissions = await permissionModel.findAll();

        // Assign all permissions to the owner role
        const permissionAssignments = allPermissions.map(permission => ({
            roleId: ownerRole.id,
            permissionId: permission.id,
            createdBy: orgObj.ownerId
        }));

        await rolePermissionModel.bulkCreate(permissionAssignments);

        // Set current organization in Redis
        const redisObj = {
            key: orgObj.key,
            organizationId: createdOrg.id,
            roleId: ownerRole.id,
            permissions: allPermissions.map(permission => permission.key),
            expiry: 86400 // 24 hours
        };
        await set(redisObj);

        const successObj = success();
        successObj.data.push(createdOrg);
        successObj.message = "Organization created successfully!";
        return successObj;
    } catch (error) {
        catchBlockErrorHandler(error);
        const failureObj = failure();
        failureObj.message = error.message;
        return failureObj;
    }
};

const patchUpdateOrganization = async (orgObj) => {
    try {
        const { name, description,status, organizationId, userId } = orgObj;

        // First check if user is the owner of the organization
        const organization = await organizationModel.findOne({
            where: {
                id: organizationId,
                ownerId: userId,
                active: 'YES'
            }
        });

        if (!organization) {
            const failureObj = failure();
            failureObj.message = "Organization not found or you don't have permission to update";
            return failureObj;
        }

        // Update organization
        await organizationModel.update(
            { name, description,status },
            {
                where: {
                    id: organizationId,
                    ownerId: userId,
                    active: 'YES'
                }
            }
        );

        const updatedOrg = await organizationModel.findOne({
            where: {
                id: organizationId,
                active: 'YES'
            }
        });

        const successObj = success();
        successObj.data.push(updatedOrg);
        successObj.message = "Organization updated successfully!";
        return successObj;
    } catch (error) {
        catchBlockErrorHandler(error);
        const failureObj = failure();
        failureObj.message = error.message;
        return failureObj;
    }
};

const deleteOrganization = async (organizationId, userId) => {
    try {
        // First check if user is the owner of the organization
        const organization = await organizationModel.findOne({
            where: {
                id: organizationId,
                ownerId: userId,
                active: 'YES'
            }
        });

        if (!organization) {
            const failureObj = failure();
            failureObj.message = "Organization not found or you don't have permission to delete";
            return failureObj;
        }

        // Soft delete by setting active to 0
        await organizationModel.update(
            { active: 'NO' },
            {
                where: {
                    id: organizationId,
                    ownerId: userId,
                    active:'YES'
                }
            }
        );

        const successObj = success();
        successObj.message = "Organization deleted successfully!";
        return successObj;
    } catch (error) {
        catchBlockErrorHandler(error);
        const failureObj = failure();
        failureObj.message = error.message;
        return failureObj;
    }
};

const postInviteMember = async (inviteObj) => {
    try {
        const { email, roleId,fullName,organizationId, invitedBy } = inviteObj;

        // Check if the role belongs to the organization
        const role = await roleModel.findOne({
            where: {
                id: roleId,
                organizationId:organizationId,
                active: 'YES'
            }
        });

        if (!role) {
            const failureObj = failure();
            failureObj.message = "Invalid role selected for this organization";
            return failureObj;
        }

        // Check if the organization exists
        const organization = await organizationModel.findOne({
            where: {
                id: organizationId,
                active: 'YES'
            }
        });

        if (!organization) {
            const failureObj = failure();
            failureObj.message = "Organization not found";
            return failureObj;
        }

        // Check if user exists, if not create one
        let user = await userModel.findOne({
            where: {
                email:email,
                active: 'YES'
            }
        });

        let userId;
        if (!user) {
            // Create a new user
            const newUser = await userModel.create({
                email:email,
                verified: 0,
                fullName:fullName,
                active: 'YES'
            });
            userId = newUser.id;
        } else {
            userId = user.id;
            await user.update({
                fullName:fullName
            })
            await user.reload();
        }


        // Check if user is already a member of the organization
        const existingMember = await organizationUserModel.findOne({
            where: {
                organizationId:organizationId,
                userId:userId,
                active: 'YES'
            }
        });


        if (existingMember) {
            if (existingMember.inviteStatus === 'accepted') {
                const failureObj = failure();
                failureObj.message = "User is already a member of this organization";
                return failureObj;
            } else {
                // Update the existing invitation with new role
                await organizationUserModel.update(
                    {
                        roleId,
                        invitedBy
                    },
                    {
                        where: {
                            id: existingMember.id
                        }
                    }
                );
            }
        } else {
            // Create new invitation
            await organizationUserModel.create({
                organizationId:organizationId,
                userId:userId,
                roleId:roleId,
                inviteStatus: 'pending',
                invitedBy,
            });
        }

        // Send invitation email
        if (ENV.STAGE !== 'LOCAL') {
            const inviteLink = `${ENV.FRONTEND_URL}/accept-invite?organizationId=${organizationId}&email=${email}`;

            let emailSubject, emailMessage;
            if (!user) {
                // New user
                emailSubject = `Invitation to join ${organization.name} on ${ENV.PROJECT_NAME}`;
                emailMessage = `You've been invited to join ${organization.name} with the role of ${role.name}. 
                                Clicking the invitation link will verify your email and create your account.`;
            } else {
                // Existing user
                emailSubject = `Invitation to join ${organization.name} on ${ENV.PROJECT_NAME}`;
                emailMessage = `You've been invited to join ${organization.name} with the role of ${role.name}. 
                                After accepting this invitation, you'll be able to access this organization.`;
            }

            const emailObj = {
                to: email,
                subject: emailSubject,
                html: emailTemplates.organizationInviteTemplate(organization.name, inviteLink, role.name, emailMessage),
            };

            emailService.sendEmail(emailObj);
        }

        const successObj = success();
        successObj.message = "Invitation sent successfully";
        // Add useful info to the response
        successObj.data.push({
            email,
            organizationId,
            fullName,
            organizationName: organization.name,
            roleName: role.name,
            userStatus: !user ? "New user (will be verified on acceptance)" : "Existing user"
        });
        return successObj;
    } catch (error) {
        catchBlockErrorHandler(error);
        const failureObj = failure();
        failureObj.message = error.message;
        return failureObj;
    }
};

const getCurrentOrganization = async (organizationId) => {
    try {
        // Check if organization is selected
        if (!organizationId) {
            const failureObj = failure();
            failureObj.status = 400;
            failureObj.message = "No organization is currently selected";
            return failureObj;
        }

        // Get organization details
        const organization = await organizationModel.findOne({
            where: {
                id: organizationId,
                active: 'YES'
            },
            attributes: ['id', 'name', 'description', 'ownerId', 'createdAt', 'updatedAt']
        });

        if (!organization) {
            const failureObj = failure();
            failureObj.message = "Organization not found";
            return failureObj;
        }

        // Get the owner details
        const owner = await userModel.findOne({
            where: {
                id: organization.ownerId,
                active: 'YES'
            },
            attributes: ['id', 'name', 'email']
        });

        // Get member count for the organization
        const memberCount = await organizationUserModel.count({
            where: {
                organizationId: organizationId,
                active: 'YES',
                inviteStatus: 'accepted'
            }
        });

        const orgDetails = {
            id: organization.id,
            name: organization.name,
            description: organization.description,
            owner: owner ? {
                id: owner.id,
                name: owner.name,
                email: owner.email
            } : null,
            memberCount,
            createdAt: organization.createdAt,
            updatedAt: organization.updatedAt
        };

        const successObj = success();
        successObj.data.push(orgDetails);
        successObj.message = "Organization details retrieved successfully";
        return successObj;
    } catch (error) {
        catchBlockErrorHandler(error);
        const failureObj = failure();
        failureObj.message = error.message;
        return failureObj;
    }
};

module.exports = {
    createOrganization,
    patchUpdateOrganization,
    deleteOrganization,
    postInviteMember,
    getCurrentOrganization
}; 