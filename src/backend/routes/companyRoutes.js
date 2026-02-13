/**
 * Company Routes
 */

const express = require('express');
const router = express.Router();

const companyController = require('../controllers/companyController');
const { protect, authorize, verifyCompanyAccess } = require('../middleware/auth');

// Public GET routes (no auth required)
router.get('/', companyController.getAllCompanies);
router.get('/statistics', companyController.getStatistics);
router.get('/:id', companyController.getCompanyById);

// Public POST for creating companies (registration)
router.post('/', companyController.createCompany);

// Public PUT/DELETE for updating/deleting companies (for demo purposes)
router.put('/:id', companyController.updateCompany);
router.delete('/:id', companyController.deleteCompany);

// Public PATCH for status/verify (for demo purposes)
router.patch('/:id/status', companyController.updateCompanyStatus);
router.patch('/:id/verify', companyController.verifyCompany);

// Protected routes - require authentication from here
router.use(protect);

// Company employees
router.get('/:id/employees', verifyCompanyAccess, companyController.getCompanyEmployees);
router.post('/:id/employees', authorize('company_admin'), verifyCompanyAccess, companyController.addEmployee);

// Company wallet
router.get('/:id/wallet', verifyCompanyAccess, companyController.getCompanyWallet);
router.post('/:id/wallet/recharge', authorize('super_admin', 'company_admin'), verifyCompanyAccess, companyController.rechargeWallet);

// Company bookings
router.get('/:id/bookings', verifyCompanyAccess, companyController.getCompanyBookings);
router.get('/:id/reports', verifyCompanyAccess, companyController.getCompanyReports);

module.exports = router;
