/**
 * Booking Controller
 * Handles all booking operations for Employee & Company Admin
 */

const Booking = require('../models/Booking');
const Wallet = require('../models/Wallet');
const Company = require('../models/Company');
const PromotionalCampaign = require('../models/PromotionalCampaign');
const Notification = require('../models/Notification');
const { AppError } = require('../middleware/errorHandler');
const { logger } = require('../utils/logger');
const { validationResult } = require('express-validator');

/**
 * @desc    Create new booking (Employee)
 * @route   POST /api/v1/bookings
 * @access  Employee, Company Admin
 */
exports.createBooking = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new AppError('Validation failed', 400, errors.array()));
    }

    const {
      serviceCategory, serviceType, travelDate, returnDate,
      origin, destination, passengers, baseAmount,
      promoCode, paymentMethod, flightDetails, hotelDetails,
      logisticsDetails, purpose, notes
    } = req.body;

    const userId = req.user._id;
    const companyId = req.user.company;

    // Get company details
    const company = await Company.findById(companyId);
    if (!company) {
      return next(new AppError('Company not found', 404));
    }

    // Check if service is allowed for company
    if (!company.isServiceAllowed(serviceCategory, serviceType)) {
      return next(new AppError(`${serviceType} service is not enabled for your company`, 403));
    }

    // Calculate amounts
    let taxAmount = baseAmount * 0.18; // 18% GST
    let discount = 0;
    let promoDiscount = 0;
    let appliedPromoCode = null;

    // Apply promo code if provided
    if (promoCode) {
      const campaign = await PromotionalCampaign.findOne({ 
        code: promoCode.toUpperCase(),
        status: 'active'
      });

      if (campaign) {
        const mockBooking = {
          totalAmount: baseAmount + taxAmount,
          serviceType,
          company: companyId,
          isFirstBooking: false // TODO: Check actual first booking status
        };

        const validation = campaign.canApplyToBooking(mockBooking, req.user);
        
        if (validation.valid) {
          promoDiscount = campaign.calculateDiscount(baseAmount + taxAmount);
          appliedPromoCode = campaign.code;
        }
      }
    }

    const totalAmount = baseAmount + taxAmount;
    const finalAmount = totalAmount - discount - promoDiscount;

    // Check if approval is required
    const requiresApproval = company.bookingSettings.requiresApproval && 
                            finalAmount >= company.bookingSettings.approvalThreshold;

    // Check wallet balance if payment method is wallet
    if (paymentMethod === 'wallet') {
      const wallet = await Wallet.findByOwner(companyId, 'Company');
      
      if (!wallet) {
        return next(new AppError('Company wallet not found', 404));
      }

      if (!wallet.hasSufficientBalance(finalAmount)) {
        return next(new AppError('Insufficient wallet balance', 400));
      }
    }

    // Create booking
    const booking = await Booking.create({
      user: userId,
      company: companyId,
      serviceCategory,
      serviceType,
      bookingDate: new Date(),
      travelDate,
      returnDate,
      origin,
      destination,
      passengers,
      baseAmount,
      taxAmount,
      discount,
      promoCode: appliedPromoCode,
      promoDiscount,
      totalAmount,
      finalAmount,
      paymentMethod,
      flightDetails,
      hotelDetails,
      logisticsDetails,
      purpose,
      notes,
      requiresApproval,
      status: requiresApproval ? 'pending_approval' : 'confirmed',
      approvalStatus: requiresApproval ? 'pending' : 'approved'
    });

    // If doesn't require approval, process payment
    if (!requiresApproval && paymentMethod === 'wallet') {
      const wallet = await Wallet.findByOwner(companyId, 'Company');
      await wallet.debit(
        finalAmount,
        `Booking payment - ${booking.bookingId}`,
        'booking_payment',
        { model: 'Booking', id: booking._id }
      );

      booking.paymentStatus = 'completed';
      await booking.save();

      // Record promo usage if applied
      if (appliedPromoCode) {
        const campaign = await PromotionalCampaign.findOne({ code: appliedPromoCode });
        if (campaign) {
          await campaign.recordUsage(userId, promoDiscount);
        }
      }
    }

    // Create notification for user
    await Notification.createNotification({
      user: userId,
      company: companyId,
      title: 'Booking Created',
      message: requiresApproval 
        ? `Your ${serviceType} booking is pending approval`
        : `Your ${serviceType} booking has been confirmed`,
      type: 'booking',
      priority: 'medium',
      reference: { model: 'Booking', id: booking._id },
      actionUrl: `/bookings/${booking._id}`
    });

    // If requires approval, notify approvers
    if (requiresApproval && company.bookingSettings.approvers?.length > 0) {
      for (const approverId of company.bookingSettings.approvers) {
        await Notification.createNotification({
          user: approverId,
          company: companyId,
          title: 'Booking Approval Required',
          message: `${req.user.name} has requested approval for ${serviceType} booking of ₹${finalAmount}`,
          type: 'approval',
          priority: 'high',
          reference: { model: 'Booking', id: booking._id },
          actionUrl: `/admin/approvals/${booking._id}`
        });
      }
    }

    logger.info(`Booking created: ${booking.bookingId} by ${req.user.email}`);

    // Emit socket event
    const io = req.app.get('io');
    if (io) {
      io.emitToUser(userId, 'booking:created', { booking });
      if (requiresApproval) {
        io.emitToCompany(companyId, 'booking:pending_approval', { booking });
      }
    }

    res.status(201).json({
      success: true,
      message: requiresApproval 
        ? 'Booking created and sent for approval'
        : 'Booking created successfully',
      data: booking
    });

  } catch (error) {
    logger.error('Error creating booking:', error);
    next(error);
  }
};

