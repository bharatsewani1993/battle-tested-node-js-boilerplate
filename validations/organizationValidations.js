const Joi = require("joi");
const joi = require("joi");

const createOrganizationValidations = joi.object().keys({
    name: joi.string().required().max(500),
    description: joi.string().optional().max(1000),
});

const updateOrganizationValidations = joi.object().keys({
    name: joi.string().optional().max(500),
    description: joi.string().optional().max(1000),
    status:Joi.string().valid('DRAFT','PUBLISHED','ARCHIVED')
});

const deleteOrganizationValidations = joi.object().keys({
    organizationId: joi.number().required(),
});



module.exports = {
    createOrganizationValidations,
    updateOrganizationValidations,
    deleteOrganizationValidations,
}; 