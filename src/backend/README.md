# SimplifyMove Backend API

Complete Node.js + Express backend for SimplifyMove - Multi-Portal Booking & Logistics Platform

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.0.0
- MongoDB >= 6.0
- npm >= 9.0.0

### Installation

```bash
# Clone the repository
cd backend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Update .env with your configuration

# Start development server
npm run dev

# Start production server
npm start
```

## 📁 Project Structure

```
backend/
├── server.js                 # Application entry point
├── package.json             # Dependencies and scripts
├── .env.example            # Environment variables template
│
├── config/                 # Configuration files
│   ├── database.js        # MongoDB connection
│   ├── cloudinary.js      # File upload config
│   └── email.js           # Email configuration
│
├── models/                # Mongoose models
│   ├── User.js           # User schema
│   ├── Company.js        # Company schema
│   ├── Booking.js        # Booking schema
│   ├── Vehicle.js        # Vehicle schema
│   ├── Driver.js         # Driver schema
│   ├── Wallet.js         # Wallet schema
│   ├── PromotionalCampaign.js  # Promo campaigns
│   ├── Courier.js        # Courier schema
│   └── Notification.js   # Notifications
│
├── controllers/          # Route controllers
│   ├── authController.js
│   ├── userController.js
│   ├── companyController.js
│   ├── bookingController.js
│   ├── vehicleController.js
│   ├── driverController.js
│   ├── walletController.js
│   ├── promoController.js
│   ├── courierController.js
│   └── analyticsController.js
│
├── routes/              # API routes
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── companyRoutes.js
│   ├── bookingRoutes.js
│   ├── vehicleRoutes.js
│   ├── driverRoutes.js
│   ├── walletRoutes.js
│   ├── promoRoutes.js
│   ├── courierRoutes.js
│   └── analyticsRoutes.js
│
├── middleware/          # Custom middleware
│   ├── auth.js         # Authentication & authorization
│   ├── errorHandler.js # Error handling
│   ├── upload.js       # File upload
│   └── validate.js     # Request validation
│
├── utils/              # Utility functions
│   ├── logger.js       # Winston logger
│   ├── email.js        # Email sender
│   ├── jwt.js          # JWT utilities
│   ├── payment.js      # Payment gateway
│   └── helpers.js      # Helper functions
│
├── socket/             # Socket.IO handlers
│   ├── socketHandler.js
│   └── events.js
│
├── validators/         # Request validators
│   ├── authValidator.js
│   ├── bookingValidator.js
│   └── companyValidator.js
│
├── scripts/            # Utility scripts
│   ├── seedDatabase.js
│   └── migrate.js
│
└── logs/              # Application logs
    ├── error-*.log
    ├── combined-*.log
    └── http-*.log
```

## 🔐 Authentication

### JWT-based authentication with the following roles:

1. **Super Admin**
   - Complete system access
   - Manage all companies
   - Create promotional campaigns
   - View analytics across all companies

2. **Company Admin**
   - Manage company settings
   - Manage employees
   - View company reports
   - Approve/reject bookings

3. **Employee**
   - Create bookings
   - View own bookings
   - Manage wallet
   - Use promotional codes

4. **Driver**
   - View assigned bookings
   - Update booking status
   - Track earnings

### Authentication Flow

```
POST /api/v1/auth/register    → Register new user
POST /api/v1/auth/login       → Login and get JWT token
POST /api/v1/auth/logout      → Logout
GET  /api/v1/auth/me          → Get current user
PUT  /api/v1/auth/update-password  → Change password
```

## 📡 API Endpoints

### Authentication
```
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/forgot-password
POST   /api/v1/auth/reset-password/:token
POST   /api/v1/auth/verify-email/:token
GET    /api/v1/auth/me
PUT    /api/v1/auth/update-password
PUT    /api/v1/auth/update-profile
```

### Companies
```
POST   /api/v1/companies              (Super Admin)
GET    /api/v1/companies              (Super Admin)
GET    /api/v1/companies/:id          (Super Admin, Company Admin)
PUT    /api/v1/companies/:id          (Super Admin, Company Admin)
DELETE /api/v1/companies/:id          (Super Admin)
PATCH  /api/v1/companies/:id/status   (Super Admin)
GET    /api/v1/companies/:id/employees
POST   /api/v1/companies/:id/employees
GET    /api/v1/companies/:id/wallet
POST   /api/v1/companies/:id/wallet/recharge
GET    /api/v1/companies/:id/bookings
GET    /api/v1/companies/:id/reports
```

### Promotional Campaigns
```
POST   /api/v1/promos                 (Super Admin)
GET    /api/v1/promos                 (Super Admin, Company Admin)
GET    /api/v1/promos/:id             (Super Admin, Company Admin)
PUT    /api/v1/promos/:id             (Super Admin)
DELETE /api/v1/promos/:id             (Super Admin)
PATCH  /api/v1/promos/:id/toggle-status  (Super Admin)
POST   /api/v1/promos/validate        (All authenticated)
GET    /api/v1/promos/:id/analytics   (Super Admin)
POST   /api/v1/promos/:id/duplicate   (Super Admin)
GET    /api/v1/promos/statistics      (Super Admin)
```

