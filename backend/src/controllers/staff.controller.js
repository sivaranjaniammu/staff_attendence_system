const staffService = require('../services/staff.service');
const ApiResponse = require('../utils/apiResponse');

/**
 * Staff CRUD Controller
 */
const staffController = {
  getAllStaff: async (req, res, next) => {
    try {
      const staffList = await staffService.getAllStaff(req.query);
      return ApiResponse.success(res, 'Staff records retrieved successfully', { staffList });
    } catch (error) {
      next(error);
    }
  },

  getStaffById: async (req, res, next) => {
    try {
      const staff = await staffService.getStaffById(req.params.id);
      return ApiResponse.success(res, 'Staff record retrieved successfully', { staff });
    } catch (error) {
      next(error);
    }
  },

  createStaff: async (req, res, next) => {
    try {
      const staff = await staffService.createStaff(req.body);
      return ApiResponse.success(res, 'Staff member registered successfully', { staff }, 201);
    } catch (error) {
      next(error);
    }
  },

  updateStaff: async (req, res, next) => {
    try {
      const staff = await staffService.updateStaff(req.params.id, req.body);
      return ApiResponse.success(res, 'Staff member profile updated successfully', { staff });
    } catch (error) {
      next(error);
    }
  },

  deleteStaff: async (req, res, next) => {
    try {
      const result = await staffService.deleteStaff(req.params.id);
      return ApiResponse.success(res, 'Staff member profile deleted successfully', result);
    } catch (error) {
      next(error);
    }
  }
};

module.exports = staffController;
