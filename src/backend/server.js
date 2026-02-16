/**
 * SimplifyMove Backend Server
 * Main entry point for the application
 */

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const http = require('http');
const socketIO = require('socket.io');

// Load environment variables
dotenv.config();

// Import Sequelize database and models
const sequelize = require('./config/database');
const { initializeModels } = require('./models');

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const companyRoutes = require('./routes/companyRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');
const driverRoutes = require('./routes/driverRoutes');
const walletRoutes = require('./routes/walletRoutes');
const promoRoutes = require('./routes/promoRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const adminRoutes = require('./routes/adminRoutes');
const courierRoutes = require('./routes/courierRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const companyAdminRoutes = require('./routes/companyAdminRoutes');
const auditLogRoutes = require('./routes/auditLogRoutes');
const vendorRoutes = require('./routes/vendorRoutes');
const emailConfigRoutes = require('./routes/emailConfigRoutes');

// Import middleware
const { errorHandler } = require('./middleware/errorHandler');
const { logger } = require('./utils/logger');
const { captureAuditInfo, logAuditAction } = require('./middleware/auditLogger');

// Import socket handlers
const socketHandler = require('./socket/socketHandler');

// Initialize express app
const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: process.env.CORS_ORIGIN?.split(',') || '*',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Security Middleware
app.use(helmet()); // Set security headers
app.use(xss()); // Prevent XSS attacks

// CORS Configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || '*',
  credentials: true,
  optionsSuccessStatus: 200
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

// Body Parser Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression Middleware
app.use(compression());

// Audit Logging Middleware
app.use(captureAuditInfo);
app.use(logAuditAction);

// Logging Middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined', {
    stream: {
      write: (message) => logger.info(message.trim())
    }
  }));
}

// Make io accessible to routes
app.set('io', io);

// API Routes
const API_VERSION = process.env.API_VERSION || 'v1';

app.use(`/api/${API_VERSION}/auth`, authRoutes);
app.use(`/api/${API_VERSION}/users`, userRoutes);
app.use(`/api/${API_VERSION}/companies`, companyRoutes);
app.use(`/api/${API_VERSION}/bookings`, bookingRoutes);
app.use(`/api/${API_VERSION}/vehicles`, vehicleRoutes);
app.use(`/api/${API_VERSION}/drivers`, driverRoutes);
app.use(`/api/${API_VERSION}/wallets`, walletRoutes);
app.use(`/api/${API_VERSION}/promos`, promoRoutes);
app.use(`/api/${API_VERSION}/analytics`, analyticsRoutes);
app.use(`/api/${API_VERSION}/admin`, adminRoutes);
app.use(`/api/${API_VERSION}/couriers`, courierRoutes);
app.use(`/api/${API_VERSION}/notifications`, notificationRoutes);
app.use(`/api/${API_VERSION}/employees`, employeeRoutes);
app.use(`/api/${API_VERSION}/companyAdmins`, companyAdminRoutes);
app.use(`/api/${API_VERSION}/audit-logs`, auditLogRoutes);
app.use(`/api/${API_VERSION}/vendors`, vendorRoutes);
app.use(`/api/${API_VERSION}/email-config`, emailConfigRoutes);

// Health Check Route
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'SimplifyMove API is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    version: API_VERSION
  });
});

// Root Route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to SimplifyMove API',
    version: API_VERSION,
    documentation: `/api/${API_VERSION}/docs`
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl
  });
});

// Error Handler Middleware (must be last)
app.use(errorHandler);

// Database Connection
const connectDB = async () => {
  try {
    // Test Sequelize connection to MySQL database
    await sequelize.authenticate();
    logger.info('MySQL connection successful');
    console.log('✅ MySQL connection successful');
    
    // Initialize models
    initializeModels(sequelize);
    logger.info('Models initialized');
    console.log('✅ Models initialized');
    
    // Skip sync since database already exists with sample data
    // and schema matches the existing tables
    logger.info('Using existing database schema');
    console.log('✅ Using existing database schema');
  } catch (error) {
    logger.error('MySQL connection error:', error);
    console.error('❌ MySQL connection error:', error.message);
    process.exit(1);
  }
};

// Socket.IO Connection
socketHandler(io);

// Start Server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  
  server.listen(PORT, () => {
    logger.info(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 Environment: ${process.env.NODE_ENV}`);
    console.log(`🌐 API Base URL: http://localhost:${PORT}/api/${API_VERSION}`);
  });
};

startServer();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Rejection:', err);
  console.error('❌ Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  console.log('👋 SIGTERM received, shutting down gracefully');
  server.close(async () => {
    await sequelize.close();
    console.log('✅ Server and database connections closed');
    process.exit(0);
  });
});

module.exports = { app, server, io };