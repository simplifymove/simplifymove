/**
 * Authentication Routes
 */

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

// Import auth controller (to be created)
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Validation middleware
const registerValidation = [
  body('name').notEmpty().trim().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('phone').matches(/^[6-9]\d{9}$/).withMessage('Valid Indian mobile number is required'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain uppercase, lowercase, number and special character'),
  body('role').optional().isIn(['employee', 'company_admin']).withMessage('Invalid role')
];

const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
];

// Public routes
router.post('/register', registerValidation, authController.register);
router.post('/login', loginValidation, authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password/:token', authController.resetPassword);
router.post('/verify-email/:token', authController.verifyEmail);
router.post('/resend-verification', authController.resendVerificationEmail);

// Protected routes
router.use(protect);
router.get('/me', authController.getMe);
router.post('/logout', authController.logout);
router.put('/update-password', authController.updatePassword);
router.put('/update-profile', authController.updateProfile);
router.post('/refresh-token', authController.refreshToken);

module.exports = router;
