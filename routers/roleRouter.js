const express = require('express');
const router = express.Router();
const { validateAuth } = require('../middlewares/auth');
const { hasPermission } = require('../middlewares/validatePermission');
const { getAllRoles, postCreateRole, getRole, patchUpdateRole, deleteRole } = require('../controllers/roleController');
const validate = require('../middlewares/validate');
const { createRoleValidations, updateRoleValidations, roleIdValidation } = require('../validations/roleValidations');

// Get all roles
router.get('/', validateAuth, hasPermission('view_roles'), getAllRoles);

// Create a new role
router.post('/', validateAuth, hasPermission('create_role'), validate(createRoleValidations), postCreateRole);

// Get role by ID
router.get('/:roleId', validateAuth, hasPermission('view_role'), validate(roleIdValidation), getRole);

// Update role
router.patch('/:roleId', validateAuth, hasPermission('update_role'), validate(updateRoleValidations), patchUpdateRole);

// Delete role
router.delete('/:roleId', validateAuth, hasPermission('delete_role'), validate(roleIdValidation), deleteRole);

module.exports = router; 