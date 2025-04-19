const express = require('express');
const router = express.Router();
const { validateAuth } = require('../middlewares/auth');
const { hasPermission } = require('../middlewares/validatePermission');
const { getAllPermissions, getRolePermissions, postAssignPermissions, deleteRolePermissions } = require('../controllers/permissionController');
const validate = require('../middlewares/validate');
const { assignPermissionValidations, deletePermissionValidations, roleIdValidation } = require('../validations/permissionValidations');

// Get all available permissions in the system
router.get('/', validateAuth, hasPermission('view_permissions'), getAllPermissions);

// Get permissions for a specific role
router.get('/role/:roleId', validateAuth, hasPermission(['view_permissions', 'view_role']), validate(roleIdValidation), getRolePermissions);

// Assign permissions to a role
router.post('/assign', validateAuth, hasPermission('assign_permission'), validate(assignPermissionValidations), postAssignPermissions);

module.exports = router; 