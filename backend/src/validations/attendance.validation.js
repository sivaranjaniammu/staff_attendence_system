const Joi = require('joi');

module.exports = {
  // Check-In validation schema
  checkIn: Joi.object({
    latitude: Joi.number().min(-90).max(90).optional(),
    longitude: Joi.number().min(-180).max(180).optional(),
    qrData: Joi.string().optional(),
    deviceInfo: Joi.string().max(255).optional(),
    method: Joi.string().valid('WEB', 'QR', 'FACE').optional()
  }),

  // Check-Out validation schema
  checkOut: Joi.object({
    latitude: Joi.number().min(-90).max(90).optional(),
    longitude: Joi.number().min(-180).max(180).optional(),
    deviceInfo: Joi.string().max(255).optional(),
    method: Joi.string().valid('WEB', 'QR', 'FACE').optional()
  })
};
