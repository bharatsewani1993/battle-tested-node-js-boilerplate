const userService = require('../services/userService');
const { failure } = require('../objects/return.objects');
const { catchBlockErrorHandler } = require('../utils/errorHandler');

const postEmailMagicLink = async (req, res, next) => {
    try {
        const email = req.body.email;
        const result = await userService.postEmailMagicLink(email);
        res.status(result.status).send(result);
    } catch (error) {
        catchBlockErrorHandler(error);
        const failureObj = failure();
        failureObj.message = "Something went wrong at server side!";
        return res.status(500).send(failureObj);
    }
}

//verify OTP and redirect user to Dashboard.
const getVerifyEmailOTP = async (req, res, next) => {
    try {
        const email = req.query.email;
        const otp = req.query.otp;

        const otpObj = {
            email,
            otp
        };
        const result = await userService.getVerifyEmailOTP(otpObj);
        return res.status(result.status).send(result);
    } catch (error) {
        catchBlockErrorHandler(error);
        const failureObj = failure();
        failureObj.message = "Something went wrong at server side!";
        return res.status(500).send(failureObj);
    }
}


// Inside controller.js
const deleteLogout = async (req, res) => {
    try {
        const key = req.redisData.key;
        const deleteResult = await userService.deleteLogout(key);
        return res.status(deleteResult.status).send(deleteResult);
    } catch (error) {
        catchBlockErrorHandler(error);
        const failureObj = failure();
        failureObj.message = "Something went wrong at server side!";
        return res.status(500).send(failureObj); // Send error response in case of catch block error
    }
};

// Select an organization and update permissions in Redis
const postSelectOrganization = async (req, res) => {
    try {
        const { organizationId } = req.body;
        const userId = req.redisData.userId;
        const key = req.redisData.key;

        const orgObj = {
            organizationId,
            userId,
            key
        }

        const result = await userService.postSelectOrganization(orgObj);
        return res.status(result.status).send(result);
    } catch (error) {
        catchBlockErrorHandler(error);
        const failureObj = failure();
        failureObj.message = "Something went wrong at server side!";
        return res.status(500).send(failureObj);
    }
};

// Accept an invitation to join an organization
const getAcceptInvitation = async (req, res) => {
    try {
        const { organizationId, email, roleId } = req.query;

        const inviteObj = {
            organizationId: parseInt(organizationId),
            email,
            roleId: parseInt(roleId)
        };

        const result = await userService.acceptInvitation(inviteObj);
        return res.status(result.status).send(result);
    } catch (error) {
        catchBlockErrorHandler(error);
        const failureObj = failure();
        failureObj.message = "Something went wrong at server side!";
        return res.status(500).send(failureObj);
    }
};

module.exports = {
    postEmailMagicLink,
    getVerifyEmailOTP,
    deleteLogout,
    postSelectOrganization,
    getAcceptInvitation
}