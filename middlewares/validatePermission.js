const { failure } = require('../objects/return.objects');

// Middleware to check if user has the required permission

const hasPermission = (requiredPermissions) => async (req, res, next) => {
    try {
        // Ensure requiredPermissions is always an array
        const permissions = Array.isArray(requiredPermissions)
            ? requiredPermissions
            : [requiredPermissions];

        // Get user permissions from Redis data added by auth middleware
        if (!req.redisData || !req.redisData.permissions) {
            return res.status(403).send({
                success: false,
                message: "No permissions found in user session",
            });
        }

        const userPermissions = req.redisData.permissions;

        // Check if user has any of the required permissions
        const hasRequiredPermission = permissions.some(permission =>
            userPermissions.includes(permission)
        );

        if (hasRequiredPermission) {
            return next();
        } else {
            const failureObj = failure();
            failureObj.status = 403;
            failureObj.message = "You don't have permission to perform this action";
            return res.status(403).send(failureObj);
        }
    } catch (error) {
        console.error("Error in permission middleware:", error);
        return res.status(500).send({
            success: false,
            message: "Internal server error",
        });
    }
};

module.exports = {
    hasPermission
}; 