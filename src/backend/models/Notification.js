/**
 * Notification Model
 * System notifications for users
 */

const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  // Recipient
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company'
  },

  // Notification Details
  title: {
    type: String,
    required: true,
    maxlength: 200
  },
  message: {
    type: String,
    required: true,
    maxlength: 1000
  },
  type: {
    type: String,
    enum: [
      'booking', 'payment', 'wallet', 'approval', 'system',
      'promotion', 'alert', 'reminder', 'announcement'
    ],
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },

  // Status
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: Date,

  // Reference
  reference: {
    model: {
      type: String,
      enum: ['Booking', 'Wallet', 'PromotionalCampaign', 'Company', 'User']
    },
    id: mongoose.Schema.Types.ObjectId
  },

  // Action
  actionUrl: String,
  actionLabel: String,

  // Channels
  channels: {
    inApp: { type: Boolean, default: true },
    email: { type: Boolean, default: false },
    sms: { type: Boolean, default: false },
    push: { type: Boolean, default: false }
  },

  // Delivery Status
  emailSent: { type: Boolean, default: false },
  smsSent: { type: Boolean, default: false },
  pushSent: { type: Boolean, default: false },

  // Expiry
  expiresAt: Date,

  // Metadata
  metadata: {
    type: Map,
    of: String
  }

}, {
  timestamps: true
});

// Indexes
notificationSchema.index({ user: 1, isRead: 1 });
notificationSchema.index({ createdAt: -1 });
notificationSchema.index({ type: 1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Static method to create notification
notificationSchema.statics.createNotification = async function(data) {
  return await this.create(data);
};

// Static method to get unread count
notificationSchema.statics.getUnreadCount = async function(userId) {
  return await this.countDocuments({ user: userId, isRead: false });
};

// Static method to mark as read
notificationSchema.statics.markAsRead = async function(notificationId, userId) {
  return await this.findOneAndUpdate(
    { _id: notificationId, user: userId },
    { isRead: true, readAt: new Date() },
    { new: true }
  );
};

// Static method to mark all as read
notificationSchema.statics.markAllAsRead = async function(userId) {
  return await this.updateMany(
    { user: userId, isRead: false },
    { isRead: true, readAt: new Date() }
  );
};

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
