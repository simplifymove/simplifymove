/**
 * Employee Dashboard Controller
 * Handles employee portal dashboard and features
 */

const Booking = require('../models/Booking');
const Wallet = require('../models/Wallet');
const Notification = require('../models/Notification');
const PromotionalCampaign = require('../models/PromotionalCampaign');
const User = require('../models/User');
const { AppError } = require('../middleware/errorHandler');
const { logger } = require('../utils/logger');

/**
 * @desc    Get employee dashboard
 * @route   GET /api/v1/employee/dashboard
 * @access  Employee
 */
exports.getDashboard = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const companyId = req.user.company;

    // Get wallet balance
    let wallet = await Wallet.findByOwner(userId, 'User');
    if (!wallet) {
      wallet = await Wallet.createWallet(userId, 'User', 0);
    }

    // Get booking statistics
    const totalBookings = await Booking.countDocuments({ user: userId });
    const pendingBookings = await Booking.countDocuments({ 
      user: userId, 
      status: 'pending_approval' 
    });
    const confirmedBookings = await Booking.countDocuments({ 
      user: userId, 
      status: 'confirmed' 
    });
    const completedBookings = await Booking.countDocuments({ 
      user: userId, 
      status: 'completed' 
    });

    // Get recent bookings
    const recentBookings = await Booking.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('company', 'name');

    // Get upcoming trips
    const upcomingTrips = await Booking.find({
      user: userId,
      status: { $in: ['confirmed', 'in_progress'] },
      travelDate: { $gte: new Date() }
    })
      .sort({ travelDate: 1 })
      .limit(5);

    // Get unread notifications
    const unreadNotifications = await Notification.getUnreadCount(userId);

    // Get available promo codes
    const availablePromos = await PromotionalCampaign.getActiveCampaignsForCompany(companyId);

    // Calculate total spent
    const spendingData = await Booking.aggregate([
      {
        $match: {
          user: userId,
          paymentStatus: 'completed'
        }
      },
      {
        $group: {
          _id: null,
          totalSpent: { $sum: '$finalAmount' },
          totalSavings: { $sum: '$promoDiscount' }
        }
      }
    ]);

    const dashboard = {
      user: {
        name: req.user.name,
        email: req.user.email,
        department: req.user.department,
        designation: req.user.designation
      },
      wallet: {
        balance: wallet.balance,
        currency: wallet.currency
      },
      bookings: {
        total: totalBookings,
        pending: pendingBookings,
        confirmed: confirmedBookings,
        completed: completedBookings
      },
      spending: {
        total: spendingData[0]?.totalSpent || 0,
        savings: spendingData[0]?.totalSavings || 0
      },
      recentBookings,
      upcomingTrips,
      unreadNotifications,
      availablePromos: availablePromos.slice(0, 3)
    };

    res.status(200).json({
      success: true,
      data: dashboard
    });

  } catch (error) {
    logger.error('Error fetching employee dashboard:', error);
    next(error);
  }
};

/**
 * @desc    Get employee profile
 * @route   GET /api/v1/employee/profile
 * @access  Employee
 */
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('company', 'name companyId email')
      .populate('reportingManager', 'name email designation');

    res.status(200).json({
      success: true,
      data: user
    });

  } catch (error) {
    logger.error('Error fetching employee profile:', error);
    next(error);
  }
};

/**
 * @desc    Update employee profile
 * @route   PUT /api/v1/employee/profile
 * @access  Employee
 */
exports.updateProfile = async (req, res, next) => {
  try {
    const {
      phone, dateOfBirth, gender, address,
      preferences
    } = req.body;

    const updateData = {};
    if (phone) updateData.phone = phone;
    if (dateOfBirth) updateData.dateOfBirth = dateOfBirth;
    if (gender) updateData.gender = gender;
    if (address) updateData.address = address;
    if (preferences) updateData.preferences = preferences;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    ).populate('company', 'name companyId');

    logger.info(`Profile updated: ${user.email}`);

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    });

  } catch (error) {
    logger.error('Error updating profile:', error);
    next(error);
  }
};

/**
 * @desc    Get my bookings
 * @route   GET /api/v1/employee/bookings
 * @access  Employee
 */
