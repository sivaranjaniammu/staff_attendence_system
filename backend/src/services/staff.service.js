const { User, Staff, Role, Department, sequelize } = require('../models');
const ApiError = require('../utils/apiError');
const { Op } = require('sequelize');

/**
 * Staff Profiles Management Service
 */
const staffService = {
  /**
   * List all staff members
   * @param {Object} queryFilters
   */
  getAllStaff: async (queryFilters) => {
    const { department_id } = queryFilters;
    const whereClause = {};
    if (department_id) {
      whereClause.department_id = department_id;
    }

    return await Staff.findAll({
      where: whereClause,
      include: [
        { 
          model: User, 
          as: 'userCredentials', 
          attributes: ['email', 'is_active'],
          include: [{ model: Role, as: 'role', attributes: ['name'] }]
        },
        { model: Department, as: 'department', attributes: ['name', 'code'] }
      ],
      order: [['id', 'ASC']]
    });
  },

  /**
   * Fetch staff member profile by PK
   * @param {number} id
   */
  getStaffById: async (id) => {
    const staff = await Staff.findByPk(id, {
      include: [
        { 
          model: User, 
          as: 'userCredentials', 
          attributes: ['email', 'is_active'],
          include: [{ model: Role, as: 'role', attributes: ['name'] }]
        },
        { model: Department, as: 'department', attributes: ['name', 'code'] }
      ]
    });

    if (!staff) {
      throw new ApiError('Staff record not found', 404);
    }
    return staff;
  },

  /**
   * Create new User credentials and Staff Profile (Transaction Wrapped)
   * @param {Object} data - profile data
   */
  createStaff: async (data) => {
    // 1. Check if email is already in use
    const emailConflict = await User.findOne({ where: { email: data.email } });
    if (emailConflict) {
      throw new ApiError('Email credentials are already registered.', 400);
    }

    // 2. Validate department exists
    const department = await Department.findByPk(data.department_id);
    if (!department) {
      throw new ApiError('Assigned department does not exist.', 404);
    }

    // 3. Find default 'STAFF' role
    const staffRole = await Role.findOne({ where: { name: 'STAFF' } });
    if (!staffRole) {
      throw new ApiError('Default Staff role entity not initialized in system.', 500);
    }

    // Start Transaction
    return await sequelize.transaction(async (t) => {
      // 4. Auto-generate sequential employee code
      const lastStaff = await Staff.findOne({
        order: [['id', 'DESC']],
        transaction: t,
        lock: true // Acquire lock to prevent concurrency duplication
      });

      let nextNum = 1;
      if (lastStaff && lastStaff.employee_code) {
        const match = lastStaff.employee_code.match(/\d+/);
        if (match) {
          nextNum = parseInt(match[0], 10) + 1;
        }
      }
      const employeeCode = `EMP${String(nextNum).padStart(3, '0')}`;

      // 5. Create user credentials entry
      const user = await User.create({
        email: data.email,
        password: data.password,
        role_id: staffRole.id,
        is_active: true
      }, { transaction: t });

      // 6. Create staff profile entry
      const staff = await Staff.create({
        user_id: user.id,
        department_id: data.department_id,
        employee_code: employeeCode,
        designation: data.designation,
        first_name: data.first_name,
        last_name: data.last_name,
        phone_number: data.phone_number,
        joining_date: data.joining_date || new Date(),
        profile_image: data.profile_image || null
      }, { transaction: t });

      return {
        id: staff.id,
        employee_code: employeeCode,
        email: user.email,
        first_name: staff.first_name,
        last_name: staff.last_name,
        designation: staff.designation
      };
    });
  },

  /**
   * Update staff metadata
   * @param {number} id
   * @param {Object} data
   */
  updateStaff: async (id, data) => {
    const staff = await Staff.findByPk(id);
    if (!staff) {
      throw new ApiError('Staff record not found', 404);
    }

    if (data.department_id) {
      const department = await Department.findByPk(data.department_id);
      if (!department) {
        throw new ApiError('Assigned department does not exist.', 404);
      }
    }

    return await staff.update(data);
  },

  /**
   * Delete Staff and associated User credentials (Transaction Wrapped)
   * @param {number} id
   */
  deleteStaff: async (id) => {
    const staff = await Staff.findByPk(id);
    if (!staff) {
      throw new ApiError('Staff record not found', 404);
    }

    return await sequelize.transaction(async (t) => {
      // Delete user credentials (will cascade delete staff profile via foreign key settings)
      await User.destroy({
        where: { id: staff.user_id },
        transaction: t
      });

      return { id, deleted: true };
    });
  }
};

module.exports = staffService;
