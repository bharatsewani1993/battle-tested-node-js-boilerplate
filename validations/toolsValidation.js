const joi=require("joi");

const postChannelNameValidation=joi.object().keys({
    channel_description:joi.string().required().max(150),
})

const postParagraphRephraseValidation=joi.object().keys({
    input_paragraph:joi.string().required().max(200),
})

const  postVideoDescriptionGeneratorValidation=joi.object().keys({
    video_about:joi.string().required().max(50),
})


const postVideoIdeaGeneratorChannelValidation=joi.object().keys({
    channel_about:joi.string().required().max(150),
})


const  postVideoTagGeneratorTitleValidation=joi.object().keys({
    video_title:joi.string().required().max(40),
    video_description : joi.string().required().max(30)

})


module.exports={
    postChannelNameValidation,
    postParagraphRephraseValidation,
    postVideoDescriptionGeneratorValidation,
    postVideoIdeaGeneratorChannelValidation,
    postVideoTagGeneratorTitleValidation
}