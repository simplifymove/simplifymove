import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import {
  Plug,
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Key,
  Globe,
  Zap,
  Activity
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface Vendor {
  id: string;
  name: string;
  category: 'payment' | 'travel' | 'logistics' | 'communication' | 'analytics' | 'other';
  status: 'active' | 'inactive' | 'testing';
  description: string;
  apiEndpoint: string;
  apiKey: string;
  webhookUrl: string;
  connectedCompanies: number;
  lastSync: string;
  healthStatus: 'healthy' | 'degraded' | 'down';
  requestsToday: number;
  uptime: number;
}

interface Integration {
  id: string;
  name: string;
  type: 'api' | 'webhook' | 'oauth' | 'custom';
  status: 'active' | 'inactive';
  vendor: string;
  description: string;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  authType: 'api_key' | 'oauth2' | 'bearer' | 'basic';
  callsToday: number;
  successRate: number;
  avgResponseTime: number;
}

const mockVendors: Vendor[] = [
  {
    id: 'VENDOR-001',
    name: 'Razorpay',
    category: 'payment',
    status: 'active',
    description: 'Payment gateway for processing transactions',
    apiEndpoint: 'https://api.razorpay.com/v1',
    apiKey: 'rzp_live_••••••••••••',
    webhookUrl: 'https://simplifymove.com/webhooks/razorpay',
    connectedCompanies: 5,
    lastSync: '2024-12-24 11:45 AM',
    healthStatus: 'healthy',
    requestsToday: 1247,
    uptime: 99.9,
  },
  {
    id: 'VENDOR-002',
    name: 'MakeMyTrip API',
    category: 'travel',
    status: 'active',
    description: 'Flight and hotel booking integration',
    apiEndpoint: 'https://api.makemytrip.com/v2',
    apiKey: 'mmt_live_••••••••••••',
    webhookUrl: 'https://simplifymove.com/webhooks/mmt',
    connectedCompanies: 5,
    lastSync: '2024-12-24 11:30 AM',
    healthStatus: 'healthy',
    requestsToday: 798,
    uptime: 99.5,
  },
  {
    id: 'VENDOR-003',
    name: 'Porter Logistics',
    category: 'logistics',
    status: 'active',
    description: 'Last-mile delivery and logistics services',
    apiEndpoint: 'https://api.porter.in/v1',
    apiKey: 'ptr_live_••••••••••••',
    webhookUrl: 'https://simplifymove.com/webhooks/porter',
    connectedCompanies: 3,
    lastSync: '2024-12-24 10:15 AM',
    healthStatus: 'degraded',
    requestsToday: 423,
    uptime: 95.2,
  },
  {
    id: 'VENDOR-004',
    name: 'Twilio',
    category: 'communication',
    status: 'active',
    description: 'SMS and communication services',
    apiEndpoint: 'https://api.twilio.com/2010-04-01',
    apiKey: 'AC••••••••••••••••••',
    webhookUrl: 'https://simplifymove.com/webhooks/twilio',
    connectedCompanies: 5,
    lastSync: '2024-12-24 11:50 AM',
    healthStatus: 'healthy',
    requestsToday: 2341,
    uptime: 99.99,
  },
  {
    id: 'VENDOR-005',
    name: 'Google Analytics',
    category: 'analytics',
    status: 'active',
    description: 'Platform analytics and tracking',
    apiEndpoint: 'https://analytics.google.com/v4',
    apiKey: 'GA_••••••••••••',
    webhookUrl: '-',
    connectedCompanies: 5,
    lastSync: '2024-12-24 11:55 AM',
    healthStatus: 'healthy',
    requestsToday: 145,
    uptime: 100,
  },
  {
    id: 'VENDOR-006',
    name: 'Ola/Uber Integration',
    category: 'travel',
    status: 'active',
    description: 'Cab booking and ride-hailing services',
    apiEndpoint: 'https://api.olacabs.com/v1',
    apiKey: 'ola_live_••••••••••••',
    webhookUrl: 'https://simplifymove.com/webhooks/ola',
    connectedCompanies: 4,
    lastSync: '2024-12-24 11:20 AM',
    healthStatus: 'healthy',
    requestsToday: 678,
    uptime: 98.5,
  },
  {
    id: 'VENDOR-007',
    name: 'RedBus API',
    category: 'travel',
    status: 'active',
    description: 'Bus ticket booking services',
    apiEndpoint: 'https://api.redbus.in/v1',
    apiKey: 'rb_live_••••••••••••',
    webhookUrl: 'https://simplifymove.com/webhooks/redbus',
    connectedCompanies: 4,
    lastSync: '2024-12-24 10:45 AM',
    healthStatus: 'healthy',
    requestsToday: 234,
    uptime: 99.2,
  },
  {
    id: 'VENDOR-008',
    name: 'SendGrid',
    category: 'communication',
    status: 'active',
    description: 'Email delivery and notification service',
    apiEndpoint: 'https://api.sendgrid.com/v3',
    apiKey: 'SG.••••••••••••••••••',
    webhookUrl: 'https://simplifymove.com/webhooks/sendgrid',
    connectedCompanies: 5,
    lastSync: '2024-12-24 11:40 AM',
    healthStatus: 'healthy',
    requestsToday: 1876,
    uptime: 99.8,
  },
  {
    id: 'VENDOR-009',
    name: 'Delhivery',
    category: 'logistics',
    status: 'active',
    description: 'Courier and parcel tracking services',
    apiEndpoint: 'https://api.delhivery.com/v1',
    apiKey: 'dlv_live_••••••••••••',
    webhookUrl: 'https://simplifymove.com/webhooks/delhivery',
    connectedCompanies: 3,
    lastSync: '2024-12-24 10:30 AM',
    healthStatus: 'healthy',
    requestsToday: 567,
    uptime: 97.8,
  },
  {
    id: 'VENDOR-010',
    name: 'Rapido',
    category: 'travel',
    status: 'active',
    description: 'Bike and two-wheeler booking services',
    apiEndpoint: 'https://api.rapido.bike/v1',
    apiKey: 'rap_live_••••••••••••',
    webhookUrl: 'https://simplifymove.com/webhooks/rapido',
    connectedCompanies: 4,
    lastSync: '2024-12-24 11:10 AM',
    healthStatus: 'healthy',
    requestsToday: 892,
    uptime: 98.8,
  },
];

const mockIntegrations: Integration[] = [
  {
    id: 'INT-001',
    name: 'Payment Processing',
    type: 'api',
    status: 'active',
    vendor: 'Razorpay',
    description: 'Process wallet recharge, booking payments and refunds',
    endpoint: '/api/v1/payments/process',
    method: 'POST',
    authType: 'api_key',
    callsToday: 1247,
    successRate: 99.2,
    avgResponseTime: 245,
  },
  {
    id: 'INT-002',
    name: 'Flight Booking',
    type: 'api',
    status: 'active',
    vendor: 'MakeMyTrip API',
    description: 'Search and book domestic/international flights',
    endpoint: '/api/v2/travel/flights/book',
    method: 'POST',
    authType: 'oauth2',
    callsToday: 456,
    successRate: 97.5,
    avgResponseTime: 1250,
  },
  {
    id: 'INT-003',
    name: 'Hotel Booking',
    type: 'api',
    status: 'active',
    vendor: 'MakeMyTrip API',
    description: 'Search and book hotels across India',
    endpoint: '/api/v2/travel/hotels/book',
    method: 'POST',
    authType: 'oauth2',
    callsToday: 342,
    successRate: 98.1,
    avgResponseTime: 980,
  },
  {
    id: 'INT-004',
    name: 'SMS Notifications',
    type: 'api',
    status: 'active',
    vendor: 'Twilio',
    description: 'Send booking confirmations and OTP to users',
    endpoint: '/api/v1/messages/send',
    method: 'POST',
    authType: 'basic',
    callsToday: 2341,
    successRate: 98.8,
    avgResponseTime: 180,
  },
  {
    id: 'INT-005',
    name: 'Logistics Tracking',
    type: 'webhook',
    status: 'active',
    vendor: 'Porter Logistics',
    description: 'Real-time delivery tracking for logistics bookings',
    endpoint: '/api/v1/logistics/track',
    method: 'POST',
    authType: 'bearer',
    callsToday: 423,
    successRate: 94.3,
    avgResponseTime: 650,
  },
  {
    id: 'INT-006',
    name: 'Cab Booking',
    type: 'api',
    status: 'active',
    vendor: 'Ola/Uber Integration',
    description: 'Book cabs for business travel',
    endpoint: '/api/v1/travel/cab/book',
    method: 'POST',
    authType: 'oauth2',
    callsToday: 678,
    successRate: 96.7,
    avgResponseTime: 520,
  },
  {
    id: 'INT-007',
    name: 'Bus Booking',
    type: 'api',
    status: 'active',
    vendor: 'RedBus API',
    description: 'Search and book intercity bus tickets',
    endpoint: '/api/v1/travel/bus/book',
    method: 'POST',
    authType: 'api_key',
    callsToday: 234,
    successRate: 97.8,
    avgResponseTime: 780,
  },
  {
    id: 'INT-008',
    name: 'Email Notifications',
    type: 'api',
    status: 'active',
    vendor: 'SendGrid',
    description: 'Send booking confirmations and invoices via email',
    endpoint: '/api/v1/email/send',
    method: 'POST',
    authType: 'api_key',
    callsToday: 1876,
    successRate: 99.5,
    avgResponseTime: 320,
  },
  {
    id: 'INT-009',
    name: 'Two-Wheeler Booking',
    type: 'api',
    status: 'active',
    vendor: 'Rapido',
    description: 'Book bikes and two-wheelers for quick travel',
    endpoint: '/api/v1/travel/bike/book',
    method: 'POST',
    authType: 'oauth2',
    callsToday: 892,
    successRate: 97.2,
    avgResponseTime: 420,
  },
  {
    id: 'INT-010',
    name: 'Courier Tracking',
    type: 'webhook',
    status: 'active',
    vendor: 'Delhivery',
    description: 'Real-time courier shipment tracking and updates',
    endpoint: '/api/v1/courier/track',
    method: 'GET',
    authType: 'bearer',
    callsToday: 567,
    successRate: 95.6,
    avgResponseTime: 450,
  },
];

export function VendorIntegrationClean() {
  const [vendors, setVendors] = useState<Vendor[]>(mockVendors);
  const [integrations, setIntegrations] = useState<Integration[]>(mockIntegrations);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [showVendorDialog, setShowVendorDialog] = useState(false);
  const [showIntegrationDialog, setShowIntegrationDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('vendors');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const [formData, setFormData] = useState({
    name: '',
    category: 'payment',
    description: '',
    apiEndpoint: '',
    apiKey: '',
    webhookUrl: '',
  });

  // Get category color
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'payment': return { bg: 'bg-green-100', text: 'text-green-600' };
      case 'travel': return { bg: 'bg-blue-100', text: 'text-blue-600' };
      case 'logistics': return { bg: 'bg-purple-100', text: 'text-purple-600' };
      case 'communication': return { bg: 'bg-orange-100', text: 'text-orange-600' };
      case 'analytics': return { bg: 'bg-pink-100', text: 'text-pink-600' };
      default: return { bg: 'bg-gray-100', text: 'text-gray-600' };
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-50 text-green-700 border-green-200';
      case 'inactive': return 'bg-gray-50 text-gray-700 border-gray-200';
      case 'testing': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  // Get health status color
  const getHealthColor = (health: string) => {
    switch (health) {
      case 'healthy': return { bg: 'bg-green-100', text: 'text-green-600', icon: CheckCircle2 };
      case 'degraded': return { bg: 'bg-yellow-100', text: 'text-yellow-600', icon: AlertCircle };
      case 'down': return { bg: 'bg-red-100', text: 'text-red-600', icon: XCircle };
      default: return { bg: 'bg-gray-100', text: 'text-gray-600', icon: Activity };
    }
  };

  // Add/Edit Vendor
  const handleSaveVendor = () => {
    if (isEditing && selectedVendor) {
      setVendors(vendors.map(v => v.id === selectedVendor.id ? { ...v, ...formData } : v));
      toast.success('Vendor updated successfully');
    } else {
      const newVendor: Vendor = {
        id: `VENDOR-${String(vendors.length + 1).padStart(3, '0')}`,
        ...formData,
        status: 'inactive',
        connectedCompanies: 0,
        lastSync: '-',
        healthStatus: 'healthy',
        requestsToday: 0,
        uptime: 100,
      } as Vendor;
      setVendors([...vendors, newVendor]);
      toast.success('Vendor added successfully');
    }
    setShowVendorDialog(false);
    resetForm();
  };

  // Delete vendor
  const handleDeleteVendor = (vendor: Vendor) => {
    setVendors(vendors.filter(v => v.id !== vendor.id));
    toast.success('Vendor deleted successfully');
  };

  // Test connection
  const handleTestConnection = (vendor: Vendor) => {
    toast.success(`Testing connection to ${vendor.name}...`, {
      description: 'Connection test initiated',
    });
    setTimeout(() => {
      toast.success(`Connection to ${vendor.name} successful!`);
    }, 2000);
  };

  // Toggle vendor status
  const handleToggleStatus = (vendor: Vendor) => {
    const newStatus = vendor.status === 'active' ? 'inactive' : 'active';
    setVendors(vendors.map(v => v.id === vendor.id ? { ...v, status: newStatus } : v));
    toast.success(`Vendor ${newStatus === 'active' ? 'activated' : 'deactivated'}`);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      category: 'payment',
      description: '',
      apiEndpoint: '',
      apiKey: '',
      webhookUrl: '',
    });
    setIsEditing(false);
    setSelectedVendor(null);
  };

  // Filter vendors
  const filteredVendors = vendors.filter(vendor => {
    if (categoryFilter !== 'all' && vendor.category !== categoryFilter) return false;
    if (statusFilter !== 'all' && vendor.status !== statusFilter) return false;

    if (searchQuery && !vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !vendor.id.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    return true;
  });

  // Filter integrations
  const filteredIntegrations = integrations.filter(integration => {
    if (statusFilter !== 'all' && integration.status !== statusFilter) return false;

    if (searchQuery && !integration.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !integration.vendor.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    return true;
  });

  const activeVendors = vendors.filter(v => v.status === 'active').length;
  const totalRequests = vendors.reduce((sum, v) => sum + v.requestsToday, 0);
  const avgUptime = vendors.reduce((sum, v) => sum + v.uptime, 0) / vendors.length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1800px] mx-auto px-6 lg:px-12 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Vendor & Integration Management</h1>
              <p className="text-gray-600 mt-1">Manage third-party services and API integrations</p>
            </div>
            <Button
              onClick={() => {
                resetForm();
                setShowVendorDialog(true);
              }}
              className="bg-[#000035] hover:bg-[#000055]"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Vendor
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-6 border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Vendors</p>
                  <p className="text-3xl font-bold text-gray-900">{vendors.length}</p>
                  <p className="text-xs text-gray-600 mt-2">{activeVendors} active</p>
                </div>
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Plug className="w-7 h-7 text-blue-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6 border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">API Requests Today</p>
                  <p className="text-3xl font-bold text-gray-900">{totalRequests.toLocaleString()}</p>
                </div>
                <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
                  <Activity className="w-7 h-7 text-green-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6 border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Average Uptime</p>
                  <p className="text-3xl font-bold text-green-600">{avgUptime.toFixed(1)}%</p>
                </div>
                <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Zap className="w-7 h-7 text-purple-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6 border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Integrations</p>
                  <p className="text-3xl font-bold text-gray-900">{integrations.length}</p>
                  <p className="text-xs text-gray-600 mt-2">All active</p>
                </div>
                <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center">
                  <Globe className="w-7 h-7 text-orange-600" />
                </div>
              </div>
            </Card>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search vendors or integrations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-50 border-gray-200"
              />
            </div>
            {activeTab === 'vendors' && (
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg bg-white text-sm"
              >
                <option value="all">All Categories</option>
                <option value="payment">Payment</option>
                <option value="travel">Travel</option>
                <option value="logistics">Logistics</option>
                <option value="communication">Communication</option>
                <option value="analytics">Analytics</option>
                <option value="other">Other</option>
              </select>
            )}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg bg-white text-sm"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="testing">Testing</option>
            </select>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-gray-100">
              <TabsTrigger value="vendors" className="data-[state=active]:bg-white">
                Vendors ({vendors.length})
              </TabsTrigger>
              <TabsTrigger value="integrations" className="data-[state=active]:bg-white">
                Integrations ({integrations.length})
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1800px] mx-auto px-6 lg:px-12 py-8">
        {activeTab === 'vendors' && (
          <div className="space-y-4">
            {filteredVendors.length === 0 ? (
              <Card className="p-12 text-center">
                <Plug className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No vendors found</h3>
                <p className="text-gray-600">Try adjusting your search or filters</p>
              </Card>
            ) : (
              filteredVendors.map((vendor) => {
                const categoryColor = getCategoryColor(vendor.category);
                const healthStatus = getHealthColor(vendor.healthStatus);
                const HealthIcon = healthStatus.icon;

                return (
                  <Card key={vendor.id} className="p-6 border-gray-200 hover:shadow-lg transition-all">
                    <div className="flex items-start gap-4">
                      <div className={`w-14 h-14 ${categoryColor.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                        <Plug className={`w-7 h-7 ${categoryColor.text}`} />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-bold text-gray-900">{vendor.name}</h3>
                              <Badge variant="outline" className={getStatusColor(vendor.status)}>
                                {vendor.status}
                              </Badge>
                              <Badge variant="outline" className={`${categoryColor.bg} ${categoryColor.text} border-0`}>
                                {vendor.category}
                              </Badge>
                              <div className={`flex items-center gap-1 px-2 py-1 ${healthStatus.bg} rounded-lg`}>
                                <HealthIcon className={`w-4 h-4 ${healthStatus.text}`} />
                                <span className={`text-xs font-medium ${healthStatus.text}`}>
                                  {vendor.healthStatus}
                                </span>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{vendor.description}</p>
                            <p className="text-xs text-gray-500">{vendor.id}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-4 gap-4 mb-4">
                          <div className="bg-blue-50 p-3 rounded-lg">
                            <p className="text-xs text-gray-600 mb-1">Connected Companies</p>
                            <p className="text-lg font-bold text-gray-900">{vendor.connectedCompanies}</p>
                          </div>
                          <div className="bg-green-50 p-3 rounded-lg">
                            <p className="text-xs text-gray-600 mb-1">Requests Today</p>
                            <p className="text-lg font-bold text-gray-900">{vendor.requestsToday.toLocaleString()}</p>
                          </div>
                          <div className="bg-purple-50 p-3 rounded-lg">
                            <p className="text-xs text-gray-600 mb-1">Uptime</p>
                            <p className="text-lg font-bold text-gray-900">{vendor.uptime}%</p>
                          </div>
                          <div className="bg-orange-50 p-3 rounded-lg">
                            <p className="text-xs text-gray-600 mb-1">Last Sync</p>
                            <p className="text-xs font-semibold text-gray-900">{vendor.lastSync}</p>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedVendor(vendor);
                              setShowDetailsDialog(true);
                            }}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Details
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedVendor(vendor);
                              setFormData({
                                name: vendor.name,
                                category: vendor.category,
                                description: vendor.description,
                                apiEndpoint: vendor.apiEndpoint,
                                apiKey: vendor.apiKey,
                                webhookUrl: vendor.webhookUrl,
                              });
                              setIsEditing(true);
                              setShowVendorDialog(true);
                            }}
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleTestConnection(vendor)}
                          >
                            <Activity className="w-4 h-4 mr-2" />
                            Test
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleStatus(vendor)}
                          >
                            {vendor.status === 'active' ? (
                              <>
                                <XCircle className="w-4 h-4 mr-2" />
                                Deactivate
                              </>
                            ) : (
                              <>
                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                Activate
                              </>
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteVendor(vendor)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })
            )}
          </div>
        )}

        {activeTab === 'integrations' && (
          <div className="space-y-4">
            {filteredIntegrations.map((integration) => (
              <Card key={integration.id} className="p-6 border-gray-200 hover:shadow-lg transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Zap className="w-7 h-7 text-blue-600" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-bold text-gray-900">{integration.name}</h3>
                          <Badge variant="outline" className={getStatusColor(integration.status)}>
                            {integration.status}
                          </Badge>
                          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                            {integration.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{integration.description}</p>
                        <p className="text-xs text-gray-500">Vendor: {integration.vendor}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4 mb-4">
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-600 mb-1">Calls Today</p>
                        <p className="text-lg font-bold text-gray-900">{integration.callsToday.toLocaleString()}</p>
                      </div>
                      <div className="bg-green-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-600 mb-1">Success Rate</p>
                        <p className="text-lg font-bold text-green-600">{integration.successRate}%</p>
                      </div>
                      <div className="bg-purple-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-600 mb-1">Avg Response</p>
                        <p className="text-lg font-bold text-gray-900">{integration.avgResponseTime}ms</p>
                      </div>
                      <div className="bg-orange-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-600 mb-1">Method</p>
                        <p className="text-lg font-bold text-gray-900">{integration.method}</p>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-lg text-sm">
                      <p className="text-gray-600 mb-1">Endpoint</p>
                      <code className="text-gray-900 font-mono">{integration.endpoint}</code>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Vendor Dialog */}
      <Dialog open={showVendorDialog} onOpenChange={setShowVendorDialog}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Vendor' : 'Add New Vendor'}</DialogTitle>
            <DialogDescription>
              {isEditing ? 'Update vendor information and settings' : 'Configure a new third-party vendor integration'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="vendor-name">Vendor Name *</Label>
              <Input
                id="vendor-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Razorpay"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="vendor-category">Category *</Label>
              <select
                id="vendor-category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full mt-2 px-3 py-2 border border-gray-200 rounded-lg"
              >
                <option value="payment">Payment</option>
                <option value="travel">Travel</option>
                <option value="logistics">Logistics</option>
                <option value="communication">Communication</option>
                <option value="analytics">Analytics</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <Label htmlFor="vendor-description">Description *</Label>
              <Textarea
                id="vendor-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of the vendor service"
                className="mt-2"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="api-endpoint">API Endpoint *</Label>
              <Input
                id="api-endpoint"
                value={formData.apiEndpoint}
                onChange={(e) => setFormData({ ...formData, apiEndpoint: e.target.value })}
                placeholder="https://api.vendor.com/v1"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="api-key">API Key *</Label>
              <Input
                id="api-key"
                type="password"
                value={formData.apiKey}
                onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                placeholder="Enter API key or token"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="webhook-url">Webhook URL</Label>
              <Input
                id="webhook-url"
                value={formData.webhookUrl}
                onChange={(e) => setFormData({ ...formData, webhookUrl: e.target.value })}
                placeholder="https://simplifymove.com/webhooks/vendor"
                className="mt-2"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowVendorDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveVendor}
              className="bg-[#000035] hover:bg-[#000055]"
              disabled={!formData.name || !formData.description || !formData.apiEndpoint || !formData.apiKey}
            >
              {isEditing ? 'Update Vendor' : 'Add Vendor'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Vendor Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="sm:max-w-2xl">
          {selectedVendor && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <div className={`w-12 h-12 ${getCategoryColor(selectedVendor.category).bg} rounded-xl flex items-center justify-center`}>
                    <Plug className={`w-6 h-6 ${getCategoryColor(selectedVendor.category).text}`} />
                  </div>
                  <div>
                    <h2>{selectedVendor.name}</h2>
                    <p className="text-sm text-gray-600 font-normal">{selectedVendor.id}</p>
                  </div>
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6 py-4">
                <div className="flex gap-2">
                  <Badge variant="outline" className={getStatusColor(selectedVendor.status)}>
                    {selectedVendor.status}
                  </Badge>
                  <Badge variant="outline" className={`${getCategoryColor(selectedVendor.category).bg} ${getCategoryColor(selectedVendor.category).text} border-0`}>
                    {selectedVendor.category}
                  </Badge>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedVendor.description}</p>
                </div>

                <Card className="p-4 bg-gray-50">
                  <h3 className="font-semibold mb-3">Configuration</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <p className="text-gray-600">API Endpoint</p>
                      <code className="text-gray-900 font-mono text-xs">{selectedVendor.apiEndpoint}</code>
                    </div>
                    <div>
                      <p className="text-gray-600">API Key</p>
                      <code className="text-gray-900 font-mono text-xs">{selectedVendor.apiKey}</code>
                    </div>
                    <div>
                      <p className="text-gray-600">Webhook URL</p>
                      <code className="text-gray-900 font-mono text-xs">{selectedVendor.webhookUrl}</code>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 bg-gray-50">
                  <h3 className="font-semibold mb-3">Performance Metrics</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-600">Connected Companies</p>
                      <p className="font-semibold">{selectedVendor.connectedCompanies}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Requests Today</p>
                      <p className="font-semibold">{selectedVendor.requestsToday.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Uptime</p>
                      <p className="font-semibold">{selectedVendor.uptime}%</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Last Sync</p>
                      <p className="font-semibold">{selectedVendor.lastSync}</p>
                    </div>
                  </div>
                </Card>
              </div>

              <DialogFooter>
                <Button onClick={() => setShowDetailsDialog(false)}>Close</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}