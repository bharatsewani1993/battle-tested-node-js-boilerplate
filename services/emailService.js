const sgMail = require('@sendgrid/mail');
const ENV = require('../env/index').envSettings();
sgMail.setApiKey(ENV.SENDGRID_API_KEY);
const { success, failure } = require('../objects/return.objects');


const sendEmail = async (emailObj) => {
    try {

        const msg = {
            to: emailObj.to,
            subject: emailObj.subject,
            html: emailObj.html,
            from: {
                email: ENV.FROM_EMAIL,
                name: ENV.FROM_NAME
            }
        };

        const response = await sgMail.send(msg);
        if (response[0].statusCode == 202) {
            const successObj = success();
            successObj.message = "Email sent succesfully!"
            return successObj;
        } else {
            const failureObj = failure();
            failureObj.message = "Fail to send email"
            return failureObj;
        }
    } catch (error) {
        console.error(error);
        const failureObj = failure();
        return failureObj;
    }
}

module.exports = {
    sendEmail
}
