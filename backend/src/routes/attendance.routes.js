const express = require('express');
const attendanceController = require('../controllers/attendance.controller');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');
const validationMiddleware = require('../middleware/validation.middleware');
const attendanceValidation = require('../validations/attendance.validation');
const roles = require('../constants/roles');

const router = express.Router();

// Enforce auth check on all attendance paths
router.use(authMiddleware);

// POST /api/attendance/check-in - Staff only
router.post(
  '/check-in',
  roleMiddleware(roles.STAFF),
  validationMiddleware(attendanceValidation.checkIn),
  attendanceController.checkIn
);

// POST /api/attendance/check-out - Staff only
router.post(
  '/check-out',
  roleMiddleware(roles.STAFF),
  validationMiddleware(attendanceValidation.checkOut),
  attendanceController.checkOut
);

// GET /api/attendance/today - Staff only (fetches today's timestamps)
router.get(
  '/today',
  roleMiddleware(roles.STAFF),
  attendanceController.getTodayStatus
);

// GET /api/attendance/history - Accessible by staff (gets own) and Admin
router.get('/history', attendanceController.getHistory);

// GET /api/attendance/monthly-report - Accessible by staff and Admin
router.get('/monthly-report', attendanceController.getMonthlyReport);

module.exports = router;
