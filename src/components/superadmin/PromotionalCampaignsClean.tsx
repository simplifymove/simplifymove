import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import {
  Tag,
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  Calendar,
  Target,
  TrendingUp,
  Users,
  Percent,
  DollarSign,
  CheckCircle2,
  XCircle,
  Copy,
  BarChart3
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface PromotionalCampaign {
  id: string;
  name: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'flat' | 'cashback';
  discountValue: number;
  maxDiscount?: number;
  minBookingAmount: number;
  applicableServices: string[];
  applicableCompanies: string[];
  applicableCompanyNames: string[];
  startDate: string;
  endDate: string;
  status: 'active' | 'inactive' | 'scheduled' | 'expired';
  usageLimit: number;
  usageCount: number;
  perUserLimit: number;
  termsAndConditions: string;
  createdBy: string;
  createdDate: string;
}

// Mock company list
const availableCompanies = [
  { id: 'COMP-001', name: 'Tech Innovations Ltd' },
  { id: 'COMP-002', name: 'Global Marketing Solutions' },
  { id: 'COMP-003', name: 'Retail Empire Inc' },
  { id: 'COMP-004', name: 'Finance Pro Services' },
  { id: 'COMP-005', name: 'Healthcare Plus' },
  { id: 'COMP-006', name: 'Logistics Pro' },
  { id: 'COMP-007', name: 'Education Network' },
  { id: 'COMP-008', name: 'Manufacturing Corp' },
  { id: 'COMP-009', name: 'Real Estate Partners' },
  { id: 'COMP-010', name: 'Consulting Group' },
];

const mockCampaigns: PromotionalCampaign[] = [
  {
    id: 'PROMO-001',
    name: 'New Year Travel Bonanza',
    code: 'NEWYEAR2025',
    description: 'Get 20% off on all flight and hotel bookings',
    discountType: 'percentage',
    discountValue: 20,
    maxDiscount: 5000,
    minBookingAmount: 10000,
    applicableServices: ['Flight', 'Hotel'],
    applicableCompanies: ['all'],
    applicableCompanyNames: ['All Companies'],
    startDate: '2025-01-01',
    endDate: '2025-01-31',
    status: 'active',
    usageLimit: 1000,
    usageCount: 342,
    perUserLimit: 1,
    termsAndConditions: 'Valid only for bookings above ₹10,000. Maximum discount capped at ₹5,000.',
    createdBy: 'System Administrator',
    createdDate: '2024-12-15',
  },
  {
    id: 'PROMO-002',
    name: 'Logistics Rush Hour',
    code: 'LOGISTIC50',
    description: 'Flat ₹50 off on all logistics bookings',
    discountType: 'flat',
    discountValue: 50,
    minBookingAmount: 500,
    applicableServices: ['Bike Logistics', '3 Wheeler Auto', 'Mini Truck'],
    applicableCompanies: ['COMP-001', 'COMP-002', 'COMP-003'],
    applicableCompanyNames: ['Tech Innovations Ltd', 'Global Marketing Solutions', 'Retail Empire Inc'],
    startDate: '2024-12-20',
    endDate: '2025-02-28',
    status: 'active',
    usageLimit: 500,
    usageCount: 156,
    perUserLimit: 1,
    termsAndConditions: 'Valid for bookings above ₹500. One use per user per day.',
    createdBy: 'System Administrator',
    createdDate: '2024-12-10',
  },
  {
    id: 'PROMO-003',
    name: 'Corporate Cab Saver',
    code: 'CABSAVE15',
    description: '15% cashback on all cab bookings',
    discountType: 'cashback',
    discountValue: 15,
    maxDiscount: 300,
    minBookingAmount: 1000,
    applicableServices: ['Cab'],
    applicableCompanies: ['COMP-001', 'COMP-005'],
    applicableCompanyNames: ['Tech Innovations Ltd', 'Healthcare Plus'],
    startDate: '2025-01-15',
    endDate: '2025-03-15',
    status: 'scheduled',
    usageLimit: 2000,
    usageCount: 0,
    perUserLimit: 1,
    termsAndConditions: 'Cashback will be credited to wallet within 24 hours. Maximum ₹300 per booking.',
    createdBy: 'Raghava Boyidi',
    createdDate: '2024-12-24',
  },
  {
    id: 'PROMO-004',
    name: 'Bus Travel Weekender',
    code: 'BUSWEEK10',
    description: '10% off on weekend bus bookings',
    discountType: 'percentage',
    discountValue: 10,
    maxDiscount: 200,
    minBookingAmount: 800,
    applicableServices: ['Bus'],
    applicableCompanies: ['all'],
    applicableCompanyNames: ['All Companies'],
    startDate: '2024-11-01',
    endDate: '2024-12-31',
    status: 'expired',
    usageLimit: 800,
    usageCount: 723,
    perUserLimit: 1,
    termsAndConditions: 'Valid only for Saturday and Sunday bookings.',
    createdBy: 'System Administrator',
    createdDate: '2024-10-25',
  },
  {
    id: 'PROMO-005',
    name: 'First Booking Special',
    code: 'WELCOME100',
    description: 'Flat ₹100 off on first booking',
    discountType: 'flat',
    discountValue: 100,
    minBookingAmount: 500,
    applicableServices: ['All Services'],
    applicableCompanies: ['all'],
    applicableCompanyNames: ['All Companies'],
    startDate: '2024-12-01',
    endDate: '2025-12-31',
    status: 'active',
    usageLimit: 5000,
    usageCount: 1234,
    perUserLimit: 1,
    termsAndConditions: 'Valid only for first-time users. One time use per user.',
    createdBy: 'System Administrator',
    createdDate: '2024-11-28',
  },
  {
    id: 'PROMO-006',
    name: 'Courier Express Deal',
    code: 'COURIER20',
    description: '₹20 flat discount on courier services',
    discountType: 'flat',
    discountValue: 20,
    minBookingAmount: 200,
    applicableServices: ['Courier'],
    applicableCompanies: ['all'],
    applicableCompanyNames: ['All Companies'],
    startDate: '2024-12-15',
    endDate: '2025-01-15',
    status: 'inactive',
    usageLimit: 1500,
    usageCount: 89,
    perUserLimit: 1,
    termsAndConditions: 'Valid for domestic courier bookings only.',
    createdBy: 'System Administrator',
    createdDate: '2024-12-12',
  },
];

export function PromotionalCampaignsClean() {
  const [campaigns, setCampaigns] = useState<PromotionalCampaign[]>(mockCampaigns);
  const [selectedCampaign, setSelectedCampaign] = useState<PromotionalCampaign | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('all');

  // Form state for create/edit
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    discountType: 'percentage' as 'percentage' | 'flat' | 'cashback',
    discountValue: 0,
    maxDiscount: 0,
    minBookingAmount: 0,
    applicableServices: [] as string[],
    applicableCompanies: [] as string[],
    startDate: '',
    endDate: '',
    usageLimit: 0,
    perUserLimit: 1,
    termsAndConditions: '',
  });

  // Services list
  const allServices = [
    'Flight',
    'Hotel',
    'Cab',
    'Bus',
    'Bike',
    'Two Wheeler',
    'Bike Logistics',
    '3 Wheeler Auto',
    'Mini Truck',
    'Medium Truck',
    'DCM',
    'Container',
    'Courier',
  ];

  // Get discount type color
  const getDiscountTypeColor = (type: string) => {
    switch (type) {
      case 'percentage': return { bg: 'bg-blue-100', text: 'text-blue-600' };
      case 'flat': return { bg: 'bg-green-100', text: 'text-green-600' };
      case 'cashback': return { bg: 'bg-purple-100', text: 'text-purple-600' };
      default: return { bg: 'bg-gray-100', text: 'text-gray-600' };
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-50 text-green-700 border-green-200';
      case 'inactive': return 'bg-gray-50 text-gray-700 border-gray-200';
      case 'scheduled': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'expired': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  // Filter campaigns
  const filteredCampaigns = campaigns.filter(campaign => {
    if (statusFilter !== 'all' && campaign.status !== statusFilter) return false;
    if (serviceFilter !== 'all' && !campaign.applicableServices.includes(serviceFilter)) return false;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        campaign.name.toLowerCase().includes(query) ||
        campaign.code.toLowerCase().includes(query) ||
        campaign.description.toLowerCase().includes(query) ||
        campaign.id.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  // Handle create campaign
  const handleCreateCampaign = () => {
    const selectedCompanyNames = formData.applicableCompanies
      .map(id => availableCompanies.find(c => c.id === id)?.name)
      .filter(Boolean) as string[];

    const newCampaign: PromotionalCampaign = {
      id: `PROMO-${String(campaigns.length + 1).padStart(3, '0')}`,
      name: formData.name,
      code: formData.code.toUpperCase(),
      description: formData.description,
      discountType: formData.discountType,
      discountValue: formData.discountValue,
      maxDiscount: formData.maxDiscount || undefined,
      minBookingAmount: formData.minBookingAmount,
      applicableServices: formData.applicableServices,
      applicableCompanies: formData.applicableCompanies,
      applicableCompanyNames: selectedCompanyNames,
      startDate: formData.startDate,
      endDate: formData.endDate,
      status: new Date(formData.startDate) > new Date() ? 'scheduled' : 'active',
      usageLimit: formData.usageLimit,
      usageCount: 0,
      perUserLimit: formData.perUserLimit,
      termsAndConditions: formData.termsAndConditions,
      createdBy: 'System Administrator',
      createdDate: new Date().toISOString().split('T')[0],
    };

    setCampaigns([newCampaign, ...campaigns]);
    setShowCreateDialog(false);
    resetForm();
    toast.success('Promotional campaign created successfully!');
  };

  // Handle edit campaign
  const handleEditCampaign = () => {
    if (!selectedCampaign) return;

    const selectedCompanyNames = formData.applicableCompanies
      .map(id => availableCompanies.find(c => c.id === id)?.name)
      .filter(Boolean) as string[];

    setCampaigns(campaigns.map(camp =>
      camp.id === selectedCampaign.id
        ? {
            ...camp,
            name: formData.name,
            code: formData.code.toUpperCase(),
            description: formData.description,
            discountType: formData.discountType,
            discountValue: formData.discountValue,
            maxDiscount: formData.maxDiscount || undefined,
            minBookingAmount: formData.minBookingAmount,
            applicableServices: formData.applicableServices,
            applicableCompanies: formData.applicableCompanies,
            applicableCompanyNames: selectedCompanyNames,
            startDate: formData.startDate,
            endDate: formData.endDate,
            usageLimit: formData.usageLimit,
            perUserLimit: formData.perUserLimit,
            termsAndConditions: formData.termsAndConditions,
          }
        : camp
    ));

    setShowEditDialog(false);
    setSelectedCampaign(null);
    resetForm();
    toast.success('Campaign updated successfully!');
  };

  // Handle delete campaign
  const handleDeleteCampaign = (campaignId: string) => {
    setCampaigns(campaigns.filter(camp => camp.id !== campaignId));
    toast.success('Campaign deleted successfully!');
  };

  // Handle toggle status
  const handleToggleStatus = (campaignId: string) => {
    setCampaigns(campaigns.map(camp =>
      camp.id === campaignId
        ? { ...camp, status: camp.status === 'active' ? 'inactive' : 'active' as const }
        : camp
    ));
    toast.success('Campaign status updated!');
  };

  // Handle duplicate campaign
  const handleDuplicateCampaign = (campaign: PromotionalCampaign) => {
    const newCampaign: PromotionalCampaign = {
      ...campaign,
      id: `PROMO-${String(campaigns.length + 1).padStart(3, '0')}`,
      name: `${campaign.name} (Copy)`,
      code: `${campaign.code}_COPY`,
      usageCount: 0,
      status: 'inactive',
      createdDate: new Date().toISOString().split('T')[0],
    };

    setCampaigns([newCampaign, ...campaigns]);
    toast.success('Campaign duplicated successfully!');
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      description: '',
      discountType: 'percentage',
      discountValue: 0,
      maxDiscount: 0,
      minBookingAmount: 0,
      applicableServices: [],
      applicableCompanies: [],
      startDate: '',
      endDate: '',
      usageLimit: 0,
      perUserLimit: 1,
      termsAndConditions: '',
    });
  };

  // Open edit dialog
  const openEditDialog = (campaign: PromotionalCampaign) => {
    setSelectedCampaign(campaign);
    setFormData({
      name: campaign.name,
      code: campaign.code,
      description: campaign.description,
      discountType: campaign.discountType,
      discountValue: campaign.discountValue,
      maxDiscount: campaign.maxDiscount || 0,
      minBookingAmount: campaign.minBookingAmount,
      applicableServices: campaign.applicableServices,
      applicableCompanies: campaign.applicableCompanies,
      startDate: campaign.startDate,
      endDate: campaign.endDate,
      usageLimit: campaign.usageLimit,
      perUserLimit: campaign.perUserLimit,
      termsAndConditions: campaign.termsAndConditions,
    });
    setShowEditDialog(true);
  };

  // Calculate stats
  const activeCount = campaigns.filter(c => c.status === 'active').length;
  const scheduledCount = campaigns.filter(c => c.status === 'scheduled').length;
  const totalUsage = campaigns.reduce((sum, c) => sum + c.usageCount, 0);
  const avgUsageRate = campaigns.length > 0
    ? campaigns.reduce((sum, c) => sum + (c.usageCount / c.usageLimit * 100), 0) / campaigns.length
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1800px] mx-auto px-6 lg:px-12 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Promotional Campaigns</h1>
              <p className="text-gray-600 mt-1">Manage offers, discounts, and promotional campaigns</p>
            </div>
            <Button
              onClick={() => {
                resetForm();
                setShowCreateDialog(true);
              }}
              className="bg-[#000035] hover:bg-[#000055]"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Campaign
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-6 border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Campaigns</p>
                  <p className="text-3xl font-bold text-gray-900">{campaigns.length}</p>
                </div>
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Tag className="w-7 h-7 text-blue-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6 border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Active Campaigns</p>
                  <p className="text-3xl font-bold text-green-600">{activeCount}</p>
                  <p className="text-xs text-gray-600 mt-2">{scheduledCount} scheduled</p>
                </div>
                <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7 text-green-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6 border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Usage</p>
                  <p className="text-3xl font-bold text-purple-600">{totalUsage.toLocaleString()}</p>
                </div>
                <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Users className="w-7 h-7 text-purple-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6 border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Avg Usage Rate</p>
                  <p className="text-3xl font-bold text-orange-600">{avgUsageRate.toFixed(1)}%</p>
                </div>
                <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-7 h-7 text-orange-600" />
                </div>
              </div>
            </Card>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search by campaign name, code, or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-50 border-gray-200"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg bg-white text-sm"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="scheduled">Scheduled</option>
              <option value="expired">Expired</option>
            </select>
            <select
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg bg-white text-sm"
            >
              <option value="all">All Services</option>
              {allServices.map(service => (
                <option key={service} value={service}>{service}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Campaigns Table */}
      <div className="max-w-[1800px] mx-auto px-6 lg:px-12 py-8">
        {filteredCampaigns.length === 0 ? (
          <Card className="p-12 text-center">
            <Tag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No campaigns found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </Card>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Campaign
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Code
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Discount
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Services
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Validity
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Usage
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredCampaigns.map((campaign) => {
                    const typeColor = getDiscountTypeColor(campaign.discountType);
                    const usagePercentage = (campaign.usageCount / campaign.usageLimit) * 100;

                    return (
                      <tr key={campaign.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-semibold text-gray-900">{campaign.name}</p>
                            <p className="text-xs text-gray-600 mt-1">{campaign.id}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <code className="px-3 py-1 bg-gray-100 rounded-md text-sm font-mono text-gray-900">
                            {campaign.code}
                          </code>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={`${typeColor.bg} ${typeColor.text} border-0`}>
                              {campaign.discountType}
                            </Badge>
                            <p className="font-bold text-gray-900">
                              {campaign.discountType === 'percentage' 
                                ? `${campaign.discountValue}%` 
                                : `₹${campaign.discountValue}`}
                            </p>
                          </div>
                          {campaign.maxDiscount && (
                            <p className="text-xs text-gray-600 mt-1">Max: ₹{campaign.maxDiscount}</p>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {campaign.applicableServices.slice(0, 2).map((service, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {service}
                              </Badge>
                            ))}
                            {campaign.applicableServices.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{campaign.applicableServices.length - 2}
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm text-gray-900">{campaign.startDate}</p>
                            <p className="text-xs text-gray-600">to {campaign.endDate}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-sm font-semibold text-gray-900">
                                {campaign.usageCount} / {campaign.usageLimit}
                              </p>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  usagePercentage >= 80 ? 'bg-red-500' :
                                  usagePercentage >= 50 ? 'bg-yellow-500' : 'bg-green-500'
                                }`}
                                style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant="outline" className={getStatusColor(campaign.status)}>
                            {campaign.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2 justify-center">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedCampaign(campaign);
                                setShowDetailsDialog(true);
                              }}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openEditDialog(campaign)}
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDuplicateCampaign(campaign)}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                            {(campaign.status === 'active' || campaign.status === 'inactive') && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleToggleStatus(campaign.id)}
                                className={campaign.status === 'active' ? 'text-red-600' : 'text-green-600'}
                              >
                                {campaign.status === 'active' ? <XCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteCampaign(campaign.id)}
                              className="text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Create Campaign Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Tag className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2>Create New Campaign</h2>
                <p className="text-sm text-gray-600 font-normal">Set up a promotional offer for companies</p>
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Basic Information</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Campaign Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Summer Sale 2025"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="code">Promo Code *</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder="e.g., SUMMER25"
                    className="mt-2"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the campaign"
                  className="mt-2"
                  rows={3}
                />
              </div>
            </div>

            {/* Discount Details */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Discount Details</h3>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="discountType">Discount Type *</Label>
                  <select
                    id="discountType"
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value as any })}
                    className="w-full mt-2 px-3 py-2 border border-gray-200 rounded-lg bg-white text-sm"
                  >
                    <option value="percentage">Percentage</option>
                    <option value="flat">Flat Amount</option>
                    <option value="cashback">Cashback</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="discountValue">Discount Value *</Label>
                  <Input
                    id="discountValue"
                    type="number"
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: parseFloat(e.target.value) })}
                    placeholder={formData.discountType === 'percentage' ? '20' : '100'}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="maxDiscount">Max Discount (₹)</Label>
                  <Input
                    id="maxDiscount"
                    type="number"
                    value={formData.maxDiscount}
                    onChange={(e) => setFormData({ ...formData, maxDiscount: parseFloat(e.target.value) })}
                    placeholder="Optional"
                    className="mt-2"
                    disabled={formData.discountType === 'flat'}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="minBookingAmount">Min Booking Amount (₹) *</Label>
                  <Input
                    id="minBookingAmount"
                    type="number"
                    value={formData.minBookingAmount}
                    onChange={(e) => setFormData({ ...formData, minBookingAmount: parseFloat(e.target.value) })}
                    placeholder="500"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="usageLimit">Usage Limit *</Label>
                  <Input
                    id="usageLimit"
                    type="number"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({ ...formData, usageLimit: parseInt(e.target.value) })}
                    placeholder="1000"
                    className="mt-2"
                  />
                </div>
              </div>
            </div>

            {/* Applicable Services */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Applicable Services</h3>
              <div className="grid grid-cols-3 gap-3">
                {allServices.map((service) => (
                  <label key={service} className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={formData.applicableServices.includes(service)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({
                            ...formData,
                            applicableServices: [...formData.applicableServices, service]
                          });
                        } else {
                          setFormData({
                            ...formData,
                            applicableServices: formData.applicableServices.filter(s => s !== service)
                          });
                        }
                      }}
                      className="w-4 h-4 text-[#000035] border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-900">{service}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Applicable Companies */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Applicable Companies *</h3>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        applicableCompanies: availableCompanies.map(c => c.id)
                      });
                    }}
                  >
                    Select All
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        applicableCompanies: []
                      });
                    }}
                  >
                    Clear All
                  </Button>
                </div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-700">
                  📌 Select which companies can use this promotional campaign
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto p-1">
                {availableCompanies.map((company) => (
                  <label key={company.id} className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={formData.applicableCompanies.includes(company.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({
                            ...formData,
                            applicableCompanies: [...formData.applicableCompanies, company.id]
                          });
                        } else {
                          setFormData({
                            ...formData,
                            applicableCompanies: formData.applicableCompanies.filter(id => id !== company.id)
                          });
                        }
                      }}
                      className="w-4 h-4 text-[#000035] border-gray-300 rounded"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{company.name}</p>
                      <p className="text-xs text-gray-600">{company.id}</p>
                    </div>
                  </label>
                ))}
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">{formData.applicableCompanies.length}</span> {formData.applicableCompanies.length === 1 ? 'company' : 'companies'} selected
                </p>
              </div>
            </div>

            {/* Validity Period */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Validity Period</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Start Date *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">End Date *</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="mt-2"
                  />
                </div>
              </div>
            </div>

            {/* Terms & Conditions */}
            <div>
              <Label htmlFor="terms">Terms & Conditions</Label>
              <Textarea
                id="terms"
                value={formData.termsAndConditions}
                onChange={(e) => setFormData({ ...formData, termsAndConditions: e.target.value })}
                placeholder="Enter terms and conditions for this campaign"
                className="mt-2"
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateCampaign}
              className="bg-[#000035] hover:bg-[#000055]"
              disabled={!formData.name || !formData.code || formData.applicableServices.length === 0 || formData.applicableCompanies.length === 0}
            >
              Create Campaign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Campaign Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <Edit2 className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h2>Edit Campaign</h2>
                <p className="text-sm text-gray-600 font-normal">{selectedCampaign?.id}</p>
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Same form fields as Create Dialog */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Basic Information</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-name">Campaign Name *</Label>
                  <Input
                    id="edit-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-code">Promo Code *</Label>
                  <Input
                    id="edit-code"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className="mt-2"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="edit-description">Description *</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-2"
                  rows={3}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Discount Details</h3>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="edit-discountType">Discount Type *</Label>
                  <select
                    id="edit-discountType"
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value as any })}
                    className="w-full mt-2 px-3 py-2 border border-gray-200 rounded-lg bg-white text-sm"
                  >
                    <option value="percentage">Percentage</option>
                    <option value="flat">Flat Amount</option>
                    <option value="cashback">Cashback</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="edit-discountValue">Discount Value *</Label>
                  <Input
                    id="edit-discountValue"
                    type="number"
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: parseFloat(e.target.value) })}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-maxDiscount">Max Discount (₹)</Label>
                  <Input
                    id="edit-maxDiscount"
                    type="number"
                    value={formData.maxDiscount}
                    onChange={(e) => setFormData({ ...formData, maxDiscount: parseFloat(e.target.value) })}
                    className="mt-2"
                    disabled={formData.discountType === 'flat'}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-minBooking">Min Booking Amount (₹) *</Label>
                  <Input
                    id="edit-minBooking"
                    type="number"
                    value={formData.minBookingAmount}
                    onChange={(e) => setFormData({ ...formData, minBookingAmount: parseFloat(e.target.value) })}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-usageLimit">Usage Limit *</Label>
                  <Input
                    id="edit-usageLimit"
                    type="number"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({ ...formData, usageLimit: parseInt(e.target.value) })}
                    className="mt-2"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Applicable Services</h3>
              <div className="grid grid-cols-3 gap-3">
                {allServices.map((service) => (
                  <label key={service} className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={formData.applicableServices.includes(service)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({
                            ...formData,
                            applicableServices: [...formData.applicableServices, service]
                          });
                        } else {
                          setFormData({
                            ...formData,
                            applicableServices: formData.applicableServices.filter(s => s !== service)
                          });
                        }
                      }}
                      className="w-4 h-4 text-[#000035] border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-900">{service}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Applicable Companies */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Applicable Companies *</h3>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        applicableCompanies: availableCompanies.map(c => c.id)
                      });
                    }}
                  >
                    Select All
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        applicableCompanies: []
                      });
                    }}
                  >
                    Clear All
                  </Button>
                </div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-700">
                  📌 Select which companies can use this promotional campaign
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto p-1">
                {availableCompanies.map((company) => (
                  <label key={company.id} className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={formData.applicableCompanies.includes(company.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({
                            ...formData,
                            applicableCompanies: [...formData.applicableCompanies, company.id]
                          });
                        } else {
                          setFormData({
                            ...formData,
                            applicableCompanies: formData.applicableCompanies.filter(id => id !== company.id)
                          });
                        }
                      }}
                      className="w-4 h-4 text-[#000035] border-gray-300 rounded"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{company.name}</p>
                      <p className="text-xs text-gray-600">{company.id}</p>
                    </div>
                  </label>
                ))}
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">{formData.applicableCompanies.length}</span> {formData.applicableCompanies.length === 1 ? 'company' : 'companies'} selected
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Validity Period</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-startDate">Start Date *</Label>
                  <Input
                    id="edit-startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-endDate">End Date *</Label>
                  <Input
                    id="edit-endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="mt-2"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="edit-terms">Terms & Conditions</Label>
              <Textarea
                id="edit-terms"
                value={formData.termsAndConditions}
                onChange={(e) => setFormData({ ...formData, termsAndConditions: e.target.value })}
                className="mt-2"
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleEditCampaign}
              className="bg-[#000035] hover:bg-[#000055]"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Campaign Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedCampaign && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Tag className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h2>{selectedCampaign.name}</h2>
                    <p className="text-sm text-gray-600 font-normal">{selectedCampaign.id}</p>
                  </div>
                </DialogTitle>
                <DialogDescription>
                  Complete campaign details and statistics
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 py-4">
                {/* Status Badges */}
                <div className="flex gap-2">
                  <Badge variant="outline" className={getStatusColor(selectedCampaign.status)}>
                    {selectedCampaign.status}
                  </Badge>
                  <Badge variant="outline" className={`${getDiscountTypeColor(selectedCampaign.discountType).bg} ${getDiscountTypeColor(selectedCampaign.discountType).text} border-0`}>
                    {selectedCampaign.discountType}
                  </Badge>
                </div>

                {/* Promo Code */}
                <Card className="p-4 bg-gray-50">
                  <p className="text-sm text-gray-600 mb-2">Promotional Code</p>
                  <code className="text-2xl font-bold text-[#000035]">{selectedCampaign.code}</code>
                </Card>

                {/* Description */}
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-gray-700">{selectedCampaign.description}</p>
                </div>

                {/* Discount Details */}
                <Card className="p-4 bg-blue-50 border-blue-200">
                  <h3 className="font-semibold mb-3">Discount Details</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-600">Discount Value</p>
                      <p className="font-bold text-lg text-gray-900">
                        {selectedCampaign.discountType === 'percentage' 
                          ? `${selectedCampaign.discountValue}%` 
                          : `₹${selectedCampaign.discountValue}`}
                      </p>
                    </div>
                    {selectedCampaign.maxDiscount && (
                      <div>
                        <p className="text-gray-600">Maximum Discount</p>
                        <p className="font-semibold text-gray-900">₹{selectedCampaign.maxDiscount}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-gray-600">Min Booking Amount</p>
                      <p className="font-semibold text-gray-900">₹{selectedCampaign.minBookingAmount}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Usage Limit</p>
                      <p className="font-semibold text-gray-900">{selectedCampaign.usageLimit}</p>
                    </div>
                  </div>
                </Card>

                {/* Usage Statistics */}
                <Card className="p-4 bg-green-50 border-green-200">
                  <h3 className="font-semibold mb-3">Usage Statistics</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Total Usage</span>
                      <span className="font-bold text-gray-900">
                        {selectedCampaign.usageCount} / {selectedCampaign.usageLimit}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="h-3 rounded-full bg-green-600"
                        style={{ width: `${(selectedCampaign.usageCount / selectedCampaign.usageLimit) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-600">
                      {((selectedCampaign.usageCount / selectedCampaign.usageLimit) * 100).toFixed(1)}% utilized
                    </p>
                  </div>
                </Card>

                {/* Applicable Services */}
                <div>
                  <h3 className="font-semibold mb-3">Applicable Services</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedCampaign.applicableServices.map((service, idx) => (
                      <Badge key={idx} variant="outline" className="bg-purple-50 text-purple-700">
                        {service}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Companies */}
                <div>
                  <h3 className="font-semibold mb-3">Applicable Companies</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedCampaign.applicableCompanyNames.map((company, idx) => (
                      <Badge key={idx} variant="outline" className="bg-blue-50 text-blue-700">
                        {company}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Validity Period */}
                <Card className="p-4 bg-orange-50 border-orange-200">
                  <h3 className="font-semibold mb-3">Validity Period</h3>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="flex-1">
                      <p className="text-gray-600 mb-1">Start Date</p>
                      <p className="font-semibold text-gray-900">{selectedCampaign.startDate}</p>
                    </div>
                    <span className="text-gray-600">→</span>
                    <div className="flex-1">
                      <p className="text-gray-600 mb-1">End Date</p>
                      <p className="font-semibold text-gray-900">{selectedCampaign.endDate}</p>
                    </div>
                  </div>
                </Card>

                {/* Terms & Conditions */}
                {selectedCampaign.termsAndConditions && (
                  <div>
                    <h3 className="font-semibold mb-2">Terms & Conditions</h3>
                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                      {selectedCampaign.termsAndConditions}
                    </p>
                  </div>
                )}

                {/* Metadata */}
                <Card className="p-4 bg-gray-50">
                  <h3 className="font-semibold mb-3">Metadata</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-600">Created By</p>
                      <p className="font-semibold text-gray-900">{selectedCampaign.createdBy}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Created Date</p>
                      <p className="font-semibold text-gray-900">{selectedCampaign.createdDate}</p>
                    </div>
                  </div>
                </Card>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
                  Close
                </Button>
                <Button
                  onClick={() => {
                    setShowDetailsDialog(false);
                    openEditDialog(selectedCampaign);
                  }}
                  className="bg-[#000035] hover:bg-[#000055]"
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit Campaign
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}