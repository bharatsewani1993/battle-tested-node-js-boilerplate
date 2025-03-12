const ENV = require('../../env/index').envSettings();
const emailVerificationTemplate = (OTP) => {
    return `<html><body>
        <p><a href="#">Click Here to Login, OTP IS ${OTP}<a></p>
    </body></html>`;
}

module.exports = {
    emailVerificationTemplate
}