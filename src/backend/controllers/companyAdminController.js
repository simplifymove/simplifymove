/**
 * Company Admin Controller
 * Handles company admin portal features
 */

const Company = require('../models/Company');
const User = require('../models/User');
const Booking = require('../models/Booking');
const Wallet = require('../models/Wallet');
const Notification = require('../models/Notification');
const { AppError } = require('../middleware/errorHandler');
const { logger } = require('../utils/logger');

/**
 * @desc    Get company admin dashboard
 * @route   GET /api/v1/company-admin/dashboard
 * @access  Company Admin
 */
exports.getDashboard = async (req, res, next) => {
  try {
    const companyId = req.user.company;

    // Get company details
    const company = await Company.findById(companyId);

    // Get company wallet
    let wallet = await Wallet.findByOwner(companyId, 'Company');
    if (!wallet) {
      wallet = await Wallet.createWallet(companyId, 'Company', 0);
    }

    // Get employee count
    const totalEmployees = await User.countDocuments({ 
      company: companyId, 
      role: { $in: ['employee', 'company_admin'] },
      status: 'active'
    });

    // Get booking statistics
    const totalBookings = await Booking.countDocuments({ company: companyId });
    const pendingApprovals = await Booking.countDocuments({ 
      company: companyId, 
      approvalStatus: 'pending' 
    });
    const thisMonthBookings = await Booking.countDocuments({
      company: companyId,
      createdAt: {
        $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      }
    });

    // Get spending data
    const spendingData = await Booking.aggregate([
      {
        $match: {
          company: companyId,
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

    // Get this month spending
    const thisMonthSpending = await Booking.aggregate([
      {
        $match: {
          company: companyId,
          paymentStatus: 'completed',
          createdAt: {
            $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$finalAmount' }
        }
      }
    ]);

    // Get recent bookings
    const recentBookings = await Booking.find({ company: companyId })
      .populate('user', 'name email department')
      .sort({ createdAt: -1 })
      .limit(10);

    // Get pending approvals
    const pendingApprovalsList = await Booking.find({
      company: companyId,
      requiresApproval: true,
      approvalStatus: 'pending'
    })
      .populate('user', 'name email department')
      .sort({ createdAt: -1 })
      .limit(5);

    // Get top spenders
    const topSpenders = await Booking.aggregate([
      {
        $match: {
          company: companyId,
          paymentStatus: 'completed'
        }
      },
      {
        $group: {
          _id: '$user',
          totalSpent: { $sum: '$finalAmount' },
          bookingCount: { $sum: 1 }
        }
      },
      {
        $sort: { totalSpent: -1 }
      },
      {
        $limit: 5
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      }
    ]);

    // Get service-wise spending
    const serviceWiseSpending = await Booking.aggregate([
      {
        $match: {
          company: companyId,
          paymentStatus: 'completed'
        }
      },
      {
        $group: {
          _id: '$serviceType',
          totalSpent: { $sum: '$finalAmount' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { totalSpent: -1 }
      }
    ]);

    const dashboard = {
      company: {
        name: company.name,
        companyId: company.companyId,
        status: company.status,
        subscription: company.subscription
      },
      wallet: {
        balance: wallet.balance,
        creditLimit: wallet.creditLimit,
        availableBalance: wallet.availableBalance
      },
      employees: {
        total: totalEmployees,
        limit: company.employeeLimit || 'Unlimited'
      },
      bookings: {
        total: totalBookings,
        thisMonth: thisMonthBookings,
        pendingApprovals
      },
      spending: {
        total: spendingData[0]?.totalSpent || 0,
        savings: spendingData[0]?.totalSavings || 0,
        thisMonth: thisMonthSpending[0]?.total || 0
      },
      recentBookings,
      pendingApprovals: pendingApprovalsList,
      topSpenders,
      serviceWiseSpending
    };

    res.status(200).json({
      success: true,
      data: dashboard
    });

  } catch (error) {
    logger.error('Error fetching company admin dashboard:', error);
    next(error);
  }
};

/**
 * @desc    Get company employees
 * @route   GET /api/v1/company-admin/employees
 * @access  Company Admin
 */
exports.getEmployees = async (req, res, next) => {
  try {
    const { status, department, search, page = 1, limit = 20 } = req.query;

    const query = { 
      company: req.user.company,
      role: { $in: ['employee', 'company_admin'] }
    };

    if (status) query.status = status;
    if (department) query.department = department;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { employeeId: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const employees = await User.find(query)
      .select('-password')
      .populate('wallet')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      data: employees,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    logger.error('Error fetching employees:', error);
    next(error);
  }
};

/**
 * @desc    Add new employee
 * @route   POST /api/v1/company-admin/employees
 * @access  Company Admin
 */
exports.addEmployee = async (req, res, next) => {
  try {
    const {
      name, email, phone, password, department, designation,
      employeeId, permissions, requiresApproval, approvalLimit
    } = req.body;

    const companyId = req.user.company;

    // Get company
    const company = await Company.findById(companyId);

    // Check employee limit
    if (!company.canAddEmployee()) {
      return next(new AppError('Employee limit reached', 400));
    }

    // Check if email exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new AppError('Email already exists', 400));
    }

    // Check if employeeId exists in company
    if (employeeId) {
      const existingEmpId = await User.findOne({ 
        employeeId, 
        company: companyId 
      });
      if (existingEmpId) {
        return next(new AppError('Employee ID already exists', 400));
      }
    }

    // Create user
    const user = await User.create({
      name,
      email,
      phone,
      password,
      role: 'employee',
      company: companyId,
      department,
      designation,
      employeeId,
      permissions: permissions || [],
      requiresApproval: requiresApproval || company.bookingSettings.requiresApproval,
      approvalLimit: approvalLimit || company.bookingSettings.approvalThreshold,
      status: 'active'
    });

    // Create wallet for employee
    await Wallet.createWallet(user._id, 'User', 0);

    // Update company employee count
    company.currentEmployeeCount += 1;
    await company.save();

    // Create notification for employee
    await Notification.createNotification({
      user: user._id,
      company: companyId,
      title: 'Welcome to SimplifyMove',
      message: `Your account has been created. You can now start booking travel and logistics services.`,
      type: 'system',
      priority: 'high'
    });

    logger.info(`Employee added: ${email} to company ${company.name}`);

    res.status(201).json({
      success: true,
      message: 'Employee added successfully',
      data: user
    });

  } catch (error) {
    logger.error('Error adding employee:', error);
    next(error);
  }
};

/**
 * @desc    Update employee
 * @route   PUT /api/v1/company-admin/employees/:id
 * @access  Company Admin
 */
exports.updateEmployee = async (req, res, next) => {
  try {
    const {
      department, designation, permissions,
      requiresApproval, approvalLimit, status
    } = req.body;

    const employee = await User.findById(req.params.id);

    if (!employee) {
      return next(new AppError('Employee not found', 404));
    }

    // Check if employee belongs to company
    if (employee.company.toString() !== req.user.company.toString()) {
      return next(new AppError('Access denied', 403));
    }

    const updateData = {};
    if (department) updateData.department = department;
    if (designation) updateData.designation = designation;
    if (permissions) updateData.permissions = permissions;
    if (typeof requiresApproval !== 'undefined') {
      updateData.requiresApproval = requiresApproval;
    }
    if (approvalLimit) updateData.approvalLimit = approvalLimit;
    if (status) updateData.status = status;

    const updatedEmployee = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    logger.info(`Employee updated: ${updatedEmployee.email}`);

    res.status(200).json({
      success: true,
      message: 'Employee updated successfully',
      data: updatedEmployee
    });

  } catch (error) {
    logger.error('Error updating employee:', error);
    next(error);
  }
};

/**
 * @desc    Deactivate employee
 * @route   DELETE /api/v1/company-admin/employees/:id
 * @access  Company Admin
 */
exports.deactivateEmployee = async (req, res, next) => {
  try {
    const employee = await User.findById(req.params.id);

    if (!employee) {
      return next(new AppError('Employee not found', 404));
    }

    // Check if employee belongs to company
    if (employee.company.toString() !== req.user.company.toString()) {
      return next(new AppError('Access denied', 403));
    }

    employee.status = 'inactive';
    await employee.save();

    // Update company employee count
    const company = await Company.findById(req.user.company);
    company.currentEmployeeCount = Math.max(0, company.currentEmployeeCount - 1);
    await company.save();

    logger.info(`Employee deactivated: ${employee.email}`);

    res.status(200).json({
      success: true,
      message: 'Employee deactivated successfully'
    });

  } catch (error) {
    logger.error('Error deactivating employee:', error);
    next(error);
  }
};

/**
 * @desc    Get company bookings
 * @route   GET /api/v1/company-admin/bookings
 * @access  Company Admin
 */
exports.getCompanyBookings = async (req, res, next) => {
  try {
    const { 
      status, serviceType, user, 
      startDate, endDate, page = 1, limit = 20 
    } = req.query;

    const query = { company: req.user.company };

    if (status) query.status = status;
    if (serviceType) query.serviceType = serviceType;
    if (user) query.user = user;
    
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const bookings = await Booking.find(query)
      .populate('user', 'name email department')
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
    logger.error('Error fetching company bookings:', error);
    next(error);
  }
};

/**
 * @desc    Get company settings
 * @route   GET /api/v1/company-admin/settings
 * @access  Company Admin
 */
exports.getSettings = async (req, res, next) => {
  try {
    const company = await Company.findById(req.user.company);

    res.status(200).json({
      success: true,
      data: company
    });

  } catch (error) {
    logger.error('Error fetching settings:', error);
    next(error);
  }
};

/**
 * @desc    Update company settings
 * @route   PUT /api/v1/company-admin/settings
 * @access  Company Admin
 */
exports.updateSettings = async (req, res, next) => {
  try {
    const {
      bookingSettings, walletSettings, notificationSettings
    } = req.body;

    const updateData = {};
    if (bookingSettings) updateData.bookingSettings = bookingSettings;
    if (walletSettings) updateData.wallet = walletSettings;
    if (notificationSettings) {
      updateData.notificationSettings = notificationSettings;
    }

    const company = await Company.findByIdAndUpdate(
      req.user.company,
      updateData,
      { new: true, runValidators: true }
    );

    logger.info(`Company settings updated: ${company.name}`);

    res.status(200).json({
      success: true,
      message: 'Settings updated successfully',
      data: company
    });

  } catch (error) {
    logger.error('Error updating settings:', error);
    next(error);
  }
};

/**
 * @desc    Get company reports
 * @route   GET /api/v1/company-admin/reports
 * @access  Company Admin
 */
exports.getReports = async (req, res, next) => {
  try {
    const { period = 'month', startDate, endDate } = req.query;

    const companyId = req.user.company;

    const now = new Date();
    let queryStartDate;

    if (startDate) {
      queryStartDate = new Date(startDate);
    } else {
      switch (period) {
        case 'week':
          queryStartDate = new Date(now.setDate(now.getDate() - 7));
          break;
        case 'month':
          queryStartDate = new Date(now.setMonth(now.getMonth() - 1));
          break;
        case 'year':
          queryStartDate = new Date(now.setFullYear(now.getFullYear() - 1));
          break;
        default:
          queryStartDate = new Date(0);
      }
    }

    const queryEndDate = endDate ? new Date(endDate) : new Date();

    // Service-wise report
    const serviceReport = await Booking.aggregate([
      {
        $match: {
          company: companyId,
          paymentStatus: 'completed',
          createdAt: { $gte: queryStartDate, $lte: queryEndDate }
        }
      },
      {
        $group: {
          _id: '$serviceType',
          totalBookings: { $sum: 1 },
          totalSpent: { $sum: '$finalAmount' },
          totalSavings: { $sum: '$promoDiscount' }
        }
      }
    ]);

    // Department-wise report
    const departmentReport = await Booking.aggregate([
      {
        $match: {
          company: companyId,
          paymentStatus: 'completed',
          createdAt: { $gte: queryStartDate, $lte: queryEndDate }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'userDetails'
        }
      },
      {
        $unwind: '$userDetails'
      },
      {
        $group: {
          _id: '$userDetails.department',
          totalBookings: { $sum: 1 },
          totalSpent: { $sum: '$finalAmount' }
        }
      }
    ]);

    // Monthly trend
    const monthlyTrend = await Booking.aggregate([
      {
        $match: {
          company: companyId,
          paymentStatus: 'completed',
          createdAt: { $gte: queryStartDate, $lte: queryEndDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          totalBookings: { $sum: 1 },
          totalSpent: { $sum: '$finalAmount' }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        period: {
          startDate: queryStartDate,
          endDate: queryEndDate
        },
        serviceWise: serviceReport,
        departmentWise: departmentReport,
        monthlyTrend
      }
    });

  } catch (error) {
    logger.error('Error fetching reports:', error);
    next(error);
  }
};