exports.getMyBookings = async (req, res, next) => {
  try {
    const { status, serviceType, page = 1, limit = 20 } = req.query;

    const query = { user: req.user._id };
    
    if (status) query.status = status;
    if (serviceType) query.serviceType = serviceType;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const bookings = await Booking.find(query)
      .populate('company', 'name')
      .populate('approvedBy', 'name')
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
 * @desc    Get my wallet
 * @route   GET /api/v1/employee/wallet
 * @access  Employee
 */
exports.getMyWallet = async (req, res, next) => {
  try {
    let wallet = await Wallet.findByOwner(req.user._id, 'User');

    if (!wallet) {
      wallet = await Wallet.createWallet(req.user._id, 'User', 0);
    }

    res.status(200).json({
      success: true,
      data: wallet
    });

  } catch (error) {
    logger.error('Error fetching wallet:', error);
    next(error);
  }
};

/**
 * @desc    Get my notifications
 * @route   GET /api/v1/employee/notifications
 * @access  Employee
 */
exports.getMyNotifications = async (req, res, next) => {
  try {
    const { unread, page = 1, limit = 20 } = req.query;

    const query = { user: req.user._id };
    
    if (unread === 'true') {
      query.isRead = false;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Notification.countDocuments(query);
    const unreadCount = await Notification.getUnreadCount(req.user._id);

    res.status(200).json({
      success: true,
      data: notifications,
      unreadCount,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    logger.error('Error fetching notifications:', error);
    next(error);
  }
};

/**
 * @desc    Mark notification as read
 * @route   PATCH /api/v1/employee/notifications/:id/read
 * @access  Employee
 */
exports.markNotificationAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.markAsRead(
      req.params.id,
      req.user._id
    );

    if (!notification) {
      return next(new AppError('Notification not found', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Notification marked as read',
      data: notification
    });

  } catch (error) {
    logger.error('Error marking notification as read:', error);
    next(error);
  }
};

/**
 * @desc    Mark all notifications as read
 * @route   PATCH /api/v1/employee/notifications/read-all
 * @access  Employee
 */
exports.markAllNotificationsAsRead = async (req, res, next) => {
  try {
    await Notification.markAllAsRead(req.user._id);

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read'
    });

  } catch (error) {
    logger.error('Error marking all notifications as read:', error);
    next(error);
  }
};

/**
 * @desc    Get available promo codes
 * @route   GET /api/v1/employee/promo-codes
 * @access  Employee
 */
exports.getAvailablePromoCodes = async (req, res, next) => {
  try {
    const { serviceType } = req.query;

    let promos;

    if (serviceType) {
      promos = await PromotionalCampaign.getCampaignsByService(
        serviceType,
        req.user.company
      );
    } else {
      promos = await PromotionalCampaign.getActiveCampaignsForCompany(
        req.user.company
      );
    }

    res.status(200).json({
      success: true,
      data: promos
    });

  } catch (error) {
    logger.error('Error fetching promo codes:', error);
    next(error);
  }
};

/**
 * @desc    Get spending analytics
 * @route   GET /api/v1/employee/analytics
 * @access  Employee
 */
exports.getSpendingAnalytics = async (req, res, next) => {
  try {
    const { period = 'month' } = req.query;

    const now = new Date();
    let startDate;

    switch (period) {
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

    const analytics = await Booking.aggregate([
      {
        $match: {
          user: req.user._id,
          paymentStatus: 'completed',
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$serviceType',
          totalSpent: { $sum: '$finalAmount' },
          totalSavings: { $sum: '$promoDiscount' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { totalSpent: -1 }
      }
    ]);

    const totalAnalytics = await Booking.aggregate([
      {
        $match: {
          user: req.user._id,
          paymentStatus: 'completed',
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: null,
          totalSpent: { $sum: '$finalAmount' },
          totalSavings: { $sum: '$promoDiscount' },
          totalBookings: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        byServiceType: analytics,
        overall: totalAnalytics[0] || {
          totalSpent: 0,
          totalSavings: 0,
          totalBookings: 0
        }
      }
    });

  } catch (error) {
    logger.error('Error fetching analytics:', error);
    next(error);
  }
};
