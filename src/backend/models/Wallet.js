/**
 * Wallet Model
 * Manages user and company wallets
 */

const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  transactionId: {
    type: String,
    unique: true,
    required: true
  },
  type: {
    type: String,
    enum: ['credit', 'debit'],
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  balanceBefore: {
    type: Number,
    required: true
  },
  balanceAfter: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: [
      'recharge', 'refund', 'booking_payment', 'cancellation_refund',
      'cashback', 'bonus', 'adjustment', 'transfer_in', 'transfer_out'
    ],
    required: true
  },
  reference: {
    model: {
      type: String,
      enum: ['Booking', 'User', 'Company', 'PromotionalCampaign']
    },
    id: mongoose.Schema.Types.ObjectId
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'netbanking', 'upi', 'cash', 'wallet', 'razorpay']
  },
  paymentId: String,
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'reversed'],
    default: 'completed'
  },
  metadata: {
    type: Map,
    of: String
  }
}, {
  timestamps: true
});

const walletSchema = new mongoose.Schema({
  // Owner Reference (User or Company)
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'ownerModel'
  },
  ownerModel: {
    type: String,
    required: true,
    enum: ['User', 'Company']
  },

  // Balance
  balance: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  currency: {
    type: String,
    default: 'INR'
  },

  // Credit Limit (for companies)
  creditLimit: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // Available Balance (balance + credit limit)
  availableBalance: {
    type: Number,
    default: 0
  },

  // Auto Recharge Settings
  autoRecharge: {
    enabled: {
      type: Boolean,
      default: false
    },
    threshold: {
      type: Number,
      default: 1000
    },
    rechargeAmount: {
      type: Number,
      default: 5000
    }
  },

  // Wallet Status
  status: {
    type: String,
    enum: ['active', 'suspended', 'blocked', 'closed'],
    default: 'active'
  },

  // Security
  pin: {
    type: String,
    select: false
  },
  pinEnabled: {
    type: Boolean,
    default: false
  },

  // Limits
  dailyLimit: {
    amount: { type: Number, default: 50000 },
    usedToday: { type: Number, default: 0 },
    lastResetDate: Date
  },
  monthlyLimit: {
    amount: { type: Number, default: 500000 },
    usedThisMonth: { type: Number, default: 0 },
    lastResetDate: Date
  },

  // Statistics
  totalCredited: {
    type: Number,
    default: 0
  },
  totalDebited: {
    type: Number,
    default: 0
  },
  transactionCount: {
    type: Number,
    default: 0
  },
  lastTransactionDate: Date,

  // Transactions
  transactions: [transactionSchema],

  // Notifications
  lowBalanceAlertSent: {
    type: Boolean,
    default: false
  },
  lowBalanceThreshold: {
    type: Number,
    default: 500
  }

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
walletSchema.index({ owner: 1, ownerModel: 1 }, { unique: true });
walletSchema.index({ status: 1 });
walletSchema.index({ 'transactions.transactionId': 1 });
walletSchema.index({ 'transactions.createdAt': -1 });

// Virtual for total available balance
walletSchema.virtual('totalAvailable').get(function() {
  return this.balance + this.creditLimit;
});

// Pre-save middleware to calculate available balance
walletSchema.pre('save', function(next) {
  this.availableBalance = this.balance + this.creditLimit;
  next();
});

// Pre-save middleware to generate transaction ID
walletSchema.pre('save', function(next) {
  this.transactions.forEach(txn => {
    if (!txn.transactionId) {
      const timestamp = Date.now();
      const random = Math.floor(Math.random() * 10000);
      txn.transactionId = `TXN-${timestamp}-${random}`;
    }
  });
  next();
});

// Method to credit wallet
walletSchema.methods.credit = async function(amount, description, category, reference, paymentDetails = {}) {
  if (amount <= 0) {
    throw new Error('Amount must be greater than 0');
  }

  if (this.status !== 'active') {
    throw new Error('Wallet is not active');
  }

  const balanceBefore = this.balance;
  this.balance += amount;
  const balanceAfter = this.balance;

  this.totalCredited += amount;
  this.transactionCount += 1;
  this.lastTransactionDate = new Date();

  this.transactions.push({
    type: 'credit',
    amount,
    balanceBefore,
    balanceAfter,
    description,
    category,
    reference,
    paymentMethod: paymentDetails.paymentMethod,
    paymentId: paymentDetails.paymentId,
    status: 'completed'
  });

  await this.save();
  
  return this.transactions[this.transactions.length - 1];
};

// Method to debit wallet
walletSchema.methods.debit = async function(amount, description, category, reference) {
  if (amount <= 0) {
    throw new Error('Amount must be greater than 0');
  }

  if (this.status !== 'active') {
    throw new Error('Wallet is not active');
  }

  if (this.balance < amount) {
    throw new Error('Insufficient balance');
  }

  // Check daily limit
  const today = new Date().toDateString();
  if (this.dailyLimit.lastResetDate?.toDateString() !== today) {
    this.dailyLimit.usedToday = 0;
    this.dailyLimit.lastResetDate = new Date();
  }

  if (this.dailyLimit.usedToday + amount > this.dailyLimit.amount) {
    throw new Error('Daily transaction limit exceeded');
  }

  const balanceBefore = this.balance;
  this.balance -= amount;
  const balanceAfter = this.balance;

  this.totalDebited += amount;
  this.transactionCount += 1;
  this.lastTransactionDate = new Date();
  this.dailyLimit.usedToday += amount;

  this.transactions.push({
    type: 'debit',
    amount,
    balanceBefore,
    balanceAfter,
    description,
    category,
    reference,
    status: 'completed'
  });

  await this.save();

  // Check if low balance alert should be sent
  if (this.balance < this.lowBalanceThreshold && !this.lowBalanceAlertSent) {
    this.lowBalanceAlertSent = true;
    await this.save();
    // Trigger notification (implement in notification service)
  }

  return this.transactions[this.transactions.length - 1];
};

// Method to check if wallet has sufficient balance
walletSchema.methods.hasSufficientBalance = function(amount) {
  return this.balance >= amount;
};

// Method to get transactions by date range
walletSchema.methods.getTransactionsByDateRange = function(startDate, endDate) {
  return this.transactions.filter(txn => {
    const txnDate = new Date(txn.createdAt);
    return txnDate >= startDate && txnDate <= endDate;
  });
};

// Method to get transaction summary
walletSchema.methods.getTransactionSummary = function(period = 'month') {
  const now = new Date();
  let startDate;

  switch (period) {
    case 'today':
      startDate = new Date(now.setHours(0, 0, 0, 0));
      break;
    case 'week':
      startDate = new Date(now.setDate(now.getDate() - 7));
      break;
    case 'month':
      startDate = new Date(now.setMonth(now.getMonth() - 1));
      break;
    case 'year':
      startDate = new Date(now.setFullYear(now.getFullYear() - 1));
      break;
    default:
      startDate = new Date(0);
  }

  const transactions = this.transactions.filter(txn => 
    new Date(txn.createdAt) >= startDate
  );

  const summary = {
    totalCredit: 0,
    totalDebit: 0,
    transactionCount: transactions.length,
    byCategory: {}
  };

  transactions.forEach(txn => {
    if (txn.type === 'credit') {
      summary.totalCredit += txn.amount;
    } else {
      summary.totalDebit += txn.amount;
    }

    if (!summary.byCategory[txn.category]) {
      summary.byCategory[txn.category] = { credit: 0, debit: 0, count: 0 };
    }
    
    if (txn.type === 'credit') {
      summary.byCategory[txn.category].credit += txn.amount;
    } else {
      summary.byCategory[txn.category].debit += txn.amount;
    }
    summary.byCategory[txn.category].count += 1;
  });

  summary.netAmount = summary.totalCredit - summary.totalDebit;

  return summary;
};

// Static method to create wallet
walletSchema.statics.createWallet = async function(ownerId, ownerModel, initialBalance = 0) {
  return await this.create({
    owner: ownerId,
    ownerModel,
    balance: initialBalance,
    status: 'active'
  });
};

// Static method to find wallet by owner
walletSchema.statics.findByOwner = async function(ownerId, ownerModel) {
  return await this.findOne({ owner: ownerId, ownerModel });
};

const Wallet = mongoose.model('Wallet', walletSchema);

module.exports = Wallet;
