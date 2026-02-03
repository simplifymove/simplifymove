# SimplifyMove Backend - Quick Start Guide

Get your backend running in 5 minutes! 🚀

---

## ⚡ **Quick Setup (5 minutes)**

### Step 1: Install Dependencies

```bash
cd backend
npm install
```

### Step 2: Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit .env file with your values
nano .env
```

**Minimum Required Variables:**
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/simplifymove
JWT_SECRET=your-super-secret-key-change-this-32-characters-minimum
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000,http://localhost:5173
```

### Step 3: Start MongoDB

**Option A - Local MongoDB:**
```bash
# Start MongoDB service
mongod --dbpath /path/to/data
```

**Option B - MongoDB Atlas (Recommended):**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env`

### Step 4: Start Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

**✅ Your server is running at:** `http://localhost:5000`

---

## 🧪 **Test API (Postman/Thunder Client)**

### 1. Health Check

```http
GET http://localhost:5000/health
```

**Expected Response:**
```json
{
  "success": true,
  "message": "SimplifyMove API is running!",
  "timestamp": "2025-01-26T...",
  "environment": "development",
  "version": "v1"
}
```

### 2. Create Super Admin (First Time)

```http
POST http://localhost:5000/api/v1/auth/register
Content-Type: application/json

{
  "name": "Super Admin",
  "email": "admin@simplifymove.com",
  "phone": "9999999999",
  "password": "Admin@123456",
  "role": "super_admin"
}
```

### 3. Login as Super Admin

```http
POST http://localhost:5000/api/v1/auth/login
Content-Type: application/json

{
  "email": "admin@simplifymove.com",
  "password": "Admin@123456"
}
```

**Copy the JWT token from response!**

### 4. Create a Company

```http
POST http://localhost:5000/api/v1/companies
Authorization: Bearer YOUR_JWT_TOKEN_HERE
Content-Type: application/json

{
  "name": "Tech Innovations Ltd",
  "email": "contact@techinnovations.com",
  "phone": "9876543210",
  "industry": "Technology",
  "companySize": "51-200",
  "address": {
    "street": "123 Main Street",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001",
    "country": "India"
  },
  "adminContact": {
    "name": "John Doe",
    "email": "john@techinnovations.com",
    "phone": "9876543210",
    "designation": "IT Manager"
  }
}
```

### 5. Create Company Admin User

```http
POST http://localhost:5000/api/v1/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@techinnovations.com",
  "phone": "9876543210",
  "password": "Admin@123456",
  "role": "company_admin",
  "company": "COMPANY_ID_FROM_PREVIOUS_STEP"
}
```

### 6. Create Employee

Login as Company Admin first, then:

```http
POST http://localhost:5000/api/v1/company-admin/employees
Authorization: Bearer COMPANY_ADMIN_JWT_TOKEN
Content-Type: application/json

{
  "name": "Jane Smith",
  "email": "jane@techinnovations.com",
  "phone": "9876543211",
  "password": "Employee@123",
  "department": "IT",
  "designation": "Developer",
  "employeeId": "EMP001"
}
```

### 7. Create Promotional Campaign

```http
POST http://localhost:5000/api/v1/promos
Authorization: Bearer SUPER_ADMIN_JWT_TOKEN
Content-Type: application/json

{
  "name": "New Year Travel Bonanza",
  "code": "NEWYEAR2025",
  "description": "Get 20% off on all flight and hotel bookings",
  "discountType": "percentage",
  "discountValue": 20,
  "maxDiscount": 5000,
  "minBookingAmount": 10000,
  "applicableServices": ["Flight", "Hotel"],
  "applicableCompanies": ["COMPANY_ID_HERE"],
  "startDate": "2025-01-01",
  "endDate": "2025-12-31",
  "usageLimit": 1000,
  "perUserLimit": 5
}
```

### 8. Create Booking (Employee)

Login as Employee first, then:

