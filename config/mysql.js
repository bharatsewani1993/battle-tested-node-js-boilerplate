const Sequelize = require('sequelize')
const ENV = require('../env/index').envSettings();

const sequelize = new Sequelize(ENV.DATABASE_NAME, ENV.DATABASE_USER, ENV.DATABASE_PASSWORD, {
  dialect: ENV.DIALECT,
  host: ENV.DATABASE_HOST,
  logging: ENV.LOGGING,
});

sequelize.authenticate()
  .then(function () {
    console.log("MySql database connected! ");
  })
  .catch(function (err) {
    console.log("SOMETHING went wrong");
  });


module.exports = sequelize