const joi = require("joi");

const assignPermissionValidations = joi.object().keys({
    roleId: joi.number().required(),
    permissionIds: joi.array().items(joi.number()).required()
});

const deletePermissionValidations = joi.object().keys({
    roleId: joi.number().required(),
    permissionIds: joi.array().items(joi.number()).required()
});

const roleIdValidation = joi.object().keys({
    roleId: joi.number().required()
});

module.exports = {
    assignPermissionValidations,
    deletePermissionValidations,
    roleIdValidation
}; 