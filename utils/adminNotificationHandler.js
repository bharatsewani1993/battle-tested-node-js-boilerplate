const emailTemplates = require("../templates/email");
const emailService = require("../services/emailService");
const ENV = require('../env/index').envSettings();

const newWebsiteNotification = (successObj) => {
    if (ENV.STAGE != 'LOCAL') {
        //send email to user.
        const emailObj = {
            to: ENV.SYSTEM_ADMIN_EMAIL,
            subject: `A new website created on ${ENV.STAGE} mazahost`,
            html: emailTemplates.newWebsiteNotificationTemplate(successObj),
        };

        emailService.sendEmail(emailObj);
    }
}

module.exports = {
    newWebsiteNotification
};