const { Department, Staff } = require('../models');
const ApiError = require('../utils/apiError');
const { Op } = require('sequelize');

/**
 * Department Management Business Logic Service
 */
const departmentService = {
  /**
   * Retrieve list of all departments
   */
  getAllDepartments: async () => {
    return await Department.findAll({
      order: [['name', 'ASC']]
    });
  },

  /**
   * Fetch department by PK
   * @param {number} id
   */
  getDepartmentById: async (id) => {
    const department = await Department.findByPk(id);
    if (!department) {
      throw new ApiError('Department not found', 404);
    }
    return department;
  },

  /**
   * Create new department
   * @param {Object} data - { name, code, description }
   */
  createDepartment: async (data) => {
    // Check for unique name or code conflict
    const conflict = await Department.findOne({
      where: {
        [Op.or]: [
          { name: data.name },
          { code: data.code }
        ]
      }
    });

    if (conflict) {
      throw new ApiError('Department name or code is already in use.', 400);
    }

    return await Department.create(data);
  },

  /**
   * Edit department configurations
   * @param {number} id
   * @param {Object} data
   */
  updateDepartment: async (id, data) => {
    const department = await Department.findByPk(id);
    if (!department) {
      throw new ApiError('Department not found', 404);
    }

    // Check unique conflict on rename
    if (data.name || data.code) {
      const conflict = await Department.findOne({
        where: {
          id: { [Op.ne]: id },
          [Op.or]: [
            ...(data.name ? [{ name: data.name }] : []),
            ...(data.code ? [{ code: data.code }] : [])
          ]
        }
      });
      
      if (conflict) {
        throw new ApiError('Department name or code is already in use.', 400);
      }
    }

    return await department.update(data);
  },

  /**
   * Delete department (Option B: Reject if staff exists)
   * @param {number} id
   */
  deleteDepartment: async (id) => {
    const department = await Department.findByPk(id);
    if (!department) {
      throw new ApiError('Department not found', 404);
    }

    // Count assigned staff
    const assignedStaffCount = await Staff.count({
      where: { department_id: id }
    });

    if (assignedStaffCount > 0) {
      throw new ApiError(
        `Cannot delete department: ${assignedStaffCount} active staff profiles are currently assigned to it.`,
        400
      );
    }

    await department.destroy();
    return { id, deleted: true };
  }
};

module.exports = departmentService;
