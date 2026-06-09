const Joi = require('joi');

module.exports = {
  // Validate department creation
  createDepartment: Joi.object({
    name: Joi.string().trim().max(100).required().messages({
      'any.required': 'Department name is required.'
    }),
    code: Joi.string().trim().uppercase().max(20).required().messages({
      'any.required': 'Department code is required.'
    }),
    description: Joi.string().trim().max(500).optional()
  }),

  // Validate department updates
  updateDepartment: Joi.object({
    name: Joi.string().trim().max(100).optional(),
    code: Joi.string().trim().uppercase().max(20).optional(),
    description: Joi.string().trim().max(500).optional()
  })
};
