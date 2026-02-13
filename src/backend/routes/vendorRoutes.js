const express = require('express');
const router = express.Router();
const vendorController = require('../controllers/vendorController');
const { protect, authorize } = require('../middleware/auth');

// Create vendor (super admin only)
router.post('/', protect, authorize('super_admin'), vendorController.createVendor);

// Get all vendors
router.get('/', protect, authorize('super_admin', 'company_admin'), vendorController.getVendors);

// Get integration status (super admin and company admin)
router.get('/status/integration', protect, authorize('super_admin', 'company_admin'), vendorController.getIntegrationStatus);

// Get vendor by ID
router.get('/:id', protect, authorize('super_admin', 'company_admin'), vendorController.getVendorById);

// Update vendor (super admin only)
router.put('/:id', protect, authorize('super_admin'), vendorController.updateVendor);

// Delete vendor (super admin only)
router.delete('/:id', protect, authorize('super_admin'), vendorController.deleteVendor);

// Update vendor health status
router.patch('/:id/health', protect, authorize('super_admin'), vendorController.updateVendorHealth);

// Bulk update vendor metrics (for monitoring service)
router.patch('/metrics/bulk', protect, authorize('super_admin'), vendorController.updateVendorMetrics);

module.exports = router;
