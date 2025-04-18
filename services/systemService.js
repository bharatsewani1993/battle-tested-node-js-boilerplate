const { success, failure } = require('../objects/return.objects');
const { catchBlockErrorHandler } = require('../utils/errorHandler');
const ENV = require('../env/index').envSettings();

const getProjectRoot = async () => {
    try {
        const successObj = success();
        successObj.message = `${ENV.PROJECT_REPO_NAME} is working fine!`
        return successObj;
    } catch (error) {
        catchBlockErrorHandler(error);
        const failureObj = failure();
        failureObj.message = error.message;
        return failureObj;
    }
}

module.exports = {
    getProjectRoot,
}