/**
 * API Client for SimplifyMove Frontend
 * Centralized API calls for all backend endpoints
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1';

// Helper function for API calls
const apiCall = async (endpoint: string, method: string = 'GET', data?: any) => {
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
    },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || `API Error: ${response.status}`);
  }

  return await response.json();
};

// ==================== COMPANY APIs ====================
export const companyAPI = {
  // Get all companies
  getAll: (params?: any) => {
    const query = new URLSearchParams(params).toString();
    return apiCall(`/companies${query ? `?${query}` : ''}`);
  },

  // Get company by ID
  getById: (id: string) => apiCall(`/companies/${id}`),

  // Create company
  create: (data: any) => apiCall('/companies', 'POST', data),

  // Update company
  update: (id: string, data: any) => apiCall(`/companies/${id}`, 'PUT', data),

  // Delete company
  delete: (id: string) => apiCall(`/companies/${id}`, 'DELETE'),

  // Update company status
  updateStatus: (id: string, status: string) => 
    apiCall(`/companies/${id}/status`, 'PATCH', { status }),

  // Get company employees
  getEmployees: (id: string) => apiCall(`/companies/${id}/employees`),

  // Add employee to company
  addEmployee: (id: string, data: any) => apiCall(`/companies/${id}/employees`, 'POST', data),

  // Get company wallet
  getWallet: (id: string) => apiCall(`/companies/${id}/wallet`),
};

// ==================== AUDIT LOG APIs ====================
export const auditLogAPI = {
  // Get all audit logs with filtering
  getAll: (params?: any) => {
    const query = new URLSearchParams(params).toString();
    return apiCall(`/audit-logs${query ? `?${query}` : ''}`);
  },

  // Get audit log by ID
  getById: (id: string) => apiCall(`/audit-logs/${id}`),

  // Create audit log
  create: (data: any) => apiCall('/audit-logs', 'POST', data),

  // Get audit logs by target entity
  getByTarget: (targetEntity: string, targetId: string) =>
    apiCall(`/audit-logs/target/${targetEntity}/${targetId}`),

  // Get audit statistics
  getStats: (params?: any) => {
    const query = new URLSearchParams(params).toString();
    return apiCall(`/audit-logs/stats${query ? `?${query}` : ''}`);
  },

  // Delete old audit logs
  deleteOld: (daysOld: number) => apiCall(`/audit-logs/cleanup?daysOld=${daysOld}`, 'DELETE'),
};

// ==================== VENDOR APIs ====================
export const vendorAPI = {
  // Get all vendors
  getAll: (params?: any) => {
    const query = new URLSearchParams(params).toString();
    return apiCall(`/vendors${query ? `?${query}` : ''}`);
  },

  // Get vendor by ID
  getById: (id: string) => apiCall(`/vendors/${id}`),

  // Create vendor
  create: (data: any) => apiCall('/vendors', 'POST', data),

  // Update vendor
  update: (id: string, data: any) => apiCall(`/vendors/${id}`, 'PUT', data),

  // Delete vendor
  delete: (id: string) => apiCall(`/vendors/${id}`, 'DELETE'),

  // Update vendor health status
  updateHealth: (id: string, data: any) => apiCall(`/vendors/${id}/health`, 'PATCH', data),

  // Update vendor metrics (bulk)
  updateMetrics: (data: any) => apiCall('/vendors/metrics/bulk', 'PATCH', data),

  // Get integration status
  getIntegrationStatus: () => apiCall('/vendors/status/integration'),
};

// ==================== EMAIL CONFIG APIs ====================
export const emailConfigAPI = {
  // Get all email configs
  getAll: (params?: any) => {
    const query = new URLSearchParams(params).toString();
    return apiCall(`/email-config${query ? `?${query}` : ''}`);
  },

  // Get email config by ID
  getById: (id: string) => apiCall(`/email-config/${id}`),

  // Create email config
  create: (data: any) => apiCall('/email-config', 'POST', data),

  // Update email config
  update: (id: string, data: any) => apiCall(`/email-config/${id}`, 'PUT', data),

  // Delete email config
  delete: (id: string) => apiCall(`/email-config/${id}`, 'DELETE'),

  // Test email config
  test: (id: string) => apiCall(`/email-config/${id}/test`, 'POST'),

  // Set default email config
  setDefault: (id: string) => apiCall(`/email-config/${id}/set-default`, 'PATCH'),

  // Get default email config
  getDefault: () => apiCall('/email-config/default/active'),

  // Update email statistics
  updateStats: (id: string, emailsSent: number) =>
    apiCall(`/email-config/${id}/stats`, 'PATCH', { emailsSent }),
};

// ==================== USER APIs ====================
export const userAPI = {
  // Get all users
  getAll: (params?: any) => {
    const query = new URLSearchParams(params).toString();
    return apiCall(`/users${query ? `?${query}` : ''}`);
  },

  // Get user by ID
  getById: (id: string) => apiCall(`/users/${id}`),

  // Update user
  update: (id: string, data: any) => apiCall(`/users/${id}`, 'PUT', data),

  // Delete user
  delete: (id: string) => apiCall(`/users/${id}`, 'DELETE'),

  // Update user status
  updateStatus: (id: string, status: string) =>
    apiCall(`/users/${id}/status`, 'PATCH', { status }),
};

// ==================== BOOKING APIs ====================
export const bookingAPI = {
  // Get all bookings
  getAll: (params?: any) => {
    const query = new URLSearchParams(params).toString();
    return apiCall(`/bookings${query ? `?${query}` : ''}`);
  },

  // Get booking by ID
  getById: (id: string) => apiCall(`/bookings/${id}`),

  // Create booking
  create: (data: any) => apiCall('/bookings', 'POST', data),

  // Update booking
  update: (id: string, data: any) => apiCall(`/bookings/${id}`, 'PUT', data),

  // Cancel booking
  cancel: (id: string, reason: string) => apiCall(`/bookings/${id}/cancel`, 'PATCH', { reason }),
};

export default {
  companyAPI,
  auditLogAPI,
  vendorAPI,
  emailConfigAPI,
  userAPI,
  bookingAPI,
};
