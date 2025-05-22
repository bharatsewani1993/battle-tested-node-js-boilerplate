const ENV = require('../env/index').envSettings();
const { success, failure } = require('../objects/return.objects');
const userModel = require('../models/userModel');
const emailService = require("./emailService");
const emailTemplates = require("../templates/email");
const auth = require('../middlewares/auth');
const { catchBlockErrorHandler } = require('../utils/errorHandler');
const { validateOtp } = require('../utils/otp');
const redis = require('../config/redis');
const { set, get } = require('../services/redisService.js');
const roleModel = require('../models/roleModel');
const permissionModel = require('../models/permissionModel');
const rolePermissionModel = require('../models/rolePermissionModel');
const organizationUserModel = require('../models/organizationUserModel');
const organizationModel=require('../models/organizationModel.js')
const sequelize = require('../config/mysql');

const postEmailMagicLink = async (email) => {
    try {
        const emailExist = await userModel.findOne({
            where: {
                active: 1,
                email: email
            }
        });

        let userId;

        if (!emailExist) {
            const insertObj = {
                email: email,
            };
            const createdUser = await userModel.create(insertObj);
            userId = createdUser.id;
        } else {
            userId = emailExist.id;
        }

        let OTP;
        if (ENV.STAGE == 'LOCAL' || ENV.STAGE == 'DEV') {
            OTP = 1234;
        } else {
            OTP = Math.floor(100000 + Math.random() * 900000);
        }

        const otpObj = {
            otp: OTP,
            key: `OTP_${email}`,
            userId: userId,
            expiry: 300,
        };
        set(otpObj);


        if (ENV.STAGE === 'LOCAL') {
            const successObj = success();
            successObj.message = "EMAIL SENT SUCCESSFULLY";
            return successObj;
        }


        const emailObj = {
            to: email,
            subject: `Welocme to ${ENV.PROJECT_NAME}! Please verify your Email.`,
            html: emailTemplates.emailVerificationTemplate(OTP, email),
        };

        emailService.sendEmail(emailObj);

        const successObj = success();
        successObj.data = userId;
        successObj.message = "Email sent to user!"
        return successObj;
    } catch (error) {
        catchBlockErrorHandler(error);
        const failureObj = failure();
        failureObj.message = error.message;
        return failureObj;
    }
}

const getVerifyEmailOTP = async (otpObj) => {
    try {
        const { email } = otpObj;

        otpObj['key'] = `OTP_${email}`;

        const validOtp = await validateOtp(otpObj);

        if (validOtp.success) {
            const userId = validOtp.data[0].userId;

            await userModel.update(
                { verified: 1 },
                {
                    where: {
                        id: userId,
                        active: 1
                    }
                }
            )

            const userObj = {
                userId: userId,
                key: `${userId}_${email}`,
                expiry: 7200,
            };

            set(userObj);

            const tokenPayload = {
                key: `${userId}_${email}`,
                userId: userId
            };

            const authToken = await auth.createAuthentication(tokenPayload);

            const successObj = success();
            successObj.message = "OTP verified successfully!"
            successObj.authToken = authToken;
            return successObj;
        } else {
            const failureObj = failure();
            failureObj.message = "Invalid OTP or Email."
            return failureObj;
        }
    } catch (error) {
        catchBlockErrorHandler(error);
        const failureObj = failure();
        failureObj.message = error.message;
        return failureObj;
    }
}

const deleteLogout = async (key) => {
    try {
        const gettingKey = await get(key);

        if (!gettingKey) {
            return {
                success: false,
                message: "Login Required"
            };
        }

        await redis.del(key);

        const successObj = success();
        successObj.message = "logout Successfully"
        return successObj;

    } catch (error) {
        catchBlockErrorHandler(error);
        const failureObj = failure();
        failureObj.message = "Failed to logout";
        return failureObj;
    }
};

