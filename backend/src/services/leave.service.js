const { LeaveRequest, Staff, Attendance, sequelize } = require('../models');
const ApiError = require('../utils/apiError');
const { Op } = require('sequelize');

/**
 * Exclude weekends (Saturday/Sunday) from calculated leave days count
 */
const calculateAppliedDays = (startDate, endDate) => {
  let count = 0;
  let current = new Date(startDate);
  const end = new Date(endDate);

  while (current <= end) {
    const day = current.getDay();
    if (day !== 0 && day !== 6) { // Exclude Sunday (0) and Saturday (6)
      count++;
    }
    current.setDate(current.getDate() + 1);
  }
  return count;
};

/**
 * Auto-populate ON_LEAVE logs in attendance table
 */
const autoLogLeaveAttendance = async (staffId, startDate, endDate, transaction) => {
  let current = new Date(startDate);
  const end = new Date(endDate);
  const records = [];

  while (current <= end) {
    const day = current.getDay();
    if (day !== 0 && day !== 6) { // Only log on working days
      records.push({
        staff_id: staffId,
        date: current.toISOString().split('T')[0],
        status: 'ON_LEAVE',
        remarks: 'Approved Leave of Absence'
      });
    }
    current.setDate(current.getDate() + 1);
  }

  if (records.length > 0) {
    await Attendance.bulkCreate(records, {
      transaction,
      updateOnDuplicate: ['status', 'remarks'] // Overwrite any existing records
    });
  }
};

/**
 * Leave Management Business Logic Service
 */
const leaveService = {
  /**
   * Apply for a new leave request (with Overlap Prevention)
   */
  applyLeave: async (userId, data) => {
    const staff = await Staff.findOne({ where: { user_id: userId } });
    if (!staff) {
      throw new ApiError('Staff profile record not found.', 404);
    }

    // 1. Leave Overlap Prevention Check
    const overlappingRequest = await LeaveRequest.findOne({
      where: {
        staff_id: staff.id,
        status: { [Op.in]: ['PENDING', 'APPROVED'] },
        [Op.or]: [
          {
            start_date: { [Op.between]: [data.startDate, data.endDate] }
          },
          {
            end_date: { [Op.between]: [data.startDate, data.endDate] }
          },
          {
            [Op.and]: [
              { start_date: { [Op.lte]: data.startDate } },
              { end_date: { [Op.gte]: data.endDate } }
            ]
          }
        ]
      }
    });

    if (overlappingRequest) {
      throw new ApiError('Overlapping leave request exists for the specified dates.', 400);
    }

    // 2. Exclude weekends to determine applied days count
    const appliedDays = calculateAppliedDays(data.startDate, data.endDate);
    if (appliedDays === 0) {
      throw new ApiError('Leave request dates fall entirely on weekends.', 400);
    }

    return await LeaveRequest.create({
      staff_id: staff.id,
      start_date: data.startDate,
      end_date: data.endDate,
      applied_days: appliedDays,
      leave_type: data.leaveType,
      reason: data.reason,
      status: 'PENDING'
    });
  },

  /**
   * Fetch leave requests history
   */
  getLeaves: async (userId, query) => {
    const whereClause = {};
    if (userId) {
      const staff = await Staff.findOne({ where: { user_id: userId } });
      if (!staff) {
        throw new ApiError('Staff profile record not found.', 404);
      }
      whereClause.staff_id = staff.id;
    }

    if (query.status) {
      whereClause.status = query.status;
    }

    return await LeaveRequest.findAll({
      where: whereClause,
      include: [
        { model: Staff, as: 'applicant', attributes: ['first_name', 'last_name', 'employee_code', 'designation'] }
      ],
      order: [['created_at', 'DESC']]
    });
  },

  /**
   * Retrieve single leave application
   */
  getLeaveById: async (id) => {
    const leave = await LeaveRequest.findByPk(id, {
      include: [
        { model: Staff, as: 'applicant', attributes: ['first_name', 'last_name', 'employee_code', 'designation'] }
      ]
    });
    if (!leave) {
      throw new ApiError('Leave request not found', 404);
    }
    return leave;
  },

  /**
   * Admin approve or reject leave request (with Transaction-wrapped Auto-Attendance inserts)
   */
  updateStatus: async (id, status, remarks, adminUserId) => {
    const leave = await LeaveRequest.findByPk(id);
    if (!leave) {
      throw new ApiError('Leave request not found', 404);
    }

    if (leave.status !== 'PENDING') {
      throw new ApiError('Leave request has already been reviewed.', 400);
    }

    return await sequelize.transaction(async (t) => {
      // 1. Update request status
      const updatedLeave = await leave.update({
        status,
        remarks,
        approved_by_user_id: adminUserId
      }, { transaction: t });

      // 2. If approved, automatically insert placeholder 'ON_LEAVE' records in attendance
      if (status === 'APPROVED') {
        await autoLogLeaveAttendance(leave.staff_id, leave.start_date, leave.end_date, t);
      }

      return updatedLeave;
    });
  }
};

module.exports = leaveService;
