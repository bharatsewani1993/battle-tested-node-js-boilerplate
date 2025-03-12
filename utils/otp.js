const redis = require('../config/redis');
const { catchBlockErrorHandler } = require('./errorHandler');
const { success, failure } = require('../objects/return.objects');

const validateOtp = async (otpObj) => {
    try {
        // Check if the OTP data exists in Redis
        const otpDataString = await redis.get(otpObj.key);
        if (otpDataString) {
            // Parse the JSON string to get the stored OTP data
            const storedOtpObj = JSON.parse(otpDataString);
            // Convert stored OTP to number if it's a string
            if (typeof storedOtpObj.otp === 'string') {
                storedOtpObj.otp = Number(storedOtpObj.otp);
            }
            // Convert input OTP to number if it's a string
            const inputOtp = typeof otpObj.otp === 'string' ? Number(otpObj.otp) : otpObj.otp;
            // Compare the provided OTP with the stored OTP
            if (storedOtpObj.otp === inputOtp) {
                await redis.del(otpObj.key);

                const successObj = success();
                successObj.data.push(storedOtpObj);
                return successObj;
            }
        }
        // The OTP data does not exist in Redis or the provided OTP is incorrect
        const failureObj = failure();
        failureObj.message = "Failed to get OTP";
        return failureObj;
    } catch (error) {
        catchBlockErrorHandler(error);
        const failureObj = failure();
        failureObj.message = "Failed to get OTP";
        return failureObj;
    }
};



module.exports = {
    validateOtp,
}