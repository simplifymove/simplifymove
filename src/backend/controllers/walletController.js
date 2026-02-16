/**
 * Wallet Controller
 * Manages wallet operations for users and companies
 */

const Wallet = require('../models/Wallet');
const Company = require('../models/Company');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { AppError } = require('../middleware/errorHandler');
const { logger } = require('../utils/logger');

/**
 * @desc    Get wallet details
 * @route   GET /api/v1/wallets/:userId
 * @access  User (own), Company Admin, Super Admin
 */
exports.getWallet = async (req, res, next) => {
  try {
    const { userId } = req.params;

    // Check permissions
    if (req.user.role === 'employee' && userId !== req.user._id.toString()) {
      return next(new AppError('You can only access your own wallet', 403));
    }

    const user = await User.findById(userId);
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    // Company admin can only view wallets of employees in their company
    if (req.user.role === 'company_admin') {
      if (user.company.toString() !== req.user.company.toString()) {
        return next(new AppError('Access denied', 403));
      }
    }

    let wallet = await Wallet.findByOwner(userId, 'User');

    // Create wallet if doesn't exist
    if (!wallet) {
      wallet = await Wallet.createWallet(userId, 'User', 0);
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
 * @desc    Get company wallet
 * @route   GET /api/v1/wallets/company/:companyId
 * @access  Company Admin, Super Admin
 */
exports.getCompanyWallet = async (req, res, next) => {
  try {
    const { companyId } = req.params;

    // Check permissions
    if (req.user.role === 'company_admin' && companyId !== req.user.company.toString()) {
      return next(new AppError('Access denied', 403));
    }

    const company = await Company.findById(companyId);
    if (!company) {
      return next(new AppError('Company not found', 404));
    }

    let wallet = await Wallet.findByOwner(companyId, 'Company');

    // Create wallet if doesn't exist
    if (!wallet) {
      wallet = await Wallet.createWallet(companyId, 'Company', 0);
    }

    res.status(200).json({
      success: true,
      data: wallet
    });

  } catch (error) {
    logger.error('Error fetching company wallet:', error);
    next(error);
  }
};

/**
 * @desc    Get company wallet summary with employee balances
 * @route   GET /api/v1/wallets/company/:companyId/summary
 * @access  Company Admin, Super Admin
 */
exports.getCompanyWalletSummary = async (req, res, next) => {
  try {
    const { companyId } = req.params;
    const { getModels } = require('../models/index');
    const models = getModels();
    const { User, Wallet, WalletTransaction } = models;

    // Check permissions
    if (req.user.role === 'company_admin' && companyId !== req.user.company.toString()) {
      return next(new AppError('Access denied', 403));
    }

    // Get company wallet
    let companyWallet = await Wallet.findByOwner(companyId, 'Company');
    if (!companyWallet) {
      companyWallet = await Wallet.createWallet(companyId, 'Company', 0);
    }

    // Get all employees in the company
    const employees = await User.findAll({
      where: { companyId: companyId, role: 'employee' }
    });

    // Get wallet balance for each employee
    const employeeWallets = [];
    for (const employee of employees) {
      let empWallet = await Wallet.findByOwner(employee.id || employee._id, 'User');
      if (!empWallet) {
        empWallet = await Wallet.createWallet(employee.id || employee._id, 'User', 0);
      }
      employeeWallets.push({
        employeeId: employee.id || employee._id,
        employeeName: employee.name,
        email: employee.email,
        walletBalance: empWallet.balance,
        totalCredited: empWallet.totalCredited,
        totalDebited: empWallet.totalDebited,
        status: empWallet.status
      });
    }

    // Get recent transactions across all employee wallets
    const recentTransactions = await WalletTransaction.findAll({
      limit: 50,
      order: [['createdAt', 'DESC']]
    });

    // Map transactions to include employee information
    const transactionsWithEmployees = [];
    for (const transaction of recentTransactions) {
      try {
        // Get the wallet for this transaction
        const wallet = await Wallet.findByPk(transaction.walletId);
        if (!wallet || wallet.ownerModel !== 'User') continue;

        // Get the employee who owns the wallet
        const employee = await User.findByPk(wallet.ownerId);
        if (!employee) continue;

        transactionsWithEmployees.push({
          id: transaction.id,
          type: transaction.type,
          amount: transaction.amount,
          description: transaction.description,
          status: transaction.status,
          createdAt: transaction.createdAt,
          employeeName: employee.name,
          employeeId: employee.id || employee._id,
          email: employee.email
        });
      } catch (err) {
        logger.warn(`Error processing transaction ${transaction.id}:`, err.message);
        continue;
      }
    }

    res.status(200).json({
      success: true,
      data: {
        companyWallet: {
          id: companyWallet.id,
          balance: companyWallet.balance,
          totalCredited: companyWallet.totalCredited,
          totalDebited: companyWallet.totalDebited,
          status: companyWallet.status
        },
        employeeWallets,
        recentTransactions: transactionsWithEmployees,
        summary: {
          totalEmployees: employees.length,
          totalAllocated: employeeWallets.reduce((sum, w) => sum + parseFloat(w.totalCredited || 0), 0),
          totalSpent: employeeWallets.reduce((sum, w) => sum + parseFloat(w.totalDebited || 0), 0),
          corporateWalletBalance: parseFloat(companyWallet.balance || 0)
        }
      }
    });

  } catch (error) {
    logger.error('Error fetching company wallet summary:', error);
    next(error);
  }
};

/**
 * @desc    Recharge wallet
 * @route   POST /api/v1/wallets/:userId/recharge
 * @access  User (own), Company Admin, Super Admin
 */
exports.rechargeWallet = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { amount, paymentMethod, paymentId, transactionId } = req.body;

    if (!amount || amount <= 0) {
      return next(new AppError('Valid amount is required', 400));
    }

    if (!paymentMethod) {
      return next(new AppError('Payment method is required', 400));
    }

    // Check permissions
    if (req.user.role === 'employee' && userId !== req.user._id.toString()) {
      return next(new AppError('You can only recharge your own wallet', 403));
    }

    let wallet = await Wallet.findByOwner(userId, 'User');

    // Create wallet if doesn't exist
    if (!wallet) {
      wallet = await Wallet.createWallet(userId, 'User', 0);
    }

    // Add credit to wallet
    const transaction = await wallet.credit(
      amount,
      'Wallet recharge',
      'recharge',
      null,
      {
        paymentMethod,
        paymentId,
        transactionId
      }
    );

    // Update company wallet if company pays
    if (req.user.role === 'company_admin') {
      const user = await User.findById(userId);
      const companyWallet = await Wallet.findByOwner(user.company, 'Company');
      
      if (companyWallet) {
        await companyWallet.debit(
          amount,
          `Wallet recharge for ${user.name}`,
          'transfer_out',
          { model: 'User', id: userId }
        );
      }
    }

    // Create notification
    await Notification.createNotification({
      user: userId,
      title: 'Wallet Recharged',
      message: `Your wallet has been recharged with ₹${amount}. New balance: ₹${wallet.balance}`,
      type: 'wallet',
      priority: 'medium'
    });

    logger.info(`Wallet recharged: User ${userId} - ₹${amount}`);

    // Emit socket event
    const io = req.app.get('io');
    if (io) {
      io.emitToUser(userId, 'wallet:recharged', { 
        amount, 
        balance: wallet.balance,
        transaction 
      });
    }

    res.status(200).json({
      success: true,
      message: 'Wallet recharged successfully',
      data: {
        wallet,
        transaction
      }
    });

  } catch (error) {
    logger.error('Error recharging wallet:', error);
    next(error);
  }
};

/**
 * @desc    Recharge company wallet
 * @route   POST /api/v1/wallets/company/:companyId/recharge
 * @access  Company Admin, Super Admin
 */
exports.rechargeCompanyWallet = async (req, res, next) => {
  try {
    const { companyId } = req.params;
    const { amount, paymentMethod, paymentId, transactionId } = req.body;

    if (!amount || amount <= 0) {
      return next(new AppError('Valid amount is required', 400));
    }

    // Check permissions
    if (req.user.role === 'company_admin' && companyId !== req.user.company.toString()) {
      return next(new AppError('Access denied', 403));
    }

    let wallet = await Wallet.findByOwner(companyId, 'Company');

    // Create wallet if doesn't exist
    if (!wallet) {
      wallet = await Wallet.createWallet(companyId, 'Company', 0);
    }

    // Add credit to wallet
    const transaction = await wallet.credit(
      amount,
      'Company wallet recharge',
      'recharge',
      null,
      {
        paymentMethod,
        paymentId,
        transactionId
      }
    );

    // Update company balance in Company model
    const company = await Company.findById(companyId);
    company.wallet.balance = wallet.balance;
    await company.save();

    logger.info(`Company wallet recharged: ${companyId} - ₹${amount}`);

    // Emit socket event
    const io = req.app.get('io');
    if (io) {
      io.emitToCompany(companyId, 'wallet:recharged', { 
        amount, 
        balance: wallet.balance,
        transaction 
      });
    }

    res.status(200).json({
      success: true,
      message: 'Company wallet recharged successfully',
      data: {
        wallet,
        transaction
      }
    });

  } catch (error) {
    logger.error('Error recharging company wallet:', error);
    next(error);
  }
};

/**
 * @desc    Get wallet transactions
 * @route   GET /api/v1/wallets/:userId/transactions
 * @access  User (own), Company Admin, Super Admin
 */
exports.getTransactions = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { type, category, startDate, endDate, page = 1, limit = 50 } = req.query;

    // Check permissions
    if (req.user.role === 'employee' && userId !== req.user._id.toString()) {
      return next(new AppError('You can only access your own transactions', 403));
    }

    const wallet = await Wallet.findByOwner(userId, 'User');

    if (!wallet) {
      return next(new AppError('Wallet not found', 404));
    }

    let transactions = wallet.transactions || [];

    // Apply filters
    if (type) {
      transactions = transactions.filter(txn => txn.type === type);
    }

    if (category) {
      transactions = transactions.filter(txn => txn.category === category);
    }

    if (startDate || endDate) {
      transactions = transactions.filter(txn => {
        const txnDate = new Date(txn.createdAt);
        if (startDate && txnDate < new Date(startDate)) return false;
        if (endDate && txnDate > new Date(endDate)) return false;
        return true;
      });
    }

    // Sort by date (newest first)
    transactions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const paginatedTransactions = transactions.slice(skip, skip + parseInt(limit));

    res.status(200).json({
      success: true,
      data: paginatedTransactions,
      pagination: {
        total: transactions.length,
        page: parseInt(page),
        pages: Math.ceil(transactions.length / parseInt(limit)),
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    logger.error('Error fetching transactions:', error);
    next(error);
  }
};

/**
 * @desc    Get transaction summary
 * @route   GET /api/v1/wallets/:userId/summary
 * @access  User (own), Company Admin, Super Admin
 */
exports.getTransactionSummary = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { period = 'month' } = req.query;

    // Check permissions
    if (req.user.role === 'employee' && userId !== req.user._id.toString()) {
      return next(new AppError('Access denied', 403));
    }

    const wallet = await Wallet.findByOwner(userId, 'User');

    if (!wallet) {
      return next(new AppError('Wallet not found', 404));
    }

    const summary = wallet.getTransactionSummary(period);

    res.status(200).json({
      success: true,
      data: summary
    });

  } catch (error) {
    logger.error('Error fetching transaction summary:', error);
    next(error);
  }
};

