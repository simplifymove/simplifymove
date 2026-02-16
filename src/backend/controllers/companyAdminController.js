/**
 * Company Admin Controller
 * Handles company admin portal features
 */

const { getModels } = require('../models');
const { AppError } = require('../middleware/errorHandler');
const { logger } = require('../utils/logger');
const { createAuditLog, getChanges } = require('../utils/auditLog');

/**
 * @desc    Get company admin dashboard
 * @route   GET /api/v1/company-admin/dashboard
 * @access  Company Admin
 */
exports.getDashboard = async (req, res, next) => {
  try {
    const { Company, User, Booking } = getModels();
    const companyId = req.user.company;

    // Get company details
    const company = await Company.findByPk(companyId);

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
    const { User } = getModels();
    const { status, department, search, page = 1, limit = 20 } = req.query;

    const where = { 
      companyId: req.user.company,
      role: { [require('sequelize').Op.in]: ['employee', 'company_admin'] }
    };

    if (status) where.status = status;
    if (department) where.department = department;
    if (search) {
      const { Op } = require('sequelize');
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { employeeId: { [Op.like]: `%${search}%` } }
      ];
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows: employees } = await User.findAndCountAll({
      where,
      attributes: { exclude: ['password'] },
      offset,
      limit: parseInt(limit),
      order: [['createdAt', 'DESC']]
    });

    const total = count;

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
    const { Company, User, Wallet, Notification } = getModels();
    const {
      name, email, phone, password, department, designation,
      employeeId, permissions, requiresApproval, approvalLimit
    } = req.body;

    const companyId = req.user.company;
    
    // Debug logging
    logger.info(`ADD EMPLOYEE DEBUG: req.user.company=${companyId}, req.user.companyId=${req.user.companyId}, req.user.id=${req.user.id}`);

    // Get company
    const company = await Company.findByPk(companyId);
    
    logger.info(`Company lookup result for ${companyId}: ${company ? company.name : 'NOT FOUND'}`);

    if (!company) {
      logger.error(`Company not found for ID: ${companyId}`);
      return next(new AppError('Company not found', 404));
    }

    // Check if email exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return next(new AppError('Email already exists', 400));
    }

    // Check if employeeId exists in company
    if (employeeId) {
      const existingEmpId = await User.findOne({ 
        where: { 
          employeeId, 
          companyId: companyId 
        }
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
      companyId: companyId,
      department,
      designation,
      employeeId,
      permissions: permissions || [],
      requiresApproval: requiresApproval || false,
      approvalLimit: approvalLimit || 0,
      status: 'active'
    });

    // Create notification for employee
    try {
      await Notification.create({
        userId: user.id,
        companyId: companyId,
        title: 'Welcome to SimplifyMove',
        message: `Your account has been created. You can now start booking travel and logistics services.`,
        type: 'system',
        priority: 'high'
      });
    } catch (err) {
      logger.error('Failed to create notification:', err);
    }

    // Log audit trail for employee addition
    await createAuditLog({
      action: 'Employee Added',
      category: 'user',
      performedBy: req.user.id,
      performedByRole: req.user.role,
      companyId: companyId,
      targetEntity: 'User',
      targetId: user.id,
      details: `New employee "${name}" (${email}) added to company "${company.name}"`,
      changes: [
        { field: 'Name', oldValue: '-', newValue: name },
        { field: 'Email', oldValue: '-', newValue: email },
        { field: 'Department', oldValue: '-', newValue: department || '-' },
        { field: 'Designation', oldValue: '-', newValue: designation || '-' },
        { field: 'Status', oldValue: '-', newValue: 'active' }
      ],
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('user-agent'),
      status: 'success',
      severity: 'medium'
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
    const { User } = getModels();
    const {
      department, designation, permissions,
      requiresApproval, approvalLimit, status
    } = req.body;

    const employee = await User.findByPk(req.params.id);

    if (!employee) {
      return next(new AppError('Employee not found', 404));
    }

    // Check if employee belongs to company
    if (employee.companyId !== req.user.company) {
      return next(new AppError('Access denied', 403));
    }

    // Capture old data for audit
    const oldData = {
      department: employee.department,
      designation: employee.designation,
      permissions: employee.permissions,
      requiresApproval: employee.requiresApproval,
      approvalLimit: employee.approvalLimit,
      status: employee.status
    };

    const updateData = {};
    if (department) updateData.department = department;
    if (designation) updateData.designation = designation;
    if (permissions) updateData.permissions = permissions;
    if (typeof requiresApproval !== 'undefined') {
      updateData.requiresApproval = requiresApproval;
    }
    if (approvalLimit) updateData.approvalLimit = approvalLimit;
    if (status) updateData.status = status;

    await employee.update(updateData);

    // Build changes array
    const changes = [];
    if (department && oldData.department !== department) {
      changes.push({ field: 'Department', oldValue: oldData.department || '-', newValue: department });
    }
    if (designation && oldData.designation !== designation) {
      changes.push({ field: 'Designation', oldValue: oldData.designation || '-', newValue: designation });
    }
    if (status && oldData.status !== status) {
      changes.push({ field: 'Status', oldValue: oldData.status, newValue: status });
    }
    if (requiresApproval !== undefined && oldData.requiresApproval !== requiresApproval) {
      changes.push({ field: 'Requires Approval', oldValue: String(oldData.requiresApproval), newValue: String(requiresApproval) });
    }
    if (approvalLimit && oldData.approvalLimit !== approvalLimit) {
      changes.push({ field: 'Approval Limit', oldValue: String(oldData.approvalLimit), newValue: String(approvalLimit) });
    }

    // Log audit trail for employee update
    if (changes.length > 0) {
      await createAuditLog({
        action: 'Employee Updated',
        category: 'user',
        performedBy: req.user.id,
        performedByRole: req.user.role,
        companyId: req.user.company,
        targetEntity: 'User',
        targetId: employee.id,
        details: `Employee "${employee.name}" updated with ${changes.length} field(s)`,
        changes,
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.get('user-agent'),
        status: 'success',
        severity: 'medium'
      });
    }

    logger.info(`Employee updated: ${employee.email}`);

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
    const { User, Company } = getModels();
    const employee = await User.findByPk(req.params.id);

    if (!employee) {
      return next(new AppError('Employee not found', 404));
    }

    // Check if employee belongs to company
    if (employee.companyId !== req.user.company) {
      return next(new AppError('Access denied', 403));
    }

    const oldStatus = employee.status;
    await employee.update({ status: 'inactive' });

    // Get company details for audit log
    const company = await Company.findByPk(req.user.company);

    // Log audit trail for employee deactivation
    await createAuditLog({
      action: 'Employee Deactivated',
      category: 'user',
      performedBy: req.user.id,
      performedByRole: req.user.role,
      companyId: req.user.company,
      targetEntity: 'User',
      targetId: employee.id,
      details: `Employee "${employee.name}" (${employee.email}) deactivated from company "${company?.name || 'Unknown'}"`,
      changes: [
        { field: 'Status', oldValue: oldStatus, newValue: 'inactive' }
      ],
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('user-agent'),
      status: 'success',
      severity: 'medium'
    });

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
    const { Booking, User } = getModels();
    const { 
      status, serviceType, user, 
      startDate, endDate, page = 1, limit = 20 
    } = req.query;

    const { Op } = require('sequelize');
    const where = { companyId: req.user.company };

    if (status) where.status = status;
    if (serviceType) where.serviceType = serviceType;
    if (user) where.userId = user;
    
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt[Op.gte] = new Date(startDate);
      if (endDate) where.createdAt[Op.lte] = new Date(endDate);
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows: bookings } = await Booking.findAndCountAll({
      where,
      include: [
        { model: User, as: 'user', attributes: ['name', 'email', 'department'] },
        { model: User, as: 'approvedBy', attributes: ['name', 'email'] }
      ],
      offset,
      limit: parseInt(limit),
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      data: bookings,
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / parseInt(limit)),
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
    const { Company } = getModels();
    const company = await Company.findByPk(req.user.company);

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
    const { Company } = getModels();
    const {
      bookingSettings, walletSettings, notificationSettings
    } = req.body;

    const company = await Company.findByPk(req.user.company);
    const oldData = company.toJSON();

    const updateData = {};
    if (bookingSettings) updateData.bookingSettings = bookingSettings;
    if (walletSettings) updateData.walletSettings = walletSettings;
    if (notificationSettings) {
      updateData.notificationSettings = notificationSettings;
    }

    await company.update(updateData);

    // Build changes array
    const changes = [];
    if (bookingSettings) {
      changes.push({ 
        field: 'Booking Settings', 
        oldValue: JSON.stringify(oldData.bookingSettings || {}), 
        newValue: JSON.stringify(bookingSettings) 
      });
    }
    if (walletSettings) {
      changes.push({ 
        field: 'Wallet Settings', 
        oldValue: JSON.stringify(oldData.walletSettings || {}), 
        newValue: JSON.stringify(walletSettings) 
      });
    }
    if (notificationSettings) {
      changes.push({ 
        field: 'Notification Settings', 
        oldValue: JSON.stringify(oldData.notificationSettings || {}), 
        newValue: JSON.stringify(notificationSettings) 
      });
    }

    // Log audit trail for settings update
    if (changes.length > 0) {
      await createAuditLog({
        action: 'Company Settings Updated',
        category: 'company',
        performedBy: req.user.id,
        performedByRole: req.user.role,
        companyId: req.user.company,
        targetEntity: 'Company',
        targetId: company.id,
        details: `Company settings updated with ${changes.length} field(s)`,
        changes,
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.get('user-agent'),
        status: 'success',
        severity: 'medium'
      });
    }

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
