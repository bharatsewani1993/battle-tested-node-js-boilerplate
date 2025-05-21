const joi = require("joi");

//sign-in validation..
const emailLoginValidations = joi.object().keys({
  email: joi.string().email().required().max(100),
});

const emailOtpValidations = joi.object().keys({
  email: joi.string().email().required().max(100),
  otp: joi.number().required(),
});

const userIdValidation = joi.object().keys({
  userId: joi.string().required().max(999999),
});

const selectOrganizationValidation = joi.object().keys({
  organizationId: joi.number().required().positive(),
});

const organizationUsersValidation = joi.object().keys({
  page: joi.number().integer().min(1).default(1),
  limit: joi.number().integer().min(1).max(100).default(10),
  search: joi.string().allow('').optional(),
  sortBy: joi.string().valid('name', 'email', 'createdAt').default('createdAt'),
  sortOrder: joi.string().valid('asc', 'desc').default('desc'),
});

module.exports = {
  emailLoginValidations,
  emailOtpValidations,
  userIdValidation,
  selectOrganizationValidation,
  organizationUsersValidation
};