/**
 * @desc    Transfer funds between wallets
 * @route   POST /api/v1/wallets/:userId/transfer
 * @access  User (own), Company Admin, Super Admin
 */
exports.transferFunds = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { toUserId, amount, description } = req.body;

    if (!amount || amount <= 0) {
      return next(new AppError('Valid amount is required', 400));
    }

    if (!toUserId) {
      return next(new AppError('Recipient user ID is required', 400));
    }

    // Check permissions
    if (req.user.role === 'employee' && userId !== req.user._id.toString()) {
      return next(new AppError('Access denied', 403));
    }

    // Get sender wallet
    const senderWallet = await Wallet.findByOwner(userId, 'User');
    if (!senderWallet) {
      return next(new AppError('Sender wallet not found', 404));
    }

    if (!senderWallet.hasSufficientBalance(amount)) {
      return next(new AppError('Insufficient balance', 400));
    }

    // Get recipient wallet
    let recipientWallet = await Wallet.findByOwner(toUserId, 'User');
    if (!recipientWallet) {
      recipientWallet = await Wallet.createWallet(toUserId, 'User', 0);
    }

    // Debit from sender
    await senderWallet.debit(
      amount,
      description || `Transfer to user ${toUserId}`,
      'transfer_out',
      { model: 'User', id: toUserId }
    );

    // Credit to recipient
    await recipientWallet.credit(
      amount,
      description || `Transfer from user ${userId}`,
      'transfer_in',
      { model: 'User', id: userId }
    );

    // Notify both users
    await Notification.createNotification({
      user: userId,
      title: 'Funds Transferred',
      message: `₹${amount} has been transferred from your wallet`,
      type: 'wallet',
      priority: 'medium'
    });

    await Notification.createNotification({
      user: toUserId,
      title: 'Funds Received',
      message: `₹${amount} has been credited to your wallet`,
      type: 'wallet',
      priority: 'medium'
    });

    logger.info(`Funds transferred: ${userId} -> ${toUserId} - ₹${amount}`);

    res.status(200).json({
      success: true,
      message: 'Funds transferred successfully',
      data: {
        senderBalance: senderWallet.balance,
        recipientBalance: recipientWallet.balance
      }
    });

  } catch (error) {
    logger.error('Error transferring funds:', error);
    next(error);
  }
};

