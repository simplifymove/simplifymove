/**
 * Mock Backend - Returns sample data
 * Gets you running without MySQL dependency
 */

const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Mock data
const mockCompanies = [
  { id: 1, name: 'Acme Corporation', status: 'active', totalUsers: 150 },
  { id: 2, name: 'Tech Solutions Ltd', status: 'active', totalUsers: 89 },
  { id: 3, name: 'Global Industries', status: 'active', totalUsers: 234 },
];

const mockUsers = [
  { id: 1, email: 'john@example.com', name: 'John Doe', role: 'employee', companyId: 1 },
  { id: 2, email: 'jane@example.com', name: 'Jane Smith', role: 'company_admin', companyId: 1 },
  { id: 3, email: 'admin@example.com', name: 'Admin User', role: 'super_admin' },
];

const mockBookings = [
  { id: 1, userId: 1, status: 'completed', amount: 500, date: '2026-02-10' },
  { id: 2, userId: 1, status: 'pending', amount: 750, date: '2026-02-12' },
];

// Auth
app.post('/api/v1/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = mockUsers.find(u => u.email === email);
  if (user) {
    res.json({
      success: true,
      data: {
        user,
        token: 'mock-jwt-token-' + Math.random(),
      }
    });
  } else {
    res.status(400).json({ success: false, message: 'Invalid credentials' });
  }
});

// Companies
app.get('/api/v1/companies', (req, res) => {
  res.json({ success: true, data: mockCompanies });
});

app.get('/api/v1/companies/:id', (req, res) => {
  const company = mockCompanies.find(c => c.id === parseInt(req.params.id));
  res.json({ success: true, data: company });
});

// Users
app.get('/api/v1/users', (req, res) => {
  res.json({ success: true, data: mockUsers });
});

app.get('/api/v1/users/:id', (req, res) => {
  const user = mockUsers.find(u => u.id === parseInt(req.params.id));
  res.json({ success: true, data: user });
});

// Bookings
app.get('/api/v1/bookings', (req, res) => {
  res.json({ success: true, data: mockBookings });
});

// Health
app.get('/health', (req, res) => {
  res.json({ success: true, message: 'Mock backend running' });
});

app.listen(5001, () => {
  console.log('✅ Mock Backend running on http://localhost:5001');
  console.log('📡 Serving mock data - NOT using MySQL');
});
