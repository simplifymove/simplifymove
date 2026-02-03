const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

const analyticsController = {
  getDashboard: (req, res) => res.json({ success: true, data: {} }),
  getBookingAnalytics: (req, res) => res.json({ success: true, data: {} }),
  getRevenueAnalytics: (req, res) => res.json({ success: true, data: {} }),
  getCompanyAnalytics: (req, res) => res.json({ success: true, data: {} }),
  getUserAnalytics: (req, res) => res.json({ success: true, data: {} }),
  exportReport: (req, res) => res.json({ success: true, message: 'Report exported' })
};

router.use(protect);
router.get('/dashboard', analyticsController.getDashboard);
router.get('/bookings', authorize('super_admin', 'company_admin'), analyticsController.getBookingAnalytics);
router.get('/revenue', authorize('super_admin', 'company_admin'), analyticsController.getRevenueAnalytics);
router.get('/companies', authorize('super_admin'), analyticsController.getCompanyAnalytics);
router.get('/users', authorize('super_admin', 'company_admin'), analyticsController.getUserAnalytics);
router.post('/export', authorize('super_admin', 'company_admin'), analyticsController.exportReport);

module.exports = router;
