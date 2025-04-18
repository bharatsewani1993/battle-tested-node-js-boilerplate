const requiredEnvVariables = require('./verifyEnvVariables');
const seedDefaultPermissions = require('./seedDefaultPermissions');
const { success, failure } = require('../objects/return.objects');
const { catchBlockErrorHandler } = require('../utils/errorHandler');

let startupScripts = async function () {
    try {
        // Verify environment variables
        const envResult = await requiredEnvVariables();
        if (!envResult.success) {
            console.error('❌ Failed to verify env variables:', envResult.message);
        } else if (envResult.data.missingKeys && envResult.data.missingKeys.length > 0) {
            console.warn('⚠️ Some environment variables are missing, but continuing startup');
        }

        // Seed default permissions
        const permissionResult = await seedDefaultPermissions();
        if (!permissionResult.success) {
            console.error('❌ Failed to seed permissions:', permissionResult.message);
        } else {
            console.log('✅ Permissions seeded successfully');
        }

        const successObj = success();
        successObj.message = "Startup scripts completed";
        return successObj;
    } catch (error) {
        catchBlockErrorHandler(error);
        const failureObj = failure();
        failureObj.message = "Failed to run startup scripts";
        console.error('❌ Error in startup scripts:', failureObj.message);
        return failureObj;
    }
}

module.exports = startupScripts;