const express = require('express');
const router = express.Router();
const { validateAuth } = require('../middlewares/auth');
const { hasPermission } = require('../middlewares/validatePermission');
const { postCreateOrganization, patchUpdateOrganization, deleteOrganization,getCurrentOrganization,postInviteMember } = require('../controllers/organizationController');
const validate = require('../middlewares/validate');
const { createOrganizationValidations, updateOrganizationValidations, deleteOrganizationValidations,inviteMemberValidations } = require('../validations/organizationValidations');

// Create organization
router.post('/', validateAuth, validate(createOrganizationValidations), postCreateOrganization);

// Update organization
router.patch('/', validateAuth, validate(updateOrganizationValidations), patchUpdateOrganization);

// Delete organization
router.delete('/:organizationId', validateAuth, hasPermission('delete_organization'), validate(deleteOrganizationValidations), deleteOrganization);

// Invite member to organization
router.post('/invite', validateAuth, hasPermission('invite_organization_user'), validate(inviteMemberValidations), postInviteMember);

// Get current organization details
router.get('/current/details', validateAuth, getCurrentOrganization);

// Invite member to organization
router.post('/invite', validateAuth, hasPermission('invite_organization_user'), validate(inviteMemberValidations), postInviteMember);

// Get current organization details
router.get('/current/details', validateAuth, getCurrentOrganization);


module.exports = router; 