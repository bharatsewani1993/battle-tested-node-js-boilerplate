const { catchBlockErrorHandler } = require('../utils/errorHandler');
const redis = require('../config/redis');
const ENV = require('../env/index').envSettings();
const { success, failure } = require('../objects/return.objects');

//set redis object
const set = async (obj) => {
    try {
        const { key, expiry, ...newData } = obj;

        const existingDataString = await redis.get(key);
        let dataToStore = newData;

        if (existingDataString) {
            const existingData = JSON.parse(existingDataString);
            // Merge existing and new data (preserve existing keys not in new data)
            dataToStore = { ...existingData, ...newData };
        }

        await redis.set(key, JSON.stringify(dataToStore));
        await redis.expire(key, expiry);

        const successObj = success();
        successObj.message = "Object set successfully!";
        return successObj;
    } catch (error) {
        catchBlockErrorHandler(error);
        const failureObj = failure();
        failureObj.message = "Failed to set Object";
        return failureObj;
    }
};


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