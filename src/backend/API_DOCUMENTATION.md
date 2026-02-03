# SimplifyMove API Documentation

Complete API reference for SimplifyMove Backend

**Base URL:** `http://localhost:5000/api/v1`  
**Production URL:** `https://api.simplifymove.com/api/v1`

---

## 📋 Table of Contents

1. [Authentication](#authentication)
2. [Companies](#companies)
3. [Promotional Campaigns](#promotional-campaigns)
4. [Bookings](#bookings)
5. [Users](#users)
6. [Wallets](#wallets)
7. [Vehicles & Drivers](#vehicles--drivers)
8. [Couriers](#couriers)
9. [Analytics](#analytics)
10. [Notifications](#notifications)

---

## 🔐 Authentication

All authenticated endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### Register New User

```http
POST /auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@company.com",
  "phone": "9876543210",
  "password": "SecurePass@123",
  "role": "employee",
  "company": "company_id_here"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": { },
    "token": "jwt_token_here"
  }
}
```

### Login

```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "john@company.com",
  "password": "SecurePass@123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@company.com",
      "role": "employee",
      "company": { }
    },
    "token": "jwt_token_here",
    "refreshToken": "refresh_token_here"
  }
}
```

### Get Current User

```http
GET /auth/me
```

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@company.com",
    "role": "employee",
    "company": { },
    "wallet": { }
  }
}
```

### Forgot Password

```http
POST /auth/forgot-password
```

**Request Body:**
```json
{
  "email": "john@company.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset email sent"
}
```

---

## 🏢 Companies

### Create Company (Super Admin Only)

```http
POST /companies
```

**Request Body:**
```json
{
  "name": "Tech Innovations Ltd",
  "email": "contact@techinnovations.com",
  "phone": "9876543210",
  "industry": "Technology",
  "companySize": "51-200",
  "website": "https://techinnovations.com",
  "gstNumber": "22AAAAA0000A1Z5",
  "panNumber": "AAAAA0000A",
  "address": {
    "street": "123 Main Street",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001",
    "country": "India"
  },
  "adminContact": {
    "name": "Admin Name",
    "email": "admin@techinnovations.com",
    "phone": "9876543210",
    "designation": "IT Manager"
  },
  "subscription": {
    "plan": "premium",
    "billingCycle": "monthly"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Company created successfully",
  "data": {
    "_id": "company_id",
    "companyId": "COMP-001",
    "name": "Tech Innovations Ltd",
    "status": "active",
    "wallet": {
      "balance": 0,
      "enabled": true
    }
  }
}
```

### Get All Companies (Super Admin)

```http
GET /companies?page=1&limit=20&status=active&industry=Technology
```

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 20)
- `status` (active, inactive, suspended)
- `industry`
- `search` (search by name, email, companyId)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "company_id",
      "companyId": "COMP-001",
      "name": "Tech Innovations Ltd",
      "email": "contact@techinnovations.com",
      "status": "active",
      "subscription": { },
      "currentEmployeeCount": 45
    }
  ],
  "pagination": {
    "total": 100,
    "page": 1,
    "pages": 5,
    "limit": 20
  }
}
```

### Get Company by ID

```http
GET /companies/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "company_id",
    "companyId": "COMP-001",
    "name": "Tech Innovations Ltd",
    "email": "contact@techinnovations.com",
    "phone": "9876543210",
    "address": { },
    "wallet": {
      "balance": 50000,
      "creditLimit": 100000
    },
    "bookingSettings": { },
    "currentEmployeeCount": 45
  }
}
```

### Update Company

```http
PUT /companies/:id
```

**Request Body:** (any company fields to update)

### Get Company Employees

```http
GET /companies/:id/employees?page=1&limit=20
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@company.com",
      "role": "employee",
      "department": "IT",
      "status": "active"
    }
  ]
}
```

### Recharge Company Wallet

```http
POST /companies/:id/wallet/recharge
```

**Request Body:**
```json
{
  "amount": 10000,
  "paymentMethod": "razorpay",
  "transactionId": "pay_xxx"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Wallet recharged successfully",
  "data": {
    "balance": 60000,
    "transaction": { }
  }
}
```

---

## 🎯 Promotional Campaigns

### Create Campaign (Super Admin)

```http
POST /promos
```

**Request Body:**
```json
{
  "name": "New Year Travel Bonanza",
  "code": "NEWYEAR2025",
  "description": "Get 20% off on all flight and hotel bookings",
  "discountType": "percentage",
  "discountValue": 20,
  "maxDiscount": 5000,
  "minBookingAmount": 10000,
  "applicableServices": ["Flight", "Hotel"],
  "applicableCompanies": ["company_id_1", "company_id_2"],
  "startDate": "2025-01-01",
  "endDate": "2025-01-31",
  "usageLimit": 1000,
  "perUserLimit": 1,
  "termsAndConditions": "Valid only for bookings above ₹10,000",
  "campaignType": "seasonal",
  "priority": 10,
  "autoApply": false
}
```

**Response:**
```json
{
  "success": true,
  "message": "Promotional campaign created successfully",
  "data": {
    "_id": "campaign_id",
    "code": "NEWYEAR2025",
    "name": "New Year Travel Bonanza",
    "status": "active",
    "usageCount": 0,
    "remainingUses": 1000
  }
}
```

### Get All Campaigns

```http
GET /promos?status=active&company=company_id&service=Flight
```

**Query Parameters:**
- `status` (active, inactive, scheduled, expired)
- `company` (filter by company ID)
- `service` (filter by service type)
- `page`, `limit`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "campaign_id",
      "code": "NEWYEAR2025",
      "name": "New Year Travel Bonanza",
      "discountType": "percentage",
      "discountValue": 20,
      "status": "active",
      "usageCount": 342,
      "usageLimit": 1000,
      "applicableCompanies": [
        {
          "_id": "company_id",
          "name": "Tech Innovations Ltd"
        }
      ]
    }
  ]
}
```

### Get Campaign by ID

```http
GET /promos/:id
```

### Update Campaign (Super Admin)

```http
PUT /promos/:id
```

**Request Body:** (fields to update)

### Delete Campaign (Super Admin)

```http
DELETE /promos/:id
```

**Note:** Cannot delete campaigns that have been used. Consider deactivating instead.

### Toggle Campaign Status

```http
PATCH /promos/:id/toggle-status
```

**Response:**
```json
{
  "success": true,
  "message": "Campaign activated successfully",
  "data": {
    "_id": "campaign_id",
    "status": "active"
  }
}
```

### Validate Promo Code

```http
POST /promos/validate
```

**Request Body:**
```json
{
  "code": "NEWYEAR2025",
  "bookingAmount": 15000,
  "serviceType": "Flight",
  "companyId": "company_id"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Promo code is valid",
  "data": {
    "campaign": {
      "code": "NEWYEAR2025",
      "name": "New Year Travel Bonanza",
      "discountType": "percentage",
      "discountValue": 20
    },
    "discount": {
      "amount": 3000,
      "originalAmount": 15000,
      "finalAmount": 12000,
      "savings": 3000,
      "isCashback": false
    }
  }
}
```

### Get Campaign Analytics

```http
GET /promos/:id/analytics
```

**Response:**
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalUsage": 342,
      "usageLimit": 1000,
      "usagePercentage": 34.2,
      "remainingUses": 658,
      "totalSavings": 1026000,
      "uniqueUsers": 298
    },
    "topUsers": [
      {
        "user": { },
        "usageCount": 1,
        "totalSavings": 3000
      }
    ],
    "dateRange": {
      "startDate": "2025-01-01",
      "endDate": "2025-01-31",
      "daysRemaining": 15
    }
  }
}
```

### Duplicate Campaign

```http
POST /promos/:id/duplicate
```

**Response:**
```json
{
  "success": true,
  "message": "Campaign duplicated successfully",
  "data": {
    "_id": "new_campaign_id",
    "name": "New Year Travel Bonanza (Copy)",
    "code": "NEWYEAR2025_COPY_1706227200000",
    "status": "inactive"
  }
}
```

### Get Campaign Statistics

```http
GET /promos/statistics
```

**Response:**
```json
{
  "success": true,
  "data": {
    "campaigns": {
      "total": 25,
      "active": 10,
      "scheduled": 5,
      "expired": 8,
      "inactive": 2
    },
    "usage": {
      "totalUsage": 15234,
      "totalSavings": 45702000,
      "avgUsageRate": 62.5
    }
  }
}
```

---

## 📦 Bookings

### Create Booking

```http
POST /bookings
```

**Request Body:**
```json
{
  "serviceType": "Cab",
  "serviceCategory": "travel",
  "pickupLocation": {
    "address": "Mumbai Airport",
    "lat": 19.0896,
    "lng": 72.8656
  },
  "dropLocation": {
    "address": "Andheri West",
    "lat": 19.1334,
    "lng": 72.8397
  },
  "bookingDate": "2025-01-26T10:00:00Z",
  "passengers": 2,
  "estimatedAmount": 500,
  "promoCode": "NEWYEAR2025",
  "paymentMethod": "wallet"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Booking created successfully",
  "data": {
    "_id": "booking_id",
    "bookingId": "BK-001",
    "status": "pending_approval",
    "totalAmount": 400,
    "discount": 100,
    "requiresApproval": true
  }
}
```

### Get All Bookings

```http
GET /bookings?status=confirmed&page=1&limit=20
```

### Get Booking by ID

```http
GET /bookings/:id
```

### Cancel Booking

```http
PATCH /bookings/:id/cancel
```

**Request Body:**
```json
{
  "reason": "Plans changed"
}
```

### Approve Booking (Company Admin)

```http
PATCH /bookings/:id/approve
```

### Reject Booking (Company Admin)

```http
PATCH /bookings/:id/reject
```

**Request Body:**
```json
{
  "reason": "Budget exceeded"
}
```

---

## 📊 Analytics

### Get Dashboard Statistics

```http
GET /analytics/dashboard
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalBookings": 1500,
    "totalRevenue": 4500000,
    "activeUsers": 450,
    "activeCampaigns": 10,
    "recentBookings": [ ],
    "topCompanies": [ ]
  }
}
```

### Get Booking Analytics

```http
GET /analytics/bookings?startDate=2025-01-01&endDate=2025-01-31
```

### Get Revenue Analytics

```http
GET /analytics/revenue?period=monthly
```

### Export Report

```http
POST /analytics/export
```

**Request Body:**
```json
{
  "reportType": "bookings",
  "format": "excel",
  "startDate": "2025-01-01",
  "endDate": "2025-01-31",
  "filters": { }
}
```

---

## 💰 Wallets

### Get Wallet

```http
GET /wallets/:userId
```

**Response:**
```json
{
  "success": true,
  "data": {
    "balance": 5000,
    "creditLimit": 0,
    "transactions": [
      {
        "type": "debit",
        "amount": 500,
        "description": "Booking payment",
        "date": "2025-01-26"
      }
    ]
  }
}
```

### Recharge Wallet

```http
POST /wallets/:userId/recharge
```

**Request Body:**
```json
{
  "amount": 5000,
  "paymentMethod": "razorpay",
  "transactionId": "pay_xxx"
}
```

### Get Transactions

```http
GET /wallets/:userId/transactions?page=1&limit=50
```

---

## 🚗 Vehicles & Drivers

### Create Vehicle

```http
POST /vehicles
```

### Get All Vehicles

```http
GET /vehicles?type=cab&status=available
```

### Create Driver

```http
POST /drivers
```

### Get All Drivers

```http
GET /drivers?status=active
```

---

## 📧 Notifications

### Get Notifications

```http
GET /notifications?page=1&limit=20&unread=true
```

### Mark as Read

```http
PATCH /notifications/:id/read
```

### Mark All as Read

```http
PATCH /notifications/read-all
```

---

## ⚠️ Error Responses

### 400 Bad Request
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

### 401 Unauthorized
```json
{
  "success": false,
  "status": "fail",
  "message": "Not authorized to access this route"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "status": "fail",
  "message": "Role 'employee' is not authorized to access this route"
}
```

### 404 Not Found
```json
{
  "success": false,
  "status": "fail",
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "status": "error",
  "message": "Something went wrong. Please try again later."
}
```

---

## 🔑 API Keys & Authentication

For production use:
1. Contact admin to get API credentials
2. Use JWT tokens for all authenticated requests
3. Tokens expire in 7 days (configurable)
4. Refresh tokens available for long-lived sessions

---

## 📞 Support

- **Email:** api@simplifymove.com
- **Documentation:** https://docs.simplifymove.com
- **Status Page:** https://status.simplifymove.com

---

**Last Updated:** January 2025  
**API Version:** v1
