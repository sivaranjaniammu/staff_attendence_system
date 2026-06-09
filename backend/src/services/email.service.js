const nodemailer = require('nodemailer');
const logger = require('../config/logger');

// Initialize SMTP Transporter
const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST || 'smtp.mailtrap.io',
  port: process.env.MAIL_PORT || 2525,
  auth: {
    user: process.env.MAIL_USER || '',
    pass: process.env.MAIL_PASS || ''
  }
});

/**
 * Email Notification Services
 */
const emailService = {
  /**
   * Dispatch raw/HTML email alert
   * @param {string} to - recipient email
   * @param {string} subject - message topic
   * @param {string} text - plain body text
   * @param {string} html - html format body
   */
  sendEmail: async (to, subject, text, html = '') => {
    try {
      const mailOptions = {
        from: process.env.MAIL_FROM || 'no-reply@company.com',
        to,
        subject,
        text,
        html
      };

      const info = await transporter.sendMail(mailOptions);
      logger.info(`Notification Email dispatched to ${to}. Message ID: ${info.messageId}`);
      return info;
    } catch (error) {
      logger.error(`Failed to dispatch email alert to ${to}: ${error.message}`);
      // In production, we don't throw to prevent main thread blocking, just log it
      return null;
    }
  }
};

module.exports = emailService;
