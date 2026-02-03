/**
 * Company Admin Portal Routes
 */

const express = require('express');
const router = express.Router();
const {
  getDashboard,
  getEmployees,
  addEmployee,
  updateEmployee,
  deactivateEmployee,
  getCompanyBookings,
  getSettings,
  updateSettings,
  getReports
} = require('../controllers/companyAdminController');

const { protect, authorize } = require('../middleware/auth');
const { body } = require('express-validator');

// Employee validation
const employeeValidation = [
  body('name').notEmpty().trim().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('phone').matches(/^[6-9]\d{9}$/).withMessage('Valid mobile number is required'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),
  body('department').optional().trim(),
  body('designation').optional().trim()
];

// Protect all routes - Company Admin only
router.use(protect);
router.use(authorize('company_admin'));

// Dashboard
router.get('/dashboard', getDashboard);

// Employee Management
router.get('/employees', getEmployees);
router.post('/employees', employeeValidation, addEmployee);
router.put('/employees/:id', updateEmployee);
router.delete('/employees/:id', deactivateEmployee);

// Booking Management
router.get('/bookings', getCompanyBookings);

// Settings
router.get('/settings', getSettings);
router.put('/settings', updateSettings);

// Reports
router.get('/reports', getReports);

module.exports = router;
