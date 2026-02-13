const express = require('express');
const router = express.Router();
const auditLogController = require('../controllers/auditLogController');
const { protect, authorize } = require('../middleware/auth');

// Create audit log (internal use, no auth required for now - typically called by audit middleware)
router.post('/', auditLogController.createAuditLog);

// Get all audit logs with filters (super admin and company admin)
router.get('/', protect, authorize('super_admin', 'company_admin'), auditLogController.getAuditLogs);

// Get audit statistics
router.get('/stats', protect, authorize('super_admin', 'company_admin'), auditLogController.getAuditStats);

// Get audit logs for specific target (entity like company, user, booking)
router.get('/target/:targetEntity/:targetId', protect, authorize('super_admin', 'company_admin'), auditLogController.getAuditLogsByTarget);

// Get specific audit log by ID
router.get('/:id', protect, authorize('super_admin', 'company_admin'), auditLogController.getAuditLogById);

// Delete old audit logs (super admin only)
router.delete('/cleanup', protect, authorize('super_admin'), auditLogController.deleteOldAuditLogs);

module.exports = router;
