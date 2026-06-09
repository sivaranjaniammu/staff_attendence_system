const departmentService = require('../services/department.service');
const ApiResponse = require('../utils/apiResponse');

/**
 * Department Controller
 */
const departmentController = {
  getAllDepartments: async (req, res, next) => {
    try {
      const departments = await departmentService.getAllDepartments();
      return ApiResponse.success(res, 'Departments retrieved successfully', { departments });
    } catch (error) {
      next(error);
    }
  },

  getDepartmentById: async (req, res, next) => {
    try {
      const department = await departmentService.getDepartmentById(req.params.id);
      return ApiResponse.success(res, 'Department retrieved successfully', { department });
    } catch (error) {
      next(error);
    }
  },

  createDepartment: async (req, res, next) => {
    try {
      const department = await departmentService.createDepartment(req.body);
      return ApiResponse.success(res, 'Department created successfully', { department }, 201);
    } catch (error) {
      next(error);
    }
  },

  updateDepartment: async (req, res, next) => {
    try {
      const department = await departmentService.updateDepartment(req.params.id, req.body);
      return ApiResponse.success(res, 'Department updated successfully', { department });
    } catch (error) {
      next(error);
    }
  },

  deleteDepartment: async (req, res, next) => {
    try {
      const result = await departmentService.deleteDepartment(req.params.id);
      return ApiResponse.success(res, 'Department deleted successfully', result);
    } catch (error) {
      next(error);
    }
  }
};

module.exports = departmentController;
