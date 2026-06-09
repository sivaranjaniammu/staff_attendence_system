const { Attendance, Staff, AttendanceSetting } = require('../models');
const ApiError = require('../utils/apiError');
const logger = require('../config/logger');

/**
 * Attendance Business Logic Service
 */
const attendanceService = {
  /**
   * Daily check-in stamp logging
   * @param {number} userId - user credentials ID
   * @param {Object} data - check-in metadata
   */
  checkIn: async (userId, data) => {
    // 1. Resolve staff profile
    const staff = await Staff.findOne({ where: { user_id: userId } });
    if (!staff) {
      throw new ApiError('Staff profile record not found.', 404);
    }

    const todayDate = new Date().toISOString().split('T')[0];

    // 2. Attendance Duplicate Prevention check
    const existingRecord = await Attendance.findOne({
      where: {
        staff_id: staff.id,
        date: todayDate
      }
    });

    if (existingRecord) {
      throw new ApiError('You have already checked in today.', 400);
    }

    // 3. Retrieve global attendance configurations
    const settings = await AttendanceSetting.findOne() || {
      office_start_time: '09:00:00',
      late_after_minutes: 15
    };

    const checkInTime = new Date();
    
    // 4. Calculate Late status parameters
    let status = 'PRESENT';
    const [startHours, startMinutes] = settings.office_start_time.split(':').map(Number);
    
    const checkInMinutesPastMidnight = checkInTime.getHours() * 60 + checkInTime.getMinutes();
    const officeStartMinutesPastMidnight = startHours * 60 + startMinutes;
    const graceThreshold = officeStartMinutesPastMidnight + settings.late_after_minutes;

    if (checkInMinutesPastMidnight > graceThreshold) {
      status = 'LATE';
    }

    // 5. Create daily log
    return await Attendance.create({
      staff_id: staff.id,
      date: todayDate,
      check_in: checkInTime,
      status,
      check_in_ip: data.ipAddress || '127.0.0.1',
      check_in_latitude: data.latitude || null,
      check_in_longitude: data.longitude || null,
      check_in_method: data.method || 'WEB',
      device_info: data.deviceInfo || 'Unknown Browser'
    });
  },

  /**
   * Daily check-out stamp logging
   * @param {number} userId
   * @param {Object} data
   */
  checkOut: async (userId, data) => {
    const staff = await Staff.findOne({ where: { user_id: userId } });
    if (!staff) {
      throw new ApiError('Staff profile record not found.', 404);
    }

    const todayDate = new Date().toISOString().split('T')[0];

    // 1. Verify check-in existence
    const attendance = await Attendance.findOne({
      where: {
        staff_id: staff.id,
        date: todayDate
      }
    });

    if (!attendance) {
      throw new ApiError('No check-in record found for today.', 404);
    }

    if (attendance.check_out) {
      throw new ApiError('You have already checked out today.', 400);
    }

    // 2. Retrieve settings
    const settings = await AttendanceSetting.findOne() || {
      half_day_after_minutes: 240 // 4 hours in minutes
    };

    const checkOutTime = new Date();
    const checkInTime = new Date(attendance.check_in);
    
    // Calculate decimal working hours
    const durationMs = checkOutTime - checkInTime;
    const workingHours = parseFloat((durationMs / (1000 * 60 * 60)).toFixed(2));

    // 3. Resolve status changes (Half-day validations)
    let status = attendance.status;
    const halfDayMinutes = settings.half_day_after_minutes;
    const workingMinutes = durationMs / (1000 * 60);

    if (workingMinutes < halfDayMinutes) {
      status = 'HALF_DAY';
    }

    return await attendance.update({
      check_out: checkOutTime,
      working_hours: workingHours,
      status,
      check_out_ip: data.ipAddress || '127.0.0.1',
      check_out_latitude: data.latitude || null,
      check_out_longitude: data.longitude || null,
      check_out_method: data.method || 'WEB'
    });
  },

  /**
   * Fetch attendance logs history
   */
  getHistory: async (userId, filters) => {
    const staff = await Staff.findOne({ where: { user_id: userId } });
    if (!staff) {
      throw new ApiError('Staff profile record not found.', 404);
    }

    return await Attendance.findAll({
      where: { staff_id: staff.id },
      order: [['date', 'DESC']],
      limit: filters.limit ? parseInt(filters.limit, 10) : 30
    });
  },

  /**
   * Fetch today's check-in/out stamps details
   */
  getTodayStatus: async (userId) => {
    const staff = await Staff.findOne({ where: { user_id: userId } });
    if (!staff) {
      throw new ApiError('Staff profile record not found.', 404);
    }

    const todayDate = new Date().toISOString().split('T')[0];
    return await Attendance.findOne({
      where: {
        staff_id: staff.id,
        date: todayDate
      }
    });
  },

  /**
   * Fetch monthly aggregates report
   */
  getMonthlyReport: async (userId, month, year) => {
    const staff = await Staff.findOne({ where: { user_id: userId } });
    if (!staff) {
      throw new ApiError('Staff profile record not found.', 404);
    }

    const currentMonth = month || new Date().getMonth() + 1;
    const currentYear = year || new Date().getFullYear();

    const records = await Attendance.findAll({
      where: {
        staff_id: staff.id,
        [Op.and]: [
          sequelize.where(sequelize.fn('MONTH', sequelize.col('date')), currentMonth),
          sequelize.where(sequelize.fn('YEAR', sequelize.col('date')), currentYear)
        ]
      }
    });

    const summary = {
      present: 0,
      late: 0,
      halfDay: 0,
      absent: 0,
      onLeave: 0
    };

    records.forEach((rec) => {
      if (rec.status === 'PRESENT') summary.present++;
      else if (rec.status === 'LATE') summary.late++;
      else if (rec.status === 'HALF_DAY') summary.halfDay++;
      else if (rec.status === 'ABSENT') summary.absent++;
      else if (rec.status === 'ON_LEAVE') summary.onLeave++;
    });

    return {
      month: currentMonth,
      year: currentYear,
      summary,
      logs: records
    };
  }
};

module.exports = attendanceService;
