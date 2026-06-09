const jwt = require('jsonwebtoken');
const { User, Role, Staff } = require('../models');
const ApiError = require('../utils/apiError');
const logger = require('../config/logger');

// Load settings from env variables
const JWT_SECRET = process.env.JWT_SECRET || 'access_secret_token_key_32_chars';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '15m';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh_secret_token_key_64_chars';
const JWT_REFRESH_EXPIRE = process.env.JWT_REFRESH_EXPIRE || '7d';

/**
 * Authentication Service
 */
const authService = {
  /**
   * Login user credentials and return signed access and refresh tokens
   * @param {string} email
   * @param {string} password
   */
  login: async (email, password) => {
    logger.info(`Authenticating user login: ${email}`);

    // Find user with role & staff profile details
    const user = await User.findOne({
      where: { email },
      include: [
        { model: Role, as: 'role' },
        { model: Staff, as: 'staffProfile' }
      ]
    });

    if (!user) {
      throw new ApiError('Invalid email credentials or password', 401);
    }

    if (!user.is_active) {
      throw new ApiError('Your account has been deactivated. Please contact support.', 403);
    }

    // Verify hashed password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new ApiError('Invalid email credentials or password', 401);
    }

    // Generate tokens
    const accessToken = authService.generateAccessToken(user);
    const refreshToken = authService.generateRefreshToken(user);

    logger.info(`Successful login session started for user ID: ${user.id}`);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role.name,
        name: user.staffProfile ? `${user.staffProfile.first_name} ${user.staffProfile.last_name}` : 'Administrator'
      }
    };
  },

  /**
   * Verify refresh token and generate new session tokens
   * @param {string} token
   */
  refreshSession: async (token) => {
    try {
      const decoded = jwt.verify(token, JWT_REFRESH_SECRET);
      
      const user = await User.findByPk(decoded.id, {
        include: [{ model: Role, as: 'role' }]
      });

      if (!user) {
        throw new ApiError('User account not found', 401);
      }

      if (!user.is_active) {
        throw new ApiError('User account is inactive', 403);
      }

      // Generate new tokens (implements rolling refresh tokens strategy)
      const accessToken = authService.generateAccessToken(user);
      const refreshToken = authService.generateRefreshToken(user);

      return {
        accessToken,
        refreshToken
      };
    } catch (err) {
      logger.warn('Failed token refresh session attempt: %s', err.message);
      throw new ApiError('Invalid or expired refresh token', 401);
    }
  },

  /**
   * Fetch user details by primary key
   * @param {number} userId
   */
  getProfile: async (userId) => {
    const user = await User.findByPk(userId, {
      attributes: ['id', 'email', 'is_active'],
      include: [
        { model: Role, as: 'role' },
        { 
          model: Staff, 
          as: 'staffProfile',
          attributes: ['employee_code', 'designation', 'first_name', 'last_name', 'phone_number', 'joining_date']
        }
      ]
    });

    if (!user) {
      throw new ApiError('Profile not found', 404);
    }

    return user;
  },

  /**
   * Generate signed JWT Access Token
   */
  generateAccessToken: (user) => {
    return jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role.name 
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRE }
    );
  },

  /**
   * Generate signed JWT Refresh Token
   */
  generateRefreshToken: (user) => {
    return jwt.sign(
      { id: user.id },
      JWT_REFRESH_SECRET,
      { expiresIn: JWT_REFRESH_EXPIRE }
    );
  }
};

module.exports = authService;