/**
 * @desc    Get all bookings
 * @route   GET /api/v1/bookings
 * @access  Employee, Company Admin, Super Admin
 */
exports.getAllBookings = async (req, res, next) => {
  try {
    const { 
      status, serviceType, serviceCategory, 
      startDate, endDate, page = 1, limit = 20 
    } = req.query;

    const query = {};

    // Role-based filtering
    if (req.user.role === 'employee') {
      query.user = req.user._id;
    } else if (req.user.role === 'company_admin') {
      query.company = req.user.company;
    }
    // Super admin can see all bookings (no filter)

    // Apply filters
    if (status) query.status = status;
    if (serviceType) query.serviceType = serviceType;
    if (serviceCategory) query.serviceCategory = serviceCategory;
    
    if (startDate || endDate) {
      query.travelDate = {};
      if (startDate) query.travelDate.$gte = new Date(startDate);
      if (endDate) query.travelDate.$lte = new Date(endDate);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const bookings = await Booking.find(query)
      .populate('user', 'name email department')
      .populate('company', 'name companyId')
      .populate('approvedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Booking.countDocuments(query);

    res.status(200).json({
      success: true,
      data: bookings,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    logger.error('Error fetching bookings:', error);
    next(error);
  }
};

/**
 * @desc    Get booking by ID
 * @route   GET /api/v1/bookings/:id
 * @access  Employee (own), Company Admin, Super Admin
 */
exports.getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'name email phone department')
      .populate('company', 'name companyId email')
      .populate('approvedBy', 'name email')
      .populate('driver', 'name email phone')
      .populate('vehicle');

    if (!booking) {
      return next(new AppError('Booking not found', 404));
    }

    // Check access permissions
    if (req.user.role === 'employee' && booking.user.toString() !== req.user._id.toString()) {
      return next(new AppError('Access denied', 403));
    }

    if (req.user.role === 'company_admin' && booking.company.toString() !== req.user.company.toString()) {
      return next(new AppError('Access denied', 403));
    }

    res.status(200).json({
      success: true,
      data: booking
    });

  } catch (error) {
    logger.error('Error fetching booking:', error);
    next(error);
  }
};

/**
 * @desc    Cancel booking (Employee)
 * @route   PATCH /api/v1/bookings/:id/cancel
 * @access  Employee (own), Company Admin
 */
exports.cancelBooking = async (req, res, next) => {
  try {
    const { reason } = req.body;

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return next(new AppError('Booking not found', 404));
    }

    // Check permissions
    if (req.user.role === 'employee' && booking.user.toString() !== req.user._id.toString()) {
      return next(new AppError('You can only cancel your own bookings', 403));
    }

    if (!booking.canBeCancelled()) {
      return next(new AppError('Booking cannot be cancelled at this time', 400));
    }

    // Calculate cancellation charges
    const cancellationCharges = booking.calculateCancellationCharges();
    const refundAmount = booking.finalAmount - cancellationCharges;

    booking.status = 'cancelled';
    booking.cancellationDate = new Date();
    booking.cancellationReason = reason;
    booking.cancellationCharges = cancellationCharges;
    booking.refundAmount = refundAmount;
    booking.refundStatus = refundAmount > 0 ? 'pending' : 'not_applicable';

    await booking.save();

    // Process refund if payment was made
    if (booking.paymentStatus === 'completed' && refundAmount > 0) {
      const wallet = await Wallet.findByOwner(booking.company, 'Company');
      if (wallet) {
        await wallet.credit(
          refundAmount,
          `Refund for cancelled booking - ${booking.bookingId}`,
          'cancellation_refund',
          { model: 'Booking', id: booking._id }
        );

        booking.refundStatus = 'completed';
        await booking.save();
      }
    }

    // Create notification
    await Notification.createNotification({
      user: booking.user,
      company: booking.company,
      title: 'Booking Cancelled',
      message: `Your ${booking.serviceType} booking has been cancelled. Refund of ₹${refundAmount} will be processed.`,
      type: 'booking',
      priority: 'medium',
      reference: { model: 'Booking', id: booking._id }
    });

    logger.info(`Booking cancelled: ${booking.bookingId}`);

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      data: {
        booking,
        cancellationCharges,
        refundAmount
      }
    });

  } catch (error) {
    logger.error('Error cancelling booking:', error);
    next(error);
  }
};

