/**
 * Employee Portal Routes
 */

const express = require('express');
const router = express.Router();
const {
  getDashboard,
  getProfile,
  updateProfile,
  getMyBookings,
  getMyWallet,
  getMyNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getAvailablePromoCodes,
  getSpendingAnalytics
} = require('../controllers/employeeDashboardController');

const { protect, authorize } = require('../middleware/auth');

// Protect all routes - Employee only
router.use(protect);
router.use(authorize('employee'));

// Dashboard
router.get('/dashboard', getDashboard);

// Profile
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

// Bookings
router.get('/bookings', getMyBookings);

// Wallet
router.get('/wallet', getMyWallet);

// Notifications
router.get('/notifications', getMyNotifications);
router.patch('/notifications/:id/read', markNotificationAsRead);
router.patch('/notifications/read-all', markAllNotificationsAsRead);

// Promo Codes
router.get('/promo-codes', getAvailablePromoCodes);

// Analytics
router.get('/analytics', getSpendingAnalytics);

module.exports = router;
