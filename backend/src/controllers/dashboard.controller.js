const dashboardService = require('../services/dashboard.service');
const ApiResponse = require('../utils/apiResponse');

/**
 * Dashboard Statistics Controller
 */
const dashboardController = {
  getStats: async (req, res, next) => {
    try {
      const stats = await dashboardService.getStats();
      return ApiResponse.success(res, 'Dashboard statistics aggregated successfully', { stats });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = dashboardController;
