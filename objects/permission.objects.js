const defaultPermissions = [
    // Organization permissions
    {
        name: 'Create Organization',
        key: 'create_organization',
        module: 'organizations',
        description: 'Allows user to create a new organization',
    },
    {
        name: 'Update Organization',
        key: 'update_organization',
        module: 'organizations',
        description: 'Allows user to update organization details',
    },
    {
        name: 'Delete Organization',
        key: 'delete_organization',
        module: 'organizations',
        description: 'Allows user to delete an organization',
    },

    // Organization User permissions
    {
        name: 'Invite Organization User',
        key: 'invite_organization_user',
        module: 'organization_users',
        description: 'Allows user to invite others to the organization',
    },
    {
        name: 'Remove Organization User',
        key: 'remove_organization_user',
        module: 'organization_users',
        description: 'Allows user to remove members from the organization',
    },
    {
        name: 'Update Organization User Role',
        key: 'update_organization_user_role',
        module: 'organization_users',
        description: 'Allows user to change the role of organization members',
    },
    // Role permissions
    {
        name: 'View Roles',
        key: 'view_roles',
        module: 'roles',
        description: 'Allows user to view all roles in the organization',
    },
    {
        name: 'Create Role',
        key: 'create_role',
        module: 'roles',
        description: 'Allows user to create new roles',
    },
    {
        name: 'View Role',
        key: 'view_role',
        module: 'roles',
        description: 'Allows user to view details of a specific role',
    },
    {
        name: 'Update Role',
        key: 'update_role',
        module: 'roles',
        description: 'Allows user to update existing roles',
    },
    {
        name: 'Delete Role',
        key: 'delete_role',
        module: 'roles',
        description: 'Allows user to delete roles',
    },

    // Permission management permissions
    {
        name: 'Assign Permission',
        key: 'assign_permission',
        module: 'permissions',
        description: 'Allows user to assign permissions to roles',
    },
    {
        name: 'Revoke Permission',
        key: 'revoke_permission',
        module: 'permissions',
        description: 'Allows user to revoke permissions from roles',
    },
    {
        name: 'View Permissions',
        key: 'view_permissions',
        module: 'permissions',
        description: 'Allows user to view all available permissions',
    }
];

module.exports = defaultPermissions;