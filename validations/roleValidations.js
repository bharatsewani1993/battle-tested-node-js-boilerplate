const joi = require("joi");

const createRoleValidations = joi.object().keys({
    name: joi.string().required().max(100),
    description: joi.string().optional().max(500),
    isDefault: joi.number().optional().valid(0, 1),
    permissionIds: joi.array().items(joi.number()).required()
});

const updateRoleValidations = joi.object().keys({
    name: joi.string().optional().max(100),
    description: joi.string().optional().max(500),
    isDefault: joi.number().optional().valid(0, 1),
    roleId: joi.number().required()
});

const roleIdValidation = joi.object().keys({
    roleId: joi.number().required()
});

module.exports = {
    createRoleValidations,
    updateRoleValidations,
    roleIdValidation
}; 