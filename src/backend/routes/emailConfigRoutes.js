const express = require('express');
const router = express.Router();
const emailConfigController = require('../controllers/emailConfigController');
const { protect, authorize } = require('../middleware/auth');

// Create email configuration (super admin only)
router.post('/', protect, authorize('super_admin'), emailConfigController.createEmailConfig);

// Get all email configurations
router.get('/', protect, authorize('super_admin', 'company_admin'), emailConfigController.getEmailConfigs);

// Get default email configuration
router.get('/default/active', protect, authorize('super_admin', 'company_admin'), emailConfigController.getDefaultEmailConfig);

// Get email configuration by ID
router.get('/:id', protect, authorize('super_admin', 'company_admin'), emailConfigController.getEmailConfigById);

// Update email configuration (super admin only)
router.put('/:id', protect, authorize('super_admin'), emailConfigController.updateEmailConfig);

// Delete email configuration (super admin only)
router.delete('/:id', protect, authorize('super_admin'), emailConfigController.deleteEmailConfig);

// Test email configuration
router.post('/:id/test', protect, authorize('super_admin'), emailConfigController.testEmailConfig);

// Set default email configuration
router.patch('/:id/set-default', protect, authorize('super_admin'), emailConfigController.setDefaultEmailConfig);

// Update email statistics
router.patch('/:id/stats', protect, authorize('super_admin'), emailConfigController.updateEmailStats);

module.exports = router;