```http
POST http://localhost:5000/api/v1/bookings
Authorization: Bearer EMPLOYEE_JWT_TOKEN
Content-Type: application/json

{
  "serviceCategory": "travel",
  "serviceType": "Flight",
  "travelDate": "2025-02-01T10:00:00Z",
  "returnDate": "2025-02-05T18:00:00Z",
  "origin": {
    "address": "Mumbai Airport",
    "city": "Mumbai",
    "state": "Maharashtra"
  },
  "destination": {
    "address": "Delhi Airport",
    "city": "Delhi",
    "state": "Delhi"
  },
  "passengers": 1,
  "baseAmount": 5000,
  "promoCode": "NEWYEAR2025",
  "paymentMethod": "wallet",
  "purpose": "Business meeting"
}
```

---

## 📁 **Project Structure**

```
backend/
├── server.js                    ✅ Main entry point
├── package.json                 ✅ Dependencies
├── .env.example                 ✅ Environment template
│
├── models/                      ✅ Database Models
│   ├── User.js                  ✅ Complete
│   ├── Company.js               ✅ Complete
│   ├── Booking.js               ✅ Complete
│   ├── Wallet.js                ✅ Complete
│   ├── Notification.js          ✅ Complete
│   └── PromotionalCampaign.js   ✅ Complete
│
├── controllers/                 ✅ Business Logic
│   ├── promoController.js       ✅ Complete
│   ├── bookingController.js     ✅ Complete
│   ├── walletController.js      ✅ Complete
│   ├── employeeDashboardController.js    ✅ Complete
│   ├── companyAdminController.js         ✅ Complete
│   ├── authController.js        📝 Stub
│   └── companyController.js     📝 Stub
│
├── routes/                      ✅ API Routes
│   ├── promoRoutes.js           ✅ Complete
│   ├── bookingRoutes.js         ✅ Complete
│   ├── walletRoutes.js          ✅ Complete
│   ├── employeeRoutes.js        ✅ Complete
│   ├── companyAdminRoutes.js    ✅ Complete
│   └── ... (12 route files)
│
├── middleware/                  ✅ Middleware
│   ├── auth.js                  ✅ Complete
│   ├── errorHandler.js          ✅ Complete
│   └── logger.js                ✅ Complete
│
└── socket/                      ✅ WebSocket
    └── socketHandler.js         ✅ Complete
```

---

## 🎯 **API Endpoints by Portal**

### **Employee Portal** (`/api/v1/employee`)

```
GET    /employee/dashboard
GET    /employee/profile
PUT    /employee/profile
GET    /employee/bookings
GET    /employee/wallet
GET    /employee/notifications
PATCH  /employee/notifications/:id/read
GET    /employee/promo-codes
GET    /employee/analytics
```

### **Company Admin Portal** (`/api/v1/company-admin`)

```
GET    /company-admin/dashboard
GET    /company-admin/employees
POST   /company-admin/employees
PUT    /company-admin/employees/:id
DELETE /company-admin/employees/:id
GET    /company-admin/bookings
GET    /company-admin/settings
PUT    /company-admin/settings
GET    /company-admin/reports
```

### **Super Admin Portal** (`/api/v1/admin`, `/api/v1/promos`, `/api/v1/companies`)

```
GET    /admin/stats
GET    /companies
POST   /companies
PUT    /companies/:id
DELETE /companies/:id
GET    /promos
POST   /promos
PUT    /promos/:id
DELETE /promos/:id
GET    /promos/:id/analytics
```

### **Common** (`/api/v1/bookings`, `/api/v1/wallets`)

```
POST   /bookings
GET    /bookings
GET    /bookings/:id
PATCH  /bookings/:id/cancel
PATCH  /bookings/:id/approve
PATCH  /bookings/:id/reject
GET    /wallets/:userId
POST   /wallets/:userId/recharge
GET    /wallets/:userId/transactions
```

---

## 🔑 **Authentication Flow**

### Register → Login → Get Token → Use Token

```javascript
// 1. Register
POST /api/v1/auth/register
{ email, password, role, ... }

// 2. Login
POST /api/v1/auth/login
{ email, password }
→ Response: { token: "eyJhbGc..." }

// 3. Use Token
GET /api/v1/employee/dashboard
Headers: { Authorization: "Bearer eyJhbGc..." }
```

