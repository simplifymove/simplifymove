const { getModels } = require('../models/registry');
const nodemailer = require('nodemailer');

// Create email configuration
exports.createEmailConfig = async (req, res) => {
  try {
    const { configName, provider, smtpHost, smtpPort, smtpUsername, smtpPassword, apiKey, fromEmail, fromName, replyTo, useTLS, useSSL, companyId } = req.body;
    const { EmailConfig } = getModels();

    // Check if config name already exists
    const existingConfig = await EmailConfig.findOne({ where: { configName } });
    if (existingConfig) {
      return res.status(400).json({
        success: false,
        message: 'Email configuration name already exists'
      });
    }

    const emailConfig = await EmailConfig.create({
      configName,
      provider,
      smtpHost,
      smtpPort,
      smtpUsername,
      smtpPassword,
      apiKey,
      fromEmail,
      fromName: fromName || configName,
      replyTo: replyTo || fromEmail,
      useTLS: useTLS !== undefined ? useTLS : true,
      useSSL: useSSL !== undefined ? useSSL : false,
      isActive: true,
      companyId
    });

    res.status(201).json({
      success: true,
      message: 'Email configuration created successfully',
      data: emailConfig
    });
  } catch (error) {
    console.error('Error creating email configuration:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get all email configurations
exports.getEmailConfigs = async (req, res) => {
  try {
    const { provider, isActive, companyId, page = 1, limit = 20 } = req.query;
    const { EmailConfig } = getModels();

    const where = {};
    if (provider) where.provider = provider;
    if (isActive !== undefined) where.isActive = isActive === 'true';
    if (companyId) where.companyId = companyId;

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows } = await EmailConfig.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset,
      attributes: { exclude: ['smtpPassword', 'apiKey'] } // Don't expose passwords/apikeys
    });

    res.status(200).json({
      success: true,
      message: 'Email configurations retrieved successfully',
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error retrieving email configurations:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get email configuration by ID
exports.getEmailConfigById = async (req, res) => {
  try {
    const { id } = req.params;
    const { EmailConfig } = getModels();

    const emailConfig = await EmailConfig.findByPk(id, {
      attributes: { exclude: ['smtpPassword', 'apiKey'] }
    });

    if (!emailConfig) {
      return res.status(404).json({
        success: false,
        message: 'Email configuration not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Email configuration retrieved successfully',
      data: emailConfig
    });
  } catch (error) {
    console.error('Error retrieving email configuration:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update email configuration
exports.updateEmailConfig = async (req, res) => {
  try {
    const { id } = req.params;
    const { configName, provider, smtpHost, smtpPort, smtpUsername, smtpPassword, apiKey, fromEmail, fromName, replyTo, isActive, useTLS, useSSL } = req.body;
    const { EmailConfig } = getModels();

    const emailConfig = await EmailConfig.findByPk(id);
    if (!emailConfig) {
      return res.status(404).json({
        success: false,
        message: 'Email configuration not found'
      });
    }

    // Check if new config name already exists (if changing name)
    if (configName && configName !== emailConfig.configName) {
      const existingConfig = await EmailConfig.findOne({ where: { configName } });
      if (existingConfig) {
        return res.status(400).json({
          success: false,
          message: 'Email configuration name already exists'
        });
      }
    }

    await emailConfig.update({
      configName: configName || emailConfig.configName,
      provider: provider || emailConfig.provider,
      smtpHost: smtpHost || emailConfig.smtpHost,
      smtpPort: smtpPort || emailConfig.smtpPort,
      smtpUsername: smtpUsername || emailConfig.smtpUsername,
      smtpPassword: smtpPassword || emailConfig.smtpPassword,
      apiKey: apiKey || emailConfig.apiKey,
      fromEmail: fromEmail || emailConfig.fromEmail,
      fromName: fromName || emailConfig.fromName,
      replyTo: replyTo || emailConfig.replyTo,
      isActive: isActive !== undefined ? isActive : emailConfig.isActive,
      useTLS: useTLS !== undefined ? useTLS : emailConfig.useTLS,
      useSSL: useSSL !== undefined ? useSSL : emailConfig.useSSL
    });

    res.status(200).json({
      success: true,
      message: 'Email configuration updated successfully',
      data: emailConfig
    });
  } catch (error) {
    console.error('Error updating email configuration:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete email configuration
exports.deleteEmailConfig = async (req, res) => {
  try {
    const { id } = req.params;
    const { EmailConfig } = getModels();

    const emailConfig = await EmailConfig.findByPk(id);
    if (!emailConfig) {
      return res.status(404).json({
        success: false,
        message: 'Email configuration not found'
      });
    }

    await emailConfig.destroy();

    res.status(200).json({
      success: true,
      message: 'Email configuration deleted successfully',
      data: { id: emailConfig.id }
    });
  } catch (error) {
    console.error('Error deleting email configuration:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Test email configuration
exports.testEmailConfig = async (req, res) => {
  try {
    const { id } = req.params;
    const { EmailConfig } = getModels();

    const emailConfig = await EmailConfig.findByPk(id);
    if (!emailConfig) {
      return res.status(404).json({
        success: false,
        message: 'Email configuration not found'
      });
    }

    // Get the password/apikey (need to fetch separately if not loaded)
    const fullConfig = await EmailConfig.findByPk(id);

    let transporter;

    try {
      // Create transporter based on provider
      if (emailConfig.provider === 'smtp') {
        transporter = nodemailer.createTransport({
          host: emailConfig.smtpHost,
          port: emailConfig.smtpPort,
          secure: emailConfig.useSSL,
          auth: {
            user: emailConfig.smtpUsername,
            pass: fullConfig.smtpPassword
          },
          tls: {
            rejectUnauthorized: emailConfig.useTLS
          }
        });
      } else if (emailConfig.provider === 'sendgrid') {
        transporter = nodemailer.createTransport({
          host: 'smtp.sendgrid.net',
          port: 587,
          secure: false,
          auth: {
            user: 'apikey',
            pass: fullConfig.apiKey
          }
        });
      } else {
        return res.status(400).json({
          success: false,
          message: `Provider ${emailConfig.provider} testing not yet implemented`
        });
      }

      // Send test email
      const testEmail = emailConfig.testEmailAddress || emailConfig.fromEmail;
      const info = await transporter.sendMail({
        from: `"${emailConfig.fromName}" <${emailConfig.fromEmail}>`,
        to: testEmail,
        subject: 'SimplifyMove Email Configuration Test',
        text: 'This is a test email to verify your configuration is working correctly.',
        html: '<p>This is a test email to verify your configuration is working correctly.</p>'
      });

      // Update test status
      await emailConfig.update({
        lastTestedAt: new Date(),
        testStatus: 'success',
        testError: null
      });

      res.status(200).json({
        success: true,
        message: 'Email configuration test successful',
        data: {
          messageId: info.messageId,
          testStatus: 'success'
        }
      });
    } catch (error) {
      // Update test status to failed
      await emailConfig.update({
        lastTestedAt: new Date(),
        testStatus: 'failed',
        testError: error.message
      });

      res.status(400).json({
        success: false,
        message: 'Email configuration test failed',
        error: error.message
      });
    }
  } catch (error) {
    console.error('Error testing email configuration:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Set default email configuration
exports.setDefaultEmailConfig = async (req, res) => {
  try {
    const { id } = req.params;
    const { EmailConfig } = getModels();

    const emailConfig = await EmailConfig.findByPk(id);
    if (!emailConfig) {
      return res.status(404).json({
        success: false,
        message: 'Email configuration not found'
      });
    }

    // Remove isDefault from all configs
    await EmailConfig.update({ isDefault: false }, { where: {} });

    // Set this one as default
    await emailConfig.update({ isDefault: true });

    res.status(200).json({
      success: true,
      message: 'Email configuration set as default successfully',
      data: emailConfig
    });
  } catch (error) {
    console.error('Error setting default email configuration:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get default email configuration
exports.getDefaultEmailConfig = async (req, res) => {
  try {
    const { EmailConfig } = getModels();

    const emailConfig = await EmailConfig.findOne({
      where: { isDefault: true, isActive: true },
      attributes: { exclude: ['smtpPassword', 'apiKey'] }
    });

    if (!emailConfig) {
      return res.status(404).json({
        success: false,
        message: 'No default email configuration found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Default email configuration retrieved successfully',
      data: emailConfig
    });
  } catch (error) {
    console.error('Error retrieving default email configuration:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update email stats (for tracking)
exports.updateEmailStats = async (req, res) => {
  try {
    const { id } = req.params;
    const { emailsSent = 1 } = req.body;
    const { EmailConfig } = getModels();

    const emailConfig = await EmailConfig.findByPk(id);
    if (!emailConfig) {
      return res.status(404).json({
        success: false,
        message: 'Email configuration not found'
      });
    }

    await emailConfig.increment({
      emailsSentToday: emailsSent,
      emailsSentThisMonth: emailsSent
    });

    res.status(200).json({
      success: true,
      message: 'Email statistics updated successfully'
    });
  } catch (error) {
    console.error('Error updating email statistics:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
