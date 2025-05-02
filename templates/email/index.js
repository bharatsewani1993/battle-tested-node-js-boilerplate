const { emailVerificationTemplate } = require('./emailVerificationTemplate');
const { criticalServerErrorTemplate } = require('./criticalServerErrorTemplate');
const { catchBlockErrorTemplate } = require('./catchBlockErrorTemplate');

const organizationInviteTemplate = (organizationName, inviteLink, roleName = '', customMessage = '') => {
    return `
    <html>
        <body>
            <h1>Organization Invitation</h1>
            <p>You have been invited to join <strong>${organizationName}</strong>${roleName ? ` with the role of <strong>${roleName}</strong>` : ''}.</p>
            ${customMessage ? `<p>${customMessage}</p>` : ''}
            <p>Click the link below to accept the invitation:</p>
            <a href="${inviteLink}" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 4px;">Accept Invitation</a>
            <p>If you didn't expect this invitation, please ignore this email.</p>
            <p>Thank you!</p>
        </body>
    </html>
    `;
};

module.exports = {
    emailVerificationTemplate,
    criticalServerErrorTemplate,
    catchBlockErrorTemplate,
    organizationInviteTemplate
}
