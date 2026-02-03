import { useState } from 'react';
import { Card } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { CompanySettings } from './CompanySettings';
import { ZohoExpensesIntegration } from './ZohoExpensesIntegration';
import { Building2, Link2, Bell, Settings } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';

function PreferencesSettings() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [approvalNotifications, setApprovalNotifications] = useState(true);
  const [budgetAlerts, setBudgetAlerts] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(true);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">Preferences</h2>
        <p className="text-sm text-gray-600">Manage your notification and system preferences</p>
      </div>

      {/* Notifications */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notifications</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b">
            <div>
              <p className="font-medium text-gray-900">Email Notifications</p>
              <p className="text-sm text-gray-600">Receive notifications via email</p>
            </div>
            <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
          </div>

          <div className="flex items-center justify-between py-3 border-b">
            <div>
              <p className="font-medium text-gray-900">SMS Notifications</p>
              <p className="text-sm text-gray-600">Receive critical alerts via SMS</p>
            </div>
            <Switch checked={smsNotifications} onCheckedChange={setSmsNotifications} />
          </div>

          <div className="flex items-center justify-between py-3 border-b">
            <div>
              <p className="font-medium text-gray-900">Approval Requests</p>
              <p className="text-sm text-gray-600">Get notified for new approval requests</p>
            </div>
            <Switch checked={approvalNotifications} onCheckedChange={setApprovalNotifications} />
          </div>

          <div className="flex items-center justify-between py-3 border-b">
            <div>
              <p className="font-medium text-gray-900">Budget Alerts</p>
              <p className="text-sm text-gray-600">Alert when budgets exceed thresholds</p>
            </div>
            <Switch checked={budgetAlerts} onCheckedChange={setBudgetAlerts} />
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-gray-900">Weekly Reports</p>
              <p className="text-sm text-gray-600">Receive weekly summary reports</p>
            </div>
            <Switch checked={weeklyReports} onCheckedChange={setWeeklyReports} />
          </div>
        </div>
      </Card>

      {/* Email Settings */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Settings</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Notification Email</Label>
            <Input type="email" placeholder="admin@acmecorporation.com" defaultValue="admin@acmecorporation.com" />
            <p className="text-xs text-gray-600">Email address for system notifications</p>
          </div>

          <div className="space-y-2">
            <Label>CC Email (Optional)</Label>
            <Input type="email" placeholder="finance@acmecorporation.com" />
            <p className="text-xs text-gray-600">Additional email for important notifications</p>
          </div>
        </div>
      </Card>

      {/* Default Settings */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Default Settings</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Default Currency</Label>
            <Input value="INR (₹)" disabled />
          </div>

          <div className="space-y-2">
            <Label>Time Zone</Label>
            <Input value="Asia/Kolkata (IST)" disabled />
          </div>

          <div className="space-y-2">
            <Label>Date Format</Label>
            <Input value="DD/MM/YYYY" disabled />
          </div>
        </div>
      </Card>

      <div className="flex justify-end gap-3">
        <Button variant="outline">Reset to Default</Button>
        <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
          Save Changes
        </Button>
      </div>
    </div>
  );
}

export function SettingsConsolidated() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-600 mt-1">Configure company, integrations, and preferences</p>
      </div>

      {/* Tabbed Content */}
      <Tabs defaultValue="company" className="space-y-6">
        <TabsList className="bg-white border shadow-sm">
          <TabsTrigger value="company" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
            <Building2 className="w-4 h-4 mr-2" />
            Company
          </TabsTrigger>
          <TabsTrigger value="integrations" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
            <Link2 className="w-4 h-4 mr-2" />
            Integrations
          </TabsTrigger>
          <TabsTrigger value="preferences" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
            <Bell className="w-4 h-4 mr-2" />
            Preferences
          </TabsTrigger>
        </TabsList>

        <TabsContent value="company">
          <CompanySettings />
        </TabsContent>

        <TabsContent value="integrations">
          <ZohoExpensesIntegration />
        </TabsContent>

        <TabsContent value="preferences">
          <PreferencesSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}