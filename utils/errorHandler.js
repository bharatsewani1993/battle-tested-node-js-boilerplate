const emailTemplates = require("../templates/email");
const emailService = require("../services/system/emailService");
const ENV = require('../env/index').envSettings();
const { errorMessageParser } = require('../utils/errorMessageParser');

const catchBlockErrorHandler = async (catchBlockError) => {
    if (ENV.STAGE != 'LOCAL') {
        //send email to user.
        const emailObj = {
            to: ENV.SYSTEM_ADMIN_EMAIL,
            subject: `Catch Block Error occured at ${ENV.STAGE} mazahost`,
            html: emailTemplates.catchBlockErrorTemplate(catchBlockError),
        };

        emailService.sendEmail(emailObj);
    } else {
        await errorMessageParser(catchBlockError);
    }
}

module.exports = {
    catchBlockErrorHandler
};