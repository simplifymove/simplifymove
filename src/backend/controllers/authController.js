/**
 * Authentication Controller
 * Handles user registration, login, and token management
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { AppError } = require('../middleware/errorHandler');
const { logger } = require('../utils/logger');
const { createAuditLog } = require('../utils/auditLog');
const { getModels } = require('../models');

// Generate JWT Token
const generateToken = (userId, role = 'super_admin', companyId = null) => {
  return jwt.sign(
    { id: userId, role, companyId },
    process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    { expiresIn: '7d' }
  );
};

// Development/Demo Login
exports.register = async (req, res, next) => {
  res.status(501).json({
    success: false,
    message: 'Register endpoint - To be implemented'
  });
};

exports.login = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;

    // Development mode: Allow demo login without database
    if (process.env.NODE_ENV === 'development') {
      const userRole = role || 'super_admin';
      let companyId = null;

      // For company admin, fetch the first company from database
      if (userRole === 'company_admin') {
        try {
          const { Company } = getModels();
          logger.info('LOGIN: Fetching company for company_admin role');
          const company = await Company.findOne();
          if (company) {
            companyId = company.id;
            logger.info(`LOGIN: Found company: ${company.name} (${companyId})`);
          } else {
            logger.warn('LOGIN: No companies found in database for company_admin');
          }
        } catch (err) {
          logger.error('LOGIN: Could not fetch company:', err.message);
        }
      }

      logger.info(`LOGIN: Generated token for ${userRole} with companyId=${companyId}`);
      const devToken = generateToken('super-admin-dev', userRole, companyId);
      
      // Log development login
      await createAuditLog({
        action: 'User Login',
        category: 'system',
        performedBy: 'super-admin-dev',
        performedByRole: userRole,
        targetEntity: 'User',
        targetId: 'super-admin-dev',
        details: `Development user logged in with email: ${email}`,
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.get('user-agent'),
        status: 'success',
        severity: 'low'
      });

      return res.status(200).json({
        success: true,
        message: 'Logged in successfully',
        data: {
          id: 'super-admin-dev',
          email: email || 'admin@simplifymove.com',
          name: 'Super Admin',
          role: userRole,
          companyId: companyId,
          token: devToken
        },
        token: devToken
      });
    }

    // Production mode: Full authentication
    if (!email || !password) {
      return next(new AppError('Please provide email and password', 400));
    }

    const user = await User.findOne({ where: { email } })
      .select('+password');

    if (!user) {
      return next(new AppError('Invalid email or password', 401));
    }

    const isPasswordCorrect = await user.matchPassword(password);

    if (!isPasswordCorrect) {
      return next(new AppError('Invalid email or password', 401));
    }

    const token = generateToken(user.id, user.role, user.companyId);

    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        companyId: user.companyId,
        token
      },
      token
    });
  } catch (error) {
    logger.error('Login error:', error);
    next(error);
  }
};

exports.logout = async (req, res, next) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
};

exports.getMe = async (req, res, next) => {
  res.status(200).json({
    success: true,
    data: req.user
  });
};

exports.forgotPassword = async (req, res, next) => {
  res.status(501).json({
    success: false,
    message: 'Forgot password endpoint - To be implemented'
  });
};

exports.resetPassword = async (req, res, next) => {
  res.status(501).json({
    success: false,
    message: 'Reset password endpoint - To be implemented'
  });
};

exports.updatePassword = async (req, res, next) => {
  res.status(501).json({
    success: false,
    message: 'Update password endpoint - To be implemented'
  });
};

exports.updateProfile = async (req, res, next) => {
  res.status(501).json({
    success: false,
    message: 'Update profile endpoint - To be implemented'
  });
};

exports.verifyEmail = async (req, res, next) => {
  res.status(501).json({
    success: false,
    message: 'Verify email endpoint - To be implemented'
  });
};

exports.resendVerificationEmail = async (req, res, next) => {
  res.status(501).json({
    success: false,
    message: 'Resend verification endpoint - To be implemented'
  });
};

exports.refreshToken = async (req, res, next) => {
  res.status(501).json({
    success: false,
    message: 'Refresh token endpoint - To be implemented'
  });
};
