const permissionService = require('../services/permissionService');
const { failure } = require('../objects/return.objects');
const { catchBlockErrorHandler } = require('../utils/errorHandler');

const getAllPermissions = async (req, res, next) => {
    try {
        const result = await permissionService.getAllPermissions();
        res.status(result.status).send(result);
    } catch (error) {
        catchBlockErrorHandler(error);
        const failureObj = failure();
        failureObj.message = "Something went wrong at server side!";
        return res.status(500).send(failureObj);
    }
};

const getRolePermissions = async (req, res, next) => {
    try {
        const roleId = parseInt(req.params.roleId);
        const redisKey = req.redisData.key;

        const result = await permissionService.getRolePermissions(roleId, redisKey);
        res.status(result.status).send(result);
    } catch (error) {
        catchBlockErrorHandler(error);
        const failureObj = failure();
        failureObj.message = "Something went wrong at server side!";
        return res.status(500).send(failureObj);
    }
};

const postAssignPermissions = async (req, res, next) => {
    try {
        const { roleId, permissionIds } = req.body;
        const redisKey = req.redisData.key;
        const userId = req.redisData.userId;

        const permObj = {
            roleId,
            permissionIds,
            redisKey,
            userId
        };

        const result = await permissionService.assignPermissionsToRole(permObj);
        res.status(result.status).send(result);
    } catch (error) {
        catchBlockErrorHandler(error);
        const failureObj = failure();
        failureObj.message = "Something went wrong at server side!";
        return res.status(500).send(failureObj);
    }
};

module.exports = {
    getAllPermissions,
    getRolePermissions,
    postAssignPermissions,
}; 