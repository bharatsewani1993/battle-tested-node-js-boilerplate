const joi = require("joi");

const limitValidation = joi.object().keys({
    limit: joi.number().max(100).default(10),
    page: joi.number().max(999).default(1)
})

module.exports = {
    limitValidation
}