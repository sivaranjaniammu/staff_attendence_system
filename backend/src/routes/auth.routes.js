const express = require('express');
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');
const validationMiddleware = require('../middleware/validation.middleware');
const authValidation = require('../validations/auth.validation');

const router = express.Router();

// POST /api/auth/login
router.post(
  '/login',
  validationMiddleware(authValidation.login),
  authController.login
);

// POST /api/auth/refresh-token
router.post(
  '/refresh-token',
  validationMiddleware(authValidation.refreshToken),
  authController.refreshToken
);

// POST /api/auth/logout (Protected)
router.post(
  '/logout',
  authMiddleware,
  authController.logout
);

// GET /api/auth/profile (Protected)
router.get(
  '/profile',
  authMiddleware,
  authController.getProfile
);

module.exports = router;
