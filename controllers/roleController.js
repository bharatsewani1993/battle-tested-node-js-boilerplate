const roleService = require('../services/roleService');
const { failure } = require('../objects/return.objects');
const { catchBlockErrorHandler } = require('../utils/errorHandler');

const getAllRoles = async (req, res, next) => {
    try {
        const redisKey = req.redisData.key;
        const result = await roleService.getAllRoles(redisKey);
        res.status(result.status).send(result);
    } catch (error) {
        catchBlockErrorHandler(error);
        const failureObj = failure();
        failureObj.message = "Something went wrong at server side!";
        return res.status(500).send(failureObj);
    }
};

const postCreateRole = async (req, res, next) => {
    try {
        const { name, description, isDefault } = req.body;
        const redisKey = req.redisData.key;
        const roleObj = { name, description, isDefault, redisKey }

        const result = await roleService.createRole(roleObj);
        res.status(result.status).send(result);
    } catch (error) {
        catchBlockErrorHandler(error);
        const failureObj = failure();
        failureObj.message = "Something went wrong at server side!";
        return res.status(500).send(failureObj);
    }
};

const getRole = async (req, res, next) => {
    try {
        const roleId = parseInt(req.params.roleId);
        const redisKey = req.redisData.key;

        const result = await roleService.getRole(roleId, redisKey);
        res.status(result.status).send(result);
    } catch (error) {
        catchBlockErrorHandler(error);
        const failureObj = failure();
        failureObj.message = "Something went wrong at server side!";
        return res.status(500).send(failureObj);
    }
};

const patchUpdateRole = async (req, res, next) => {
    try {
        const roleId = parseInt(req.params.roleId);
        const { name, description, isDefault } = req.body;
        const redisKey = req.redisData.key;

        const roleObj = { name, description, isDefault, redisKey, roleId }

        const result = await roleService.patchUpdateRole(roleObj);
        res.status(result.status).send(result);
    } catch (error) {
        catchBlockErrorHandler(error);
        const failureObj = failure();
        failureObj.message = "Something went wrong at server side!";
        return res.status(500).send(failureObj);
    }
};

const deleteRole = async (req, res, next) => {
    try {
        const roleId = parseInt(req.params.roleId);
        const redisKey = req.redisData.key;

        const result = await roleService.deleteRole(roleId, redisKey);
        res.status(result.status).send(result);
    } catch (error) {
        catchBlockErrorHandler(error);
        const failureObj = failure();
        failureObj.message = "Something went wrong at server side!";
        return res.status(500).send(failureObj);
    }
};

module.exports = {
    getAllRoles,
    postCreateRole,
    getRole,
    patchUpdateRole,
    deleteRole
}; 