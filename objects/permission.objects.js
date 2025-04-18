const defaultPermissions = [
    {
        name: 'Create Project',
        key: 'create_project',
        module: 'projects',
        description: 'Allows user to create new projects',
    },
    {
        name: 'Delete Project',
        key: 'delete_project',
        module: 'projects',
        description: 'Allows user to delete existing projects',
    },
    {
        name: 'Invite User',
        key: 'invite_user',
        module: 'users',
        description: 'Allows user to invite members to the organization',
    },
    {
        name: 'Assign Task',
        key: 'assign_task',
        module: 'tasks',
        description: 'Allows user to assign tasks to members',
    },
    {
        name: 'View Reports',
        key: 'view_reports',
        module: 'reports',
        description: 'Allows user to view analytics and reports',
    }
];

module.exports = defaultPermissions;