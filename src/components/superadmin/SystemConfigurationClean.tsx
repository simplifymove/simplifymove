import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  Settings,
  Save,
  RefreshCw,
  Globe,
  Mail,
  Bell,
  Shield,
  Database,
  Zap,
  CheckCircle2,
  AlertCircle,
  DollarSign,
  CreditCard,
  Truck,
  Plane,
  Info,
  Clock
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface SystemConfig {
  general: {
    platformName: string;
    supportEmail: string;
    supportPhone: string;
    timezone: string;
    currency: string;
    currencySymbol: string;
    dateFormat: string;
    maxFileSize: number;
    sessionTimeout: number;
    maintenanceMode: boolean;
  };
  email: {
    smtpHost: string;
    smtpPort: number;
    smtpUser: string;
    fromEmail: string;
    fromName: string;
    enableSSL: boolean;
  };
  notifications: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    pushNotifications: boolean;
    adminAlerts: boolean;
    bookingConfirmations: boolean;
    paymentAlerts: boolean;
  };
  security: {
    passwordMinLength: number;
    passwordRequireUppercase: boolean;
    passwordRequireNumbers: boolean;
    passwordRequireSpecialChars: boolean;
    twoFactorRequired: boolean;
    maxLoginAttempts: number;
    lockoutDuration: number;
    sessionExpiry: number;
  };
  features: {
    travelBooking: boolean;
    logisticsBooking: boolean;
    courierServices: boolean;
    walletManagement: boolean;
    expenseManagement: boolean;
    approvalWorkflow: boolean;
    analytics: boolean;
    apiAccess: boolean;
    customIntegrations: boolean;
    bulkBooking: boolean;
  };
  booking: {
    autoApprovalThreshold: number;
    cancellationWindow: number;
    advanceBookingDays: number;
    maxBookingsPerDay: number;
    requireApproval: boolean;
    allowCancellation: boolean;
  };
  payment: {
    razorpayEnabled: boolean;
    stripeEnabled: boolean;
    paypalEnabled: boolean;
    codEnabled: boolean;
    walletEnabled: boolean;
    minWalletBalance: number;
    maxWalletBalance: number;
    autoRefund: boolean;
  };
  limits: {
    maxCompanies: number;
    maxUsersPerCompany: number;
    maxBookingsPerMonth: number;
    apiRateLimit: number;
    maxFileUploads: number;
    storagePerCompany: number;
  };
}

const defaultConfig: SystemConfig = {
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
    maintenanceMode: false,
  },
  email: {
    smtpHost: 'smtp.gmail.com',
    smtpPort: 587,
    smtpUser: 'noreply@simplifymove.com',
    fromEmail: 'noreply@simplifymove.com',
    fromName: 'SimplifyMove',
    enableSSL: true,
  },
  notifications: {
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: false,
    adminAlerts: true,
    bookingConfirmations: true,
    paymentAlerts: true,
  },
  security: {
    passwordMinLength: 8,
    passwordRequireUppercase: true,
    passwordRequireNumbers: true,
    passwordRequireSpecialChars: true,
    twoFactorRequired: false,
    maxLoginAttempts: 5,
    lockoutDuration: 30,
    sessionExpiry: 3600,
  },
  features: {
    travelBooking: true,
    logisticsBooking: true,
    courierServices: true,
    walletManagement: true,
    expenseManagement: true,
    approvalWorkflow: true,
    analytics: true,
    apiAccess: true,
    customIntegrations: false,
    bulkBooking: true,
  },
  booking: {
    autoApprovalThreshold: 1000,
    cancellationWindow: 24,
    advanceBookingDays: 30,
    maxBookingsPerDay: 100,
    requireApproval: true,
    allowCancellation: true,
  },
  payment: {
    razorpayEnabled: true,
    stripeEnabled: true,
    paypalEnabled: true,
    codEnabled: true,
    walletEnabled: true,
    minWalletBalance: 100,
    maxWalletBalance: 10000,
    autoRefund: true,
  },
  limits: {
    maxCompanies: 100,
    maxUsersPerCompany: 500,
    maxBookingsPerMonth: 10000,
    apiRateLimit: 1000,
    maxFileUploads: 100,
    storagePerCompany: 1000,
  },
};

