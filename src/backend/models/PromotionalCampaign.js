/**
 * Promotional Campaign Model
 * Company-wise promotional campaigns and discount codes
 */

const mongoose = require('mongoose');

const promotionalCampaignSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: [true, 'Campaign name is required'],
    trim: true,
    maxlength: [200, 'Name cannot exceed 200 characters']
  },
  code: {
    type: String,
    required: [true, 'Promo code is required'],
    unique: true,
    uppercase: true,
    trim: true,
    match: [/^[A-Z0-9_-]+$/, 'Promo code can only contain letters, numbers, underscores and hyphens']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },

  // Discount Configuration
  discountType: {
    type: String,
    required: [true, 'Discount type is required'],
    enum: ['percentage', 'flat', 'cashback']
  },
  discountValue: {
    type: Number,
    required: [true, 'Discount value is required'],
    min: [0, 'Discount value must be positive']
  },
  maxDiscount: {
    type: Number,
    min: 0,
    default: null // For percentage discounts, cap the maximum discount amount
  },
  minBookingAmount: {
    type: Number,
    required: [true, 'Minimum booking amount is required'],
    min: 0,
    default: 0
  },

  // Applicable Services
  applicableServices: [{
    type: String,
    enum: [
      'Flight', 'Hotel', 'Cab', 'Bus', 'Bike', 'Two Wheeler',
      'Bike Logistics', '3 Wheeler Auto', 'Mini Truck', 'Medium Truck',
      'DCM', 'Container', 'Courier', 'All Services'
    ],
    required: true
  }],

  // Company-wise Application
  applicableCompanies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  }],

  // Validity Period
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  },

  // Usage Limits
  usageLimit: {
    type: Number,
    required: [true, 'Usage limit is required'],
    min: 1,
    default: 1000
  },
  usageCount: {
    type: Number,
    default: 0,
    min: 0
  },
  perUserLimit: {
    type: Number,
    default: 1,
    min: 1,
    max: 100
  },

  // User-specific usage tracking
  usedBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    usageCount: {
      type: Number,
      default: 1
    },
    lastUsed: {
      type: Date,
      default: Date.now
    },
    totalSavings: {
      type: Number,
      default: 0
    }
  }],

  // Status
  status: {
    type: String,
    enum: ['active', 'inactive', 'scheduled', 'expired'],
    default: 'scheduled'
  },

  // Terms & Conditions
  termsAndConditions: {
    type: String,
    maxlength: [5000, 'Terms cannot exceed 5000 characters']
  },

  // Additional Conditions
  conditions: {
    daysOfWeek: [{
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    }],
    timeRange: {
      startTime: String, // Format: "HH:MM"
      endTime: String    // Format: "HH:MM"
    },
    firstBookingOnly: {
      type: Boolean,
      default: false
    },
    specificRoutes: [{
      from: String,
      to: String
    }],
    excludedDates: [Date],
    minAdvanceBookingHours: {
      type: Number,
      default: 0
    }
  },

  // Stacking & Combination Rules
  stackable: {
    type: Boolean,
    default: false // Can be combined with other promos
  },
  excludedPromoCodes: [{
    type: String,
    uppercase: true
  }],

  // Priority (for auto-apply logic)
  priority: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  autoApply: {
    type: Boolean,
    default: false
  },

  // Analytics
  totalSavings: {
    type: Number,
    default: 0
  },
  totalRevenue: {
    type: Number,
    default: 0
  },
  conversionRate: {
    type: Number,
    default: 0
  },

  // Visibility
  isVisible: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },

  // Metadata
  campaignType: {
    type: String,
    enum: ['seasonal', 'festival', 'corporate', 'promotional', 'loyalty', 'referral', 'other'],
    default: 'promotional'
  },
  tags: [String],
  notes: String,

  // Audit Fields
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
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
promotionalCampaignSchema.index({ code: 1 });
promotionalCampaignSchema.index({ status: 1 });
promotionalCampaignSchema.index({ applicableCompanies: 1 });
promotionalCampaignSchema.index({ startDate: 1, endDate: 1 });
promotionalCampaignSchema.index({ 'usedBy.user': 1 });

// Virtual for usage percentage
promotionalCampaignSchema.virtual('usagePercentage').get(function() {
  if (this.usageLimit === 0) return 0;
  return (this.usageCount / this.usageLimit) * 100;
});

// Virtual for remaining uses
promotionalCampaignSchema.virtual('remainingUses').get(function() {
  return Math.max(0, this.usageLimit - this.usageCount);
});

// Virtual for is active
promotionalCampaignSchema.virtual('isActive').get(function() {
  const now = new Date();
  return (
    this.status === 'active' &&
    now >= this.startDate &&
    now <= this.endDate &&
    this.usageCount < this.usageLimit
  );
});

