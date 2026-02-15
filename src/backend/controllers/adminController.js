const fs = require('fs');
const path = require('path');
const { logger } = require('../utils/logger');

const SETTINGS_DIR = path.join(__dirname, '..', 'data');
const SETTINGS_FILE = path.join(SETTINGS_DIR, 'platformSettings.json');

const defaultSettings = {
  general: {
    platformName: 'SimplifyMove',
    supportEmail: 'support@simplifymove.com',
    supportPhone: '+1234567890',
    timezone: 'UTC',
    currency: 'USD',
    currencySymbol: '$',
    dateFormat: 'YYYY-MM-DD',
    maxFileSize: 10,
    sessionTimeout: 60,
    maintenanceMode: false
  },
  email: {},
  notifications: {},
  security: {},
  features: {},
  booking: {},
  payment: {},
  limits: {}
};

function ensureSettingsFile() {
  try {
    if (!fs.existsSync(SETTINGS_DIR)) fs.mkdirSync(SETTINGS_DIR, { recursive: true });
    if (!fs.existsSync(SETTINGS_FILE)) {
      fs.writeFileSync(SETTINGS_FILE, JSON.stringify(defaultSettings, null, 2));
    }
  } catch (err) {
    logger.error('Error ensuring settings file:', err);
    console.error('[ERROR] ensureSettingsFile:', err.message);
  }
}

exports.getPlatformSettings = async (req, res, next) => {
  try {
    ensureSettingsFile();
    const raw = fs.readFileSync(SETTINGS_FILE, 'utf8');
    const data = JSON.parse(raw || '{}');
    console.log('[INFO] getPlatformSettings succeeded');
    res.json({ success: true, data });
  } catch (error) {
    logger.error('Get platform settings error:', error);
    console.error('[ERROR] getPlatformSettings:', error.message);
    res.status(500).json({ success: false, message: 'Failed to load settings', error: error.message });
  }
};

exports.updatePlatformSettings = async (req, res, next) => {
  try {
    console.log('[DEBUG] updatePlatformSettings called');
    console.log('[DEBUG] req.body:', JSON.stringify(req.body));
    
    ensureSettingsFile();
    const newSettings = req.body || {};
    
    // Merge with existing to avoid accidental deletion (deep merge for nested objects)
    const existing = JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf8') || '{}');
    const merged = {
      ...existing,
      general: { ...existing.general, ...newSettings.general },
      email: { ...existing.email, ...newSettings.email },
      notifications: { ...existing.notifications, ...newSettings.notifications },
      security: { ...existing.security, ...newSettings.security },
      features: { ...existing.features, ...newSettings.features },
      booking: { ...existing.booking, ...newSettings.booking },
      payment: { ...existing.payment, ...newSettings.payment },
      limits: { ...existing.limits, ...newSettings.limits }
    };
    
    console.log('[DEBUG] Merged email config:', JSON.stringify(merged.email));
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(merged, null, 2));
    console.log('[INFO] Settings file written successfully');
    res.json({ success: true, message: 'Settings updated', data: merged });
  } catch (error) {
    logger.error('Update platform settings error:', error);
    console.error('[ERROR] updatePlatformSettings:', error.message, error.stack);
    res.status(500).json({ success: false, message: 'Failed to update settings', error: error.message });
  }
};
