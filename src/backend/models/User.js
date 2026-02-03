/**
 * User Model
 * Supports: Super Admin, Company Admin, Employee Users
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^[6-9]\d{9}$/, 'Please provide a valid Indian mobile number']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false
  },

  // Role & Permissions
  role: {
    type: String,
    enum: ['super_admin', 'company_admin', 'employee', 'driver'],
    default: 'employee'
  },
  permissions: [{
    type: String,
    enum: [
      'view_bookings', 'create_bookings', 'edit_bookings', 'delete_bookings',
      'view_users', 'create_users', 'edit_users', 'delete_users',
      'view_wallet', 'manage_wallet',
      'view_reports', 'export_reports',
      'manage_company_settings',
      'approve_bookings', 'reject_bookings',
      'manage_vehicles', 'manage_drivers',
      'view_analytics', 'manage_promos'
    ]
  }],

  // Company Reference (null for super admin)
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    default: null
  },

  // Department & Designation
  department: {
    type: String,
    trim: true
  },
  designation: {
    type: String,
    trim: true
  },
  employeeId: {
    type: String,
    trim: true,
    unique: true,
    sparse: true
  },

  // Profile Information
  avatar: {
    type: String,
    default: null
  },
  dateOfBirth: Date,
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    default: null
  },
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    country: { type: String, default: 'India' }
  },

  // Employment Details
  joiningDate: {
    type: Date,
    default: Date.now
  },
  reportingManager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },

  // Account Status
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended', 'blocked'],
    default: 'active'
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  phoneVerified: {
    type: Boolean,
    default: false
  },

  // Wallet Reference
  wallet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Wallet',
    default: null
  },

  // Booking Approval Settings (for employees)
  requiresApproval: {
    type: Boolean,
    default: false
  },
  approvalLimit: {
    type: Number,
    default: 0, // INR amount above which approval is needed
    min: 0
  },

  // Security
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  twoFactorEnabled: {
    type: Boolean,
    default: false
  },
  twoFactorSecret: String,

  // Login Tracking
  lastLogin: Date,
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: Date,

  // Preferences
  preferences: {
    language: { type: String, default: 'en' },
    timezone: { type: String, default: 'Asia/Kolkata' },
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: true },
      push: { type: Boolean, default: true }
    },
    currency: { type: String, default: 'INR' }
  },

  // Metadata
  metadata: {
    type: Map,
    of: String,
    default: {}
  }

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ phone: 1 });
userSchema.index({ company: 1, role: 1 });
userSchema.index({ status: 1 });
userSchema.index({ employeeId: 1 });

// Virtual for full address
userSchema.virtual('fullAddress').get(function() {
  if (!this.address) return null;
  const { street, city, state, pincode, country } = this.address;
  return `${street}, ${city}, ${state} - ${pincode}, ${country}`.trim();
});

// Virtual for bookings
userSchema.virtual('bookings', {
  ref: 'Booking',
  localField: '_id',
  foreignField: 'user'
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Pre-save middleware to update passwordChangedAt
userSchema.pre('save', function(next) {
  if (!this.isModified('password') || this.isNew) return next();
  
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// Instance method to check if password is correct
userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Instance method to check if password was changed after token was issued
userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

// Instance method to check if account is locked
userSchema.methods.isLocked = function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
};

// Instance method to increment login attempts
userSchema.methods.incLoginAttempts = function() {
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $set: { loginAttempts: 1 },
      $unset: { lockUntil: 1 }
    });
  }

  const updates = { $inc: { loginAttempts: 1 } };
  const maxAttempts = 5;
  const lockTime = 2 * 60 * 60 * 1000; // 2 hours

  if (this.loginAttempts + 1 >= maxAttempts && !this.isLocked()) {
    updates.$set = { lockUntil: Date.now() + lockTime };
  }

  return this.updateOne(updates);
};

// Static method to get users by role
userSchema.statics.getUsersByRole = function(role) {
  return this.find({ role, status: 'active' });
};

// Static method to get company employees
userSchema.statics.getCompanyEmployees = function(companyId) {
  return this.find({ 
    company: companyId, 
    role: { $in: ['company_admin', 'employee'] },
    status: 'active'
  });
};

const User = mongoose.model('User', userSchema);

module.exports = User;
