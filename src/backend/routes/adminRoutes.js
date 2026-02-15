const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

const adminController = require('../controllers/adminController');
const auditController = require('../controllers/auditLogController') || null;

// Settings endpoints: public in dev, protected in prod
const settingsAuth = process.env.NODE_ENV === 'development'
  ? (req, res, next) => next() // Dev: skip auth
  : [protect, authorize('super_admin')]; // Prod: require auth

router.get('/settings', settingsAuth, adminController.getPlatformSettings);
router.put('/settings', settingsAuth, adminController.updatePlatformSettings);

// All other admin routes require authentication
router.use(protect);
router.use(authorize('super_admin'));

// System stats (placeholder)
router.get('/stats', (req, res) => res.json({ success: true, data: {} }));

// Audit logs placeholder (kept simple)
router.get('/audit-logs', (req, res) => res.json({ success: true, data: [] }));

// Permissions & bulk ops placeholders
router.post('/permissions', (req, res) => res.json({ success: true, message: 'Permissions updated' }));
router.post('/bulk-operations', (req, res) => res.json({ success: true, message: 'Operation completed' }));

module.exports = router;
