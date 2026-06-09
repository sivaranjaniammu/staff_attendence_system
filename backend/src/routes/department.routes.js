const express = require('express');
const departmentController = require('../controllers/department.controller');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');
const validationMiddleware = require('../middleware/validation.middleware');
const departmentValidation = require('../validations/department.validation');
const roles = require('../constants/roles');

const router = express.Router();

// Enforce auth check on all department paths
router.use(authMiddleware);

// GET /api/departments - Accessible by all authenticated accounts
router.get('/', departmentController.getAllDepartments);

// GET /api/departments/:id
router.get('/:id', departmentController.getDepartmentById);

// POST /api/departments - Admin/Super Admin only
router.post(
  '/',
  roleMiddleware(roles.ADMIN, roles.SUPER_ADMIN),
  validationMiddleware(departmentValidation.createDepartment),
  departmentController.createDepartment
);

// PUT /api/departments/:id - Admin/Super Admin only
router.put(
  '/:id',
  roleMiddleware(roles.ADMIN, roles.SUPER_ADMIN),
  validationMiddleware(departmentValidation.updateDepartment),
  departmentController.updateDepartment
);

// DELETE /api/departments/:id - Admin/Super Admin only
router.delete(
  '/:id',
  roleMiddleware(roles.ADMIN, roles.SUPER_ADMIN),
  departmentController.deleteDepartment
);

module.exports = router;
