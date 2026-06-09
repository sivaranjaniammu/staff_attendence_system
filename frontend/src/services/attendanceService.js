import api from './api';

/**
 * Frontend Attendance Operations Services
 */
const attendanceService = {
  /**
   * Log daily check-in stamp
   * POST /api/attendance/check-in
   */
  checkIn: (data) => api.post('/attendance/check-in', data),

  /**
   * Log daily check-out stamp
   * POST /api/attendance/check-out
   */
  checkOut: (data) => api.post('/attendance/check-out', data),

  /**
   * Fetch today's check-in/out records
   * GET /api/attendance/today
   */
  getTodayStatus: () => api.get('/attendance/today'),

  /**
   * Fetch attendance logs history
   * GET /api/attendance/history
   */
  getHistory: (params) => api.get('/attendance/history', { params }),

  /**
   * Fetch monthly aggregates report
   * GET /api/attendance/monthly-report
   */
  getMonthlyReport: (params) => api.get('/attendance/monthly-report', { params })
};

export default attendanceService;
