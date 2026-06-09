const express = require('express');
const authRoutes = require('./auth.routes');
const attendanceRoutes = require('./attendance.routes');
const leaveRoutes = require('./leave.routes');
const staffRoutes = require('./staff.routes');
const departmentRoutes = require('./department.routes');
const dashboardRoutes = require('./dashboard.routes');
const reportRoutes = require('./report.routes');

const router = express.Router();

/**
 * Mount sub-routers under main API gateway
 */
router.use('/auth', authRoutes);
router.use('/attendance', attendanceRoutes);
router.use('/leaves', leaveRoutes);
router.use('/staff', staffRoutes);
router.use('/departments', departmentRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/reports', reportRoutes);

module.exports = router;
