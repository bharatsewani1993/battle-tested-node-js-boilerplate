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
const permissionModel = require('../models/permissionModel');
const rolePermissionModel = require('../models/rolePermissionModel');
const organizationUserModel = require('../models/organizationUserModel');
const organizationModel = require('../models/organizationModel');
const roleModel = require('../models/roleModel');

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
const acceptInvitation = async (inviteObj) => {
    try {
        const { organizationId, email, roleId } = inviteObj;

        // Find the user by email
        const user = await userModel.findOne({
            where: {
                email,
                active: 1
            }
        });

        // If user doesn't exist, return error - don't create account automatically
        // This could be a sign of tampering with the invitation
        if (!user) {
            const failureObj = failure();
            failureObj.message = "No user found with this email. Please make sure you're using the same email that received the invitation.";
            return failureObj;
        }

        // If user exists but isn't verified, verify them now since they've clicked the email link
        if (user.verified === 0) {
            await userModel.update(
                { verified: 1 },
                {
                    where: {
                        id: user.id
                    }
                }
            );
        }

        // Find the organization
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

        // Verify that the role exists and belongs to the organization
        const role = await roleModel.findOne({
            where: {
                id: roleId,
                organizationId,
                active: 1
            }
        });

        if (!role) {
            const failureObj = failure();
            failureObj.message = "Invalid role for this organization";
            return failureObj;
        }

        // Check if there is a pending invitation for this email and organization
        const invitation = await organizationUserModel.findOne({
            where: {
                organizationId,
                userId: user.id,
                active: 1
            }
        });

        // If no invitation exists, this could be a tampered link
        if (!invitation) {
            const failureObj = failure();
            failureObj.message = "No invitation found for this email and organization. Please contact the organization admin.";
            return failureObj;
        }

        if (invitation.inviteStatus === 'accepted') {
            const failureObj = failure();
            failureObj.message = "Invitation already accepted";
            return failureObj;
        }

        // Update invitation status to accepted and update roleId if different
        await organizationUserModel.update(
            {
                inviteStatus: 'accepted',
                roleId: roleId
            },
            {
                where: {
                    id: invitation.id
                }
            }
        );

        // Get permissions for this role
        const rolePermissionsData = await rolePermissionModel.findAll({
            where: {
                roleId,
                active: 1
            },
            attributes: ['permissionId']
        });

        // Extract permission IDs
        const permissionIds = rolePermissionsData.map(rp => rp.permissionId);

        // Get the actual permissions
        const permissionsData = await permissionModel.findAll({
            where: {
                id: permissionIds,
                active: 1
            },
            attributes: ['key']
        });

        // Extract permission keys
        const permissions = permissionsData.map(p => p.key);

        const successObj = success();

        // Since we've verified the email, we can give a simple, consistent message
        successObj.message = "Invitation accepted successfully. You can now log in and access this organization.";

        // Add additional information to response
        successObj.data.push({
            organizationId,
            organizationName: organization.name,
            roleName: role.name,
            email: user.email,
            verified: true, // Always true now since we verify as part of accepting the invitation
            permissions: permissions.length
        });

        return successObj;
    } catch (error) {
        catchBlockErrorHandler(error);
        const failureObj = failure();
        failureObj.message = error.message;
        return failureObj;
    }
}

module.exports = {
    postEmailMagicLink,
    getVerifyEmailOTP,
    deleteLogout,
    postSelectOrganization,
    acceptInvitation
}