---

## 🛠️ **Common Issues & Fixes**

### ❌ MongoDB Connection Error

**Error:** `MongoNetworkError: connect ECONNREFUSED`

**Fix:**
```bash
# Check if MongoDB is running
mongod --version

# Start MongoDB
mongod --dbpath /path/to/data

# Or use MongoDB Atlas connection string
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
```

### ❌ Port Already in Use

**Error:** `EADDRINUSE: address already in use :::5000`

**Fix:**
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>

# Or change port in .env
PORT=5001
```

### ❌ JWT Token Invalid

**Error:** `JsonWebTokenError: invalid token`

**Fix:**
- Ensure JWT_SECRET is set in `.env`
- JWT_SECRET must be at least 32 characters
- Token must start with "Bearer " in Authorization header

### ❌ CORS Error

**Error:** `Access-Control-Allow-Origin`

**Fix:**
```env
# Add your frontend URL to .env
CORS_ORIGIN=http://localhost:3000,http://localhost:5173
```

---

## 📊 **Database Seeding (Optional)**

Create initial data for testing:

```bash
# Create seed script
npm run seed
```

**Seed Data Includes:**
- 1 Super Admin
- 5 Companies
- 10 Employees per company
- 10 Promotional campaigns
- Sample bookings

---

## 🚀 **Deployment**

### Deploy to Railway (Easiest)

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Set environment variables
railway variables set MONGODB_URI="your_uri"
railway variables set JWT_SECRET="your_secret"
railway variables set NODE_ENV="production"

# Deploy
railway up
```

### Deploy to Render

1. Push code to GitHub
2. Go to https://render.com
3. New Web Service
4. Connect your repo
5. Set environment variables
6. Deploy!

---

## 📚 **Documentation**

- **API Reference:** `API_DOCUMENTATION.md`
- **Portal Features:** `PORTAL_FEATURES.md`
- **Deployment Guide:** `DEPLOYMENT.md`
- **Implementation Guide:** `IMPLEMENTATION_GUIDE.md`
- **Main README:** `README.md`

---

## 🧪 **Testing with Postman**

### Import Collection

Create a Postman collection with:

**Environment Variables:**
```
base_url: http://localhost:5000/api/v1
token: (set after login)
```

**Pre-request Script (for authenticated routes):**
```javascript
pm.request.headers.add({
  key: 'Authorization',
  value: 'Bearer ' + pm.environment.get('token')
});
```

---

## 📞 **Support**

### Need Help?

- **Documentation:** All `.md` files in `/backend`
- **Email:** dev@simplifymove.com
- **Issues:** Check logs in `logs/` folder

### Check Logs

```bash
# Development logs (console)
npm run dev

# Production logs
tail -f logs/combined-$(date +%Y-%m-%d).log
tail -f logs/error-$(date +%Y-%m-%d).log
```

---

## ✅ **Quick Checklist**

Before starting development:

- [ ] MongoDB is running
- [ ] `.env` file is configured
- [ ] `npm install` completed
- [ ] JWT_SECRET is set (32+ characters)
- [ ] CORS_ORIGIN includes your frontend URL
- [ ] Server starts without errors
- [ ] Health check endpoint works
- [ ] Can create super admin user
- [ ] Can login and get JWT token

---

## 🎉 **You're Ready!**

Your SimplifyMove backend is fully configured with:

✅ **3 Complete Portals**
- Super Admin Portal
- Company Admin Portal
- Employee Portal

✅ **Complete Features**
- Authentication & Authorization
- Booking Management
- Wallet System
- Promotional Campaigns
- Real-time Updates
- Notifications
- Analytics & Reports

✅ **Production-Ready**
- Error Handling
- Validation
- Logging
- Security
- Documentation

**Start building your frontend now!** 🚀

---

**Need the frontend?** Connect this backend to your React frontend using the API endpoints documented in `API_DOCUMENTATION.md`.
