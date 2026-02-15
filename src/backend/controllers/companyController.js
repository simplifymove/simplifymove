/**
 * Company Controller - Using Sequelize ORM
 */

const { getModels } = require('../models');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { AppError } = require('../middleware/errorHandler');
const { logger } = require('../utils/logger');
const { logCompanyAction, getChanges } = require('../utils/auditLog');

exports.createCompany = async (req, res, next) => {
  try {
    const { Company, User } = getModels();
    const {
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
      status,
      contactName,
      contactEmail,
      contactPhone,
      contactDesignation
    } = req.body;

    const allowedCompanySizes = ['1-10','11-50','51-200','201-500','501-1000','1000+'];

    if (companySize && !allowedCompanySizes.includes(companySize)) {
      return res.status(400).json({ success: false, message: `Invalid companySize. Allowed values: ${allowedCompanySizes.join(', ')}` });
    }

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

    // Log audit trail for company creation
    await logCompanyAction({
      action: 'Company Created',
      performedBy: req.user?.id || 'system',
      performedByRole: req.user?.role || 'system',
      targetId: company.id,
      details: `New company "${name}" created with email ${email}`,
      changes: [
        { field: 'Name', oldValue: '-', newValue: name },
        { field: 'Email', oldValue: '-', newValue: email },
        { field: 'Industry', oldValue: '-', newValue: industry || '-' },
        { field: 'Company Size', oldValue: '-', newValue: companySize || '-' },
        { field: 'Status', oldValue: '-', newValue: status || 'active' }
      ],
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('user-agent'),
      status: 'success',
      severity: 'medium'
    });

    // Create company admin user and send invitation email when contactEmail provided
    if (contactEmail) {
      const password = crypto.randomBytes(6).toString('base64');

      try {
        await User.create({
          name: contactName || 'Company Admin',
          email: contactEmail,
          phone: contactPhone || '',
          password,
          role: 'company_admin',
          companyId: company.id,
          designation: contactDesignation || '',
          status: 'active',
          emailVerified: false
        });
      } catch (err) {
        logger.error('Failed to create company admin user:', err);
      }

      // attempt to send invitation using platform settings (non-blocking)
      try {
        console.log('[EMAIL] Attempting to send invitation email for contactEmail:', contactEmail);
        const SETTINGS_FILE = path.join(__dirname, '..', 'data', 'platformSettings.json');
        let platformSettings = {};
        if (fs.existsSync(SETTINGS_FILE)) {
          platformSettings = JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf8') || '{}');
        }
        console.log('[EMAIL] Platform settings email config:', JSON.stringify(platformSettings.email, null, 2));

        const emailCfg = platformSettings.email || {};
        if (emailCfg && (emailCfg.smtpHost || emailCfg.fromEmail)) {
          console.log('[EMAIL] Creating transporter for', emailCfg.smtpHost, 'port', emailCfg.smtpPort, 'secure:', emailCfg.enableSSL);
          const transporter = nodemailer.createTransport({
            host: emailCfg.smtpHost || 'localhost',
            port: emailCfg.smtpPort || 587,
            secure: emailCfg.enableSSL ? true : false,
            auth: emailCfg.smtpUser ? { user: emailCfg.smtpUser, pass: emailCfg.smtpPassword } : undefined,
            tls: { rejectUnauthorized: false }
          });

          const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
          const loginUrl = `${frontendUrl}/login`;

          const mailOptions = {
            from: `${emailCfg.fromName || 'SimplifyMove'} <${emailCfg.fromEmail || 'noreply@simplifymove.com'}>`,
            to: contactEmail,
            subject: 'Your SimplifyMove Company Admin account',
            text: `Hello ${contactName || ''},\n\nAn admin account has been created for your company on SimplifyMove.\n\nLogin URL: ${loginUrl}\nEmail: ${contactEmail}\nPassword: ${password}\n\nPlease change your password after first login.`,
            html: `<p>Hello ${contactName || ''},</p><p>An admin account has been created for your company on SimplifyMove.</p><p><strong>Login URL:</strong> <a href="${loginUrl}">${loginUrl}</a><br/><strong>Email:</strong> ${contactEmail}<br/><strong>Password:</strong> ${password}</p><p>Please change your password after first login.</p>`
          };
          console.log('[EMAIL] Sending mail to:', contactEmail);

          const info = await transporter.sendMail(mailOptions);
          console.log('[EMAIL] ✅ Invitation email sent successfully. MessageID:', info.messageId);
          logger.info('Invitation email sent to', contactEmail);
        } else {
          console.log('[EMAIL] ⚠️ Email settings not configured - smtpHost:', emailCfg.smtpHost, 'fromEmail:', emailCfg.fromEmail);
          logger.info('Platform email settings not configured - skipping invitation email');
        }
      } catch (err) {
        console.error('[EMAIL] ❌ Failed to send invitation email:', err.message);
        logger.error('Failed to send invitation email:', err);
      }
    }

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
    
    const allowedCompanySizes = ['1-10','11-50','51-200','201-500','501-1000','1000+'];
    if (req.body.companySize && !allowedCompanySizes.includes(req.body.companySize)) {
      return res.status(400).json({ success: false, message: `Invalid companySize. Allowed values: ${allowedCompanySizes.join(', ')}` });
    }

    // Capture old data for audit trail
    const oldData = company.toJSON();
    
    await company.update(req.body);

    // Log audit trail for company update
    const changes = getChanges(oldData, company.toJSON());
    if (changes.length > 0) {
      await logCompanyAction({
        action: 'Company Updated',
        performedBy: req.user?.id || 'system',
        performedByRole: req.user?.role || 'system',
        targetId: company.id,
        details: `Company "${company.name}" updated with ${changes.length} field(s)`,
        changes,
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.get('user-agent'),
        status: 'success',
        severity: 'medium'
      });
    }
    
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

    const companyName = company.name;
    const companyId = company.id;
    
    await company.destroy();

    // Log audit trail for company deletion
    await logCompanyAction({
      action: 'Company Deleted',
      performedBy: req.user?.id || 'system',
      performedByRole: req.user?.role || 'system',
      targetId: companyId,
      details: `Company "${companyName}" has been deleted permanently`,
      changes: [
        { field: 'Status', oldValue: 'Active', newValue: 'Deleted' }
      ],
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('user-agent'),
      status: 'success',
      severity: 'high'
    });
    
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

    const oldStatus = company.status;
    
    await company.update({ status });

    // Log audit trail for status change
    await logCompanyAction({
      action: `Company Status Changed to ${status}`,
      performedBy: req.user?.id || 'system',
      performedByRole: req.user?.role || 'system',
      targetId: company.id,
      details: `Company "${company.name}" status changed from ${oldStatus} to ${status}`,
      changes: [
        { field: 'Status', oldValue: oldStatus, newValue: status }
      ],
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('user-agent'),
      status: 'success',
      severity: 'medium'
    });
    
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

    const wasVerified = company.emailVerified;
    
    await company.update({ status: 'active', emailVerified: true });

    // Log audit trail for company verification
    await logCompanyAction({
      action: 'Company Verified',
      performedBy: req.user?.id || 'system',
      performedByRole: req.user?.role || 'system',
      targetId: company.id,
      details: `Company "${company.name}" has been verified and activated`,
      changes: [
        { field: 'Status', oldValue: company.previous('status'), newValue: 'active' },
        { field: 'Email Verified', oldValue: String(wasVerified), newValue: 'true' }
      ],
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('user-agent'),
      status: 'success',
      severity: 'medium'
    });
    
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
