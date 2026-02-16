/**
 * Models - Module Pattern with Lazy Initialization
 */

const sequelize = require('../config/database');
const { registerModels } = require('./registry');

const registry = {
  initialized: false,
  models: {}
};

const initializeModels = (sequelizeInstance) => {
  if (registry.initialized) return registry.models;

  const instanceToUse = sequelizeInstance || sequelize;

  const { DataTypes } = require('sequelize');
  const bcrypt = require('bcryptjs');

  // User Model
  const User = instanceToUse.define('User', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    phone: { type: DataTypes.STRING(15), allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.ENUM('super_admin', 'company_admin', 'employee', 'driver'), defaultValue: 'employee' },
    permissions: { type: DataTypes.JSON, defaultValue: [] },
    companyId: { type: DataTypes.UUID },
    department: { type: DataTypes.STRING },
    designation: { type: DataTypes.STRING },
    employeeId: { type: DataTypes.STRING, unique: true },
    avatar: { type: DataTypes.STRING },
    dateOfBirth: { type: DataTypes.DATE },
    gender: { type: DataTypes.ENUM('male', 'female', 'other') },
    street: { type: DataTypes.STRING },
    city: { type: DataTypes.STRING },
    state: { type: DataTypes.STRING },
    pincode: { type: DataTypes.STRING(10) },
    country: { type: DataTypes.STRING, defaultValue: 'India' },
    joiningDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    reportingManagerId: { type: DataTypes.UUID },
    status: { type: DataTypes.ENUM('active', 'inactive', 'suspended', 'blocked'), defaultValue: 'active' },
    emailVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
    phoneVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
    requiresApproval: { type: DataTypes.BOOLEAN, defaultValue: false },
    approvalLimit: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    passwordChangedAt: { type: DataTypes.DATE },
    twoFactorEnabled: { type: DataTypes.BOOLEAN, defaultValue: false },
    lastLogin: { type: DataTypes.DATE },
    loginAttempts: { type: DataTypes.INTEGER, defaultValue: 0 },
    lockUntil: { type: DataTypes.DATE },
    language: { type: DataTypes.STRING, defaultValue: 'en' },
    timezone: { type: DataTypes.STRING, defaultValue: 'Asia/Kolkata' },
    currency: { type: DataTypes.STRING, defaultValue: 'INR' }
  }, { timestamps: true, tableName: 'users' });

  User.beforeCreate(async (user) => { if (user.password) user.password = await bcrypt.hash(user.password, 12); });
  User.beforeUpdate(async (user) => { if (user.changed('password')) { user.password = await bcrypt.hash(user.password, 12); user.passwordChangedAt = new Date(); } });

  // Company Model
  const Company = instanceToUse.define('Company', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING(200), allowNull: false, unique: true },
    companyId: { type: DataTypes.STRING, unique: true },
    email: { type: DataTypes.STRING, unique: true },
    phone: { type: DataTypes.STRING(20) },
    industry: { type: DataTypes.STRING(100) },
    businessCategory: { type: DataTypes.STRING(100), defaultValue: 'General' },
    companySize: { type: DataTypes.ENUM('1-10', '11-50', '51-200', '201-500', '501-1000', '1000+') },
    street: { type: DataTypes.STRING },
    city: { type: DataTypes.STRING },
    state: { type: DataTypes.STRING },
    pincode: { type: DataTypes.STRING(10) },
    country: { type: DataTypes.STRING, defaultValue: 'India' },
    status: { type: DataTypes.ENUM('active', 'inactive', 'suspended', 'deleted'), defaultValue: 'active' },
    totalBookings: { type: DataTypes.INTEGER, defaultValue: 0 },
    totalSpent: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 }
  }, { timestamps: true, tableName: 'companies' });

  // Booking Model
  const Booking = instanceToUse.define('Booking', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    bookingId: { type: DataTypes.STRING, unique: true },
    userId: { type: DataTypes.UUID },
    companyId: { type: DataTypes.UUID },
    serviceCategory: { type: DataTypes.ENUM('travel', 'logistics', 'courier') },
    serviceType: { type: DataTypes.STRING(50) },
    travelDate: { type: DataTypes.DATE },
    returnDate: { type: DataTypes.DATE },
    originCity: { type: DataTypes.STRING },
    destinationCity: { type: DataTypes.STRING },
    passengers: { type: DataTypes.INTEGER, defaultValue: 1 },
    baseAmount: { type: DataTypes.DECIMAL(10, 2) },
    taxAmount: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    discount: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    totalAmount: { type: DataTypes.DECIMAL(10, 2) },
    finalAmount: { type: DataTypes.DECIMAL(10, 2) },
    paymentMethod: { type: DataTypes.ENUM('wallet', 'card', 'netbanking', 'upi', 'cash') },
    paymentStatus: { type: DataTypes.ENUM('pending', 'processing', 'completed', 'failed', 'refunded'), defaultValue: 'pending' },
    status: { type: DataTypes.ENUM('pending_approval', 'approved', 'rejected', 'confirmed', 'in_progress', 'completed', 'cancelled', 'failed'), defaultValue: 'pending_approval' },
    requiresApproval: { type: DataTypes.BOOLEAN, defaultValue: false },
    approvalStatus: { type: DataTypes.ENUM('pending', 'approved', 'rejected'), defaultValue: 'pending' },
    rating: { type: DataTypes.INTEGER },
    review: { type: DataTypes.TEXT }
  }, { timestamps: true, tableName: 'bookings' });

  // Wallet Model
  const Wallet = instanceToUse.define('Wallet', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    ownerId: { type: DataTypes.UUID },
    ownerModel: { type: DataTypes.ENUM('User', 'Company') },
    balance: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
    currency: { type: DataTypes.STRING(3), defaultValue: 'INR' },
    creditLimit: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
    status: { type: DataTypes.ENUM('active', 'suspended', 'blocked', 'closed'), defaultValue: 'active' },
    totalCredited: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
    totalDebited: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 }
  }, { timestamps: true, tableName: 'wallets' });

  // WalletTransaction Model
  const WalletTransaction = instanceToUse.define('WalletTransaction', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    walletId: { type: DataTypes.UUID },
    transactionId: { type: DataTypes.STRING, unique: true },
    type: { type: DataTypes.ENUM('credit', 'debit') },
    amount: { type: DataTypes.DECIMAL(12, 2) },
    balanceBefore: { type: DataTypes.DECIMAL(12, 2) },
    balanceAfter: { type: DataTypes.DECIMAL(12, 2) },
    description: { type: DataTypes.TEXT },
    status: { type: DataTypes.ENUM('pending', 'processing', 'completed', 'failed'), defaultValue: 'completed' }
  }, { timestamps: true, tableName: 'wallet_transactions' });

  // Add instance methods to Wallet model
  Wallet.prototype.credit = async function(amount, description, transactionType, referenceId, metadata) {
    const balanceBefore = parseFloat(this.balance) || 0;
    const balanceAfter = balanceBefore + parseFloat(amount);
    
    // Update wallet balance
    this.balance = balanceAfter;
    this.totalCredited = (parseFloat(this.totalCredited) || 0) + parseFloat(amount);
    await this.save();
    
    // Create transaction record
    const transaction = await WalletTransaction.create({
      walletId: this.id,
      transactionId: referenceId || `TXN-${Date.now()}`,
      type: 'credit',
      amount: parseFloat(amount),
      balanceBefore,
      balanceAfter,
      description,
      status: 'completed',
      metadata: metadata || {}
    });
    
    return transaction;
  };

  Wallet.prototype.debit = async function(amount, description, transactionType, referenceId, metadata) {
    const balanceBefore = parseFloat(this.balance) || 0;
    
    // Check if sufficient funds
    if (balanceBefore < parseFloat(amount)) {
      throw new Error('Insufficient wallet balance');
    }
    
    const balanceAfter = balanceBefore - parseFloat(amount);
    
    // Update wallet balance
    this.balance = balanceAfter;
    this.totalDebited = (parseFloat(this.totalDebited) || 0) + parseFloat(amount);
    await this.save();
    
    // Create transaction record
    const transaction = await WalletTransaction.create({
      walletId: this.id,
      transactionId: referenceId || `TXN-${Date.now()}`,
      type: 'debit',
      amount: parseFloat(amount),
      balanceBefore,
      balanceAfter,
      description,
      status: 'completed',
      metadata: metadata || {}
    });
    
    return transaction;
  };

  // Add static methods to Wallet model
  Wallet.findByOwner = async function(ownerId, ownerModel) {
    return await this.findOne({
      where: {
        ownerId,
        ownerModel
      }
    });
  };

  Wallet.createWallet = async function(ownerId, ownerModel, initialBalance = 0) {
    return await this.create({
      ownerId,
      ownerModel,
      balance: parseFloat(initialBalance),
      status: 'active'
    });
  };

  // Notification Model
  const Notification = instanceToUse.define('Notification', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    recipientId: { type: DataTypes.UUID },
    type: { type: DataTypes.ENUM('booking', 'payment', 'approval', 'system', 'alert') },
    title: { type: DataTypes.STRING(200) },
    message: { type: DataTypes.TEXT },
    isRead: { type: DataTypes.BOOLEAN, defaultValue: false }
  }, { timestamps: true, tableName: 'notifications' });

  // PromotionalCampaign Model
  const PromotionalCampaign = instanceToUse.define('PromotionalCampaign', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    promoCode: { type: DataTypes.STRING(50), unique: true },
    title: { type: DataTypes.STRING(200) },
    discountType: { type: DataTypes.ENUM('percentage', 'flat') },
    discountValue: { type: DataTypes.DECIMAL(10, 2) },
    status: { type: DataTypes.ENUM('active', 'inactive', 'expired'), defaultValue: 'active' }
  }, { timestamps: true, tableName: 'promotional_campaigns' });

  // AuditLog Model
  const AuditLog = instanceToUse.define('AuditLog', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    action: { type: DataTypes.STRING(100), allowNull: false },
    category: { type: DataTypes.ENUM('company', 'user', 'booking', 'payment', 'subscription', 'billing', 'system', 'vendor', 'email'), allowNull: false },
    performedBy: { type: DataTypes.UUID },
    performedByRole: { type: DataTypes.STRING(50) },
    companyId: { type: DataTypes.UUID },
    targetEntity: { type: DataTypes.STRING(100) },
    targetId: { type: DataTypes.STRING(100) },
    details: { type: DataTypes.TEXT },
    changes: { type: DataTypes.JSON, defaultValue: [] },
    ipAddress: { type: DataTypes.STRING(45) },
    userAgent: { type: DataTypes.STRING(500) },
    status: { type: DataTypes.ENUM('success', 'failure'), defaultValue: 'success' },
    severity: { type: DataTypes.ENUM('low', 'medium', 'high', 'critical'), defaultValue: 'medium' }
  }, { timestamps: true, tableName: 'audit_logs' });

  // Vendor Model
  const Vendor = instanceToUse.define('Vendor', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    category: { type: DataTypes.ENUM('payment', 'travel', 'logistics', 'communication', 'analytics', 'other'), allowNull: false },
    description: { type: DataTypes.TEXT },
    status: { type: DataTypes.ENUM('active', 'inactive', 'testing'), defaultValue: 'active' },
    apiEndpoint: { type: DataTypes.STRING(255) },
    apiKey: { type: DataTypes.STRING(500) },
    webhookUrl: { type: DataTypes.STRING(255) },
    connectedCompanies: { type: DataTypes.INTEGER, defaultValue: 0 },
    healthStatus: { type: DataTypes.ENUM('healthy', 'degraded', 'down'), defaultValue: 'healthy' },
    requestsToday: { type: DataTypes.INTEGER, defaultValue: 0 },
    uptime: { type: DataTypes.DECIMAL(5, 2), defaultValue: 100 },
    lastSync: { type: DataTypes.DATE }
  }, { timestamps: true, tableName: 'vendors' });

  // Email Config Model
  const EmailConfig = instanceToUse.define('EmailConfig', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    configName: { type: DataTypes.STRING(255), unique: true, allowNull: false },
    provider: { type: DataTypes.ENUM('smtp', 'sendgrid', 'mailgun', 'aws_ses', 'custom'), defaultValue: 'smtp' },
    smtpHost: { type: DataTypes.STRING(255) },
    smtpPort: { type: DataTypes.INTEGER },
    smtpUsername: { type: DataTypes.STRING(255) },
    smtpPassword: { type: DataTypes.TEXT },
    apiKey: { type: DataTypes.TEXT },
    fromEmail: { type: DataTypes.STRING(255), allowNull: false },
    fromName: { type: DataTypes.STRING(255) },
    replyTo: { type: DataTypes.STRING(255) },
    isDefault: { type: DataTypes.BOOLEAN, defaultValue: false },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    useTLS: { type: DataTypes.BOOLEAN, defaultValue: true },
    useSSL: { type: DataTypes.BOOLEAN, defaultValue: false },
    testEmailAddress: { type: DataTypes.STRING(255) },
    lastTestedAt: { type: DataTypes.DATE },
    testStatus: { type: DataTypes.ENUM('not_tested', 'success', 'failed'), defaultValue: 'not_tested' },
    testError: { type: DataTypes.TEXT },
    companyId: { type: DataTypes.UUID },
    additionalConfig: { type: DataTypes.JSON },
    rateLimit: { type: DataTypes.INTEGER, defaultValue: 100 },
    rateLimitPeriod: { type: DataTypes.INTEGER, defaultValue: 60 },
    emailsSentToday: { type: DataTypes.INTEGER, defaultValue: 0 },
    emailsSentThisMonth: { type: DataTypes.INTEGER, defaultValue: 0 }
  }, { timestamps: true, tableName: 'email_configs' });

  // Associations
  User.hasMany(Booking, { foreignKey: 'userId' });
  Booking.belongsTo(User, { foreignKey: 'userId' });
  Company.hasMany(Booking, { foreignKey: 'companyId' });
  Booking.belongsTo(Company, { foreignKey: 'companyId' });
  Company.hasMany(User, { foreignKey: 'companyId' });
  User.belongsTo(Company, { foreignKey: 'companyId' });
  Wallet.hasMany(WalletTransaction, { foreignKey: 'walletId' });
  WalletTransaction.belongsTo(Wallet, { foreignKey: 'walletId' });

  const models = { User, Company, Booking, Wallet, WalletTransaction, Notification, PromotionalCampaign, AuditLog, Vendor, EmailConfig };
  registry.models = models;
  registry.initialized = true;

  // Register models in the models/registry module so controllers can access them
  registerModels(models);

  return models;
};

const getModels = () => {
  if (!registry.initialized) throw new Error('Models not initialized');
  return registry.models;
};

// Initialize models on module import for eager loading
try {
  if (!registry.initialized) {
    initializeModels(sequelize);
  }
} catch (error) {
  console.warn('Failed to eagerly initialize models:', error.message);
}

module.exports = { initializeModels, getModels, registry };
