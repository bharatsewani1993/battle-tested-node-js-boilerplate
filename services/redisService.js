const { catchBlockErrorHandler } = require('../utils/errorHandler');
const { channelsToSubscribeArr } = require('../config/redisChannels');
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



//subscribe redis channels, this function will trigger in boot file.
const subscribeRedisChannels = async () => {
    try {
        channelsToSubscribeArr.forEach((channelName) => {
            redis.subscribe(channelName);
        });
    } catch (error) {
        catchBlockErrorHandler(error);
        const failureObj = failure();
        failureObj.message = error.message;
        return failureObj;
    }
}

//start listening to all subscribed channels.
//this function will trigger in boot file.
const listenRedisChannels = async () => {
    try {
        redis.on('message', (channel, message) => {
            console.log(`Received message on channel ${channel}: ${message}`);

            switch (channel) {
                case `${ENV.PROJECT_ID}_SIGNUP_CHANNEL`:
                    //call your function on specific channel message.
                    //createFreelancerProfile(message);
                    break;
                default:
                    return null;
            }

        });
    } catch (error) {
        catchBlockErrorHandler(error);
        const failureObj = failure();
        failureObj.message = error.message;
        return failureObj;
    }
};

//this function will handle redis errors
const handleRedisErrors = async () => {
    try {
        redis.on('error', (error) => {
            console.error('Redis Channel error:', error);
        });
    } catch (error) {
        catchBlockErrorHandler(error);
        const failureObj = failure();
        failureObj.message = error.message;
        return failureObj;
    }
}

const redisMaster = async () => {
    try {
        await subscribeRedisChannels();
        await listenRedisChannels();
        await handleRedisErrors();
    } catch (error) {
        catchBlockErrorHandler(error);
        const failureObj = failure();
        failureObj.message = error.message;
        return failureObj;
    }
}



module.exports = {
    set,
    get,
    subscribeRedisChannels,
    listenRedisChannels,
    handleRedisErrors,
    redisMaster,
}