/**
 * @desc    Deduct from wallet (Admin only)
 * @route   POST /api/v1/wallets/:userId/deduct
 * @access  Super Admin
 */
exports.deductFromWallet = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { amount, description } = req.body;

    if (!amount || amount <= 0) {
      return next(new AppError('Valid amount is required', 400));
    }

    const wallet = await Wallet.findByOwner(userId, 'User');

    if (!wallet) {
      return next(new AppError('Wallet not found', 404));
    }

    // Debit from wallet
    const transaction = await wallet.debit(
      amount,
      description || 'Admin adjustment',
      'adjustment',
      { model: 'User', id: req.user._id }
    );

    // Notify user
    await Notification.createNotification({
      user: userId,
      title: 'Wallet Adjusted',
      message: `₹${amount} has been deducted from your wallet. ${description || ''}`,
      type: 'wallet',
      priority: 'high'
    });

    logger.info(`Wallet deducted: User ${userId} - ₹${amount} by ${req.user.email}`);

    res.status(200).json({
      success: true,
      message: 'Amount deducted successfully',
      data: {
        wallet,
        transaction
      }
    });

  } catch (error) {
    logger.error('Error deducting from wallet:', error);
    next(error);
  }
};
/**
 * @desc    Add funds to employee or employees in a department
 * @route   POST /api/v1/wallets/add-funds
 * @access  Company Admin, Super Admin
 */
