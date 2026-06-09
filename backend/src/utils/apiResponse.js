/**
 * Centralized API Success Response Helper
 */
class ApiResponse {
  /**
   * Send structured JSON success response
   * @param {Object} res - Express Response object
   * @param {string} message - Descriptive message
   * @param {Object} data - Payload dictionary
   * @param {number} statusCode - HTTP status code (default: 200)
   */
  static success(res, message = "Success", data = {}, statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data
    });
  }
}

module.exports = ApiResponse;
