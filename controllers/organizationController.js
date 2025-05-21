const organizationService = require('../services/organizationService');
const { failure } = require('../objects/return.objects');
const { catchBlockErrorHandler } = require('../utils/errorHandler');

const postCreateOrganization = async (req, res, next) => {
    try {
        const { name, description } = req.body;
        const userId = req.redisData.userId;
        const key = req.redisData.key;

        const orgObj = {
            name,
            description,
            ownerId: userId,
            key
        };

        const result = await organizationService.createOrganization(orgObj);
        return res.status(result.status).send(result);
    } catch (error) {
        catchBlockErrorHandler(error);
        const failureObj = failure();
        failureObj.message = "Something went wrong at server side!";
        return res.status(500).send(failureObj);
    }
};

const patchUpdateOrganization = async (req, res, next) => {
    try {

        const { name, description,status } = req.body;
        const organizationId = req.redisData.organizationId;
        const userId = req.redisData.userId;

        const orgObj = {
            name,
            description,
            status,
            organizationId,
            userId,
        };

        const result = await organizationService.patchUpdateOrganization(orgObj);
        return res.status(result.status).send(result);
    } catch (error) {
        catchBlockErrorHandler(error);
        const failureObj = failure();
        failureObj.message = "Something went wrong at server side!";
        return res.status(500).send(failureObj);
    }
};

const deleteOrganization = async (req, res, next) => {
    try {
        const organizationId = parseInt(req.params.organizationId);
        const userId = req.redisData.userId;

        const result = await organizationService.deleteOrganization(organizationId, userId);
        return res.status(result.status).send(result);
    } catch (error) {
        catchBlockErrorHandler(error);
        const failureObj = failure();
        failureObj.message = "Something went wrong at server side!";
        return res.status(500).send(failureObj);
    }
};

const postInviteMember = async (req, res, next) => {
    try {
        const { email, roleId } = req.body;
        const organizationId = req.redisData.organizationId;
        const userId = req.redisData.userId;

        const inviteObj = {
            email,
            roleId,
            organizationId,
            invitedBy: userId
        };

        const result = await organizationService.postInviteMember(inviteObj);
        return res.status(result.status).send(result);
    } catch (error) {
        catchBlockErrorHandler(error);
        const failureObj = failure();
        failureObj.message = "Something went wrong at server side!";
        return res.status(500).send(failureObj);
    }
};


const getCurrentOrganization = async (req, res, next) => {
    try {
        const result = await organizationService.getCurrentOrganization(req.redisData);
        return res.status(result.status).send(result);
    } catch (error) {
        catchBlockErrorHandler(error);
        const failureObj = failure();
        failureObj.message = "Something went wrong at server side!";
        return res.status(500).send(failureObj);
    }
};

module.exports = {
    postCreateOrganization,
    patchUpdateOrganization,
    deleteOrganization,
    postInviteMember,
    getCurrentOrganization
}; 