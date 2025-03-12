const { failure } = require('../../objects/return.objects');
const { catchBlockErrorHandler } = require('../../utils/errorHandler');
const userService = require("../../services/admin/userService");

//list All user Profile
const getUsers = async (req, res, next) => {
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 10;

        const listObj = {
            limit,
            page
        }

        const listedUsers = await userService.getUsers(listObj);

        res.status(listedUsers.status).send(listedUsers);

    }
    catch (error) {
        catchBlockErrorHandler(error);
        const failureObj = failure();
        failureObj.message = "Something went wrong at server side";
        return res.status(500).send(failureObj);
    }
}

//list Single User Profile
const getUserById = async (req, res, next) => {
    try {

        const userId = req.params.userId;
        const user = await userService.getUserById(userId);
        res.status(user.status).send(user);
    } catch (error) {
        catchBlockErrorHandler(error);
        const failureObj = failure();
        failureObj.message = "Something went wrong at server side";
        return res.status(500).send(failureObj);
    }
}

module.exports = {
    getUsers,
    getUserById,
}