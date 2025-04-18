const express = require('express');
const router = express.Router();
const { validateAuth } = require('../middlewares/auth');
const { postEmailMagicLink, getVerifyEmailOTP, deleteLogout } = require('../controllers/userController');
const validate = require('../middlewares/validate');
const { emailLoginValidations, emailOtpValidations } = require('../validations/userValidations');

//for signup,sign-in we have single api.
router.post('/email/magic-link', validate(emailLoginValidations), postEmailMagicLink);

router.get('/email/magic-link/verify', validate(emailOtpValidations), getVerifyEmailOTP);

router.delete("/logout", validateAuth, deleteLogout);

module.exports = router;