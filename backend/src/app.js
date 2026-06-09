const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const logger = require('./config/logger');
const apiRouter = require('./routes');
const errorHandler = require('./middleware/error.middleware');
const ApiError = require('./utils/apiError');

const app = express();

// Set up security headers
app.use(helmet());

// Configure CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Request Payloads Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// HTTP Request Logger Middleware
const morganFormat = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';
app.use(morgan(morganFormat, {
  stream: { write: (message) => logger.info(message.trim()) }
}));

// API Routes Mounting
app.use(process.env.API_PREFIX || '/api', apiRouter);

// Base health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', timestamp: new Date() });
});

// Fallback Route Handler (404 Page Not Found)
app.use((req, res, next) => {
  next(new ApiError(`Route ${req.originalUrl} not found`, 404));
});

// Register Global Exception Middleware
app.use(errorHandler);

module.exports = app;
