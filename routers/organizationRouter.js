const express = require('express');
const router = express.Router();
const { validateAuth } = require('../middlewares/auth');
const { postCreateOrganization, patchUpdateOrganization, deleteOrganization } = require('../controllers/organizationController');
const validate = require('../middlewares/validate');
const { createOrganizationValidations, updateOrganizationValidations, deleteOrganizationValidations } = require('../validations/organizationValidations');

// Create organization
router.post('/', validateAuth, validate(createOrganizationValidations), postCreateOrganization);

// Update organization
router.patch('/', validateAuth, validate(updateOrganizationValidations), patchUpdateOrganization);

// Delete organization
router.delete('/:orgId', validateAuth, validate(deleteOrganizationValidations), deleteOrganization);

module.exports = router; 