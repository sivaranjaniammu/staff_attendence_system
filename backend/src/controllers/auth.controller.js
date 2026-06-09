const authService = require('../services/auth.service');
const ApiResponse = require('../utils/apiResponse');
const responseMessages = require('../constants/responseMessages');

/**
 * Authentication Controller
 */
const authController = {
  /**
   * Login credentials check
   */
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      return ApiResponse.success(res, responseMessages.AUTH.LOGIN_SUCCESS, result);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Token refresh rotation action
   */
  refreshToken: async (req, res, next) => {
    try {
      const { refreshToken } = req.body;
      const result = await authService.refreshSession(refreshToken);
      return ApiResponse.success(res, 'Tokens refreshed successfully', result);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Revoke/logout session details
   */
  logout: async (req, res, next) => {
    try {
      // In stateless JWT architectures, token deletion is managed client-side.
      // If server-side token blacklist DB is needed in the future, it is integrated here.
      return ApiResponse.success(res, responseMessages.AUTH.LOGOUT);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Fetch authenticated user details
   */
  getProfile: async (req, res, next) => {
    try {
      const profile = await authService.getProfile(req.user.id);
      return ApiResponse.success(res, 'Profile details retrieved successfully', { profile });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = authController;
