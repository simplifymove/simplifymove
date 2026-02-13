const { getModels } = require('../models/registry');
const { Op } = require('sequelize');

// Create vendor
exports.createVendor = async (req, res) => {
  try {
    const { name, category, description, status, apiEndpoint, apiKey, webhookUrl } = req.body;
    const { Vendor } = getModels();

    // Check if vendor name already exists
    const existingVendor = await Vendor.findOne({ where: { name } });
    if (existingVendor) {
      return res.status(400).json({
        success: false,
        message: 'Vendor name already exists'
      });
    }

    const vendor = await Vendor.create({
      name,
      category,
      description,
      status: status || 'testing',
      apiEndpoint,
      apiKey,
      webhookUrl,
      healthStatus: 'healthy',
      requestsToday: 0,
      uptime: 100,
      lastSync: new Date()
    });

    res.status(201).json({
      success: true,
      message: 'Vendor created successfully',
      data: vendor
    });
  } catch (error) {
    console.error('Error creating vendor:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get all vendors
exports.getVendors = async (req, res) => {
  try {
    const { category, status, healthStatus, page = 1, limit = 20 } = req.query;
    const { Vendor } = getModels();

    const where = {};
    if (category) where.category = category;
    if (status) where.status = status;
    if (healthStatus) where.healthStatus = healthStatus;

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows } = await Vendor.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset
    });

    res.status(200).json({
      success: true,
      message: 'Vendors retrieved successfully',
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error retrieving vendors:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get vendor by ID
exports.getVendorById = async (req, res) => {
  try {
    const { id } = req.params;
    const { Vendor } = getModels();

    const vendor = await Vendor.findByPk(id);

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Vendor retrieved successfully',
      data: vendor
    });
  } catch (error) {
    console.error('Error retrieving vendor:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update vendor
exports.updateVendor = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, description, status, apiEndpoint, apiKey, webhookUrl } = req.body;
    const { Vendor } = getModels();

    const vendor = await Vendor.findByPk(id);
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found'
      });
    }

    // Check if new name already exists (if changing name)
    if (name && name !== vendor.name) {
      const existingVendor = await Vendor.findOne({ where: { name } });
      if (existingVendor) {
        return res.status(400).json({
          success: false,
          message: 'Vendor name already exists'
        });
      }
    }

    await vendor.update({
      name: name || vendor.name,
      category: category || vendor.category,
      description: description || vendor.description,
      status: status || vendor.status,
      apiEndpoint: apiEndpoint || vendor.apiEndpoint,
      apiKey: apiKey || vendor.apiKey,
      webhookUrl: webhookUrl || vendor.webhookUrl
    });

    res.status(200).json({
      success: true,
      message: 'Vendor updated successfully',
      data: vendor
    });
  } catch (error) {
    console.error('Error updating vendor:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete vendor
exports.deleteVendor = async (req, res) => {
  try {
    const { id } = req.params;
    const { Vendor } = getModels();

    const vendor = await Vendor.findByPk(id);
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found'
      });
    }

    await vendor.destroy();

    res.status(200).json({
      success: true,
      message: 'Vendor deleted successfully',
      data: { id: vendor.id }
    });
  } catch (error) {
    console.error('Error deleting vendor:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update vendor health status
exports.updateVendorHealth = async (req, res) => {
  try {
    const { id } = req.params;
    const { healthStatus, uptime, requestsToday } = req.body;
    const { Vendor } = getModels();

    const vendor = await Vendor.findByPk(id);
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found'
      });
    }

    await vendor.update({
      healthStatus: healthStatus || vendor.healthStatus,
      uptime: uptime !== undefined ? uptime : vendor.uptime,
      requestsToday: requestsToday !== undefined ? requestsToday : vendor.requestsToday,
      lastSync: new Date()
    });

    res.status(200).json({
      success: true,
      message: 'Vendor health status updated successfully',
      data: vendor
    });
  } catch (error) {
    console.error('Error updating vendor health:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Bulk update vendor metrics (for monitoring service)
exports.updateVendorMetrics = async (req, res) => {
  try {
    const { metrics } = req.body; // Array of { vendorId, healthStatus, uptime, requestsToday }
    const { Vendor } = getModels();

    if (!Array.isArray(metrics)) {
      return res.status(400).json({
        success: false,
        message: 'metrics must be an array'
      });
    }

    const updates = await Promise.all(
      metrics.map(metric => {
        return Vendor.update(
          {
            healthStatus: metric.healthStatus,
            uptime: metric.uptime,
            requestsToday: metric.requestsToday,
            lastSync: new Date()
          },
          { where: { id: metric.vendorId } }
        );
      })
    );

    res.status(200).json({
      success: true,
      message: `Updated metrics for ${metrics.length} vendors`,
      updatedCount: metrics.length
    });
  } catch (error) {
    console.error('Error updating vendor metrics:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get vendor integration status
exports.getIntegrationStatus = async (req, res) => {
  try {
    const { Vendor } = getModels();

    const vendors = await Vendor.findAll({
      attributes: ['id', 'name', 'category', 'healthStatus', 'uptime', 'lastSync'],
      where: { status: 'active' }
    });

    const statusSummary = {
      totalVendors: vendors.length,
      healthy: vendors.filter(v => v.healthStatus === 'healthy').length,
      degraded: vendors.filter(v => v.healthStatus === 'degraded').length,
      down: vendors.filter(v => v.healthStatus === 'down').length,
      averageUptime: vendors.length > 0 
        ? (vendors.reduce((sum, v) => sum + (v.uptime || 0), 0) / vendors.length).toFixed(2)
        : 0
    };

    res.status(200).json({
      success: true,
      message: 'Integration status retrieved successfully',
      data: {
        summary: statusSummary,
        vendors
      }
    });
  } catch (error) {
    console.error('Error retrieving integration status:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
