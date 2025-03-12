const joi = require("joi");

const postOrderValidations = joi.object().keys({
    order_title: joi.string().required().max(500),
    order_description: joi.string().max(5000).allow("")
});

const patchOrderValidations = joi.object().keys({
    orderId: joi.string().required(),
    order_title: joi.string().max(500),
    order_description: joi.string().max(5000).allow("")
});

const patchFileValidations = joi.object().keys({
    orderId: joi.string().required(),
    fileId: joi.string().required(),
    file_description: joi.string().max(5000),
    voice_preference: joi.string().max(1000).valid('custom_voice', 'predefined_voice'),
    subtitles: joi.string().valid('yes', 'no'),
    output_preference: joi.string().max(100).valid('audio_video_music', 'audio_video', 'audio')
});

const orderIdValidation = joi.object().keys({
    orderId: joi.string().required().max(999999),
});

const getFileByIdValidation = joi.object().keys({
    orderId: joi.string().required(),
    fileId: joi.string().required()
})

//following function we are using for admin routes..
const patchOrderPriceValidations = joi.object().keys({
    orderId: joi.string().required(),
    fileId: joi.string().required(),
    order_amount: joi.string().required().max(9999999).min(1),
    tax_amount: joi.string().required().max(999999).min(0),
});

const deleteFileValidations = joi.object().keys({
    orderId: joi.string().required(),
    fileId: joi.string().required(),
});


module.exports = {
    postOrderValidations,
    patchOrderValidations,
    patchFileValidations,
    orderIdValidation,
    deleteFileValidations,
    patchOrderPriceValidations,
    getFileByIdValidation
}