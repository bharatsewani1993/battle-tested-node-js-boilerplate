const joi=require("joi");


//logIn Validation
const logInvalidation=joi.object().keys({
    email:joi.string().required().max(100),
})

const emailOtpValidations = joi.object().keys({
    email: joi.string().email().required().max(100),
    otp: joi.number().required(),
  })
module.exports={
    logInvalidation,
    emailOtpValidations
};
    