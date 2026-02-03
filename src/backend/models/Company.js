/**
 * Company Model
 * Manages company/organization details
 */

const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
    unique: true,
    maxlength: [200, 'Company name cannot exceed 200 characters']
  },
  companyId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^[6-9]\d{9}$/, 'Please provide a valid Indian mobile number']
  },
  alternatePhone: String,

  // Company Details
  industry: {
    type: String,
    required: [true, 'Industry is required'],
    enum: [
      'Technology', 'Healthcare', 'Finance', 'Education', 'Retail',
      'Manufacturing', 'Logistics', 'Real Estate', 'Consulting',
      'Marketing', 'Construction', 'Hospitality', 'Other'
    ]
  },
  companySize: {
    type: String,
    enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'],
    required: [true, 'Company size is required']
  },
  website: {
    type: String,
    match: [/^https?:\/\/.+/, 'Please provide a valid URL']
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },

  // Registration Details
  registrationNumber: {
    type: String,
    unique: true,
    sparse: true
  },
  gstNumber: {
    type: String,
    unique: true,
    sparse: true,
    match: [/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, 'Invalid GST number']
  },
  panNumber: {
    type: String,
    unique: true,
    sparse: true,
    uppercase: true,
    match: [/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN number']
  },

  // Address
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { 
      type: String, 
      required: true,
      match: [/^[1-9][0-9]{5}$/, 'Invalid pincode']
    },
    country: { type: String, default: 'India' }
  },

  // Billing Address (if different)
  billingAddress: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    country: { type: String, default: 'India' }
  },

  // Logo & Branding
  logo: {
    type: String,
    default: null
  },
  brandColor: {
    type: String,
    default: '#000035'
  },

  // Admin Contact
  adminContact: {
    name: { type: String, required: true },
    email: { 
      type: String, 
      required: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    phone: { 
      type: String, 
      required: true,
      match: [/^[6-9]\d{9}$/, 'Please provide a valid mobile number']
    },
    designation: String
  },

  // Subscription & Billing
  subscription: {
    plan: {
      type: String,
      enum: ['trial', 'basic', 'premium', 'enterprise'],
      default: 'trial'
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'suspended', 'cancelled'],
      default: 'active'
    },
    startDate: {
      type: Date,
      default: Date.now
    },
    endDate: Date,
    billingCycle: {
      type: String,
      enum: ['monthly', 'quarterly', 'annually'],
      default: 'monthly'
    },
    amount: {
      type: Number,
      default: 0
    }
  },

  // Wallet Configuration
  wallet: {
    enabled: {
      type: Boolean,
      default: true
    },
    balance: {
      type: Number,
      default: 0,
      min: 0
    },
    creditLimit: {
      type: Number,
      default: 0,
      min: 0
    },
    minimumBalance: {
      type: Number,
      default: 0
    },
    autoRecharge: {
      enabled: { type: Boolean, default: false },
      threshold: { type: Number, default: 1000 },
      amount: { type: Number, default: 5000 }
    }
  },

  // Booking Configuration
  bookingSettings: {
    requiresApproval: {
      type: Boolean,
      default: false
    },
    approvalThreshold: {
      type: Number,
      default: 5000 // Amount in INR above which approval is required
    },
    approvers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    allowedServices: {
      travel: {
        flight: { type: Boolean, default: true },
        hotel: { type: Boolean, default: true },
        cab: { type: Boolean, default: true },
        bus: { type: Boolean, default: true },
        bike: { type: Boolean, default: true },
        twoWheeler: { type: Boolean, default: true }
      },
      logistics: {
        bike: { type: Boolean, default: true },
        threeWheeler: { type: Boolean, default: true },
        miniTruck: { type: Boolean, default: true },
        mediumTruck: { type: Boolean, default: true },
        dcm: { type: Boolean, default: true },
        container: { type: Boolean, default: true }
      },
      courier: {
        enabled: { type: Boolean, default: true }
      }
    },
    bookingLimits: {
      daily: { type: Number, default: null },
      weekly: { type: Number, default: null },
      monthly: { type: Number, default: null }
    },
    advanceBookingDays: {
      type: Number,
      default: 90 // Can book up to 90 days in advance
    }
  },

  // Employee Limits
  employeeLimit: {
    type: Number,
    default: null // null = unlimited
  },
  currentEmployeeCount: {
    type: Number,
    default: 0
  },

  // Status
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended', 'deleted'],
    default: 'active'
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },

  // Documents
  documents: [{
    type: {
      type: String,
      enum: ['registration', 'gst', 'pan', 'agreement', 'other'],
      required: true
    },
    name: String,
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],

  // Payment Methods
  paymentMethods: [{
    type: {
      type: String,
      enum: ['wallet', 'card', 'netbanking', 'upi'],
      required: true
    },
    isDefault: {
      type: Boolean,
      default: false
    },
    details: {
      type: Map,
      of: String
    }
  }],

  // Notifications
  notificationSettings: {
    email: {
      bookingConfirmation: { type: Boolean, default: true },
      bookingCancellation: { type: Boolean, default: true },
      lowWalletBalance: { type: Boolean, default: true },
      monthlyReport: { type: Boolean, default: true }
    },
    sms: {
      bookingConfirmation: { type: Boolean, default: false },
      lowWalletBalance: { type: Boolean, default: false }
    }
  },

  // Analytics
  totalBookings: {
    type: Number,
    default: 0
  },
  totalSpent: {
    type: Number,
    default: 0
  },

  // Metadata
  notes: String,
  tags: [String],
  metadata: {
    type: Map,
    of: String,
    default: {}
  },

  // Audit
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  lastModifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
companySchema.index({ companyId: 1 });
companySchema.index({ email: 1 });
companySchema.index({ status: 1 });
companySchema.index({ 'subscription.status': 1 });
companySchema.index({ industry: 1 });

// Virtual for full address
companySchema.virtual('fullAddress').get(function() {
  if (!this.address) return null;
  const { street, city, state, pincode, country } = this.address;
  return `${street}, ${city}, ${state} - ${pincode}, ${country}`;
});

// Virtual for employees
companySchema.virtual('employees', {
  ref: 'User',
  localField: '_id',
  foreignField: 'company'
});

// Virtual for bookings
companySchema.virtual('bookings', {
  ref: 'Booking',
  localField: '_id',
  foreignField: 'company'
});

// Pre-save middleware to generate companyId
companySchema.pre('save', async function(next) {
  if (this.isNew && !this.companyId) {
    const prefix = 'COMP';
    const count = await this.constructor.countDocuments();
    this.companyId = `${prefix}-${String(count + 1).padStart(3, '0')}`;
  }
  next();
});

// Method to check if company can add more employees
companySchema.methods.canAddEmployee = function() {
  if (!this.employeeLimit) return true; // Unlimited
  return this.currentEmployeeCount < this.employeeLimit;
};

// Method to check if service is allowed
companySchema.methods.isServiceAllowed = function(category, service) {
  if (!this.bookingSettings.allowedServices[category]) return false;
  return this.bookingSettings.allowedServices[category][service] === true;
};

// Method to check wallet balance
companySchema.methods.hasInsufficientBalance = function(amount) {
  return this.wallet.enabled && (this.wallet.balance < amount);
};

// Static method to get active companies
companySchema.statics.getActiveCompanies = function() {
  return this.find({ 
    status: 'active',
    'subscription.status': 'active'
  });
};

const Company = mongoose.model('Company', companySchema);

module.exports = Company;