### Bookings
```
POST   /api/v1/bookings
GET    /api/v1/bookings
GET    /api/v1/bookings/:id
PUT    /api/v1/bookings/:id
DELETE /api/v1/bookings/:id
PATCH  /api/v1/bookings/:id/cancel
PATCH  /api/v1/bookings/:id/approve
PATCH  /api/v1/bookings/:id/reject
```

### Wallets
```
GET    /api/v1/wallets/:userId
POST   /api/v1/wallets/:userId/recharge
POST   /api/v1/wallets/:userId/deduct
GET    /api/v1/wallets/:userId/transactions
```

### Users
```
GET    /api/v1/users
GET    /api/v1/users/:id
PUT    /api/v1/users/:id
DELETE /api/v1/users/:id
PATCH  /api/v1/users/:id/status
```

### Analytics
```
GET    /api/v1/analytics/dashboard
GET    /api/v1/analytics/bookings
GET    /api/v1/analytics/revenue
GET    /api/v1/analytics/companies
```

## 🔒 Security Features

1. **JWT Authentication** - Secure token-based auth
2. **Password Hashing** - bcryptjs with salt rounds
3. **Rate Limiting** - Prevent brute force attacks
4. **Helmet** - Security headers
5. **CORS** - Cross-origin resource sharing
6. **XSS Protection** - Prevent cross-site scripting
7. **NoSQL Injection Prevention** - express-mongo-sanitize
8. **Account Locking** - Lock after failed login attempts
9. **Token Expiration** - Auto-expire tokens
10. **Input Validation** - express-validator

## 💾 Database Models

### User Schema
- Authentication credentials
- Role-based permissions
- Company association
- Wallet reference
- Profile information
- Login tracking

### Company Schema
- Company details
- Subscription management
- Wallet configuration
- Booking settings
- Employee limits
- Document management

### Promotional Campaign Schema
- Campaign details
- Discount configuration
- Company-wise application
- Service applicability
- Usage tracking
- Conditions & rules

### Booking Schema
- Service details
- User & company references
- Payment information
- Status tracking
- Approval workflow
- Driver assignment

## 🔧 Environment Variables

See `.env.example` for all required environment variables:

- **Server**: PORT, NODE_ENV
- **Database**: MONGODB_URI
- **JWT**: JWT_SECRET, JWT_EXPIRES_IN
- **Email**: EMAIL_HOST, EMAIL_PORT, EMAIL_USER
- **Payment**: RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET
- **Storage**: CLOUDINARY credentials

## 📊 Validation & Error Handling

### Request Validation
- express-validator for input validation
- Custom validation middleware
- Schema-level validation in Mongoose

### Error Handling
- Centralized error handling middleware
- Custom AppError class
- Development vs Production error responses
- Mongoose error handling
- JWT error handling

### Example Error Response
```json
{
  "success": false,
  "status": "fail",
  "message": "Invalid input data",
  "errors": [
    {
      "field": "email",
      "message": "Valid email is required"
    }
  ]
}
```

## 📝 Logging

Winston logger with:
- Console logging (development)
- Daily rotating file logs (production)
- Separate error logs
- HTTP request logs via Morgan
- Automatic log rotation and compression

## 🚦 API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { },
  "pagination": {
    "total": 100,
    "page": 1,
    "pages": 10,
    "limit": 10
  }
}
```

### Error Response
```json
{
  "success": false,
  "status": "fail",
  "message": "Error message",
  "errors": []
}
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 📦 Deployment

### Production Checklist

1. Set `NODE_ENV=production`
2. Configure MongoDB connection string
3. Set secure JWT_SECRET
4. Configure email service
5. Set up payment gateway credentials
6. Configure Cloudinary for file uploads
7. Enable CORS for frontend domain
8. Set up SSL/TLS certificates
9. Configure reverse proxy (nginx)
10. Set up monitoring and logging

### Recommended Platforms
- **Railway** (easiest)
- **Render**
- **AWS EC2 + MongoDB Atlas**
- **DigitalOcean**
- **Heroku**

## 🔌 WebSocket Events

Real-time updates via Socket.IO:

```javascript
// Client connects
socket.emit('join', { userId, role });

// Booking updates
socket.on('booking:created', data);
socket.on('booking:updated', data);
socket.on('booking:cancelled', data);

// Notifications
socket.on('notification', data);

// Wallet updates
socket.on('wallet:updated', data);
```

## 📧 Email Templates

Email notifications for:
- Welcome email
- Email verification
- Password reset
- Booking confirmation
- Booking cancellation
- Wallet low balance alert
- Monthly reports

## 💳 Payment Integration

### Razorpay (Primary - for INR)
```javascript
// Create order
POST /api/v1/payments/create-order

// Verify payment
POST /api/v1/payments/verify

// Webhooks
POST /api/v1/payments/webhook
```

## 📈 Analytics & Reports

- Dashboard statistics
- Booking analytics
- Revenue reports
- Company performance
- User activity tracking
- Export to Excel/PDF

## 🛠️ Development

```bash
# Install dependencies
npm install

# Run development server with auto-reload
npm run dev

# Seed database with sample data
npm run seed

# Run linter
npm run lint
```

## 📞 Support

For issues or questions, contact: support@simplifymove.com

## 📄 License

MIT License - SimplifyMove © 2025
