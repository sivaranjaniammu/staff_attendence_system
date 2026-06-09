const Joi = require('joi');

module.exports = {
  // Apply Leave Validation Schema
  applyLeave: Joi.object({
    startDate: Joi.date().iso().required().messages({
      'date.base': 'Start date must be a valid date.',
      'any.required': 'Start date is required.'
    }),
    endDate: Joi.date().iso().min(Joi.ref('startDate')).required().messages({
      'date.min': 'End date cannot be earlier than start date.',
      'any.required': 'End date is required.'
    }),
    leaveType: Joi.string().valid('SICK', 'CASUAL', 'EARNED', 'MATERNITY', 'PATERNITY', 'UNPAID').required().messages({
      'any.only': 'Invalid leave type specified.'
    }),
    reason: Joi.string().trim().min(10).required().messages({
      'string.min': 'Reason must be at least 10 characters long.',
      'any.required': 'Reason is required.'
    })
  }),

  // Update Status Validation Schema
  updateStatus: Joi.object({
    status: Joi.string().valid('APPROVED', 'REJECTED').required(),
    remarks: Joi.string().trim().max(255).optional()
  })
};
