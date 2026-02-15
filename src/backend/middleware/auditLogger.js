const { getModels } = require('../models');

// Middleware to capture request information for audit logging
const captureAuditInfo = (req, res, next) => {
  // Capture original send function
  const originalSend = res.send;

  // Store request info
  res.locals = res.locals || {};
  res.locals.auditInfo = {
    method: req.method,
    path: req.path,
    url: req.originalUrl,
    ipAddress: req.ip || req.connection.remoteAddress,
    userAgent: req.get('user-agent'),
    userId: req.user?.id,
    userRole: req.user?.role,
    companyId: req.user?.companyId,
    timestamp: new Date()
  };

  // Override send to capture response
  res.send = function(data) {
    res.locals.auditInfo.statusCode = res.statusCode;
    res.locals.auditInfo.responseSize = data?.length || 0;
    
    // Call original send
    return originalSend.call(this, data);
  };

  next();
};

// Middleware to create audit log after request completes
const logAuditAction = (req, res, next) => {
  // Use a small delay to ensure response has been sent
  setImmediate(async () => {
    try {
      const auditInfo = res.locals?.auditInfo;
      if (!auditInfo) return;

      const { AuditLog } = getModels();

      // Map common API endpoints to audit categories and actions
      let category = 'system';
      let action = `${auditInfo.method} ${auditInfo.path}`;
      let targetEntity = null;
      let targetId = null;

      // Parse category and target from URL
      if (auditInfo.path.includes('/companies')) {
        category = 'company';
        const companyMatch = auditInfo.url.match(/\/companies\/([a-f0-9-]+)/);
        if (companyMatch) {
          targetEntity = 'Company';
          targetId = companyMatch[1];
        }
      } else if (auditInfo.path.includes('/users')) {
        category = 'user';
        const userMatch = auditInfo.url.match(/\/users\/([a-f0-9-]+)/);
        if (userMatch) {
          targetEntity = 'User';
          targetId = userMatch[1];
        }
      } else if (auditInfo.path.includes('/bookings')) {
        category = 'booking';
        const bookingMatch = auditInfo.url.match(/\/bookings\/([a-f0-9-]+)/);
        if (bookingMatch) {
          targetEntity = 'Booking';
          targetId = bookingMatch[1];
        }
      } else if (auditInfo.path.includes('/vendors')) {
        category = 'vendor';
        const vendorMatch = auditInfo.url.match(/\/vendors\/([a-f0-9-]+)/);
        if (vendorMatch) {
          targetEntity = 'Vendor';
          targetId = vendorMatch[1];
        }
      } else if (auditInfo.path.includes('/wallet')) {
        category = 'payment';
      } else if (auditInfo.path.includes('/auth')) {
        category = 'system';
      }

      // Determine status
      const status = auditInfo.statusCode >= 200 && auditInfo.statusCode < 300 ? 'success' : 'failure';
      const severity = auditInfo.statusCode >= 400 ? 'high' : 'low';

      // Only log if user is authenticated (skip public endpoints)
      if (auditInfo.userId) {
        await AuditLog.create({
          action,
          category,
          performedBy: auditInfo.userId,
          performedByRole: auditInfo.userRole,
          companyId: auditInfo.companyId,
          targetEntity,
          targetId,
          details: `${auditInfo.method} ${auditInfo.path} - Status: ${auditInfo.statusCode}`,
          changes: [],
          ipAddress: auditInfo.ipAddress,
          userAgent: auditInfo.userAgent,
          status,
          severity
        });
      }
    } catch (error) {
      // Silently fail audit logging - don't break the main request
      console.error('Error creating audit log:', error);
    }
  });

  next();
};

// Specific audit logger for mutations (POST, PUT, PATCH, DELETE)
const logAuditMutation = (category, action) => {
  return async (req, res, next) => {
    try {
      const { AuditLog } = getModels();
      const ipAddress = req.ip || req.connection.remoteAddress;
      const userAgent = req.get('user-agent');

      // Capture request body for change tracking
      const changes = [];
      if (req.body) {
        Object.entries(req.body).forEach(([key, value]) => {
          changes.push({
            field: key,
            newValue: value
          });
        });
      }

      // Add audit logging to response locals for use after completion
      res.locals = res.locals || {};
      res.locals.auditMutation = {
        category,
        action,
        changes,
        ipAddress,
        userAgent
      };

      next();
    } catch (error) {
      console.error('Error capturing audit mutation:', error);
      next();
    }
  };
};

// Helper to log specific mutations
const createMutationLogger = (AuditAction) => {
  return async (userId, userRole, companyId, targetEntity, targetId, changes, status = 'success', severity = 'low') => {
    try {
      const { AuditLog } = getModels();
      
      await AuditLog.create({
        action: AuditAction.action || 'Unknown Action',
        category: AuditAction.category || 'system',
        performedBy: userId,
        performedByRole: userRole,
        companyId,
        targetEntity,
        targetId,
        details: AuditAction.details || AuditAction.action,
        changes: changes || [],
        status,
        severity
      });
    } catch (error) {
      console.error('Error logging mutation:', error);
    }
  };
};

module.exports = {
  captureAuditInfo,
  logAuditAction,
  logAuditMutation,
  createMutationLogger
};
