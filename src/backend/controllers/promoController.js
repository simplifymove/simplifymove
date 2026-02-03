/**
 * Promotional Campaign Controller
 * Handles all promotional campaign operations
 */

const PromotionalCampaign = require('../models/PromotionalCampaign');
const Company = require('../models/Company');
const { validationResult } = require('express-validator');
const { AppError } = require('../middleware/errorHandler');
const { logger } = require('../utils/logger');

/**
 * @desc    Create new promotional campaign
 * @route   POST /api/v1/promos
 * @access  Super Admin
 */
exports.createCampaign = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new AppError('Validation failed', 400, errors.array()));
    }

    const {
      name, code, description, discountType, discountValue, maxDiscount,
      minBookingAmount, applicableServices, applicableCompanies,
      startDate, endDate, usageLimit, perUserLimit, termsAndConditions,
      conditions, stackable, priority, autoApply, campaignType, tags
    } = req.body;

    // Check if promo code already exists
    const existingCampaign = await PromotionalCampaign.findOne({ code: code.toUpperCase() });
    if (existingCampaign) {
      return next(new AppError('Promo code already exists', 400));
    }

    // Validate dates
    if (new Date(startDate) >= new Date(endDate)) {
      return next(new AppError('End date must be after start date', 400));
    }

    // Validate companies exist
    if (applicableCompanies && applicableCompanies.length > 0) {
      const companies = await Company.find({ _id: { $in: applicableCompanies } });
      if (companies.length !== applicableCompanies.length) {
        return next(new AppError('One or more companies not found', 404));
      }
    }

    // Validate discount value
    if (discountType === 'percentage' && discountValue > 100) {
      return next(new AppError('Percentage discount cannot exceed 100%', 400));
    }

    // Create campaign
    const campaign = await PromotionalCampaign.create({
      name,
      code: code.toUpperCase(),
      description,
      discountType,
      discountValue,
      maxDiscount,
      minBookingAmount,
      applicableServices,
      applicableCompanies,
      startDate,
      endDate,
      usageLimit,
      perUserLimit,
      termsAndConditions,
      conditions,
      stackable,
      priority,
      autoApply,
      campaignType,
      tags,
      createdBy: req.user._id
    });

    logger.info(`Campaign created: ${campaign.code} by ${req.user.email}`);

    res.status(201).json({
      success: true,
      message: 'Promotional campaign created successfully',
      data: campaign
    });

  } catch (error) {
    logger.error('Error creating campaign:', error);
    next(error);
  }
};

/**
 * @desc    Get all campaigns
 * @route   GET /api/v1/promos
 * @access  Super Admin, Company Admin
 */
exports.getAllCampaigns = async (req, res, next) => {
  try {
    const { status, company, service, page = 1, limit = 20, search } = req.query;

    const query = {};

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Filter by company (for company admins)
    if (req.user.role === 'company_admin') {
      query.applicableCompanies = req.user.company;
    } else if (company) {
      query.applicableCompanies = company;
    }

    // Filter by service
    if (service) {
      query.$or = [
        { applicableServices: 'All Services' },
        { applicableServices: service }
      ];
    }

    // Search by name or code
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const campaigns = await PromotionalCampaign.find(query)
      .populate('applicableCompanies', 'name companyId')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await PromotionalCampaign.countDocuments(query);

    res.status(200).json({
      success: true,
      data: campaigns,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    logger.error('Error fetching campaigns:', error);
    next(error);
  }
};

/**
 * @desc    Get campaign by ID
 * @route   GET /api/v1/promos/:id
 * @access  Super Admin, Company Admin
 */
exports.getCampaignById = async (req, res, next) => {
  try {
    const campaign = await PromotionalCampaign.findById(req.params.id)
      .populate('applicableCompanies', 'name companyId email')
      .populate('createdBy', 'name email')
      .populate('usedBy.user', 'name email');

    if (!campaign) {
      return next(new AppError('Campaign not found', 404));
    }

    // Check if company admin has access
    if (req.user.role === 'company_admin') {
      const hasAccess = campaign.applicableCompanies.some(
        company => company._id.toString() === req.user.company.toString()
      );
      
      if (!hasAccess) {
        return next(new AppError('Access denied to this campaign', 403));
      }
    }

    res.status(200).json({
      success: true,
      data: campaign
    });

  } catch (error) {
    logger.error('Error fetching campaign:', error);
    next(error);
  }
};

/**
 * @desc    Update campaign
 * @route   PUT /api/v1/promos/:id
 * @access  Super Admin
 */
exports.updateCampaign = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new AppError('Validation failed', 400, errors.array()));
    }

    let campaign = await PromotionalCampaign.findById(req.params.id);

    if (!campaign) {
      return next(new AppError('Campaign not found', 404));
    }

    // Validate code uniqueness if changed
    if (req.body.code && req.body.code.toUpperCase() !== campaign.code) {
      const existingCampaign = await PromotionalCampaign.findOne({ 
        code: req.body.code.toUpperCase() 
      });
      if (existingCampaign) {
        return next(new AppError('Promo code already exists', 400));
      }
    }

    // Validate dates if changed
    const startDate = req.body.startDate || campaign.startDate;
    const endDate = req.body.endDate || campaign.endDate;
    if (new Date(startDate) >= new Date(endDate)) {
      return next(new AppError('End date must be after start date', 400));
    }

    // Update campaign
    campaign = await PromotionalCampaign.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        code: req.body.code ? req.body.code.toUpperCase() : campaign.code,
        lastModifiedBy: req.user._id
      },
      { new: true, runValidators: true }
    ).populate('applicableCompanies', 'name companyId');

    logger.info(`Campaign updated: ${campaign.code} by ${req.user.email}`);

    res.status(200).json({
      success: true,
      message: 'Campaign updated successfully',
      data: campaign
    });

  } catch (error) {
    logger.error('Error updating campaign:', error);
    next(error);
  }
};

