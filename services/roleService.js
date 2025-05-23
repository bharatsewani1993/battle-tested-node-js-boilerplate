const { success, failure } = require('../objects/return.objects');
const roleModel = require('../models/roleModel');
const { catchBlockErrorHandler } = require('../utils/errorHandler');
const { get } = require('./redisService.js');
const {assignPermissionsToRole}=require('./permissionService.js')

const getAllRoles = async (redisKey) => {
    try {
        // Get organization ID from Redis using user ID
        const redisData = await get(redisKey);

        if (!redisData.success || !redisData.data || !redisData.data.organizationId) {
            const failureObj = failure();
            failureObj.message = "No organization selected";
            return failureObj;
        }

        const organizationId = redisData.data.organizationId;

        // Get all active roles for the organization
        const roles = await roleModel.findAll({
            where: {
                organizationId: organizationId,
                active: 1
            }
        });

        const successObj = success();
        successObj.data = roles;
        successObj.message = "Roles retrieved successfully";
        return successObj;
    } catch (error) {
        catchBlockErrorHandler(error);
        const failureObj = failure();
        failureObj.message = error.message;
        return failureObj;
    }
};

const createRole = async (roleObj) => {
    try {
        const redisData = await get(roleObj.redisKey);

        if (!redisData.success || !redisData.data || !redisData.data.organizationId) {
            const failureObj = failure();
            failureObj.message = "No organization selected";
            return failureObj;
        }

        const organizationId = redisData.data.organizationId;

        const existingRole = await roleModel.findOne({
            where: {
                name: roleObj.name,
                organizationId: organizationId,
                active: 1
            }
        });

        if (existingRole) {
            const failureObj = failure();
            failureObj.message = "A role with this name already exists in the organization";
            return failureObj;
        }

        // Create role object
        const insertObj = {
            name: roleObj.name,
            description: roleObj.description,
            isDefault: roleObj.isDefault || 0,
            organizationId: organizationId,
            createdBy: redisData.data.userId
        };

        // Create role
        const createdRole = await roleModel.create(insertObj);

        // 📝 If permissions are sent in roleObj.permissions — assign them
        if (roleObj.permissionIds && Array.isArray(roleObj.permissionIds) && roleObj.permissionIds.length > 0) {
            const permObj = {
                roleId: createdRole.id,
                permissionIds: roleObj.permissionIds,
                redisKey: roleObj.redisKey,
                userId: redisData.data.userId
            };

            const permissionResult = await assignPermissionsToRole(permObj);

            if (!permissionResult.success) {
                const failureObj = failure();
                failureObj.message = "Role created but failed to assign permissions: " + permissionResult.message;
                return failureObj;
            }
        }

        const successObj = success();
        successObj.data.push({
            role:createdRole,
            assignPermissions:roleObj.permissionIds || []
        });
        successObj.message = "Role created successfully!";
        return successObj;
    } catch (error) {
        catchBlockErrorHandler(error);
        const failureObj = failure();
        failureObj.message = error.message;
        return failureObj;
    }
};


const getRole = async (roleId, redisKey) => {
    try {
        // Get organization ID from Redis using user ID
        const redisData = await get(redisKey);

        if (!redisData.success || !redisData.data || !redisData.data.organizationId) {
            const failureObj = failure();
            failureObj.message = "No organization selected";
            return failureObj;
        }

        const organizationId = redisData.data.organizationId;

        // Get role by ID and ensure it belongs to the organization
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

        const successObj = success();
        successObj.data = role;
        successObj.message = "Role retrieved successfully";
        return successObj;
    } catch (error) {
        catchBlockErrorHandler(error);
        const failureObj = failure();
        failureObj.message = error.message;
        return failureObj;
    }
};

const patchUpdateRole = async (roleObj) => {
    try {
        // Get organization ID from Redis using user ID
        const redisData = await get(roleObj.redisKey);

        if (!redisData.success || !redisData.data || !redisData.data.organizationId) {
            const failureObj = failure();
            failureObj.message = "No organization selected";
            return failureObj;
        }

        const organizationId = redisData.data.organizationId;

        // Check if role exists and belongs to the organization
        const role = await roleModel.findOne({
            where: {
                id: roleObj.roleId,
                organizationId: organizationId,
                active: 1
            }
        });

        if (!role) {
            const failureObj = failure();
            failureObj.message = "Role not found";
            return failureObj;
        }

        // If name is being updated, check if a role with the same name already exists
        if (roleObj.name && roleObj.name !== role.name) {
            const existingRole = await roleModel.findOne({
                where: {
                    name: roleObj.name,
                    organizationId: organizationId,
                    active: 1,
                    id: { [require('sequelize').Op.ne]: roleObj.roleId } // Exclude current role
                }
            });


            if (existingRole) {
                const failureObj = failure();
                failureObj.message = "A role with this name already exists in the organization";
                return failureObj;
            }
        }

        // Update role
        await roleModel.update(
            roleObj,
            {
                where: {
                    id: roleObj.roleId,
                    organizationId: organizationId
                }
            }
        );

        // Get updated role
        const updatedRole = await roleModel.findOne({
            where: {
                id: roleObj.roleId,
                active: 1
            }
        });

        const successObj = success();
        successObj.data = updatedRole;
        successObj.message = "Role updated successfully!";
        return successObj;
    } catch (error) {
        catchBlockErrorHandler(error);
        const failureObj = failure();
        failureObj.message = error.message;
        return failureObj;
    }
};

const deleteRole = async (roleId, redisKey) => {
    try {
        // Get organization ID from Redis using user ID
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

        // Check if the role is the Owner role
        if (role.name === 'Owner') {
            const failureObj = failure();
            failureObj.message = "The Owner role cannot be deleted";
            return failureObj;
        }

        // Soft delete by setting active to 0
        await roleModel.update(
            { active: 0 },
            {
                where: {
                    id: roleId,
                    organizationId: organizationId
                }
            }
        );

        const successObj = success();
        successObj.message = "Role deleted successfully!";
        return successObj;
    } catch (error) {
        catchBlockErrorHandler(error);
        const failureObj = failure();
        failureObj.message = error.message;
        return failureObj;
    }
};

module.exports = {
    getAllRoles,
    createRole,
    getRole,
    patchUpdateRole,
    deleteRole
}; 