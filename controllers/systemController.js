const { failure } = require('../objects/return.objects');
const { catchBlockErrorHandler } = require('../utils/errorHandler');
const systemService = require('../services/systemService');

const getProjectRoot = async (req, res, next) => {
    try {
        const result = await systemService.getProjectRoot();
        res.status(result.status).send(result);
    } catch (error) {
        catchBlockErrorHandler(error);
        const failureObj = failure();
        failureObj.message = "Something went wrong at server side!";
        return res.status(500).send(failureObj);
    }
}


module.exports = {
    getProjectRoot,
}