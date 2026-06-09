const express = require('express');
const dashboardController = require('../controllers/dashboard.controller');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');
const roles = require('../constants/roles');

const router = express.Router();

// GET /api/dashboard/stats - Admin/Super Admin dashboard aggregates
router.get(
  '/stats',
  authMiddleware,
  roleMiddleware(roles.ADMIN, roles.SUPER_ADMIN),
  dashboardController.getStats
);

module.exports = router;
