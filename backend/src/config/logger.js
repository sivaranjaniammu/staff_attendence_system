const winston = require('winston');
const path = require('path');

// Define log level based on environment
const level = process.env.NODE_ENV === 'production' ? 'info' : 'debug';

// Define format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// Define transport targets
const transports = [
  // Output logs to file
  new winston.transports.File({ 
    filename: path.join(__dirname, '../../logs/error.log'), 
    level: 'error',
    maxsize: 5242880, // 5MB
    maxFiles: 5
  }),
  new winston.transports.File({ 
    filename: path.join(__dirname, '../../logs/combined.log'),
    maxsize: 5242880, // 5MB
    maxFiles: 5
  })
];

// Add console output in non-production environments
if (process.env.NODE_ENV !== 'production') {
  transports.push(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(
          (info) => `${info.timestamp} [${info.level}]: ${info.message}`
        )
      )
    })
  );
}

// Create Logger Instance
const logger = winston.createLogger({
  level,
  format: logFormat,
  transports
});

module.exports = logger;
