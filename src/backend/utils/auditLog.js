/**
 * Audit Logger Utility
 * Centralized function to create audit logs with proper formatting
 */

const { getModels } = require('../models');
const { logger } = require('./logger');

/**
 * Create an audit log entry
 * @param {Object} options - Audit log options
 * @param {string} options.action - Action description
 * @param {string} options.category - Category (company, user, booking, etc.)
 * @param {string} options.performedBy - User ID who performed the action
 * @param {string} options.performedByRole - User role
 * @param {string} options.companyId - Company ID (optional)
 * @param {string} options.targetEntity - Entity type (Company, User, Booking)
 * @param {string} options.targetId - Entity ID
 * @param {string} options.details - Detailed description
 * @param {Array} options.changes - Array of {field, oldValue, newValue}
 * @param {string} options.ipAddress - IP address
 * @param {string} options.userAgent - User agent
 * @param {string} options.status - 'success' or 'failure'
 * @param {string} options.severity - 'low', 'medium', 'high', 'critical'
 */
async function createAuditLog(options) {
  try {
    const { AuditLog } = getModels();

    const auditLogData = {
      action: options.action || 'Unknown Action',
      category: options.category || 'system',
      performedBy: options.performedBy || 'system',
      performedByRole: options.performedByRole || 'system',
      companyId: options.companyId || null,
      targetEntity: options.targetEntity || null,
      targetId: options.targetId || null,
      details: options.details || '',
      changes: options.changes || [],
      ipAddress: options.ipAddress || '0.0.0.0',
      userAgent: options.userAgent || 'Unknown',
      status: options.status || 'success',
      severity: options.severity || 'low'
    };

    const auditLog = await AuditLog.create(auditLogData);
    logger.info(`Audit Log Created: ${options.action} - ${options.targetEntity || options.category}`);
    return auditLog;
  } catch (error) {
    logger.error('Error creating audit log:', error.message);
    // Don't throw - audit logging failure shouldn't break the main operation
    return null;
  }
}

/**
 * Log company action
 */
async function logCompanyAction(options) {
  return createAuditLog({
    category: 'company',
    targetEntity: 'Company',
    ...options
  });
}

/**
 * Log user action
 */
async function logUserAction(options) {
  return createAuditLog({
    category: 'user',
    targetEntity: 'User',
    ...options
  });
}

/**
 * Log booking action
 */
async function logBookingAction(options) {
  return createAuditLog({
    category: 'booking',
    targetEntity: 'Booking',
    ...options
  });
}

/**
 * Log vendor action
 */
async function logVendorAction(options) {
  return createAuditLog({
    category: 'vendor',
    targetEntity: 'Vendor',
    ...options
  });
}

/**
 * Log payment/wallet action
 */
async function logPaymentAction(options) {
  return createAuditLog({
    category: 'payment',
    targetEntity: 'Transaction',
    ...options
  });
}

/**
 * Extract changed fields
 * Compares old and new objects and returns array of changes
 */
function getChanges(oldData, newData, fieldsToTrack = null) {
  const changes = [];
  const fields = fieldsToTrack || Object.keys(newData);

  fields.forEach(field => {
    if (field.startsWith('_') || field === 'password' || field === 'id') {
      return; // Skip private fields and passwords
    }

    const oldValue = oldData?.[field];
    const newValue = newData?.[field];

    if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
      changes.push({
        field: field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1'),
        oldValue: oldValue !== undefined ? String(oldValue) : '-',
        newValue: newValue !== undefined ? String(newValue) : '-'
      });
    }
  });

  return changes;
}

module.exports = {
  createAuditLog,
  logCompanyAction,
  logUserAction,
  logBookingAction,
  logVendorAction,
  logPaymentAction,
  getChanges
};
