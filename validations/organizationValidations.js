const joi = require("joi");

const createOrganizationValidations = joi.object().keys({
    name: joi.string().required().max(500),
    description: joi.string().optional().allow('').max(1000),
});

const updateOrganizationValidations = joi.object().keys({
    name: joi.string().optional().max(500),
    description: joi.string().optional().allow('').max(1000),
});

const deleteOrganizationValidations = joi.object().keys({
    orgId: joi.number().required(),
});

const inviteMemberValidations = joi.object().keys({
    email: joi.string().email().required().max(500),
    roleId: joi.number().required().positive(),
});

const getOrganizationByIdValidations = joi.object().keys({
    organizationId: joi.number().required().positive(),
});

module.exports = {
    createOrganizationValidations,
    updateOrganizationValidations,
    deleteOrganizationValidations,
    inviteMemberValidations,
    getOrganizationByIdValidations
}; 