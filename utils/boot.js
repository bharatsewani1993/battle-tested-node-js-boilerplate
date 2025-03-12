let bcrypt = require('bcrypt');
const redis = require('../config/redis');
const { MESSAGES } = require("../constants/constants");
const ENV = require('../env/index').envSettings();
const { envVariablesArr } = require('../constants/envVariables');
const { redisMaster } = require('../services/system/redisService');
const { GOD_ADMIN } = require('../constants/godAdmin');

//list not available env variables
const requiredEnvVariables = async () => {
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
}


let master = async function () {
    await requiredEnvVariables();
    //  await redisMaster();
}

module.exports = {
    master
}