// Select organization and update Redis with permissions
const postSelectOrganization = async (orgObj) => {
    try {
        const { organizationId, userId, key } = orgObj;

        // Check if user belongs to the organization
        const organizationUser = await organizationUserModel.findOne({
            where: {
                organizationId,
                userId,
                active: 1,
                inviteStatus: 'accepted'
            }
        });

        if (!organizationUser) {
            const failureObj = failure();
            failureObj.message = "You don't have access to this organization";
            return failureObj;
        }

        // Get user's role in this organization
        const roleId = organizationUser.roleId;

        // First, get all permission IDs for this role
        const rolePermissionsData = await rolePermissionModel.findAll({
            where: {
                roleId,
                active: 1
            },
            attributes: ['permissionId']
        });

        // Extract permission IDs
        const permissionIds = rolePermissionsData.map(rp => rp.permissionId);

        // Now get the actual permissions
        const permissionsData = await permissionModel.findAll({
            where: {
                id: permissionIds,
                active: 1
            },
            attributes: ['key']
        });

        // Extract permission keys
        const permissions = permissionsData.map(p => p.key);

        // Update Redis with organization info and permissions
        const redisObj = {
            key,
            organizationId,
            roleId,
            permissions,
            expiry: 86400 // 24 hours
        };

        await set(redisObj);

        const successObj = success();
        successObj.message = "Organization selected successfully";
        return successObj;
    } catch (error) {
        catchBlockErrorHandler(error);
        const failureObj = failure();
        failureObj.message = error.message;
        return failureObj;
    }
}

// Accept an invitation to join an organization
const getAcceptInvitation= async (inviteObj) => {
    try {
        const { organizationId, email } = inviteObj;

        // Find the user by email
        const user = await userModel.findOne({
            where: {
                email,
                active: 1
            }
        });

        if (!user) {
            const failureObj = failure();
            failureObj.message = "No user found with this email. Please make sure you're using the same email that received the invitation.";
            return failureObj;
        }

        // Verify user if not already verified
        if (user.verified === 0) {
            await userModel.update(
                { verified: 1 },
                {
                    where: { id: user.id }
                }
            );
        }

        // Validate organization
        const organization = await organizationModel.findOne({
            where: {
                id: organizationId,
                active: 1
            }
        });

        if (!organization) {
            const failureObj = failure();
            failureObj.message = "Organization not found";
            return failureObj;
        }

        // Get the invitation and ensure it's pending
        const invitation = await organizationUserModel.findOne({
            where: {
                organizationId,
                userId: user.id,
                active: 1,
                inviteStatus: 'pending'
            }
        });

        if (!invitation) {
            const failureObj = failure();
            failureObj.message = "No pending invitation found for this email and organization. Please contact the organization admin.";
            return failureObj;
        }

        // Use the roleId from the invitation (NOT from user input)
        const role = await roleModel.findOne({
            where: {
                id: invitation.roleId,
                organizationId,
                active: 1
            }
        });

        if (!role) {
            const failureObj = failure();
            failureObj.message = "Assigned role in invitation is no longer valid";
            return failureObj;
        }

        // Mark invitation as accepted
        await organizationUserModel.update(
            {
                inviteStatus: 'accepted'
            },
            {
                where: {
                    id: invitation.id
                }
            }
        );

        const successObj = success();
        successObj.message = "Invitation accepted successfully. You can now log in and access this organization.";
        successObj.data.push({
            organizationId,
            organizationName: organization.name,
            roleName: role.name,
            email: user.email,
            verified: true
        });

        return successObj;
    } catch (error) {
        catchBlockErrorHandler(error);
        const failureObj = failure();
        failureObj.message = error.message;
        return failureObj;
    }
}

// Get all organizations for a user
const getUserOrganizations = async (userId,options) => {
    try {
        const {limit,page,sortBy,sortOrder,status}=options;
        // Find all organization-user relationships for this user
        const organizationUsers = await organizationUserModel.findAll({
            where: {
                userId:userId,
                active: 1,
                inviteStatus: 'accepted'
            }
        });

        if (!organizationUsers || organizationUsers.length === 0) {
            const successObj = success();
            successObj.message = "No organizations found";
            successObj.data = [];
            return successObj;
        }

        // Extract organization IDs
        const organizationIds = organizationUsers.map(ou => ou.organizationId);

        // Get organization details
        const organizations = await organizationModel.findAll({
            where: {
                id: organizationIds,
                active: 1,
                ...(status && {status})
            },
            attributes: ['id', 'name', 'description', 'ownerId', 'createdAt','status'],
            limit,
            offset:(page-1) * limit,
            order:[[sortBy,sortOrder]]
        });
        // Get user roles in each organization
        const orgDetails = await Promise.all(organizations.map(async (org) => {
            // Find user's role in this organization
            const orgUser = organizationUsers.find(ou => ou.organizationId === org.id);

            // Get role details
            const role = await roleModel.findOne({
                where: {
                    id: orgUser.roleId,
                    active: 1
                },
                attributes: ['id', 'name']
            });

            // Check if user is the owner
            const isOwner = org.ownerId === userId;

            return {
                id: org.id,
                name: org.name,
                description: org.description,
                isOwner,
                role: role ? {
                    id: role.id,
                    name: role.name
                } : null,
                status:org.status,
                createdAt: org.createdAt
            };
        }));

        const successObj = success();
        successObj.data = orgDetails;
        successObj.message = "Organizations retrieved successfully";
        return successObj;
    } catch (error) {
        catchBlockErrorHandler(error);
        const failureObj = failure();
        failureObj.message = error.message;
        return failureObj;
    }
}

