const Joi = require('joi');

module.exports = {
  // Validate staff profile creation
  createStaff: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Valid email address is required.',
      'any.required': 'Email is a required field.'
    }),
    password: Joi.string().min(6).required().messages({
      'string.min': 'Password must be at least 6 characters.',
      'any.required': 'Password is required.'
    }),
    first_name: Joi.string().trim().max(64).required().messages({
      'any.required': 'First name is required.'
    }),
    last_name: Joi.string().trim().max(64).required().messages({
      'any.required': 'Last name is required.'
    }),
    designation: Joi.string().trim().max(100).required().messages({
      'any.required': 'Designation is required.'
    }),
    department_id: Joi.number().integer().required().messages({
      'any.required': 'Department assignment is required.'
    }),
    phone_number: Joi.string().trim().max(20).optional(),
    joining_date: Joi.date().iso().optional()
  }),

  // Validate staff updates
  updateStaff: Joi.object({
    first_name: Joi.string().trim().max(64).optional(),
    last_name: Joi.string().trim().max(64).optional(),
    designation: Joi.string().trim().max(100).optional(),
    department_id: Joi.number().integer().optional(),
    phone_number: Joi.string().trim().max(20).optional(),
    joining_date: Joi.date().iso().optional()
  })
};
