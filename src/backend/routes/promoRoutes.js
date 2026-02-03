/**
 * Promotional Campaign Routes
 */

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  createCampaign,
  getAllCampaigns,
  getCampaignById,
  updateCampaign,
  deleteCampaign,
  toggleCampaignStatus,
  validatePromoCode,
  getCampaignAnalytics,
  duplicateCampaign,
  getCampaignStatistics
} = require('../controllers/promoController');

const { protect, authorize } = require('../middleware/auth');

// Validation middleware
const campaignValidation = [
  body('name').notEmpty().trim().withMessage('Campaign name is required'),
  body('code')
    .notEmpty()
    .trim()
    .toUpperCase()
    .matches(/^[A-Z0-9_-]+$/)
    .withMessage('Promo code can only contain letters, numbers, underscores and hyphens'),
  body('description').notEmpty().trim().withMessage('Description is required'),
  body('discountType')
    .isIn(['percentage', 'flat', 'cashback'])
    .withMessage('Invalid discount type'),
  body('discountValue')
    .isFloat({ min: 0 })
    .withMessage('Discount value must be a positive number'),
  body('minBookingAmount')
    .isFloat({ min: 0 })
    .withMessage('Minimum booking amount must be a positive number'),
  body('applicableServices')
    .isArray({ min: 1 })
    .withMessage('At least one service must be selected'),
  body('applicableCompanies')
    .isArray({ min: 1 })
    .withMessage('At least one company must be selected'),
  body('startDate')
    .isISO8601()
    .withMessage('Invalid start date'),
  body('endDate')
    .isISO8601()
    .withMessage('Invalid end date'),
  body('usageLimit')
    .isInt({ min: 1 })
    .withMessage('Usage limit must be at least 1'),
  body('perUserLimit')
    .isInt({ min: 1 })
    .withMessage('Per user limit must be at least 1')
];

// Protect all routes
router.use(protect);

// Public routes (for employees)
router.post('/validate', validatePromoCode);

// Super Admin only routes
router.post('/', authorize('super_admin'), campaignValidation, createCampaign);
router.get('/statistics', authorize('super_admin'), getCampaignStatistics);

// Super Admin and Company Admin routes
router.get('/', authorize('super_admin', 'company_admin'), getAllCampaigns);
router.get('/:id', authorize('super_admin', 'company_admin'), getCampaignById);
router.get('/:id/analytics', authorize('super_admin'), getCampaignAnalytics);

// Super Admin only update/delete routes
router.put('/:id', authorize('super_admin'), campaignValidation, updateCampaign);
router.delete('/:id', authorize('super_admin'), deleteCampaign);
router.patch('/:id/toggle-status', authorize('super_admin'), toggleCampaignStatus);
router.post('/:id/duplicate', authorize('super_admin'), duplicateCampaign);

module.exports = router;