// Get all users of the current organization with pagination, sorting, and search
const getOrganizationUsers = async (queryObj) => {
  try {
    let {
      organizationId,
      page = 1,
      limit = 10,
      search = '',
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = queryObj;

    // Validation
    if (!organizationId) {
      const failureObj = failure();
      failureObj.status = 400;
      failureObj.message = "Please select an organization first";
      return failureObj;
    }

    // Parse pagination numbers safely
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const offset = (page - 1) * limit;

    // Safe sort field handling
    const allowedSortFields = ['createdAt', 'name', 'email'];
    const finalSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const finalSortOrder = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    // Fetch active, accepted organization users
    const orgUsers = await organizationUserModel.findAll({
      where: {
        organizationId:organizationId,
        active: 1,
        inviteStatus: 'accepted'
      },
      attributes: ['userId', 'roleId'],
      raw: true
    });
     
    const userIds=orgUsers.map(u=>u.userId);

    if (userIds.length === 0) {
      const successObj = success();
      successObj.message = "No users found in this organization";
      successObj.data = {
        users: [],
        pagination: {
          page,
          limit,
          totalPages: 0,
          totalCount: 0
        }
      };
      return successObj;
    }

    // Prepare role and orgUser mappings
    const roleIds = [...new Set(orgUsers.map(o => o.roleId).filter(Boolean))];
    const orgUserMap = Object.fromEntries(orgUsers.map(o => [o.userId, o.roleId]));


    // Fetch role details in bulk
    let roleMap = {};
    if (roleIds.length > 0) {
      const roleDataList = await roleModel.findAll({
        where: {
          id: roleIds,
          active: 1
        },
        attributes: ['id', 'name'],
        raw: true
      });
      roleMap = Object.fromEntries(roleDataList.map(r => [r.id, r.name]));
    }

    // Build user search condition
    const userWhereCondition = {
      id: userIds,
      active: 1
    };

    if (search?.trim()) {
      userWhereCondition[sequelize.Op.or] = [
        { name: { [sequelize.Op.like]: `%${search}%` } },
        { email: { [sequelize.Op.like]: `%${search}%` } }
      ];
    }

    // Get total count
    const totalCount = await userModel.count({ where: userWhereCondition });
    const totalPages = Math.ceil(totalCount / limit);

    // Fetch paginated user data
    const users = await userModel.findAll({
      where: userWhereCondition,
      attributes: ['id', 'email', 'phone', 'countryCode', 'verified', 'createdAt', 'updatedAt'],
      order: [[finalSortBy, finalSortOrder]],
      limit,
      offset
    });

    // Map roles to users
    const usersWithRoles = users.map(user => {
      const userData = user.get({ plain: true });
      const roleId = orgUserMap[user.id];
      userData.roleId = roleId || null;
      userData.role = roleId ? roleMap[roleId] || null : null;
      return userData;
    });

    // Build success response
    const successObj = success();
    successObj.message = "Users fetched successfully";
    successObj.data = {
      users: usersWithRoles,
      pagination: {
        page,
        limit,
        totalPages,
        totalCount
      }
    };

    return successObj;
  } catch (error) {
    catchBlockErrorHandler(error);
    const failureObj = failure();
    failureObj.message = error.message;
    return failureObj;
  }
};


module.exports = {
    postEmailMagicLink,
    getVerifyEmailOTP,
    deleteLogout,
    postSelectOrganization,
    getAcceptInvitation,
    getAcceptInvitation,
    getUserOrganizations,
    getOrganizationUsers
}