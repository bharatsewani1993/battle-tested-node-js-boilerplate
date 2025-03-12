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

module.exports = {
  emailLoginValidations,
  emailOtpValidations,
  userIdValidation
};