/**
 * @desc    Delete campaign
 * @route   DELETE /api/v1/promos/:id
 * @access  Super Admin
 */
exports.deleteCampaign = async (req, res, next) => {
  try {
    const campaign = await PromotionalCampaign.findById(req.params.id);

    if (!campaign) {
      return next(new AppError('Campaign not found', 404));
    }

    // Check if campaign has been used
    if (campaign.usageCount > 0) {
      return next(new AppError(
        'Cannot delete campaign that has been used. Consider deactivating it instead.',
        400
      ));
    }

    await campaign.deleteOne();

    logger.info(`Campaign deleted: ${campaign.code} by ${req.user.email}`);

    res.status(200).json({
      success: true,
      message: 'Campaign deleted successfully'
    });

  } catch (error) {
    logger.error('Error deleting campaign:', error);
    next(error);
  }
};

/**
 * @desc    Toggle campaign status
 * @route   PATCH /api/v1/promos/:id/toggle-status
 * @access  Super Admin
 */
exports.toggleCampaignStatus = async (req, res, next) => {
  try {
    const campaign = await PromotionalCampaign.findById(req.params.id);

    if (!campaign) {
      return next(new AppError('Campaign not found', 404));
    }

    // Toggle between active and inactive
    campaign.status = campaign.status === 'active' ? 'inactive' : 'active';
    campaign.lastModifiedBy = req.user._id;
    await campaign.save();

    logger.info(`Campaign status toggled: ${campaign.code} to ${campaign.status}`);

    res.status(200).json({
      success: true,
      message: `Campaign ${campaign.status === 'active' ? 'activated' : 'deactivated'} successfully`,
      data: campaign
    });

  } catch (error) {
    logger.error('Error toggling campaign status:', error);
    next(error);
  }
};

/**
 * @desc    Validate promo code
 * @route   POST /api/v1/promos/validate
 * @access  Employee, Company Admin
 */
exports.validatePromoCode = async (req, res, next) => {
  try {
    const { code, bookingAmount, serviceType, companyId } = req.body;

    if (!code || !bookingAmount || !serviceType) {
      return next(new AppError('Please provide code, booking amount, and service type', 400));
    }

    const campaign = await PromotionalCampaign.findOne({ 
      code: code.toUpperCase(),
      status: 'active'
    });

    if (!campaign) {
      return next(new AppError('Invalid or inactive promo code', 400));
    }

    // Mock booking object for validation
    const mockBooking = {
      totalAmount: bookingAmount,
      serviceType,
      company: companyId || req.user.company,
      isFirstBooking: false // This should come from actual booking logic
    };

    // Validate campaign
    const validation = campaign.canApplyToBooking(mockBooking, req.user);
    
    if (!validation.valid) {
      return next(new AppError(validation.reason, 400));
    }

    // Calculate discount
    const discount = campaign.calculateDiscount(bookingAmount);
    const finalAmount = bookingAmount - discount;

    res.status(200).json({
      success: true,
      message: 'Promo code is valid',
      data: {
        campaign: {
          code: campaign.code,
          name: campaign.name,
          description: campaign.description,
          discountType: campaign.discountType,
          discountValue: campaign.discountValue
        },
        discount: {
          amount: discount,
          originalAmount: bookingAmount,
          finalAmount,
          savings: discount,
          isCashback: campaign.discountType === 'cashback'
        }
      }
    });

  } catch (error) {
    logger.error('Error validating promo code:', error);
    next(error);
  }
};

/**
 * @desc    Get campaign analytics
 * @route   GET /api/v1/promos/:id/analytics
 * @access  Super Admin
 */
