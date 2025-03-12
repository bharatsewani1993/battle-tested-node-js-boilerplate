const { success, failure } = require('../objects/return.objects');

const extractTLD = async (fullDomain) => {
    try {
        const parts = fullDomain.split('.');
        if (parts.length >= 2) {
            const successObj = success();
            successObj.data = [{ tld: parts[parts.length - 1] }];
            return successObj;
        } else {
            const failureObj = failure();
            failureObj.message = "Failed to extract TLD";
            return failureObj;
        }
    } catch (error) {
        const failureObj = failure();
        failureObj.message = "Failed to extract TLD";
        return failureObj;
    }
}

module.exports = {
    extractTLD
}

