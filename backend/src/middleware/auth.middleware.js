const jwt = require('jsonwebtoken');
const ApiError = require('../utils/apiError');
const logger = require('../config/logger');

/**
 * JWT Authentication Middleware
 * Extracts and verifies JWT from Bearer Authorization header
 */
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError('Authentication token missing or malformed', 401);
    }

    const token = authHeader.split(' ')[1];
    
    // Verify token synchronously to cleanly catch exceptions
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'access_secret_token_key_32_chars');
    
    // Inject decoded user metadata into request object
    req.user = {
      id: decoded.id,
      role: decoded.role,
      email: decoded.email
    };
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      logger.warn('Failed token verification attempt: %s', error.message);
      return next(new ApiError('Invalid or expired authentication token', 401));
    }
    next(error);
  }
};

module.exports = authMiddleware;
