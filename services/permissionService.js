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
        if (!roleId || !Array.isArray(permissionIds) || permissionIds.length === 0) {
            const failureObj = failure();
            failureObj.message = "Invalid roleId or empty permissionIds";
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
                active: 1,
                // Uncomment the following line if permissions are organization-specific
                // organizationId
            }
        });

        if (permissions.length !== permissionIds.length) {
            const failureObj = failure();
            failureObj.message = "One or more permissions do not exist or are inactive";
            return failureObj;
        }

        // Get already assigned permissions to the role
        const existingRolePermissions = await rolePermissionModel.findAll({
            where: {
                roleId,
                permissionId: {
                    [Op.in]: permissionIds
                },
                active: 1
            },
            attributes: ['permissionId']
        });

        const existingPermissionIds = new Set(existingRolePermissions.map(rp => rp.permissionId));
        const newPermissionIds = permissionIds.filter(id => !existingPermissionIds.has(id));

        // Prepare new role-permission entries
        const rolePermissions = newPermissionIds.map(permissionId => ({
            roleId,
            permissionId,
            createdBy: userId,
            active: 1
        }));

        // Bulk create if new permissions are available
        if (rolePermissions.length > 0) {
            await rolePermissionModel.bulkCreate(rolePermissions, {
                ignoreDuplicates: true // in case of race conditions
            });
        }

        const responseData = {
            roleId,
            assignedPermissions: newPermissionIds,
            totalPermissions: [...existingPermissionIds, ...newPermissionIds]
        };

        const successObj = success();
        successObj.message = rolePermissions.length > 0
            ? "Permissions assigned to role successfully"
            : "All permissions were already assigned to this role";
        successObj.data.push(responseData);

        return successObj;
    } catch (error) {
        catchBlockErrorHandler(error);
        const failureObj = failure();
        failureObj.message = error.message || "An error occurred while assigning permissions";
        return failureObj;
    }
};

module.exports = {
    getAllPermissions,
    getRolePermissions,
    assignPermissionsToRole,
}; 