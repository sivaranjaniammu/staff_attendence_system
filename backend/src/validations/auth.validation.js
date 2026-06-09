const Joi = require('joi');

module.exports = {
  // Credentials Login validation schema
  login: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Please specify a valid email address.',
      'any.required': 'Email is a required field.'
    }),
    password: Joi.string().min(6).required().messages({
      'string.min': 'Password must be at least 6 characters long.',
      'any.required': 'Password is a required field.'
    })
  }),

  // Token Refresh validation schema
  refreshToken: Joi.object({
    refreshToken: Joi.string().required().messages({
      'any.required': 'Refresh token is required.'
    })
  })
};
