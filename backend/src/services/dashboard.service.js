const { Staff, Attendance, LeaveRequest } = require('../models');
const { Op } = require('sequelize');

/**
 * Dashboard Statistics Business Logic Service
 */
const dashboardService = {
  /**
   * Fetch daily system aggregate counts for admin charts
   */
  getStats: async () => {
    const todayDate = new Date().toISOString().split('T')[0];

    // 1. Total active staff counts
    const totalStaff = await Staff.count();

    // 2. Attendance categories counts for today
    const presentToday = await Attendance.count({
      where: {
        date: todayDate,
        status: { [Op.in]: ['PRESENT', 'LATE', 'HALF_DAY'] }
      }
    });

    const absentToday = await Attendance.count({
      where: {
        date: todayDate,
        status: 'ABSENT'
      }
    });

    const onLeaveToday = await Attendance.count({
      where: {
        date: todayDate,
        status: 'ON_LEAVE'
      }
    });

    // 3. Pending leave applications count
    const pendingLeaves = await LeaveRequest.count({
      where: { status: 'PENDING' }
    });

    return {
      totalStaff,
      presentToday,
      absentToday,
      onLeave: onLeaveToday,
      pendingLeaves
    };
  }
};

module.exports = dashboardService;