exports.addFundsToEmployees = async (req, res, next) => {
  try {
    const { targetType, selectedTarget, amount, walletType } = req.body;
    const { getModels } = require('../models');
    const models = getModels();
    const UserModel = models.User;
    const WalletModel = models.Wallet;

    if (!amount || amount <= 0) {
      return next(new AppError('Valid amount is required', 400));
    }

    if (!targetType || !['employee', 'department'].includes(targetType)) {
      return next(new AppError('Valid targetType is required (employee or department)', 400));
    }

    if (!selectedTarget) {
      return next(new AppError('Selected target is required', 400));
    }

    if (!walletType) {
      return next(new AppError('Wallet type is required', 400));
    }

    let employees = [];
    let successCount = 0;
    let failureCount = 0;
    const transactions = [];

    // Fetch employees based on target type
    if (targetType === 'employee') {
      const employee = await UserModel.findByPk(selectedTarget);
      if (!employee) {
        return next(new AppError('Employee not found', 404));
      }
      // Check permission
      if (req.user.role === 'company_admin' && employee.companyId !== req.user.companyId) {
        return next(new AppError('Access denied', 403));
      }
      employees = [employee];
    } else if (targetType === 'department') {
      // Get all employees in the department
      employees = await UserModel.findAll({
        where: { 
          department: selectedTarget,
          role: 'employee'
        }
      });

      if (req.user.role === 'company_admin') {
        // Filter employees to only those in company admin's company
        employees = employees.filter(emp => emp.companyId === req.user.companyId);
      }

      if (employees.length === 0) {
        return next(new AppError('No employees found in the selected department', 404));
      }
    }

    // Process each employee
    for (const employee of employees) {
      try {
        let wallet = await WalletModel.findByOwner(employee.id || employee._id, 'User');

        // Create wallet if doesn't exist
        if (!wallet) {
          wallet = await WalletModel.createWallet(employee.id || employee._id, 'User', 0);
        }

        // Add credit to wallet based on wallet type
        const walletsToUpdate = walletType === 'both' 
          ? ['business', 'personal']
          : [walletType];

        for (const wType of walletsToUpdate) {
          const transaction = await wallet.credit(
            amount,
            `Funds added by ${req.user.role === 'company_admin' ? 'Company Admin' : 'Super Admin'}`,
            'admin_credit',
            null,
            {
              walletType: wType,
              targetType,
              addedBy: req.user._id || req.user.id
            }
          );

          transactions.push({
            employeeId: employee.id || employee._id,
            employeeName: employee.name,
            amount,
            walletType: wType,
            transaction
          });
        }

        // Create notification
        await Notification.createNotification({
          user: employee.id || employee._id,
          title: 'Wallet Credited',
          message: `₹${amount} has been added to your ${walletType === 'both' ? 'wallets' : walletType + ' wallet'}.`,
          type: 'wallet',
          priority: 'medium'
        });

        successCount++;

        // Emit socket event
        const io = req.app.get('io');
        if (io) {
          io.emitToUser(employee.id || employee._id, 'wallet:updated', { 
            amount, 
            balance: wallet.balance,
            walletType
          });
        }

      } catch (error) {
        logger.error(`Error adding funds to employee ${employee.id || employee._id}: ${error.message}`);
        failureCount++;
      }
    }

    const message = targetType === 'employee'
      ? `₹${amount} added to ${employees[0].name}'s wallet`
      : `₹${amount} added to ${successCount} employees in ${selectedTarget} department${failureCount > 0 ? ` (${failureCount} failed)` : ''}`;

    logger.info(`Funds added: ${targetType} - ${selectedTarget} - ₹${amount} by ${req.user.email || req.user._id}`);

    res.status(200).json({
      success: true,
      message,
      data: {
        targetType,
        selectedTarget,
        amount,
        walletType,
        successCount,
        failureCount,
        totalProcessed: employees.length,
        transactions
      }
    });

  } catch (error) {
    logger.error('Error adding funds to employees:', error);
    next(error);
  }
};