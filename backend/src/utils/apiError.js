/**
 * Custom Operational Error Class
 * Injects clean HTTP status code and serialization attributes
 */
class ApiError extends Error {
  constructor(message, statusCode = 500, errors = null) {
    super(message);
    this.statusCode = statusCode;
    this.success = false;
    this.errors = errors; // Array/object for validation details or stack references

    // Capture stack trace excluding this constructor
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ApiError;
