const requiredEnvVariables = require('./verifyEnvVariables');
const seedDefaultPermissions = require('./seedDefaultPermissions');


let startupScripts = async function () {
    await requiredEnvVariables();
    await seedDefaultPermissions();
}

module.exports = startupScripts;