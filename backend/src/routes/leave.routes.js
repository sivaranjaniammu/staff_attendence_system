const express = require('express');
const leaveController = require('../controllers/leave.controller');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');
const validationMiddleware = require('../middleware/validation.middleware');
const leaveValidation = require('../validations/leave.validation');
const roles = require('../constants/roles');

const router = express.Router();

// Enforce auth check on all leave paths
router.use(authMiddleware);

// POST /api/leaves - Apply leave (Staff only)
router.post(
  '/',
  roleMiddleware(roles.STAFF),
  validationMiddleware(leaveValidation.applyLeave),
  leaveController.applyLeave
);

// GET /api/leaves - List leaves (Staff gets own, Admin gets all)
router.get('/', leaveController.getLeaves);

// GET /api/leaves/:id - Get leave request details
router.get('/:id', leaveController.getLeaveById);

// PATCH /api/leaves/:id/status - Review application (Admin/Super Admin only)
router.patch(
  '/:id/status',
  roleMiddleware(roles.ADMIN, roles.SUPER_ADMIN),
  validationMiddleware(leaveValidation.updateStatus),
  leaveController.updateLeaveStatus
);

module.exports = router;
