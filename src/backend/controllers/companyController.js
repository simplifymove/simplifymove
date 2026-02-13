/**
 * Company Controller - Using Sequelize ORM
 */

const { getModels } = require('../models');
const { AppError } = require('../middleware/errorHandler');
const { logger } = require('../utils/logger');

exports.createCompany = async (req, res, next) => {
  try {
    const { Company } = getModels();
    const { name, email, phone, industry, businessCategory, companySize, street, city, state, pincode, country, status } = req.body;
    
    const company = await Company.create({
      name,
      email,
      phone,
      industry,
      businessCategory,
      companySize,
      street,
      city,
      state,
      pincode,
      country,
      status: status || 'active'
    });
    
    res.status(201).json({
      success: true,
      message: 'Company created successfully',
      data: company
    });
  } catch (error) {
    logger.error('Create company error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllCompanies = async (req, res, next) => {
  try {
    const { Company } = getModels();
    const companies = await Company.findAll({ limit: 100 });
    res.json({
      success: true,
      data: companies
    });
  } catch (error) {
    logger.error('Get all companies error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getCompanyById = async (req, res, next) => {
  try {
    const { Company, User } = getModels();
    const company = await Company.findByPk(req.params.id, {
      include: [{ model: User, as: 'employees', attributes: { exclude: ['password'] } }]
    });
    
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }
    
    res.json({
      success: true,
      data: company
    });
  } catch (error) {
    logger.error('Get company by ID error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateCompany = async (req, res, next) => {
  try {
    const { Company } = getModels();
    const company = await Company.findByPk(req.params.id);
    
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }
    
    await company.update(req.body);
    
    res.json({
      success: true,
      message: 'Company updated successfully',
      data: company
    });
  } catch (error) {
    logger.error('Update company error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteCompany = async (req, res, next) => {
  try {
    const { Company } = getModels();
    const company = await Company.findByPk(req.params.id);
    
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }
    
    await company.destroy();
    
    res.json({
      success: true,
      message: 'Company deleted successfully'
    });
  } catch (error) {
    logger.error('Delete company error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateCompanyStatus = async (req, res, next) => {
  try {
    const { Company } = getModels();
    const { status } = req.body;
    
    const company = await Company.findByPk(req.params.id);
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }
    
    await company.update({ status });
    
    res.json({
      success: true,
      message: 'Company status updated',
      data: company
    });
  } catch (error) {
    logger.error('Update company status error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.verifyCompany = async (req, res, next) => {
  try {
    const { Company } = getModels();
    const company = await Company.findByPk(req.params.id);
    
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }
    
    await company.update({ status: 'active', emailVerified: true });
    
    res.json({
      success: true,
      message: 'Company verified successfully',
      data: company
    });
  } catch (error) {
    logger.error('Verify company error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getCompanyEmployees = async (req, res, next) => {
  try {
    const { User } = getModels();
    const employees = await User.findAll({
      where: { companyId: req.params.id },
      attributes: { exclude: ['password'] }
    });
    
    res.json({
      success: true,
      data: employees
    });
  } catch (error) {
    logger.error('Get company employees error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.addEmployee = async (req, res, next) => {
  try {
    const { User } = getModels();
    const { email, name, phone, department, designation } = req.body;
    
    const user = await User.create({
      email,
      name,
      phone,
      companyId: req.params.id,
      department,
      designation,
      role: 'employee',
      status: 'active'
    });
    
    res.status(201).json({
      success: true,
      message: 'Employee added successfully',
      data: user
    });
  } catch (error) {
    logger.error('Add employee error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getCompanyWallet = async (req, res, next) => {
  try {
    const { Wallet } = getModels();
    const wallet = await Wallet.findOne({
      where: { ownerId: req.params.id, ownerModel: 'Company' }
    });
    
    if (!wallet) {
      return res.status(404).json({ success: false, message: 'Wallet not found' });
    }
    
    res.json({
      success: true,
      data: wallet
    });
  } catch (error) {
    logger.error('Get company wallet error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.rechargeWallet = async (req, res, next) => {
  res.status(501).json({
    success: false,
    message: 'Recharge wallet endpoint - To be implemented'
  });
};

exports.getCompanyBookings = async (req, res, next) => {
  res.status(501).json({
    success: false,
    message: 'Get company bookings endpoint - To be implemented'
  });
};

exports.getCompanyReports = async (req, res, next) => {
  res.status(501).json({
    success: false,
    message: 'Get company reports endpoint - To be implemented'
  });
};

exports.getStatistics = async (req, res, next) => {
  res.status(501).json({
    success: false,
    message: 'Get statistics endpoint - To be implemented'
  });
};
