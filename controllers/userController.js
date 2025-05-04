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
        const { organizationId, email } = req.query;

        const inviteObj = {
            organizationId: parseInt(organizationId),
            email
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

// Get all organizations for the current logged-in user
const getUserOrganizations = async (req, res) => {
    try {
        const userId = req.redisData.userId;

        const result = await userService.getUserOrganizations(userId);
        return res.status(result.status).send(result);
    } catch (error) {
        catchBlockErrorHandler(error);
        const failureObj = failure();
        failureObj.message = "Something went wrong at server side!";
        return res.status(500).send(failureObj);
    }
};

// Get all users of the current organization with pagination, sorting, and search
const getOrganizationUsers = async (req, res) => {
    try {
        const { organizationId } = req.redisData;

        // Extract query parameters with defaults from validation
        const { page, limit, search, sortBy, sortOrder } = req.query;

        const queryObj = {
            organizationId,
            page,
            limit,
            search,
            sortBy,
            sortOrder
        };

        const result = await userService.getOrganizationUsers(queryObj);
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
    getAcceptInvitation,
    getUserOrganizations,
    getOrganizationUsers
}