export function SystemConfigurationClean() {
  const [config, setConfig] = useState<SystemConfig>(defaultConfig);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  // Handle save configuration
  const handleSaveConfig = () => {
    toast.success('Configuration saved successfully!', {
      description: 'All system settings have been updated',
    });
    setHasUnsavedChanges(false);
  };

  // Handle reset to defaults
  const handleResetDefaults = () => {
    setConfig(defaultConfig);
    toast.success('Configuration reset to defaults');
    setHasUnsavedChanges(true);
  };

  // Update config helper
  const updateConfig = (section: keyof SystemConfig, key: string, value: any) => {
    setConfig({
      ...config,
      [section]: {
        ...config[section],
        [key]: value,
      },
    });
    setHasUnsavedChanges(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1800px] mx-auto px-6 lg:px-12 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">System Configuration</h1>
              <p className="text-gray-600 mt-1">Manage global platform settings and parameters</p>
            </div>
            <div className="flex gap-3">
              {hasUnsavedChanges && (
                <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Unsaved Changes
                </Badge>
              )}
              <Button
                variant="outline"
                onClick={handleResetDefaults}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset Defaults
              </Button>
              <Button
                onClick={handleSaveConfig}
                className="bg-[#000035] hover:bg-[#000055]"
                disabled={!hasUnsavedChanges}
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-gray-100">
              <TabsTrigger value="general" className="data-[state=active]:bg-white">
                General
              </TabsTrigger>
              <TabsTrigger value="email" className="data-[state=active]:bg-white">
                Email
              </TabsTrigger>
              <TabsTrigger value="notifications" className="data-[state=active]:bg-white">
                Notifications
              </TabsTrigger>
              <TabsTrigger value="security" className="data-[state=active]:bg-white">
                Security
              </TabsTrigger>
              <TabsTrigger value="features" className="data-[state=active]:bg-white">
                Features
              </TabsTrigger>
              <TabsTrigger value="limits" className="data-[state=active]:bg-white">
                Limits
              </TabsTrigger>
              <TabsTrigger value="booking" className="data-[state=active]:bg-white">
                Booking
              </TabsTrigger>
              <TabsTrigger value="payment" className="data-[state=active]:bg-white">
                Payment
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1800px] mx-auto px-6 lg:px-12 py-8">
        {activeTab === 'general' && (
          <div className="space-y-6">
            <Card className="p-6 border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <Globe className="w-6 h-6 text-[#000035]" />
                <h2 className="text-xl font-bold text-gray-900">General Settings</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="platform-name">Platform Name</Label>
                  <Input
                    id="platform-name"
                    value={config.general.platformName}
                    onChange={(e) => updateConfig('general', 'platformName', e.target.value)}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="support-email">Support Email</Label>
                  <Input
                    id="support-email"
                    type="email"
                    value={config.general.supportEmail}
                    onChange={(e) => updateConfig('general', 'supportEmail', e.target.value)}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="support-phone">Support Phone</Label>
                  <Input
                    id="support-phone"
                    type="tel"
                    value={config.general.supportPhone}
                    onChange={(e) => updateConfig('general', 'supportPhone', e.target.value)}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <Input
                    id="timezone"
                    value={config.general.timezone}
                    onChange={(e) => updateConfig('general', 'timezone', e.target.value)}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <Input
                    id="currency"
                    value={config.general.currency}
                    onChange={(e) => updateConfig('general', 'currency', e.target.value)}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="currency-symbol">Currency Symbol</Label>
                  <Input
                    id="currency-symbol"
                    value={config.general.currencySymbol}
                    onChange={(e) => updateConfig('general', 'currencySymbol', e.target.value)}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="date-format">Date Format</Label>
                  <Input
                    id="date-format"
                    value={config.general.dateFormat}
                    onChange={(e) => updateConfig('general', 'dateFormat', e.target.value)}
                    className="mt-2"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="max-file-size">Max File Size (MB)</Label>
                    <Input
                      id="max-file-size"
                      type="number"
                      value={config.general.maxFileSize}
                      onChange={(e) => updateConfig('general', 'maxFileSize', parseInt(e.target.value))}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                    <Input
                      id="session-timeout"
                      type="number"
                      value={config.general.sessionTimeout}
                      onChange={(e) => updateConfig('general', 'sessionTimeout', parseInt(e.target.value))}
                      className="mt-2"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-900">Maintenance Mode</p>
                    <p className="text-sm text-gray-600">Temporarily disable platform access</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.general.maintenanceMode}
                    onChange={(e) => updateConfig('general', 'maintenanceMode', e.target.checked)}
                    className="w-5 h-5 text-[#000035] border-gray-300 rounded"
                  />
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'email' && (
          <div className="space-y-6">
            <Card className="p-6 border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <Mail className="w-6 h-6 text-[#000035]" />
                <h2 className="text-xl font-bold text-gray-900">Email Configuration</h2>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="smtp-host">SMTP Host</Label>
                    <Input
                      id="smtp-host"
                      value={config.email.smtpHost}
                      onChange={(e) => updateConfig('email', 'smtpHost', e.target.value)}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="smtp-port">SMTP Port</Label>
                    <Input
                      id="smtp-port"
                      type="number"
                      value={config.email.smtpPort}
                      onChange={(e) => updateConfig('email', 'smtpPort', parseInt(e.target.value))}
                      className="mt-2"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="smtp-user">SMTP Username</Label>
                  <Input
                    id="smtp-user"
                    value={config.email.smtpUser}
                    onChange={(e) => updateConfig('email', 'smtpUser', e.target.value)}
                    className="mt-2"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="from-email">From Email</Label>
                    <Input
                      id="from-email"
                      type="email"
                      value={config.email.fromEmail}
                      onChange={(e) => updateConfig('email', 'fromEmail', e.target.value)}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="from-name">From Name</Label>
                    <Input
                      id="from-name"
                      value={config.email.fromName}
                      onChange={(e) => updateConfig('email', 'fromName', e.target.value)}
                      className="mt-2"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-900">Enable SSL</p>
                    <p className="text-sm text-gray-600">Use SSL for secure email connections</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.email.enableSSL}
                    onChange={(e) => updateConfig('email', 'enableSSL', e.target.checked)}
                    className="w-5 h-5 text-[#000035] border-gray-300 rounded"
                  />
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <Card className="p-6 border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <Bell className="w-6 h-6 text-[#000035]" />
                <h2 className="text-xl font-bold text-gray-900">Notification Settings</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-900">Email Notifications</p>
                    <p className="text-sm text-gray-600">Send notifications via email</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.notifications.emailNotifications}
                    onChange={(e) => updateConfig('notifications', 'emailNotifications', e.target.checked)}
                    className="w-5 h-5 text-[#000035] border-gray-300 rounded"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-900">SMS Notifications</p>
                    <p className="text-sm text-gray-600">Send notifications via SMS</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.notifications.smsNotifications}
                    onChange={(e) => updateConfig('notifications', 'smsNotifications', e.target.checked)}
                    className="w-5 h-5 text-[#000035] border-gray-300 rounded"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-900">Push Notifications</p>
                    <p className="text-sm text-gray-600">Send browser push notifications</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.notifications.pushNotifications}
                    onChange={(e) => updateConfig('notifications', 'pushNotifications', e.target.checked)}
                    className="w-5 h-5 text-[#000035] border-gray-300 rounded"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-900">Admin Alerts</p>
                    <p className="text-sm text-gray-600">Send critical alerts to administrators</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.notifications.adminAlerts}
                    onChange={(e) => updateConfig('notifications', 'adminAlerts', e.target.checked)}
                    className="w-5 h-5 text-[#000035] border-gray-300 rounded"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-900">Booking Confirmations</p>
                    <p className="text-sm text-gray-600">Send booking confirmation emails</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.notifications.bookingConfirmations}
                    onChange={(e) => updateConfig('notifications', 'bookingConfirmations', e.target.checked)}
                    className="w-5 h-5 text-[#000035] border-gray-300 rounded"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-900">Payment Alerts</p>
                    <p className="text-sm text-gray-600">Send payment status updates</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.notifications.paymentAlerts}
                    onChange={(e) => updateConfig('notifications', 'paymentAlerts', e.target.checked)}
                    className="w-5 h-5 text-[#000035] border-gray-300 rounded"
                  />
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-6">
            <Card className="p-6 border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <Shield className="w-6 h-6 text-[#000035]" />
                <h2 className="text-xl font-bold text-gray-900">Security Settings</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="password-min-length">Password Minimum Length</Label>
                  <Input
                    id="password-min-length"
                    type="number"
                    value={config.security.passwordMinLength}
                    onChange={(e) => updateConfig('security', 'passwordMinLength', parseInt(e.target.value))}
                    className="mt-2"
                  />
                </div>

                <div className="space-y-3">
                  <p className="font-semibold text-gray-900">Password Requirements</p>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Require Uppercase Letters</p>
                      <p className="text-sm text-gray-600">Password must contain A-Z</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={config.security.passwordRequireUppercase}
                      onChange={(e) => updateConfig('security', 'passwordRequireUppercase', e.target.checked)}
                      className="w-5 h-5 text-[#000035] border-gray-300 rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Require Numbers</p>
                      <p className="text-sm text-gray-600">Password must contain 0-9</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={config.security.passwordRequireNumbers}
                      onChange={(e) => updateConfig('security', 'passwordRequireNumbers', e.target.checked)}
                      className="w-5 h-5 text-[#000035] border-gray-300 rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Require Special Characters</p>
                      <p className="text-sm text-gray-600">Password must contain !@#$%^&*</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={config.security.passwordRequireSpecialChars}
                      onChange={(e) => updateConfig('security', 'passwordRequireSpecialChars', e.target.checked)}
                      className="w-5 h-5 text-[#000035] border-gray-300 rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Require Two-Factor Authentication</p>
                      <p className="text-sm text-gray-600">Mandatory 2FA for all users</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={config.security.twoFactorRequired}
                      onChange={(e) => updateConfig('security', 'twoFactorRequired', e.target.checked)}
                      className="w-5 h-5 text-[#000035] border-gray-300 rounded"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="max-login-attempts">Max Login Attempts</Label>
                    <Input
                      id="max-login-attempts"
                      type="number"
                      value={config.security.maxLoginAttempts}
                      onChange={(e) => updateConfig('security', 'maxLoginAttempts', parseInt(e.target.value))}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lockout-duration">Lockout Duration (minutes)</Label>
                    <Input
                      id="lockout-duration"
                      type="number"
                      value={config.security.lockoutDuration}
                      onChange={(e) => updateConfig('security', 'lockoutDuration', parseInt(e.target.value))}
                      className="mt-2"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="session-expiry">Session Expiry (seconds)</Label>
                  <Input
                    id="session-expiry"
                    type="number"
                    value={config.security.sessionExpiry}
                    onChange={(e) => updateConfig('security', 'sessionExpiry', parseInt(e.target.value))}
                    className="mt-2"
                  />
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'features' && (
          <div className="space-y-6">
            <Card className="p-6 border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <Zap className="w-6 h-6 text-[#000035]" />
                <h2 className="text-xl font-bold text-gray-900">Platform Features</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-900">Travel Booking</p>
                    <p className="text-sm text-gray-600">Enable travel booking module</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.features.travelBooking}
                    onChange={(e) => updateConfig('features', 'travelBooking', e.target.checked)}
                    className="w-5 h-5 text-[#000035] border-gray-300 rounded"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-900">Logistics Booking</p>
                    <p className="text-sm text-gray-600">Enable logistics booking module</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.features.logisticsBooking}
                    onChange={(e) => updateConfig('features', 'logisticsBooking', e.target.checked)}
                    className="w-5 h-5 text-[#000035] border-gray-300 rounded"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-900">Courier Services</p>
                    <p className="text-sm text-gray-600">Enable courier services module</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.features.courierServices}
                    onChange={(e) => updateConfig('features', 'courierServices', e.target.checked)}
                    className="w-5 h-5 text-[#000035] border-gray-300 rounded"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-900">Wallet Management</p>
                    <p className="text-sm text-gray-600">Enable wallet management module</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.features.walletManagement}
                    onChange={(e) => updateConfig('features', 'walletManagement', e.target.checked)}
                    className="w-5 h-5 text-[#000035] border-gray-300 rounded"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-900">Expense Management</p>
                    <p className="text-sm text-gray-600">Enable expense tracking and reimbursement</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.features.expenseManagement}
                    onChange={(e) => updateConfig('features', 'expenseManagement', e.target.checked)}
                    className="w-5 h-5 text-[#000035] border-gray-300 rounded"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-900">Approval Workflow</p>
                    <p className="text-sm text-gray-600">Enable approval workflow for bookings</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.features.approvalWorkflow}
                    onChange={(e) => updateConfig('features', 'approvalWorkflow', e.target.checked)}
                    className="w-5 h-5 text-[#000035] border-gray-300 rounded"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-900">Analytics</p>
                    <p className="text-sm text-gray-600">Enable analytics and reporting</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.features.analytics}
                    onChange={(e) => updateConfig('features', 'analytics', e.target.checked)}
                    className="w-5 h-5 text-[#000035] border-gray-300 rounded"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-900">API Access</p>
                    <p className="text-sm text-gray-600">Enable REST API for integrations</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.features.apiAccess}
                    onChange={(e) => updateConfig('features', 'apiAccess', e.target.checked)}
                    className="w-5 h-5 text-[#000035] border-gray-300 rounded"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-900">Custom Integrations</p>
                    <p className="text-sm text-gray-600">Enable custom third-party integrations</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.features.customIntegrations}
                    onChange={(e) => updateConfig('features', 'customIntegrations', e.target.checked)}
                    className="w-5 h-5 text-[#000035] border-gray-300 rounded"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-900">Bulk Booking</p>
                    <p className="text-sm text-gray-600">Enable bulk booking functionality</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.features.bulkBooking}
                    onChange={(e) => updateConfig('features', 'bulkBooking', e.target.checked)}
                    className="w-5 h-5 text-[#000035] border-gray-300 rounded"
                  />
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'limits' && (
          <div className="space-y-6">
            <Card className="p-6 border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <Database className="w-6 h-6 text-[#000035]" />
                <h2 className="text-xl font-bold text-gray-900">Platform Limits</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="max-companies">Max Companies</Label>
                  <Input
                    id="max-companies"
                    type="number"
                    value={config.limits.maxCompanies}
                    onChange={(e) => updateConfig('limits', 'maxCompanies', parseInt(e.target.value))}
                    className="mt-2"
                  />
                  <p className="text-sm text-gray-600 mt-1">Maximum number of companies allowed on platform</p>
                </div>

                <div>
                  <Label htmlFor="max-users">Max Users Per Company</Label>
                  <Input
                    id="max-users"
                    type="number"
                    value={config.limits.maxUsersPerCompany}
                    onChange={(e) => updateConfig('limits', 'maxUsersPerCompany', parseInt(e.target.value))}
                    className="mt-2"
                  />
                  <p className="text-sm text-gray-600 mt-1">Maximum users each company can have</p>
                </div>

                <div>
                  <Label htmlFor="max-bookings">Max Bookings Per Month</Label>
                  <Input
                    id="max-bookings"
                    type="number"
                    value={config.limits.maxBookingsPerMonth}
                    onChange={(e) => updateConfig('limits', 'maxBookingsPerMonth', parseInt(e.target.value))}
                    className="mt-2"
                  />
                  <p className="text-sm text-gray-600 mt-1">Maximum bookings per company per month</p>
                </div>

                <div>
                  <Label htmlFor="api-rate-limit">API Rate Limit (requests/hour)</Label>
                  <Input
                    id="api-rate-limit"
                    type="number"
                    value={config.limits.apiRateLimit}
                    onChange={(e) => updateConfig('limits', 'apiRateLimit', parseInt(e.target.value))}
                    className="mt-2"
                  />
                  <p className="text-sm text-gray-600 mt-1">Maximum API requests per hour per company</p>
                </div>

                <div>
                  <Label htmlFor="max-file-uploads">Max File Uploads</Label>
                  <Input
                    id="max-file-uploads"
                    type="number"
                    value={config.limits.maxFileUploads}
                    onChange={(e) => updateConfig('limits', 'maxFileUploads', parseInt(e.target.value))}
                    className="mt-2"
                  />
                  <p className="text-sm text-gray-600 mt-1">Maximum number of file uploads per company</p>
                </div>

                <div>
                  <Label htmlFor="storage-per-company">Storage Per Company (MB)</Label>
                  <Input
                    id="storage-per-company"
                    type="number"
                    value={config.limits.storagePerCompany}
                    onChange={(e) => updateConfig('limits', 'storagePerCompany', parseInt(e.target.value))}
                    className="mt-2"
                  />
                  <p className="text-sm text-gray-600 mt-1">Maximum storage space per company</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'booking' && (
          <div className="space-y-6">
            <Card className="p-6 border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <Truck className="w-6 h-6 text-[#000035]" />
                <h2 className="text-xl font-bold text-gray-900">Booking Settings</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="auto-approval-threshold">Auto Approval Threshold</Label>
                  <Input
                    id="auto-approval-threshold"
                    type="number"
                    value={config.booking.autoApprovalThreshold}
                    onChange={(e) => updateConfig('booking', 'autoApprovalThreshold', parseInt(e.target.value))}
                    className="mt-2"
                  />
                  <p className="text-sm text-gray-600 mt-1">Booking amount below which auto-approval is enabled</p>
                </div>

                <div>
                  <Label htmlFor="cancellation-window">Cancellation Window (hours)</Label>
                  <Input
                    id="cancellation-window"
                    type="number"
                    value={config.booking.cancellationWindow}
                    onChange={(e) => updateConfig('booking', 'cancellationWindow', parseInt(e.target.value))}
                    className="mt-2"
                  />
                  <p className="text-sm text-gray-600 mt-1">Time window within which bookings can be cancelled</p>
                </div>

                <div>
                  <Label htmlFor="advance-booking-days">Advance Booking Days</Label>
                  <Input
                    id="advance-booking-days"
                    type="number"
                    value={config.booking.advanceBookingDays}
                    onChange={(e) => updateConfig('booking', 'advanceBookingDays', parseInt(e.target.value))}
                    className="mt-2"
                  />
                  <p className="text-sm text-gray-600 mt-1">Number of days in advance bookings can be made</p>
                </div>

                <div>
                  <Label htmlFor="max-bookings-per-day">Max Bookings Per Day</Label>
                  <Input
                    id="max-bookings-per-day"
                    type="number"
                    value={config.booking.maxBookingsPerDay}
                    onChange={(e) => updateConfig('booking', 'maxBookingsPerDay', parseInt(e.target.value))}
                    className="mt-2"
                  />
                  <p className="text-sm text-gray-600 mt-1">Maximum number of bookings allowed per day</p>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-900">Require Approval</p>
                    <p className="text-sm text-gray-600">Require manual approval for bookings</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.booking.requireApproval}
                    onChange={(e) => updateConfig('booking', 'requireApproval', e.target.checked)}
                    className="w-5 h-5 text-[#000035] border-gray-300 rounded"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-900">Allow Cancellation</p>
                    <p className="text-sm text-gray-600">Allow cancellation of bookings</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.booking.allowCancellation}
                    onChange={(e) => updateConfig('booking', 'allowCancellation', e.target.checked)}
                    className="w-5 h-5 text-[#000035] border-gray-300 rounded"
                  />
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'payment' && (
          <div className="space-y-6">
            <Card className="p-6 border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <CreditCard className="w-6 h-6 text-[#000035]" />
                <h2 className="text-xl font-bold text-gray-900">Payment Settings</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-900">Razorpay Enabled</p>
                    <p className="text-sm text-gray-600">Enable Razorpay payment gateway</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.payment.razorpayEnabled}
                    onChange={(e) => updateConfig('payment', 'razorpayEnabled', e.target.checked)}
                    className="w-5 h-5 text-[#000035] border-gray-300 rounded"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-900">Stripe Enabled</p>
                    <p className="text-sm text-gray-600">Enable Stripe payment gateway</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.payment.stripeEnabled}
                    onChange={(e) => updateConfig('payment', 'stripeEnabled', e.target.checked)}
                    className="w-5 h-5 text-[#000035] border-gray-300 rounded"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-900">Paypal Enabled</p>
                    <p className="text-sm text-gray-600">Enable Paypal payment gateway</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.payment.paypalEnabled}
                    onChange={(e) => updateConfig('payment', 'paypalEnabled', e.target.checked)}
                    className="w-5 h-5 text-[#000035] border-gray-300 rounded"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-900">COD Enabled</p>
                    <p className="text-sm text-gray-600">Enable Cash on Delivery payment option</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.payment.codEnabled}
                    onChange={(e) => updateConfig('payment', 'codEnabled', e.target.checked)}
                    className="w-5 h-5 text-[#000035] border-gray-300 rounded"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-900">Wallet Enabled</p>
                    <p className="text-sm text-gray-600">Enable wallet payment option</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.payment.walletEnabled}
                    onChange={(e) => updateConfig('payment', 'walletEnabled', e.target.checked)}
                    className="w-5 h-5 text-[#000035] border-gray-300 rounded"
                  />
                </div>

                <div>
                  <Label htmlFor="min-wallet-balance">Min Wallet Balance</Label>
                  <Input
                    id="min-wallet-balance"
                    type="number"
                    value={config.payment.minWalletBalance}
                    onChange={(e) => updateConfig('payment', 'minWalletBalance', parseInt(e.target.value))}
                    className="mt-2"
                  />
                  <p className="text-sm text-gray-600 mt-1">Minimum balance required in wallet for payments</p>
                </div>

                <div>
                  <Label htmlFor="max-wallet-balance">Max Wallet Balance</Label>
                  <Input
                    id="max-wallet-balance"
                    type="number"
                    value={config.payment.maxWalletBalance}
                    onChange={(e) => updateConfig('payment', 'maxWalletBalance', parseInt(e.target.value))}
                    className="mt-2"
                  />
                  <p className="text-sm text-gray-600 mt-1">Maximum balance allowed in wallet</p>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-900">Auto Refund</p>
                    <p className="text-sm text-gray-600">Enable automatic refunds for cancelled bookings</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.payment.autoRefund}
                    onChange={(e) => updateConfig('payment', 'autoRefund', e.target.checked)}
                    className="w-5 h-5 text-[#000035] border-gray-300 rounded"
                  />
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Floating Save Button */}
      {hasUnsavedChanges && (
        <div className="fixed bottom-8 right-8">
          <Button
            onClick={handleSaveConfig}
            className="bg-[#000035] hover:bg-[#000055] shadow-lg"
            size="lg"
          >
            <Save className="w-5 h-5 mr-2" />
            Save All Changes
          </Button>
        </div>
      )}
    </div>
  );
}