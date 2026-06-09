const ApiError = require('../utils/apiError');

/**
 * Validation Middleware using Joi
 * Validates request body, query, or params against specified Joi schemas
 * @param {Object} schema - Joi validation schema object
 * @param {string} source - Request field to validate ('body', 'query', 'params') (default: 'body')
 */
const validationMiddleware = (schema, source = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[source], {
      abortEarly: false,     // Capture all errors rather than failing on first
      allowUnknown: true,   // Allow non-validated inputs
      stripUnknown: true    // Strip unrecognized inputs from output body
    });

    if (error) {
      const errorDetails = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message
      }));
      
      throw new ApiError('Request validation failed', 400, errorDetails);
    }

    // Replace request payload with clean validated input values
    req[source] = value;
    next();
  };
};

module.exports = validationMiddleware;
