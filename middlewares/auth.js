const jwt = require("jsonwebtoken");
const ENV = require("../env/index").envSettings();
const CONSTANTS = require("../constants/constants");
const CATCH_MESSAGES = require("../constants/catchMessages");
const { set, get } = require('../services/redisService.js');
const userModel = require("../models/userModel.js")
const createAuthentication = async (tokenDetails) => {

  const token = jwt.sign(tokenDetails,
    ENV.JWT_SECRET_KEY, {
    expiresIn: "2h",
  }
  );
  return token;
}
const validateAuth = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      console.log("No authorization header");
      return res.status(401).send({
        success: false,
        message: CONSTANTS.MESSAGES.LOGIN_REQUIRED,
      });
    }

   
    const token = req.headers.authorization;
    try {
      const decoded = jwt.verify(token, ENV.JWT_SECRET_KEY);
      console.log("Decoded token:", decoded);
      const redisObj = await get(decoded.key);

      if (!redisObj.success) {
        return res.status(401).send({
          success: false,
          message: CONSTANTS.MESSAGES.LOGIN_REQUIRED,
        });
      }

      req.redisData = redisObj.data; 
      return next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).send({
          success: false,
          message: CONSTANTS.MESSAGES.LOGIN_REQUIRED,
        });
      } else {
        return res.status(401).send({
          success: false,
          message: CONSTANTS.MESSAGES.LOGIN_REQUIRED,
        });
      }
    }
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};


const validateAuthAndRole = (roleArr) => async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return res.status(401).send({
        success: false,
        message: CONSTANTS.MESSAGES.LOGIN_REQUIRED,
      });
    }

    const token = req.headers.authorization;
    try {
      const decoded = jwt.verify(token, ENV.JWT_SECRET_KEY);
      const redisObj = await get(decoded.key);
      if (!redisObj.success) {
        return res.status(401).send({
          success: false,
          message: CONSTANTS.MESSAGES.LOGIN_REQUIRED,
        });
      }
      if (roleArr.includes(redisObj.data.userRole)) {
        req.redisData = redisObj.data;
        return next();
      } else {
        const failureObj = failure();
        failureObj.status = 403;
        failureObj.message = "Make sure to select a blog before doing anything.";
        res.status(403).send(failureObj);
      }
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).send({
          success: false,
          message: CONSTANTS.MESSAGES.LOGIN_REQUIRED,
        });
      } else {
        return res.status(401).send({
          success: false,
          message: CONSTANTS.MESSAGES.LOGIN_REQUIRED,
        });
      }
    }
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  createAuthentication,
  validateAuth,
  validateAuthAndRole
};
