const express = require('express');
const router = express.Router();
const { validateAuth } = require('../middlewares/auth');
const { postEmailMagicLink, getVerifyEmailOTP, deleteLogout, postSelectOrganization, getAcceptInvitation, getUserOrganizations } = require('../controllers/userController');
const validate = require('../middlewares/validate');
const { emailLoginValidations, emailOtpValidations, selectOrganizationValidation, acceptInvitationValidation } = require('../validations/userValidations');

//for signup,sign-in we have single api.
router.post('/email/magic-link', validate(emailLoginValidations), postEmailMagicLink);

router.get('/email/magic-link/verify', validate(emailOtpValidations), getVerifyEmailOTP);

router.delete("/logout", validateAuth, deleteLogout);

// Route to select an organization and update permissions in Redis
router.post("/select-organization", validateAuth, validate(selectOrganizationValidation), postSelectOrganization);

// Route to accept an invitation to join an organization (GET endpoint - no auth required)
router.get("/accept-invitation", validate(acceptInvitationValidation), getAcceptInvitation);

// Route to get all organizations for the current logged-in user
router.get("/organizations", validateAuth, getUserOrganizations);

module.exports = router;