const { success, failure } = require('../objects/return.objects');
const organizationModel = require('../models/organizationModel');
const organizationUserModel = require('../models/organizationUserModel.js');
const roleModel = require('../models/roleModel');
const permissionModel = require('../models/permissionModel');
const rolePermissionModel = require('../models/rolePermissionModel');
const { catchBlockErrorHandler } = require('../utils/errorHandler');
const { set } = require('./redisService.js');

const createOrganization = async (orgObj) => {
    try {
        // Create organization object
        const insertObj = {
            name: orgObj.name,
            description: orgObj.description,
            ownerId: orgObj.ownerId
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
            active: 1
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
        const { name, description, organizationId, userId } = orgObj;

        // First check if user is the owner of the organization
        const organization = await organizationModel.findOne({
            where: {
                id: organizationId,
                ownerId: userId,
                active: 1
            }
        });

        if (!organization) {
            const failureObj = failure();
            failureObj.message = "Organization not found or you don't have permission to update";
            return failureObj;
        }

        // Update organization
        await organizationModel.update(
            { name, description },
            {
                where: {
                    id: organizationId,
                    ownerId: userId,
                    active: 1
                }
            }
        );

        const updatedOrg = await organizationModel.findOne({
            where: {
                id: organizationId,
                active: 1
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

const deleteOrganization = async (orgId, userId) => {
    try {
        // First check if user is the owner of the organization
        const organization = await organizationModel.findOne({
            where: {
                id: orgId,
                ownerId: userId,
                active: 1
            }
        });

        if (!organization) {
            const failureObj = failure();
            failureObj.message = "Organization not found or you don't have permission to delete";
            return failureObj;
        }

        // Soft delete by setting active to 0
        await organizationModel.update(
            { active: 0 },
            {
                where: {
                    id: orgId,
                    ownerId: userId
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

module.exports = {
    createOrganization,
    patchUpdateOrganization,
    deleteOrganization
}; 