const leaveService = require('../services/leave.service');
const ApiResponse = require('../utils/apiResponse');

/**
 * Leave Controller
 */
const leaveController = {
  applyLeave: async (req, res, next) => {
    try {
      const leave = await leaveService.applyLeave(req.user.id, req.body);
      return ApiResponse.success(res, 'Leave application submitted successfully', { leave }, 201);
    } catch (error) {
      next(error);
    }
  },

  getLeaves: async (req, res, next) => {
    try {
      // Staff retrieve own applications; Admins get all records
      const isStaff = req.user.role === 'STAFF';
      const userId = isStaff ? req.user.id : null;
      
      const leaves = await leaveService.getLeaves(userId, req.query);
      return ApiResponse.success(res, 'Leave applications history retrieved successfully', { leaves });
    } catch (error) {
      next(error);
    }
  },

  getLeaveById: async (req, res, next) => {
    try {
      const leave = await leaveService.getLeaveById(req.params.id);
      return ApiResponse.success(res, 'Leave application details fetched', { leave });
    } catch (error) {
      next(error);
    }
  },

  updateLeaveStatus: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { status, remarks } = req.body;
      
      const leave = await leaveService.updateStatus(id, status, remarks, req.user.id);
      return ApiResponse.success(res, `Leave request status updated to ${status}`, { leave });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = leaveController;