// Middleware to update status based on dates
promotionalCampaignSchema.pre('save', function(next) {
  const now = new Date();
  
  if (now < this.startDate) {
    this.status = 'scheduled';
  } else if (now > this.endDate) {
    this.status = 'expired';
  } else if (this.usageCount >= this.usageLimit) {
    this.status = 'expired';
  } else if (this.status === 'scheduled') {
    this.status = 'active';
  }
  
  next();
});

// Method to validate if promo can be applied to booking
promotionalCampaignSchema.methods.canApplyToBooking = function(booking, user) {
  const now = new Date();
  
  // Check if campaign is active
  if (this.status !== 'active') return { valid: false, reason: 'Campaign is not active' };
  
  // Check date validity
  if (now < this.startDate || now > this.endDate) {
    return { valid: false, reason: 'Campaign is not valid for this date' };
  }
  
  // Check usage limit
  if (this.usageCount >= this.usageLimit) {
    return { valid: false, reason: 'Campaign usage limit reached' };
  }
  
  // Check minimum booking amount
  if (booking.totalAmount < this.minBookingAmount) {
    return { 
      valid: false, 
      reason: `Minimum booking amount is ₹${this.minBookingAmount}` 
    };
  }
  
  // Check applicable services
  if (!this.applicableServices.includes('All Services') && 
      !this.applicableServices.includes(booking.serviceType)) {
    return { valid: false, reason: 'Campaign not applicable for this service' };
  }
  
  // Check applicable companies
  if (!this.applicableCompanies.includes(booking.company)) {
    return { valid: false, reason: 'Campaign not applicable for your company' };
  }
  
  // Check per-user limit
  const userUsage = this.usedBy.find(u => u.user.toString() === user._id.toString());
  if (userUsage && userUsage.usageCount >= this.perUserLimit) {
    return { valid: false, reason: 'You have reached the usage limit for this campaign' };
  }
  
  // Check first booking only condition
  if (this.conditions.firstBookingOnly && booking.isFirstBooking === false) {
    return { valid: false, reason: 'Campaign is only valid for first booking' };
  }
  
  // Check days of week
  if (this.conditions.daysOfWeek && this.conditions.daysOfWeek.length > 0) {
    const bookingDay = new Date(booking.bookingDate).toLocaleLowerCase('en-US', { weekday: 'long' });
    if (!this.conditions.daysOfWeek.includes(bookingDay)) {
      return { valid: false, reason: 'Campaign not valid for this day of week' };
    }
  }
  
  return { valid: true };
};

// Method to calculate discount amount
promotionalCampaignSchema.methods.calculateDiscount = function(bookingAmount) {
  let discount = 0;
  
  switch (this.discountType) {
    case 'percentage':
      discount = (bookingAmount * this.discountValue) / 100;
      if (this.maxDiscount && discount > this.maxDiscount) {
        discount = this.maxDiscount;
      }
      break;
    case 'flat':
      discount = this.discountValue;
      break;
    case 'cashback':
      discount = (bookingAmount * this.discountValue) / 100;
      if (this.maxDiscount && discount > this.maxDiscount) {
        discount = this.maxDiscount;
      }
      break;
  }
  
  return Math.min(discount, bookingAmount);
};

// Method to record usage
promotionalCampaignSchema.methods.recordUsage = async function(userId, savingsAmount) {
  this.usageCount += 1;
  this.totalSavings += savingsAmount;
  
  const userIndex = this.usedBy.findIndex(u => u.user.toString() === userId.toString());
  
  if (userIndex >= 0) {
    this.usedBy[userIndex].usageCount += 1;
    this.usedBy[userIndex].lastUsed = Date.now();
    this.usedBy[userIndex].totalSavings += savingsAmount;
  } else {
    this.usedBy.push({
      user: userId,
      usageCount: 1,
      lastUsed: Date.now(),
      totalSavings: savingsAmount
    });
  }
  
  return await this.save();
};

// Static method to get active campaigns for company
promotionalCampaignSchema.statics.getActiveCampaignsForCompany = function(companyId) {
  const now = new Date();
  
  return this.find({
    status: 'active',
    applicableCompanies: companyId,
    startDate: { $lte: now },
    endDate: { $gte: now },
    $expr: { $lt: ['$usageCount', '$usageLimit'] }
  }).sort({ priority: -1, createdAt: -1 });
};

// Static method to get campaigns by service type
promotionalCampaignSchema.statics.getCampaignsByService = function(serviceType, companyId) {
  const now = new Date();
  
  return this.find({
    status: 'active',
    applicableCompanies: companyId,
    $or: [
      { applicableServices: 'All Services' },
      { applicableServices: serviceType }
    ],
    startDate: { $lte: now },
    endDate: { $gte: now },
    $expr: { $lt: ['$usageCount', '$usageLimit'] }
  }).sort({ priority: -1 });
};

const PromotionalCampaign = mongoose.model('PromotionalCampaign', promotionalCampaignSchema);

module.exports = PromotionalCampaign;
