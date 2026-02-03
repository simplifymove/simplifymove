/**
 * Booking Model
 * Handles Travel & Logistics Bookings
 */

const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  // Booking Identification
  bookingId: {
    type: String,
    unique: true,
    required: true
  },
  
  // References
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },

  // Service Details
  serviceCategory: {
    type: String,
    enum: ['travel', 'logistics', 'courier'],
    required: true
  },
  serviceType: {
    type: String,
    required: true,
    enum: [
      'Flight', 'Hotel', 'Cab', 'Bus', 'Bike', 'Two Wheeler',
      'Bike Logistics', '3 Wheeler Auto', 'Mini Truck', 'Medium Truck',
      'DCM', 'Container', 'Courier'
    ]
  },

  // Booking Details
  bookingDate: {
    type: Date,
    required: true
  },
  travelDate: {
    type: Date,
    required: true
  },
  returnDate: Date,

  // Location Details
  origin: {
    address: String,
    city: String,
    state: String,
    pincode: String,
    lat: Number,
    lng: Number
  },
  destination: {
    address: String,
    city: String,
    state: String,
    pincode: String,
    lat: Number,
    lng: Number
  },

  // Travel/Logistics Specific
  passengers: {
    type: Number,
    default: 1,
    min: 1
  },
  vehicleType: String,
  flightDetails: {
    airline: String,
    flightNumber: String,
    class: { type: String, enum: ['Economy', 'Business', 'First'] },
    pnr: String
  },
  hotelDetails: {
    hotelName: String,
    checkIn: Date,
    checkOut: Date,
    roomType: String,
    numberOfRooms: Number,
    confirmationNumber: String
  },
  logisticsDetails: {
    weight: Number, // in kg
    dimensions: {
      length: Number,
      width: Number,
      height: Number
    },
    goodsType: String,
    specialInstructions: String
  },

  // Pricing
  baseAmount: {
    type: Number,
    required: true,
    min: 0
  },
  taxAmount: {
    type: Number,
    default: 0
  },
  discount: {
    type: Number,
    default: 0
  },
  promoCode: {
    type: String,
    uppercase: true
  },
  promoDiscount: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  finalAmount: {
    type: Number,
    required: true,
    min: 0
  },

  // Payment
  paymentMethod: {
    type: String,
    enum: ['wallet', 'card', 'netbanking', 'upi', 'cash'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentId: String,
  transactionId: String,

  // Status & Workflow
  status: {
    type: String,
    enum: [
      'pending_approval', 'approved', 'rejected', 'confirmed',
      'in_progress', 'completed', 'cancelled', 'failed'
    ],
    default: 'pending_approval'
  },
  
  // Approval Workflow
  requiresApproval: {
    type: Boolean,
    default: false
  },
  approvalStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: Date,
  rejectionReason: String,

  // Assignment (for logistics/travel with drivers)
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle'
  },

  // Tracking
  trackingStatus: {
    type: String,
    enum: ['not_started', 'picked_up', 'in_transit', 'delivered', 'cancelled'],
    default: 'not_started'
  },
  trackingHistory: [{
    status: String,
    location: String,
    timestamp: Date,
    notes: String
  }],

  // Cancellation
  cancellationDate: Date,
  cancellationReason: String,
  cancellationCharges: {
    type: Number,
    default: 0
  },
  refundAmount: {
    type: Number,
    default: 0
  },
  refundStatus: {
    type: String,
    enum: ['not_applicable', 'pending', 'processed', 'completed'],
    default: 'not_applicable'
  },

  // Ratings & Reviews
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  review: String,
  reviewDate: Date,

  // Additional Information
  purpose: String,
  notes: String,
  specialRequirements: String,
  
  // Documents
  documents: [{
    type: { type: String },
    name: String,
    url: String,
    uploadedAt: Date
  }],

  // Metadata
  metadata: {
    type: Map,
    of: String
  }

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
bookingSchema.index({ bookingId: 1 });
bookingSchema.index({ user: 1, company: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ bookingDate: -1 });
bookingSchema.index({ travelDate: 1 });
bookingSchema.index({ company: 1, status: 1 });
bookingSchema.index({ 'origin.city': 1, 'destination.city': 1 });

// Virtual for duration (in days)
bookingSchema.virtual('duration').get(function() {
  if (this.returnDate && this.travelDate) {
    const diff = this.returnDate - this.travelDate;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }
  return 1;
});

// Pre-save middleware to generate booking ID
bookingSchema.pre('save', async function(next) {
  if (this.isNew && !this.bookingId) {
    const prefix = this.serviceCategory === 'travel' ? 'TRV' : 
                   this.serviceCategory === 'logistics' ? 'LOG' : 'CUR';
    const count = await this.constructor.countDocuments();
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    this.bookingId = `${prefix}-${date}-${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

// Pre-save middleware to calculate final amount
bookingSchema.pre('save', function(next) {
  this.totalAmount = this.baseAmount + this.taxAmount;
  this.finalAmount = this.totalAmount - this.discount - this.promoDiscount;
  next();
});

// Method to check if booking can be cancelled
bookingSchema.methods.canBeCancelled = function() {
  const now = new Date();
  const cancellationDeadline = new Date(this.travelDate);
  cancellationDeadline.setHours(cancellationDeadline.getHours() - 24); // 24 hours before travel
  
  return (
    ['pending_approval', 'approved', 'confirmed'].includes(this.status) &&
    now < cancellationDeadline
  );
};

// Method to calculate cancellation charges
bookingSchema.methods.calculateCancellationCharges = function() {
  const now = new Date();
  const hoursBeforeTravel = (this.travelDate - now) / (1000 * 60 * 60);
  
  let chargePercentage = 0;
  
  if (hoursBeforeTravel < 24) {
    chargePercentage = 50; // 50% charges
  } else if (hoursBeforeTravel < 48) {
    chargePercentage = 25; // 25% charges
  } else {
    chargePercentage = 10; // 10% charges
  }
  
  return (this.finalAmount * chargePercentage) / 100;
};

// Static method to get bookings by date range
bookingSchema.statics.getBookingsByDateRange = function(startDate, endDate, filters = {}) {
  return this.find({
    travelDate: { $gte: startDate, $lte: endDate },
    ...filters
  }).populate('user', 'name email')
    .populate('company', 'name companyId')
    .sort({ travelDate: -1 });
};

// Static method to get pending approvals
bookingSchema.statics.getPendingApprovals = function(companyId) {
  return this.find({
    company: companyId,
    requiresApproval: true,
    approvalStatus: 'pending',
    status: 'pending_approval'
  }).populate('user', 'name email department')
    .sort({ createdAt: -1 });
};

// Static method to get user bookings
bookingSchema.statics.getUserBookings = function(userId, filters = {}) {
  return this.find({
    user: userId,
    ...filters
  }).populate('company', 'name')
    .sort({ createdAt: -1 });
};

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
