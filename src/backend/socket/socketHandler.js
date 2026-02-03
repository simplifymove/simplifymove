/**
 * Socket.IO Event Handlers
 * Real-time communication for bookings, notifications, etc.
 */

const jwt = require('jsonwebtoken');
const { logger } = require('../utils/logger');

module.exports = (io) => {
  // Middleware to authenticate socket connections
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      socket.userRole = decoded.role;
      
      next();
    } catch (error) {
      logger.error('Socket authentication error:', error);
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    logger.info(`Client connected: ${socket.id}, User: ${socket.userId}`);

    // Join user-specific room
    socket.join(`user:${socket.userId}`);

    // Join role-specific room
    socket.join(`role:${socket.userRole}`);

    // Handle custom events
    socket.on('join:company', (companyId) => {
      socket.join(`company:${companyId}`);
      logger.info(`User ${socket.userId} joined company room: ${companyId}`);
    });

    socket.on('join:booking', (bookingId) => {
      socket.join(`booking:${bookingId}`);
      logger.info(`User ${socket.userId} joined booking room: ${bookingId}`);
    });

    // Disconnect handler
    socket.on('disconnect', () => {
      logger.info(`Client disconnected: ${socket.id}`);
    });

    // Error handler
    socket.on('error', (error) => {
      logger.error('Socket error:', error);
    });
  });

  // Helper functions to emit events
  io.emitToUser = (userId, event, data) => {
    io.to(`user:${userId}`).emit(event, data);
  };

  io.emitToCompany = (companyId, event, data) => {
    io.to(`company:${companyId}`).emit(event, data);
  };

  io.emitToRole = (role, event, data) => {
    io.to(`role:${role}`).emit(event, data);
  };

  io.emitToBooking = (bookingId, event, data) => {
    io.to(`booking:${bookingId}`).emit(event, data);
  };

  logger.info('Socket.IO initialized successfully');
};
