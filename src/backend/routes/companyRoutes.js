/**
 * Company Routes
 */

const express = require('express');
const router = express.Router();

const companyController = require('../controllers/companyController');
const { protect, authorize, verifyCompanyAccess } = require('../middleware/auth');

// Protect all routes
router.use(protect);

// Super Admin routes
router.post('/', authorize('super_admin'), companyController.createCompany);
router.get('/', authorize('super_admin'), companyController.getAllCompanies);
router.get('/statistics', authorize('super_admin'), companyController.getStatistics);

// Company-specific routes
router.get('/:id', verifyCompanyAccess, companyController.getCompanyById);
router.put('/:id', authorize('super_admin', 'company_admin'), verifyCompanyAccess, companyController.updateCompany);
router.delete('/:id', authorize('super_admin'), companyController.deleteCompany);

// Company status management
router.patch('/:id/status', authorize('super_admin'), companyController.updateCompanyStatus);
router.patch('/:id/verify', authorize('super_admin'), companyController.verifyCompany);

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
