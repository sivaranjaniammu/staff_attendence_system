const attendanceService = require('../services/attendance.service');
const ApiResponse = require('../utils/apiResponse');

/**
 * Attendance Controller
 */
const attendanceController = {
  checkIn: async (req, res, next) => {
    try {
      // Ingress client parameters
      const ipAddress = req.ip || req.headers['x-forwarded-for'] || '127.0.0.1';
      const checkInPayload = {
        ...req.body,
        ipAddress
      };
      
      const record = await attendanceService.checkIn(req.user.id, checkInPayload);
      return ApiResponse.success(res, 'Check-in registered successfully', { record }, 201);
    } catch (error) {
      next(error);
    }
  },

  checkOut: async (req, res, next) => {
    try {
      const ipAddress = req.ip || req.headers['x-forwarded-for'] || '127.0.0.1';
      const checkOutPayload = {
        ...req.body,
        ipAddress
      };
      
      const record = await attendanceService.checkOut(req.user.id, checkOutPayload);
      return ApiResponse.success(res, 'Check-out registered successfully', { record });
    } catch (error) {
      next(error);
    }
  },

  getHistory: async (req, res, next) => {
    try {
      const history = await attendanceService.getHistory(req.user.id, req.query);
      return ApiResponse.success(res, 'Attendance logs history retrieved successfully', { history });
    } catch (error) {
      next(error);
    }
  },

  getTodayStatus: async (req, res, next) => {
    try {
      const record = await attendanceService.getTodayStatus(req.user.id);
      return ApiResponse.success(res, "Today's attendance status fetched successfully", { record });
    } catch (error) {
      next(error);
    }
  },

  getMonthlyReport: async (req, res, next) => {
    try {
      const { month, year } = req.query;
      const report = await attendanceService.getMonthlyReport(req.user.id, month, year);
      return ApiResponse.success(res, 'Monthly attendance report aggregated successfully', report);
    } catch (error) {
      next(error);
    }
  }
};

module.exports = attendanceController;