exports.getCampaignAnalytics = async (req, res, next) => {
  try {
    const campaign = await PromotionalCampaign.findById(req.params.id)
      .populate('usedBy.user', 'name email company');

    if (!campaign) {
      return next(new AppError('Campaign not found', 404));
    }

    const analytics = {
      overview: {
        totalUsage: campaign.usageCount,
        usageLimit: campaign.usageLimit,
        usagePercentage: campaign.usagePercentage,
        remainingUses: campaign.remainingUses,
        totalSavings: campaign.totalSavings,
        uniqueUsers: campaign.usedBy.length
      },
      topUsers: campaign.usedBy
        .sort((a, b) => b.usageCount - a.usageCount)
        .slice(0, 10)
        .map(u => ({
          user: u.user,
          usageCount: u.usageCount,
          totalSavings: u.totalSavings,
          lastUsed: u.lastUsed
        })),
      dateRange: {
        startDate: campaign.startDate,
        endDate: campaign.endDate,
        daysRemaining: Math.ceil((campaign.endDate - new Date()) / (1000 * 60 * 60 * 24))
      },
      status: {
        current: campaign.status,
        isActive: campaign.isActive,
        canBeUsed: campaign.isActive && campaign.remainingUses > 0
      }
    };

    res.status(200).json({
      success: true,
      data: analytics
    });

  } catch (error) {
    logger.error('Error fetching campaign analytics:', error);
    next(error);
  }
};

/**
 * @desc    Duplicate campaign
 * @route   POST /api/v1/promos/:id/duplicate
 * @access  Super Admin
 */
exports.duplicateCampaign = async (req, res, next) => {
  try {
    const originalCampaign = await PromotionalCampaign.findById(req.params.id);

    if (!originalCampaign) {
      return next(new AppError('Campaign not found', 404));
    }

    // Generate new code
    const newCode = `${originalCampaign.code}_COPY_${Date.now()}`;

    // Create duplicate
    const duplicatedCampaign = await PromotionalCampaign.create({
      name: `${originalCampaign.name} (Copy)`,
      code: newCode,
      description: originalCampaign.description,
      discountType: originalCampaign.discountType,
      discountValue: originalCampaign.discountValue,
      maxDiscount: originalCampaign.maxDiscount,
      minBookingAmount: originalCampaign.minBookingAmount,
      applicableServices: originalCampaign.applicableServices,
      applicableCompanies: originalCampaign.applicableCompanies,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      usageLimit: originalCampaign.usageLimit,
      perUserLimit: originalCampaign.perUserLimit,
      termsAndConditions: originalCampaign.termsAndConditions,
      conditions: originalCampaign.conditions,
      stackable: originalCampaign.stackable,
      priority: originalCampaign.priority,
      campaignType: originalCampaign.campaignType,
      status: 'inactive',
      createdBy: req.user._id
    });

    logger.info(`Campaign duplicated: ${originalCampaign.code} -> ${newCode}`);

    res.status(201).json({
      success: true,
      message: 'Campaign duplicated successfully',
      data: duplicatedCampaign
    });

  } catch (error) {
    logger.error('Error duplicating campaign:', error);
    next(error);
  }
};

/**
 * @desc    Get campaign statistics
 * @route   GET /api/v1/promos/statistics
 * @access  Super Admin
 */
exports.getCampaignStatistics = async (req, res, next) => {
  try {
    const totalCampaigns = await PromotionalCampaign.countDocuments();
    const activeCampaigns = await PromotionalCampaign.countDocuments({ status: 'active' });
    const scheduledCampaigns = await PromotionalCampaign.countDocuments({ status: 'scheduled' });
    const expiredCampaigns = await PromotionalCampaign.countDocuments({ status: 'expired' });

    const usageStats = await PromotionalCampaign.aggregate([
      {
        $group: {
          _id: null,
          totalUsage: { $sum: '$usageCount' },
          totalSavings: { $sum: '$totalSavings' },
          avgUsageRate: { 
            $avg: { 
              $multiply: [
                { $divide: ['$usageCount', '$usageLimit'] },
                100
              ]
            }
          }
        }
      }
    ]);

    const stats = {
      campaigns: {
        total: totalCampaigns,
        active: activeCampaigns,
        scheduled: scheduledCampaigns,
        expired: expiredCampaigns,
        inactive: totalCampaigns - activeCampaigns - scheduledCampaigns - expiredCampaigns
      },
      usage: usageStats[0] || {
        totalUsage: 0,
        totalSavings: 0,
        avgUsageRate: 0
      }
    };

    res.status(200).json({
      success: true,
      data: stats
    });

  } catch (error) {
    logger.error('Error fetching campaign statistics:', error);
    next(error);
  }
};
