const ApiError = require('../utils/apiError');

/**
 * Role-Based Access Control Middleware
 * Restricts access to routes based on user role
 * @param {...string} allowedRoles - List of authorized roles (e.g. 'ADMIN', 'STAFF')
 */
const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        throw new ApiError('User credentials not found in request context', 401);
      }

      if (!allowedRoles.includes(req.user.role)) {
        throw new ApiError('Access denied: Insufficient privileges to access this resource', 403);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = roleMiddleware;
