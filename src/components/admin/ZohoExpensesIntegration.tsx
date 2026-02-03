import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import { CheckCircle, XCircle, RefreshCw, ExternalLink, AlertCircle, Zap } from 'lucide-react';
import { toast } from 'sonner';

export function ZohoExpensesIntegration() {
  const [isConnected, setIsConnected] = useState(false);
  const [autoSync, setAutoSync] = useState(true);
  const [syncFrequency, setSyncFrequency] = useState('realtime');
  const [apiKey, setApiKey] = useState('');
  const [lastSync, setLastSync] = useState('2024-01-23 14:30:00');

  const handleConnect = () => {
    if (!apiKey) {
      toast.error('Please enter your Zoho API credentials');
      return;
    }
    setIsConnected(true);
    toast.success('Successfully connected to Zoho Expenses!');
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    toast.success('Disconnected from Zoho Expenses');
  };

  const handleManualSync = () => {
    toast.success('Syncing expense data with Zoho...');
    setTimeout(() => {
      setLastSync(new Date().toLocaleString());
      toast.success('Sync completed successfully!');
    }, 2000);
  };

  const handleTestConnection = () => {
    toast.success('Connection test successful!');
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h2>Zoho Expenses Integration</h2>
        <p className="text-sm text-gray-600 mt-1">Connect your company's Zoho Expenses account to sync expense data</p>
      </div>

      {/* Connection Status */}
      <Card className="p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-orange-100 rounded-xl">
              <img 
                src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23e56b1f'%3E%3Ctext x='3' y='18' font-size='16' font-weight='bold'%3EZ%3C/text%3E%3C/svg%3E" 
                alt="Zoho" 
                className="w-8 h-8"
              />
            </div>
            <div>
              <h3 className="text-sm text-gray-900 mb-1">Zoho Expenses</h3>
              <div className="flex items-center gap-2">
                {isConnected ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-600">Connected</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Not Connected</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isConnected ? (
              <>
                <Button variant="outline" onClick={handleManualSync}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Sync Now
                </Button>
                <Button variant="outline" onClick={handleDisconnect}>
                  Disconnect
                </Button>
              </>
            ) : (
              <Button onClick={handleConnect}>
                Connect Account
              </Button>
            )}
          </div>
        </div>
      </Card>

      {!isConnected ? (
        /* Connection Setup */
        <>
          <Card className="p-6 mb-6 bg-blue-50 border-blue-200">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="text-sm text-blue-900 mb-2">Setup Instructions</h3>
                <ol className="text-sm text-blue-700 space-y-2 list-decimal list-inside">
                  <li>Log in to your Zoho Expenses account</li>
                  <li>Navigate to Settings → Developer Space → API</li>
                  <li>Generate a new API key for SimplifyMove integration</li>
                  <li>Copy the API key and paste it below</li>
                  <li>Click "Connect Account" to complete the integration</li>
                </ol>
                <Button variant="link" className="mt-3 p-0 h-auto text-blue-700">
                  <ExternalLink className="w-4 h-4 mr-1" />
                  View detailed integration guide
                </Button>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-sm text-gray-900 mb-4">API Credentials</h3>
            <div className="space-y-4">
              <div>
                <Label>Organization ID</Label>
                <Input 
                  placeholder="Enter your Zoho Organization ID"
                  className="mt-2"
                />
              </div>

              <div>
                <Label>API Key</Label>
                <Input 
                  type="password"
                  placeholder="Enter your Zoho API Key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="mt-2"
                />
              </div>

              <div>
                <Label>API Secret</Label>
                <Input 
                  type="password"
                  placeholder="Enter your Zoho API Secret"
                  className="mt-2"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" onClick={handleTestConnection} className="flex-1">
                  Test Connection
                </Button>
                <Button onClick={handleConnect} className="flex-1">
                  Connect Account
                </Button>
              </div>
            </div>
          </Card>
        </>
      ) : (
        /* Connected Settings */
        <>
          {/* Sync Settings */}
          <Card className="p-6 mb-6">
            <h3 className="text-sm text-gray-900 mb-4">Sync Settings</h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label>Automatic Sync</Label>
                  <p className="text-xs text-gray-600 mt-1">
                    Automatically sync expense claims with Zoho
                  </p>
                </div>
                <Switch checked={autoSync} onCheckedChange={setAutoSync} />
              </div>

              {autoSync && (
                <div>
                  <Label>Sync Frequency</Label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    <Button
                      variant={syncFrequency === 'realtime' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSyncFrequency('realtime')}
                    >
                      <Zap className="w-3 h-3 mr-1" />
                      Real-time
                    </Button>
                    <Button
                      variant={syncFrequency === 'hourly' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSyncFrequency('hourly')}
                    >
                      Hourly
                    </Button>
                    <Button
                      variant={syncFrequency === 'daily' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSyncFrequency('daily')}
                    >
                      Daily
                    </Button>
                  </div>
                </div>
              )}

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Last Sync</span>
                  <span className="text-gray-900">{lastSync}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Data Mapping */}
          <Card className="p-6 mb-6">
            <h3 className="text-sm text-gray-900 mb-4">Field Mapping</h3>
            <p className="text-sm text-gray-600 mb-4">
              Map SimplifyMove fields to your Zoho Expenses fields
            </p>

            <div className="space-y-3">
              {[
                { simplify: 'Expense Category', zoho: 'Category' },
                { simplify: 'Amount', zoho: 'Amount' },
                { simplify: 'Description', zoho: 'Notes' },
                { simplify: 'Employee', zoho: 'User' },
                { simplify: 'Date', zoho: 'Expense Date' },
                { simplify: 'Receipt', zoho: 'Attachment' },
              ].map((mapping, idx) => (
                <div key={idx} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{mapping.simplify}</p>
                  </div>
                  <div className="text-gray-400">→</div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{mapping.zoho}</p>
                  </div>
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
              ))}
            </div>
          </Card>

          {/* Sync Status */}
          <Card className="p-6">
            <h3 className="text-sm text-gray-900 mb-4">Sync Statistics</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-xs text-green-700 mb-1">Synced Successfully</p>
                <p className="text-2xl text-green-900">248</p>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-xs text-yellow-700 mb-1">Pending Sync</p>
                <p className="text-2xl text-yellow-900">12</p>
              </div>
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <p className="text-xs text-red-700 mb-1">Failed</p>
                <p className="text-2xl text-red-900">3</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs text-blue-700 mb-1">Total Claims</p>
                <p className="text-2xl text-blue-900">263</p>
              </div>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
