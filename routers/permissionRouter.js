const express = require('express');
const router = express.Router();
const { validateAuth } = require('../middlewares/auth');
const { getAllPermissions, getRolePermissions, postAssignPermissions, deleteRolePermissions } = require('../controllers/permissionController');
const validate = require('../middlewares/validate');
const { assignPermissionValidations, deletePermissionValidations, roleIdValidation } = require('../validations/permissionValidations');

// Get all available permissions in the system
router.get('/', validateAuth, getAllPermissions);

// Get permissions for a specific role
router.get('/role/:roleId', validateAuth, validate(roleIdValidation), getRolePermissions);

// Assign permissions to a role
router.post('/assign', validateAuth, validate(assignPermissionValidations), postAssignPermissions);

module.exports = router; 