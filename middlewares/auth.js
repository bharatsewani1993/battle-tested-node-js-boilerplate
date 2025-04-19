const jwt = require("jsonwebtoken");
const ENV = require("../env/index").envSettings();
const { set, get } = require('../services/redisService.js');



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
        message: "Login required",
      });
    }


    const token = req.headers.authorization;
    try {
      const decoded = jwt.verify(token, ENV.JWT_SECRET_KEY);
      const redisObj = await get(decoded.key);

      if (!redisObj.success) {
        return res.status(401).send({
          success: false,
          message: "Login required",
        });
      }

      req.redisData = redisObj.data;
      return next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).send({
          success: false,
          message: "Login required",
        });
      } else {
        return res.status(401).send({
          success: false,
          message: "Login required",
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
  validateAuth
};