/**
 * @desc    Approve booking (Company Admin)
 * @route   PATCH /api/v1/bookings/:id/approve
 * @access  Company Admin, Super Admin
 */
exports.approveBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return next(new AppError('Booking not found', 404));
    }

    // Check company access
    if (req.user.role === 'company_admin' && booking.company.toString() !== req.user.company.toString()) {
      return next(new AppError('Access denied', 403));
    }

    if (booking.approvalStatus !== 'pending') {
      return next(new AppError('Booking is not pending approval', 400));
    }

    booking.approvalStatus = 'approved';
    booking.status = 'confirmed';
    booking.approvedBy = req.user._id;
    booking.approvedAt = new Date();

    // Process payment if wallet
    if (booking.paymentMethod === 'wallet' && booking.paymentStatus === 'pending') {
      const wallet = await Wallet.findByOwner(booking.company, 'Company');
      
      if (!wallet.hasSufficientBalance(booking.finalAmount)) {
        return next(new AppError('Insufficient wallet balance', 400));
      }

      await wallet.debit(
        booking.finalAmount,
        `Booking payment - ${booking.bookingId}`,
        'booking_payment',
        { model: 'Booking', id: booking._id }
      );

      booking.paymentStatus = 'completed';

      // Record promo usage if applied
      if (booking.promoCode) {
        const campaign = await PromotionalCampaign.findOne({ code: booking.promoCode });
        if (campaign) {
          await campaign.recordUsage(booking.user, booking.promoDiscount);
        }
      }
    }

    await booking.save();

    // Notify user
    await Notification.createNotification({
      user: booking.user,
      company: booking.company,
      title: 'Booking Approved',
      message: `Your ${booking.serviceType} booking has been approved by ${req.user.name}`,
      type: 'approval',
      priority: 'high',
      reference: { model: 'Booking', id: booking._id },
      actionUrl: `/bookings/${booking._id}`
    });

    logger.info(`Booking approved: ${booking.bookingId} by ${req.user.email}`);

    // Emit socket event
    const io = req.app.get('io');
    if (io) {
      io.emitToUser(booking.user.toString(), 'booking:approved', { booking });
    }

    res.status(200).json({
      success: true,
      message: 'Booking approved successfully',
      data: booking
    });

  } catch (error) {
    logger.error('Error approving booking:', error);
    next(error);
  }
};

