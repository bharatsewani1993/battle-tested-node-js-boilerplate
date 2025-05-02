const express = require('express');
const router = express.Router();
const { validateAuth } = require('../middlewares/auth');
const { hasPermission } = require('../middlewares/validatePermission');
const { postCreateOrganization, patchUpdateOrganization, deleteOrganization, postInviteMember } = require('../controllers/organizationController');
const validate = require('../middlewares/validate');
const { createOrganizationValidations, updateOrganizationValidations, deleteOrganizationValidations, inviteMemberValidations } = require('../validations/organizationValidations');

// Create organization
router.post('/', validateAuth, validate(createOrganizationValidations), postCreateOrganization);

// Update organization
router.patch('/', validateAuth, hasPermission('update_organization'), validate(updateOrganizationValidations), patchUpdateOrganization);

// Delete organization
router.delete('/:orgId', validateAuth, hasPermission('delete_organization'), validate(deleteOrganizationValidations), deleteOrganization);

// Invite member to organization
router.post('/invite', validateAuth, hasPermission('invite_organization_user'), validate(inviteMemberValidations), postInviteMember);

module.exports = router; 