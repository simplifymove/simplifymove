/**
 * Wallet Routes
 */

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  getWallet,
  getCompanyWallet,
  rechargeWallet,
  rechargeCompanyWallet,
  getTransactions,
  getTransactionSummary,
  transferFunds,
  deductFromWallet
} = require('../controllers/walletController');

const { protect, authorize } = require('../middleware/auth');

// Recharge validation
const rechargeValidation = [
  body('amount').isFloat({ min: 1 }).withMessage('Amount must be greater than 0'),
  body('paymentMethod').notEmpty().withMessage('Payment method is required')
];

// Transfer validation
const transferValidation = [
  body('amount').isFloat({ min: 1 }).withMessage('Amount must be greater than 0'),
  body('toUserId').notEmpty().withMessage('Recipient user ID is required')
];

// Protect all routes
router.use(protect);

// Company wallet routes
router.get('/company/:companyId', getCompanyWallet);
router.post(
  '/company/:companyId/recharge',
  authorize('company_admin', 'super_admin'),
  rechargeValidation,
  rechargeCompanyWallet
);

// User wallet routes
router.get('/:userId', getWallet);
router.post('/:userId/recharge', rechargeValidation, rechargeWallet);
router.get('/:userId/transactions', getTransactions);
router.get('/:userId/summary', getTransactionSummary);
router.post('/:userId/transfer', transferValidation, transferFunds);

// Admin operations
router.post(
  '/:userId/deduct',
  authorize('super_admin'),
  body('amount').isFloat({ min: 1 }).withMessage('Amount must be greater than 0'),
  deductFromWallet
);

module.exports = router;