/**
 * @desc    Reject booking (Company Admin)
 * @route   PATCH /api/v1/bookings/:id/reject
 * @access  Company Admin, Super Admin
 */
exports.rejectBooking = async (req, res, next) => {
  try {
    const { reason } = req.body;

    if (!reason) {
      return next(new AppError('Rejection reason is required', 400));
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return next(new AppError('Booking not found', 404));
    }

    // Check company access
    if (req.user.role === 'company_admin' && booking.company.toString() !== req.user.company.toString()) {
      return next(new AppError('Access denied', 403));
    }

    if (booking.approvalStatus !== 'pending') {
      return next(new AppError('Booking is not pending approval', 400));
    }

    booking.approvalStatus = 'rejected';
    booking.status = 'rejected';
    booking.approvedBy = req.user._id;
    booking.approvedAt = new Date();
    booking.rejectionReason = reason;

    await booking.save();

    // Notify user
    await Notification.createNotification({
      user: booking.user,
      company: booking.company,
      title: 'Booking Rejected',
      message: `Your ${booking.serviceType} booking has been rejected. Reason: ${reason}`,
      type: 'approval',
      priority: 'high',
      reference: { model: 'Booking', id: booking._id }
    });

    logger.info(`Booking rejected: ${booking.bookingId} by ${req.user.email}`);

    // Emit socket event
    const io = req.app.get('io');
    if (io) {
      io.emitToUser(booking.user.toString(), 'booking:rejected', { booking });
    }

    res.status(200).json({
      success: true,
      message: 'Booking rejected',
      data: booking
    });

  } catch (error) {
    logger.error('Error rejecting booking:', error);
    next(error);
  }
};

/**
 * @desc    Get pending approvals (Company Admin)
 * @route   GET /api/v1/bookings/pending-approvals
 * @access  Company Admin, Super Admin
 */
exports.getPendingApprovals = async (req, res, next) => {
  try {
    const companyId = req.user.role === 'company_admin' 
      ? req.user.company 
      : req.query.company;

    const bookings = await Booking.getPendingApprovals(companyId);

    res.status(200).json({
      success: true,
      data: bookings,
      count: bookings.length
    });

  } catch (error) {
    logger.error('Error fetching pending approvals:', error);
    next(error);
  }
};

/**
 * @desc    Get booking statistics
 * @route   GET /api/v1/bookings/statistics
 * @access  Company Admin, Super Admin
 */
exports.getBookingStatistics = async (req, res, next) => {
  try {
    const query = {};

    if (req.user.role === 'company_admin') {
      query.company = req.user.company;
    }

    const totalBookings = await Booking.countDocuments(query);
    const pendingApprovals = await Booking.countDocuments({ ...query, approvalStatus: 'pending' });
    const confirmedBookings = await Booking.countDocuments({ ...query, status: 'confirmed' });
    const completedBookings = await Booking.countDocuments({ ...query, status: 'completed' });
    const cancelledBookings = await Booking.countDocuments({ ...query, status: 'cancelled' });

    const totalSpent = await Booking.aggregate([
      { $match: { ...query, paymentStatus: 'completed' } },
      { $group: { _id: null, total: { $sum: '$finalAmount' } } }
    ]);

    const stats = {
      totalBookings,
      pendingApprovals,
      confirmedBookings,
      completedBookings,
      cancelledBookings,
      totalSpent: totalSpent[0]?.total || 0
    };

    res.status(200).json({
      success: true,
      data: stats
    });

  } catch (error) {
    logger.error('Error fetching booking statistics:', error);
    next(error);
  }
};
