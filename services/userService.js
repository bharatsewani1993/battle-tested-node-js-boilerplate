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

module.exports = {
    postEmailMagicLink,
    getVerifyEmailOTP,
    deleteLogout,
    postSelectOrganization
}