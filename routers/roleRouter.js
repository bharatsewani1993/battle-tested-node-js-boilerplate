const express = require('express');
const router = express.Router();
const { validateAuth } = require('../middlewares/auth');
const { getAllRoles, postCreateRole, getRole, patchUpdateRole, deleteRole } = require('../controllers/roleController');
const validate = require('../middlewares/validate');
const { createRoleValidations, updateRoleValidations, roleIdValidation } = require('../validations/roleValidations');

// Get all roles
router.get('/', validateAuth, getAllRoles);

// Create a new role
router.post('/', validateAuth, validate(createRoleValidations), postCreateRole);

// Get role by ID
router.get('/:roleId', validateAuth, validate(roleIdValidation), getRole);

// Update role
router.patch('/:roleId', validateAuth, validate(updateRoleValidations), patchUpdateRole);

// Delete role
router.delete('/:roleId', validateAuth, validate(roleIdValidation), deleteRole);

module.exports = router; 