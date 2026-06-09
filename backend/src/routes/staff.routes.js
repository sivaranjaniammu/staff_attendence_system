const express = require('express');
const staffController = require('../controllers/staff.controller');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');
const validationMiddleware = require('../middleware/validation.middleware');
const staffValidation = require('../validations/staff.validation');
const roles = require('../constants/roles');

const router = express.Router();

// Enforce auth check on all staff paths
router.use(authMiddleware);

// GET /api/staff - Admin/Super Admin only
router.get(
  '/',
  roleMiddleware(roles.ADMIN, roles.SUPER_ADMIN),
  staffController.getAllStaff
);

// GET /api/staff/:id - Admin/Super Admin only (Note: or user fetching own profile, which is mapped via GET /api/auth/profile)
router.get(
  '/:id',
  roleMiddleware(roles.ADMIN, roles.SUPER_ADMIN),
  staffController.getStaffById
);

// POST /api/staff - Create new staff user and profile (Admin/Super Admin only)
router.post(
  '/',
  roleMiddleware(roles.ADMIN, roles.SUPER_ADMIN),
  validationMiddleware(staffValidation.createStaff),
  staffController.createStaff
);

// PUT /api/staff/:id - Edit staff (Admin/Super Admin only)
router.put(
  '/:id',
  roleMiddleware(roles.ADMIN, roles.SUPER_ADMIN),
  validationMiddleware(staffValidation.updateStaff),
  staffController.updateStaff
);

// DELETE /api/staff/:id - Delete staff credentials and profile (Admin/Super Admin only)
router.delete(
  '/:id',
  roleMiddleware(roles.ADMIN, roles.SUPER_ADMIN),
  staffController.deleteStaff
);

module.exports = router;
