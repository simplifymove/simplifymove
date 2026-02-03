/**
 * Booking Routes
 */

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  createBooking,
  getAllBookings,
  getBookingById,
  cancelBooking,
  approveBooking,
  rejectBooking,
  getPendingApprovals,
  getBookingStatistics
} = require('../controllers/bookingController');

const { protect, authorize } = require('../middleware/auth');

// Booking validation
const bookingValidation = [
  body('serviceCategory')
    .isIn(['travel', 'logistics', 'courier'])
    .withMessage('Invalid service category'),
  body('serviceType').notEmpty().withMessage('Service type is required'),
  body('travelDate').isISO8601().withMessage('Valid travel date is required'),
  body('baseAmount').isFloat({ min: 0 }).withMessage('Valid amount is required'),
  body('paymentMethod').isIn(['wallet', 'card', 'netbanking', 'upi', 'cash'])
    .withMessage('Invalid payment method')
];

// Protect all routes
router.use(protect);

// Create booking
router.post('/', bookingValidation, createBooking);

// Get all bookings (role-based filtering in controller)
router.get('/', getAllBookings);

// Get booking statistics
router.get('/statistics', authorize('company_admin', 'super_admin'), getBookingStatistics);

// Get pending approvals
router.get('/pending-approvals', authorize('company_admin', 'super_admin'), getPendingApprovals);

// Get booking by ID
router.get('/:id', getBookingById);

// Cancel booking
router.patch('/:id/cancel', cancelBooking);

// Approve booking (Company Admin, Super Admin)
router.patch('/:id/approve', authorize('company_admin', 'super_admin'), approveBooking);

// Reject booking (Company Admin, Super Admin)
router.patch(
  '/:id/reject',
  authorize('company_admin', 'super_admin'),
  body('reason').notEmpty().withMessage('Rejection reason is required'),
  rejectBooking
);

module.exports = router;
