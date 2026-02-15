/**
 * Authentication & Authorization Middleware
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { AppError } = require('./errorHandler');
const { logger } = require('../utils/logger');

/**
 * Protect routes - Verify JWT token
 */
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Get token from header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Check if token exists
    if (!token) {
      return next(new AppError('Not authorized to access this route', 401));
    }

    try {
      // Development mode: Allow mock tokens
      let decoded;
      if (process.env.NODE_ENV === 'development' && token.endsWith('.mock')) {
        // Parse mock token format: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InN1cGVyLWFkbWluIiwicm9sZSI6InN1cGVyX2FkbWluIiwibmFtZSI6IlN1cGVyIEFkbWluIn0.mock
        try {
          const parts = token.split('.');
          decoded = JSON.parse(Buffer.from(parts[1], 'base64').toString());
        } catch (e) {
          return next(new AppError('Invalid token format', 401));
        }
      } else {
        // Verify token
        decoded = jwt.verify(token, process.env.JWT_SECRET);
      }

      // Development mode: Create mock user if ID is dev
      if (process.env.NODE_ENV === 'development' && (decoded.id === 'super-admin-dev' || decoded.id === 'super-admin')) {
        req.user = {
          id: decoded.id,
          email: 'admin@simplifymove.com',
          name: 'Super Admin',
          role: decoded.role || 'super_admin',
          status: 'active',
          company: null,
          changedPasswordAfter: () => false,
          isLocked: () => false
        };
        return next();
      }

      // Get user from token (production mode)
      const user = await User.findByPk(decoded.id, {
        attributes: { include: ['password'] }
      });

      if (!user) {
        return next(new AppError('User no longer exists', 401));
      }

      // Check if user is active
      if (user.status && user.status !== 'active') {
        return next(new AppError(`Account is ${user.status}. Please contact support.`, 403));
      }

      // Check if account is locked (only if method exists)
      if (typeof user.isLocked === 'function' && user.isLocked()) {
        return next(new AppError('Account is temporarily locked due to multiple failed login attempts', 403));
      }

      // Check if user changed password after token was issued (only if method exists)
      if (typeof user.changedPasswordAfter === 'function' && user.changedPasswordAfter(decoded.iat)) {
        return next(new AppError('Password was recently changed. Please login again.', 401));
      }

      // Check if company is active (for non-super admins) - only if company exists
      if (user.role !== 'super_admin' && user.company && user.company.status) {
        if (user.company.status !== 'active') {
          return next(new AppError('Company account is not active', 403));
        }
      }

      // Update last login (only if save method exists)
      if (typeof user.save === 'function') {
        user.lastLogin = Date.now();
        try {
          await user.save({ validateBeforeSave: false });
        } catch (e) {
          // Silently ignore save errors in development
        }
      }

      // Grant access to protected route
      req.user = user;
      next();

    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        return next(new AppError('Invalid token', 401));
      }
      if (error.name === 'TokenExpiredError') {
        return next(new AppError('Token expired', 401));
      }
      throw error;
    }

  } catch (error) {
    logger.error('Auth middleware error:', error);
    next(error);
  }
};

/**
 * Authorize specific roles
 */
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError(
        `Role '${req.user.role}' is not authorized to access this route`,
        403
      ));
    }
    next();
  };
};

/**
 * Check specific permissions
 */
exports.checkPermission = (...permissions) => {
  return (req, res, next) => {
    // Super admin has all permissions
    if (req.user.role === 'super_admin') {
      return next();
    }

    // Check if user has required permissions
    const hasPermission = permissions.some(permission => 
      req.user.permissions.includes(permission)
    );

    if (!hasPermission) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }

    next();
  };
};

/**
 * Verify company access
 */
exports.verifyCompanyAccess = (req, res, next) => {
  const companyId = req.params.companyId || req.body.company || req.query.company;

  // Super admin can access all companies
  if (req.user.role === 'super_admin') {
    return next();
  }

  // Check if user belongs to the company
  if (req.user.company.toString() !== companyId.toString()) {
    return next(new AppError('You do not have access to this company', 403));
  }

  next();
};

/**
 * Verify user access (can only access own data unless admin)
 */
exports.verifyUserAccess = (req, res, next) => {
  const userId = req.params.userId || req.params.id;

  // Super admin can access all users
  if (req.user.role === 'super_admin') {
    return next();
  }

  // Company admin can access users in their company
  if (req.user.role === 'company_admin') {
    return next(); // Will be validated in controller
  }

  // Users can only access their own data
  if (req.user._id.toString() !== userId.toString()) {
    return next(new AppError('You can only access your own data', 403));
  }

  next();
};

/**
 * Optional auth - doesn't fail if no token
 */
exports.optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).populate('company');
        
        if (user && user.status === 'active') {
          req.user = user;
        }
      } catch (error) {
        // Token is invalid, but that's okay for optional auth
        logger.warn('Optional auth - invalid token');
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Rate limiting for sensitive operations
 */
exports.rateLimitSensitive = (req, res, next) => {
  // This would typically use Redis for distributed rate limiting
  // For now, it's a placeholder
  next();
};
