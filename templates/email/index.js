const { emailVerificationTemplate } = require('./emailVerificationTemplate');
const { criticalServerErrorTemplate } = require('./criticalServerErrorTemplate');
const { catchBlockErrorTemplate } = require('./catchBlockErrorTemplate');

module.exports = {
    emailVerificationTemplate,
    criticalServerErrorTemplate,
    catchBlockErrorTemplate,
}
