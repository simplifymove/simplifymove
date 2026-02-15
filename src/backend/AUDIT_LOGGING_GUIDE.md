# Audit Logging Implementation Guide

## Overview

Audit logging has been implemented to track all major actions in the SimplifyMove platform. This ensures complete visibility into system activities and maintains compliance with audit requirements.

## Current Implementation

### ✅ Controllers with Audit Logging Implemented

1. **Company Controller** (`src/backend/controllers/companyController.js`)
   - ✓ Company Creation
   - ✓ Company Update
   - ✓ Company Deletion
   - ✓ Status Changes
   - ✓ Company Verification

2. **Auth Controller** (`src/backend/controllers/authController.js`)
   - ✓ User Login (with IP and user agent tracking)

### Audit Log Utility (`src/backend/utils/auditLog.js`)

A centralized utility providing:
- `createAuditLog()` - Generic audit log creation
- `logCompanyAction()` - Company-specific logging
- `logUserAction()` - User-specific logging
- `logBookingAction()` - Booking-specific logging
- `logVendorAction()` - Vendor-specific logging
- `logPaymentAction()` - Payment transaction logging
- `getChanges()` - Extracts changed fields between old and new data

## How to Add Audit Logging to Controllers

### Basic Pattern

```javascript
// 1. Import the audit logging utility
const { logCompanyAction, getChanges } = require('../utils/auditLog');

// 2. In your controller method, implement logging

// For CREATE operations:
const newItem = await Model.create(data);
await logCompanyAction({
  action: 'Company Created',
  performedBy: req.user?.id || 'system',
  performedByRole: req.user?.role || 'system',
  targetId: newItem.id,
  details: `Item created with name: ${newItem.name}`,
  changes: [
    { field: 'Name', oldValue: '-', newValue: newItem.name },
    { field: 'Email', oldValue: '-', newValue: newItem.email },
  ],
  ipAddress: req.ip || req.connection.remoteAddress,
  userAgent: req.get('user-agent'),
  status: 'success',
  severity: 'medium'
});

// For UPDATE operations:
const oldData = item.toJSON();
await item.update(updateData);
const changes = getChanges(oldData, item.toJSON());
if (changes.length > 0) {
  await logCompanyAction({
    action: 'Company Updated',
    performedBy: req.user?.id || 'system',
    performedByRole: req.user?.role || 'system',
    targetId: item.id,
    details: `Item updated with ${changes.length} field(s)`,
    changes,
    ipAddress: req.ip || req.connection.remoteAddress,
    userAgent: req.get('user-agent'),
    status: 'success',
    severity: 'medium'
  });
}

// For DELETE operations:
await logCompanyAction({
  action: 'Company Deleted',
  performedBy: req.user?.id || 'system',
  performedByRole: req.user?.role || 'system',
  targetId: item.id,
  details: `Item "${item.name}" deleted permanently`,
  changes: [{ field: 'Status', oldValue: 'Active', newValue: 'Deleted' }],
  ipAddress: req.ip || req.connection.remoteAddress,
  userAgent: req.get('user-agent'),
  status: 'success',
  severity: 'high'
});
```

## Audit Log Fields

Each audit log entry contains:

| Field | Description | Example |
|-------|-------------|---------|
| `action` | What action was performed | "Company Created", "User Updated" |
| `category` | Type of entity affected | "company", "user", "booking", "payment" |
| `performedBy` | ID of user who performed action | "usr_12345" or "system" |
| `performedByRole` | Role of the user | "super_admin", "company_admin", "employee" |
| `targetEntity` | Type of entity | "Company", "User", "Booking" |
| `targetId` | ID of affected entity | "comp_abc123" |
| `details` | Human-readable description | "Company 'TechCorp' created with email tech@example.com" |
| `changes` | Array of field changes | [{field: "Status", oldValue: "draft", newValue: "active"}] |
| `ipAddress` | IP address of requester | "192.168.1.100" |
| `userAgent` | Browser/client info | "Mozilla/5.0..." |
| `status` | Success or failure | "success", "failure" |
| `severity` | Impact level | "low", "medium", "high", "critical" |

## Severity Levels

- **low** - Informational actions (read operations, non-destructive changes)
- **medium** - Moderate impact (user/company creation, status changes)
- **high** - Significant impact (deletion, permission changes)
- **critical** - Security events (failed logins, unauthorized access attempts)

## Controllers to Add Audit Logging To

Priority order for implementation:

### High Priority (Security/Critical)
- [ ] User Controller - user creation, update, deletion, role changes
- [ ] Booking Controller - booking creation, status changes, cancellation
- [ ] Wallet Controller - payments, refunds, transactions
- [ ] Admin Controller - system settings, permissions

### Medium Priority (Business Operations)
- [ ] Vendor Controller - vendor onboarding, updates
- [ ] Email Config Controller - configuration changes
- [ ] Promo Controller - promotional campaign changes

### Lower Priority (Reference)
- [ ] Driver Controller - driver operations
- [ ] Vehicle Controller - fleet management
- [ ] Notification Controller - notification settings

## Testing Audit Logs

To verify audit logs are being created:

```bash
# Via API (with authentication)
GET http://localhost:5001/api/v1/audit-logs?limit=10&page=1

# Filter by category
GET http://localhost:5001/api/v1/audit-logs?category=company&limit=10

# Filter by status
GET http://localhost:5001/api/v1/audit-logs?status=success&limit=10

# Filter by severity
GET http://localhost:5001/api/v1/audit-logs?severity=high&limit=10
```

## Accessing Audit Logs in Frontend

The frontend displays audit logs in the Super Admin Portal under "Audit Logs" tab. The component is located at:
- `src/components/superadmin/PlatformAuditLogsClean.tsx`

## Important Notes

1. **Non-blocking**: Audit log failures don't interrupt main operations - they are logged silently
2. **Automatic middleware**: Basic API call logging happens automatically via middleware
3. **Detailed logging**: Use the utility functions for detailed action tracking with change history
4. **Development mode**: Development logins and operations are properly logged with 'super-admin-dev' user
5. **Performance**: Audit logs are created asynchronously to minimize impact on request times

## Best Practices

1. Always include IP address and user agent for security tracking
2. Use descriptive `details` field for human-readable audit trail
3. Set appropriate severity levels based on business impact
4. Use `getChanges()` utility to automatically detect and log field changes
5. Log both successful and failed operations when relevant
6. Include company context for multi-tenant operations

## Audit Log Queries

### Get all logs for a company
```javascript
GET /api/v1/audit-logs?companyId=comp_123
```

### Get all actions by a user
```javascript
GET /api/v1/audit-logs?performedBy=user_456
```

### Get all high-severity events
```javascript
GET /api/v1/audit-logs?severity=high
```

### Get audit trail for specific entity
```javascript
GET /api/v1/audit-logs/target/Company/comp_789
```

## Troubleshooting

### Audit logs not being created
1. Check if `NODE_ENV=development` is set
2. Verify database connection is active
3. Check server logs for errors in `auditLog.js`
4. Ensure `req.user` is populated (authentication)

### Audit logs showing empty changes
1. Use `getChanges()` utility function
2. Ensure `oldData` is captured before update
3. Check field names match between old and new objects

---

For questions or clarifications about audit logging, refer to the API documentation at `src/backend/API_DOCUMENTATION.md`
