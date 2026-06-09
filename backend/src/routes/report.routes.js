const express = require('express');
const reportController = require('../controllers/report.controller');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');
const roles = require('../constants/roles');

const router = express.Router();

// Enforce admin-only credentials checks on all reports endpoints
router.use(authMiddleware);
router.use(roleMiddleware(roles.ADMIN, roles.SUPER_ADMIN));

// JSON Previews
router.get('/attendance', reportController.getAttendanceReport);
router.get('/staff', reportController.getStaffReport);
router.get('/leaves', reportController.getLeavesReport);

// PDF Exports
router.get('/attendance/pdf', reportController.exportAttendancePDF);
router.get('/staff/pdf', reportController.exportStaffPDF);
router.get('/leaves/pdf', reportController.exportLeavesPDF);

// Excel Exports
router.get('/attendance/excel', reportController.exportAttendanceExcel);
router.get('/staff/excel', reportController.exportStaffExcel);
router.get('/leaves/excel', reportController.exportLeavesExcel);

module.exports = router;
