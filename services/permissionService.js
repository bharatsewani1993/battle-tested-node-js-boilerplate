const { success, failure } = require('../objects/return.objects');
const permissionModel = require('../models/permissionModel');
const roleModel = require('../models/roleModel');
const rolePermissionModel = require('../models/rolePermissionModel');
const { catchBlockErrorHandler } = require('../utils/errorHandler');
const { get } = require('./redisService.js');
const { Sequelize, Op } = require('sequelize');

// Get all available permissions in the system
const getAllPermissions = async () => {
    try {
        const permissions = await permissionModel.findAll({
            where: {
                active: 1
            }
        });

        const successObj = success();
        successObj.data = permissions;
        successObj.message = "Permissions retrieved successfully";
        return successObj;
    } catch (error) {
        catchBlockErrorHandler(error);
        const failureObj = failure();
        failureObj.message = error.message;
        return failureObj;
    }
};

// Get permissions for a specific role
const getRolePermissions = async (roleId, redisKey) => {
    try {
        // Get organization ID from Redis
        const redisData = await get(redisKey);

        if (!redisData.success || !redisData.data || !redisData.data.organizationId) {
            const failureObj = failure();
            failureObj.message = "No organization selected";
            return failureObj;
        }

        const organizationId = redisData.data.organizationId;

        // Check if role exists and belongs to the organization
        const role = await roleModel.findOne({
            where: {
                id: roleId,
                organizationId: organizationId,
                active: 1
            }
        });

        if (!role) {
            const failureObj = failure();
            failureObj.message = "Role not found";
            return failureObj;
        }

        // Get role permissions
        const rolePermissions = await rolePermissionModel.findAll({
            where: {
                roleId: roleId,
                active: 1
            },
            attributes: ['permissionId']
        });

        const permissionIds = rolePermissions.map(rp => rp.permissionId);

        // Get permission details
        const permissions = await permissionModel.findAll({
            where: {
                id: {
                    [Op.in]: permissionIds
                },
                active: 1
            }
        });

        const successObj = success();
        successObj.data = permissions;
        successObj.message = "Role permissions retrieved successfully";
        return successObj;
    } catch (error) {
        catchBlockErrorHandler(error);
        const failureObj = failure();
        failureObj.message = error.message;
        return failureObj;
    }
};

// Assign permissions to a role
const assignPermissionsToRole = async (permObj) => {
    try {
        const { roleId, permissionIds = [], redisKey, userId } = permObj;

        // Validate input
        if (!roleId || !Array.isArray(permissionIds)) {
            const failureObj = failure();
            failureObj.message = "Invalid roleId or permissionIds";
            return failureObj;
        }

        // Get organization ID from Redis
        const redisData = await get(redisKey);
        const organizationId = redisData?.data?.organizationId;

        if (!organizationId) {
            const failureObj = failure();
            failureObj.message = "No organization selected";
            return failureObj;
        }

        // Validate role existence and ownership
        const role = await roleModel.findOne({
            where: {
                id: roleId,
                organizationId,
                active: 1
            }
        });

        if (!role) {
            const failureObj = failure();
            failureObj.message = "Role not found for the selected organization";
            return failureObj;
        }

        // Validate permissions existence
        const permissions = await permissionModel.findAll({
            where: {
                id: {
                    [Op.in]: permissionIds
                },
                active: 1
            }
        });

        if (permissions.length !== permissionIds.length) {
            const failureObj = failure();
            failureObj.message = "One or more permissions do not exist or are inactive";
            return failureObj;
        }

        // 🔥 DELETE all previous permissions for this role
        await rolePermissionModel.destroy({
            where: { roleId }
        });

        // ✅ Insert new permissions if any
        if (permissionIds.length > 0) {
            const rolePermissions = permissionIds.map(permissionId => ({
                roleId,
                permissionId,
                createdBy: userId,
                active: 1
            }));
            await rolePermissionModel.bulkCreate(rolePermissions);
        }

        const successObj = success();
        successObj.message = "Permissions updated successfully";
        successObj.data.push({
            roleId,
            assignedPermissions: permissionIds
        });

        return successObj;
    } catch (error) {
        catchBlockErrorHandler(error);
        const failureObj = failure();
        failureObj.message = error.message || "An error occurred while updating role permissions";
        return failureObj;
    }
};


module.exports = {
    getAllPermissions,
    getRolePermissions,
    assignPermissionsToRole,
}; 