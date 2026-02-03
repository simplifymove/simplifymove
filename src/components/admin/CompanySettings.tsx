import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Settings, 
  Building2, 
  Bell,
  Shield,
  Users,
  Mail,
  Phone,
  MapPin,
  Globe,
  Save,
  Upload
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function CompanySettings() {
  const [companyName, setCompanyName] = useState('Acme Corporation');
  const [companyEmail, setCompanyEmail] = useState('admin@acmecorp.com');
  const [companyPhone, setCompanyPhone] = useState('+91 22 1234 5678');
  const [companyAddress, setCompanyAddress] = useState('123 Business Plaza, Mumbai, India');
  const [companyWebsite, setCompanyWebsite] = useState('www.acmecorp.com');

  const handleSave = () => {
    toast.success('Settings saved successfully');
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2">Company Settings</h1>
        <p className="text-gray-600">Manage your company profile and preferences</p>
      </div>

      <Tabs defaultValue="company" className="space-y-6">
        <TabsList className="grid w-full max-w-2xl grid-cols-4">
          <TabsTrigger value="company">Company</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>

        {/* Company Information Tab */}
        <TabsContent value="company" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="mb-1">Company Information</h3>
                <p className="text-sm text-gray-600">Update your company details</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="company-name">Company Name</Label>
                <Input
                  id="company-name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="company-email">Email Address</Label>
                <div className="relative mt-2">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="company-email"
                    type="email"
                    value={companyEmail}
                    onChange={(e) => setCompanyEmail(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="company-phone">Phone Number</Label>
                <div className="relative mt-2">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="company-phone"
                    value={companyPhone}
                    onChange={(e) => setCompanyPhone(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="company-website">Website</Label>
                <div className="relative mt-2">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="company-website"
                    value={companyWebsite}
                    onChange={(e) => setCompanyWebsite(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="company-address">Address</Label>
                <div className="relative mt-2">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    id="company-address"
                    value={companyAddress}
                    onChange={(e) => setCompanyAddress(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t">
              <div className="mb-4">
                <Label>Company Logo</Label>
                <p className="text-sm text-gray-600 mb-3">Upload your company logo (recommended size: 200x200px)</p>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white text-2xl font-bold">
                    AC
                  </div>
                  <Button variant="outline">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload New Logo
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <Button 
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                onClick={handleSave}
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                <Bell className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="mb-1">Notification Preferences</h3>
                <p className="text-sm text-gray-600">Choose what notifications you want to receive</p>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { label: 'New approval requests', desc: 'Get notified when employees submit approval requests' },
                { label: 'Policy violations', desc: 'Alert when bookings violate company policies' },
                { label: 'Budget alerts', desc: 'Notifications when budgets reach threshold limits' },
                { label: 'Employee wallet low balance', desc: 'Alert when employee wallets are running low' },
                { label: 'Monthly reports', desc: 'Receive monthly analytics and spending reports' },
                { label: 'System updates', desc: 'Important platform updates and announcements' },
              ].map((item, index) => (
                <div key={index} className="flex items-start justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 mb-1">{item.label}</div>
                    <div className="text-sm text-gray-600">{item.desc}</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              ))}
            </div>

            <div className="flex justify-end mt-6">
              <Button 
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                onClick={handleSave}
              >
                <Save className="w-4 h-4 mr-2" />
                Save Preferences
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="mb-1">Security Settings</h3>
                <p className="text-sm text-gray-600">Manage your account security</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="mb-4">Password</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" className="mt-2" />
                  </div>
                  <div></div>
                  <div>
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" className="mt-2" />
                  </div>
                  <div>
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" className="mt-2" />
                  </div>
                </div>
                <Button variant="outline" className="mt-4">Update Password</Button>
              </div>

              <div className="pt-6 border-t">
                <h4 className="mb-4">Two-Factor Authentication</h4>
                <div className="flex items-start justify-between p-4 border rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900 mb-1">Enable 2FA</div>
                    <div className="text-sm text-gray-600">Add an extra layer of security to your account</div>
                  </div>
                  <Badge className="bg-gray-100 text-gray-700">Disabled</Badge>
                </div>
                <Button variant="outline" className="mt-4">Enable 2FA</Button>
              </div>

              <div className="pt-6 border-t">
                <h4 className="mb-4">Active Sessions</h4>
                <div className="space-y-3">
                  <div className="flex items-start justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900 mb-1">Chrome on Windows</div>
                      <div className="text-sm text-gray-600">Mumbai, India • Last active: 2 mins ago</div>
                    </div>
                    <Badge className="bg-green-100 text-green-700">Current</Badge>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Integrations Tab */}
        <TabsContent value="integrations" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="mb-1">Integrations</h3>
                <p className="text-sm text-gray-600">Connect with third-party services</p>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { name: 'Slack', desc: 'Get approval notifications in Slack', status: 'Connected' },
                { name: 'Microsoft Teams', desc: 'Sync bookings with Teams calendar', status: 'Not Connected' },
                { name: 'Google Workspace', desc: 'Integrate with Google Calendar and Gmail', status: 'Not Connected' },
                { name: 'Accounting Software', desc: 'Export expenses to QuickBooks or Xero', status: 'Not Connected' },
              ].map((integration, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 mb-1">{integration.name}</div>
                    <div className="text-sm text-gray-600">{integration.desc}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={integration.status === 'Connected' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                      {integration.status}
                    </Badge>
                    <Button variant="outline" size="sm">
                      {integration.status === 'Connected' ? 'Configure' : 'Connect'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
