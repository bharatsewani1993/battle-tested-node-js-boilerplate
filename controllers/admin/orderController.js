const { failure } = require('../../objects/return.objects');
const { catchBlockErrorHandler } = require('../../utils/errorHandler');
const orderService = require("../../services/admin/orderService");

//list All orders of Users
const getOrders = async (req, res, next) => {
    try {
        const page = req.query.page;
        const limit = req.query.limit;

        const listObj = {
            page,
            limit
        }
        const orders = await adminService.getOrders(listObj)

        res.status(orders.status).send(orders);
    }
    catch (error) {
        catchBlockErrorHandler(error);
        const failureObj = failure();
        failureObj.message = "Something went wrong at server side";
        return res.status(500).send(failureObj);
    }
}

//List All Order of Specific Users
const getOrdersByUserId = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const page = req.query.page || 1;
        const limit = req.query.limit || 10;

        const ordersObj = { userId, page, limit };

        const userOrders = await adminService.getUserOrders(ordersObj);
        res.status(userOrders.status).send(userOrders);
    }
    catch (error) {
        catchBlockErrorHandler(error);
        const failureObj = failure();
        failureObj.message = "Something Went Wrong At Server Side";
        return res.status(500).send(failureObj);
    }
}

//update Pricing of order
const patchOrderPrice = async (req, res, next) => {
    try {
        const orderId = req.params.orderId;
        const orderAmount = req.body.order_amount;
        const fileId = req.params.fileId;
        const taxAmount = req.body.tax_amount;
        const priceObj = {
            orderId: orderId,
            orderAmount: orderAmount,
            fileId: fileId,
            taxAmount: taxAmount
        }
        const updatedPrice = await orderService.patchOrderPrice(priceObj);

        res.status(updatedPrice.status).send(updatedPrice);

    }
    catch (error) {
        catchBlockErrorHandler(error);
        const failureObj = failure();
        failureObj.message = "Something Went Wrong At Server Side";
        return res.status(500).send(failureObj);
    }
}

//Uploaded File Delete By Admin
const deleteOrderFile = async (req, res, next) => {
    try {
        const fileId = req.params.fileId;

        const deletedFile = await adminService.deleteFile(fileId);

        res.status(deletedFile.status).send(deletedFile);
    }
    catch (error) {
        catchBlockErrorHandler(error);
        const failureObj = failure();
        failureObj.message = "Something Went Wrong At Server Side";
        return res.status(500).send(failureObj);
    }
}

module.exports = {
    getOrders,
    getOrdersByUserId,
    patchOrderPrice,
    deleteOrderFile
}