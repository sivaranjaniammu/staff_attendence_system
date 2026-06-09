const logger = require('../config/logger');

/**
 * Global Express Error Handling Middleware
 */
const errorHandler = (err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;

  // Log error using Winston
  logger.error(`${req.method} ${req.originalUrl} - Status: ${statusCode} - Msg: ${message} - Stack: ${err.stack}`);

  // Construct response JSON
  const response = {
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { error: err.stack }),
    ...(err.errors && { errors: err.errors })
  };

  res.status(statusCode).json(response);
};

module.exports = errorHandler;
