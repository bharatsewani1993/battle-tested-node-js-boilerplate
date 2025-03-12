const { failure } = require('../objects/return.objects');
const { getBody } = require('../utils/getBody');

const validate = (schema) => (req, res, next) => {
  try {
    // From where to get the data
    const body = getBody(req);

    // Validate the data
    const { error, value } = schema.validate(body);

    if (error) {
      const errorArr = error.details.map(detail => ({ [detail.path[0]]: detail.message }));

      const failureObj = failure();
      failureObj.errors = errorArr;
      failureObj.message = "Validation errors";
      return res.status(failureObj.status || 400).send(failureObj);
    }

    Object.assign(req.body, value);
    next();
  } catch (error) {
    console.error("Error in validation middleware:", error);
    return res.status(500).send({ message: "Internal server error" });
  }
};

module.exports = validate;
