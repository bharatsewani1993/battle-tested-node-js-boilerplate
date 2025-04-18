const { envVariablesArr } = require('../objects/envVariable.objects');
const ENV = require('../env/index').envSettings();
const { success, failure } = require('../objects/return.objects');
const { catchBlockErrorHandler } = require('../utils/errorHandler');

//list not available env variables
const requiredEnvVariables = async () => {
    try {
        const extraKeys = [];
        const missingKeys = [];

        for (const key in ENV) {
            if (ENV.hasOwnProperty(key) && !envVariablesArr.includes(key)) {
                extraKeys.push(key);
            }
        }

        for (const key of envVariablesArr) {
            if (!(key in ENV)) {
                missingKeys.push(key);
            }
        }

        if (missingKeys.length > 0) {
            console.log("\nMissing env variables", missingKeys);
        }

        if (extraKeys.length > 0) {
            console.log("Project specific extra env variables", extraKeys);
        }

        const successObj = success();
        successObj.data = { missingKeys, extraKeys };
        successObj.message = "Environment variables verified";
        return successObj;
    } catch (error) {
        catchBlockErrorHandler(error);
        const failureObj = failure();
        failureObj.message = "Failed to verify environment variables";
        return failureObj;
    }
}

module.exports = requiredEnvVariables;