const { getModels } = require('../models');
const { Op } = require('sequelize');

// Create audit log entry
exports.createAuditLog = async (req, res) => {
  try {
    const { action, category, performedBy, performedByRole, companyId, targetEntity, targetId, details, changes, ipAddress, userAgent, status, severity } = req.body;
    const { AuditLog } = getModels();

    const auditLog = await AuditLog.create({
      action,
      category,
      performedBy,
      performedByRole,
      companyId,
      targetEntity,
      targetId,
      details,
      changes: changes || [],
      ipAddress,
      userAgent,
      status: status || 'success',
      severity: severity || 'low'
    });

    res.status(201).json({
      success: true,
      message: 'Audit log created successfully',
      data: auditLog
    });
  } catch (error) {
    console.error('Error creating audit log:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get all audit logs with filtering
exports.getAuditLogs = async (req, res) => {
  try {
    const { category, status, severity, performedBy, companyId, startDate, endDate, page = 1, limit = 50 } = req.query;
    const { AuditLog } = getModels();

    const where = {};
    if (category) where.category = category;
    if (status) where.status = status;
    if (severity) where.severity = severity;
    if (performedBy) where.performedBy = performedBy;
    if (companyId) where.companyId = companyId;
    
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt[Op.gte] = new Date(startDate);
      if (endDate) where.createdAt[Op.lte] = new Date(endDate);
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows } = await AuditLog.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset,
      raw: true
    });

    res.status(200).json({
      success: true,
      message: 'Audit logs retrieved successfully',
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error retrieving audit logs:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get audit log by ID
exports.getAuditLogById = async (req, res) => {
  try {
    const { id } = req.params;
    const { AuditLog } = getModels();

    const auditLog = await AuditLog.findByPk(id);

    if (!auditLog) {
      return res.status(404).json({
        success: false,
        message: 'Audit log not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Audit log retrieved successfully',
      data: auditLog
    });
  } catch (error) {
    console.error('Error retrieving audit log:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get audit logs by target entity (e.g., all changes to a specific company)
exports.getAuditLogsByTarget = async (req, res) => {
  try {
    const { targetEntity, targetId } = req.params;
    const { AuditLog } = getModels();

    const auditLogs = await AuditLog.findAll({
      where: {
        targetEntity,
        targetId
      },
      order: [['createdAt', 'DESC']],
      limit: 100
    });

    res.status(200).json({
      success: true,
      message: 'Audit logs retrieved successfully',
      data: auditLogs
    });
  } catch (error) {
    console.error('Error retrieving audit logs:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete audit logs older than specified days
exports.deleteOldAuditLogs = async (req, res) => {
  try {
    const { daysOld = 90 } = req.query;
    const { AuditLog } = getModels();

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - parseInt(daysOld));

    const result = await AuditLog.destroy({
      where: {
        createdAt: {
          [Op.lt]: cutoffDate
        }
      }
    });

    res.status(200).json({
      success: true,
      message: `Deleted ${result} audit logs older than ${daysOld} days`,
      deletedCount: result
    });
  } catch (error) {
    console.error('Error deleting audit logs:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get audit log statistics
exports.getAuditStats = async (req, res) => {
  try {
    const { companyId, startDate, endDate } = req.query;
    const { AuditLog } = getModels();
    const { sequelize } = require('../config/database');
    const { QueryTypes } = require('sequelize');

    const where = {};
    if (companyId) where.companyId = companyId;
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt[Op.gte] = new Date(startDate);
      if (endDate) where.createdAt[Op.lte] = new Date(endDate);
    }

    const stats = await AuditLog.findAll({
      attributes: [
        'category',
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      where,
      group: ['category', 'status'],
      raw: true
    });

    res.status(200).json({
      success: true,
      message: 'Audit statistics retrieved successfully',
      data: stats
    });
  } catch (error) {
    console.error('Error retrieving audit statistics:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
