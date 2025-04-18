const { catchBlockErrorHandler } = require('../utils/errorHandler');
const redis = require('../config/redis');
const ENV = require('../env/index').envSettings();
const { success, failure } = require('../objects/return.objects');

//set redis object
const set = async (obj) => {
    try {
        // Convert the OTP data object to a JSON string
        const objString = JSON.stringify(obj);

        // Use async/await for Redis commands
        await redis.set(obj.key, objString);
        await redis.expire(obj.key, obj.expiry); // Set expiry for the key

        const successObj = success();
        successObj.message = "Object set successfully!";
        return successObj;
    } catch (error) {
        catchBlockErrorHandler(error);
        const failureObj = failure();
        failureObj.message = "Failed to set Object";
        return failureObj;
    }
}

//get redis object
const get = async (key) => {
    try {
        //Check if the key exists in Redis
        const objDataString = await redis.get(key);
        if (objDataString) {
            // Parse the JSON string to get the stored data
            const storedObj = JSON.parse(objDataString);

            const successObj = success();
            successObj.data = storedObj;
            return successObj;
        }

        const failureObj = failure();
        failureObj.message = "Failed to get object!";
        return failureObj;

    } catch (error) {
        catchBlockErrorHandler(error);
        const failureObj = failure();
        failureObj.message = "Failed to get object!";
        return failureObj;
    }
}

module.exports = {
    set,
    get,
}