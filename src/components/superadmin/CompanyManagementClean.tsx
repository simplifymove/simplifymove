import { useState, useEffect } from 'react';
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
  Building2,
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Users,
  User,
  DollarSign,
  Calendar,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Crown,
  Settings,
  Loader
} from 'lucide-react';
import { toast } from 'sonner';
import { companyAPI } from '../../lib/apiClient';

interface Company {
  id: string;
  name: string;
  industry: string;
  businessCategory: string;
  status: 'active' | 'suspended' | 'trial' | 'inactive';
  plan: 'free' | 'basic' | 'pro' | 'enterprise';
  registrationDate: string;
  expiryDate: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  employeeCount: number;
  adminCount: number;
  totalBookings: number;
  monthlyRevenue: number;
  totalRevenue: number;
  features: string[];
}

const mockCompanies: Company[] = [
  {
    id: 'COMP-001',
    name: 'Tech Innovations Ltd',
    industry: 'Technology',
    status: 'active',
    plan: 'enterprise',
    registrationDate: '2024-01-15',
    expiryDate: '2025-01-15',
    contactPerson: 'Raghava Boyidi',
    email: 'raghava@techinnovations.com',
    phone: '+91-9876543210',
    address: '123 Tech Park, Whitefield',
    city: 'Bangalore',
    country: 'India',
    employeeCount: 150,
    adminCount: 5,
    totalBookings: 487,
    monthlyRevenue: 125000,
    totalRevenue: 1450000,
    features: ['Travel Booking', 'Logistics', 'Expense Management', 'Analytics', 'API Access'],
  },
  {
    id: 'COMP-002',
    name: 'Global Marketing Solutions',
    industry: 'Marketing',
    status: 'active',
    plan: 'pro',
    registrationDate: '2024-03-20',
    expiryDate: '2025-03-20',
    contactPerson: 'Priya Sharma',
    email: 'priya@globalmarketing.com',
    phone: '+91-9876543211',
    address: '45 Business Bay',
    city: 'Mumbai',
    country: 'India',
    employeeCount: 75,
    adminCount: 3,
    totalBookings: 245,
    monthlyRevenue: 85000,
    totalRevenue: 680000,
    features: ['Travel Booking', 'Expense Management', 'Analytics'],
  },
  {
    id: 'COMP-003',
    name: 'Retail Empire Inc',
    industry: 'Retail',
    status: 'trial',
    plan: 'basic',
    registrationDate: '2024-12-01',
    expiryDate: '2024-12-31',
    contactPerson: 'Amit Kumar',
    email: 'amit@retailempire.com',
    phone: '+91-9876543212',
    address: '789 Shopping Complex',
    city: 'Delhi',
    country: 'India',
    employeeCount: 30,
    adminCount: 2,
    totalBookings: 58,
    monthlyRevenue: 15000,
    totalRevenue: 15000,
    features: ['Travel Booking', 'Expense Management'],
  },
  {
    id: 'COMP-004',
    name: 'Finance Pro Services',
    industry: 'Finance',
    status: 'suspended',
    plan: 'pro',
    registrationDate: '2024-02-10',
    expiryDate: '2024-11-10',
    contactPerson: 'Sneha Patel',
    email: 'sneha@financepro.com',
    phone: '+91-9876543213',
    address: '567 Financial District',
    city: 'Hyderabad',
    country: 'India',
    employeeCount: 50,
    adminCount: 2,
    totalBookings: 125,
    monthlyRevenue: 0,
    totalRevenue: 425000,
    features: ['Travel Booking', 'Expense Management', 'Analytics'],
  },
  {
    id: 'COMP-005',
    name: 'Healthcare Plus',
    industry: 'Healthcare',
    status: 'active',
    plan: 'enterprise',
    registrationDate: '2024-01-05',
    expiryDate: '2025-01-05',
    contactPerson: 'Dr. Karthik Reddy',
    email: 'karthik@healthcareplus.com',
    phone: '+91-9876543214',
    address: '234 Medical Hub',
    city: 'Chennai',
    country: 'India',
    employeeCount: 200,
    adminCount: 8,
    totalBookings: 612,
    monthlyRevenue: 145000,
    totalRevenue: 1740000,
    features: ['Travel Booking', 'Logistics', 'Expense Management', 'Analytics', 'API Access', 'Custom Integrations'],
  },
];

export function CompanyManagementClean() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [planFilter, setPlanFilter] = useState('all');

  // Form state
  const [companyForm, setCompanyForm] = useState({
    name: '',
    industry: '',
    businessCategory: '',
    status: 'active' as const,
    plan: 'basic' as const,
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: 'India',
    registrationDate: new Date().toISOString().split('T')[0],
    expiryDate: new Date(Date.now() + 365*24*60*60*1000).toISOString().split('T')[0],
  });

  // Load companies on mount
  useEffect(() => {
    const loadCompanies = async () => {
      try {
        setIsLoading(true);
        const response = await companyAPI.getAll({ limit: 100 });
        const companiesData = Array.isArray(response.data) ? response.data : [];
        
        // Map backend data to frontend interface
        const mappedCompanies = companiesData.map((comp: any) => ({
          id: comp.id,
          name: comp.name,
          industry: comp.industry || 'Technology',
          businessCategory: comp.businessCategory || 'General',
          status: comp.status || 'active',
          plan: (comp.companySize || 'basic').toLowerCase() as any,
          registrationDate: comp.createdAt?.split('T')[0] || new Date().toISOString().split('T')[0],
          expiryDate: comp.expiryDate || new Date(Date.now() + 365*24*60*60*1000).toISOString().split('T')[0],
          contactPerson: 'Admin',
          email: comp.email,
          phone: comp.phone || '',
          address: comp.street || 'N/A',
          city: comp.city || 'N/A',
          country: comp.country || 'India',
          employeeCount: 0,
          adminCount: 1,
          totalBookings: 0,
          monthlyRevenue: 0,
          totalRevenue: 0,
          features: ['Travel Booking', 'Expense Management'],
        }));
        
        setCompanies(mappedCompanies);
      } catch (error) {
        console.error('Error loading companies:', error);
        toast.error('Failed to load companies');
        // Fallback to empty array
        setCompanies([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadCompanies();
  }, []);

  // Reset form
  const resetForm = () => {
    setCompanyForm({
      name: '',
      industry: '',
      businessCategory: '',
      status: 'active',
      plan: 'basic',
      contactPerson: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      country: 'India',
      registrationDate: new Date().toISOString().split('T')[0],
      expiryDate: new Date(Date.now() + 365*24*60*60*1000).toISOString().split('T')[0],
    });
  };

  // Add company via API
  const handleAddCompany = async () => {
    if (!companyForm.name || !companyForm.email) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setIsSaving(true);
      
      // Map plan to valid companySize enum value
      const planToSize: Record<string, string> = {
        'free': '1-10',
        'basic': '11-50',
        'pro': '51-200',
        'enterprise': '201-500'
      };
      
      // Prepare data for backend
      const createData = {
        name: companyForm.name,
        email: companyForm.email,
        phone: companyForm.phone,
        industry: companyForm.industry,
        businessCategory: companyForm.businessCategory,
        companySize: planToSize[companyForm.plan] || '11-50',
        street: companyForm.address,
        city: companyForm.city,
        country: companyForm.country,
        status: companyForm.status,
      };

      const response = await companyAPI.create(createData);
      
      if (response.success) {
        // Map response to frontend format
        const newCompany: Company = {
          id: response.data.id,
          name: response.data.name,
          industry: response.data.industry,
          businessCategory: companyForm.businessCategory,
          status: response.data.status,
          plan: companyForm.plan,
          registrationDate: companyForm.registrationDate,
          expiryDate: companyForm.expiryDate,
          contactPerson: companyForm.contactPerson || 'Admin',
          email: response.data.email,
          phone: response.data.phone,
          address: response.data.street,
          city: response.data.city,
          country: response.data.country,
          employeeCount: 0,
          adminCount: 1,
          totalBookings: 0,
          monthlyRevenue: 0,
          totalRevenue: 0,
          features: companyForm.plan === 'enterprise' ? ['Travel Booking', 'Logistics', 'Expense Management', 'Analytics', 'API Access'] :
                    companyForm.plan === 'pro' ? ['Travel Booking', 'Expense Management', 'Analytics'] :
                    ['Travel Booking', 'Expense Management'],
        };

        setCompanies([newCompany, ...companies]);
        toast.success('Company created successfully!');
        setShowAddDialog(false);
        resetForm();
      }
    } catch (error: any) {
      console.error('Error creating company:', error);
      toast.error(error.message || 'Failed to create company');
    } finally {
      setIsSaving(false);
    }
  };

  // Edit company
  const handleEditClick = (company: Company) => {
    setSelectedCompany(company);
    setCompanyForm({
      name: company.name,
      industry: company.industry,
      businessCategory: company.businessCategory,
      status: company.status,
      plan: company.plan,
      contactPerson: company.contactPerson,
      email: company.email,
      phone: company.phone,
      address: company.address,
      city: company.city,
      country: company.country,
      registrationDate: company.registrationDate,
      expiryDate: company.expiryDate,
    });
    setShowEditDialog(true);
  };

  // Update company via API
  const handleUpdateCompany = async () => {
    if (!selectedCompany) return;

    if (!companyForm.name || !companyForm.email) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setIsSaving(true);
      
      const updateData = {
        name: companyForm.name,
        email: companyForm.email,
        phone: companyForm.phone,
        industry: companyForm.industry,
        businessCategory: companyForm.businessCategory,
        companySize: companyForm.plan,
        street: companyForm.address,
        city: companyForm.city,
        country: companyForm.country,
      };

      const response = await companyAPI.update(selectedCompany.id, updateData);
      
      if (response.success) {
        setCompanies(companies.map(c =>
          c.id === selectedCompany.id
            ? {
                ...c,
                name: companyForm.name,
                industry: companyForm.industry,
                businessCategory: companyForm.businessCategory,
                status: companyForm.status,
                plan: companyForm.plan,
                contactPerson: companyForm.contactPerson,
                email: companyForm.email,
                phone: companyForm.phone,
                address: companyForm.address,
                city: companyForm.city,
                country: companyForm.country,
                registrationDate: companyForm.registrationDate,
                expiryDate: companyForm.expiryDate,
              }
            : c
        ));

        toast.success('Company updated successfully!');
        setShowEditDialog(false);
        setSelectedCompany(null);
        resetForm();
      }
    } catch (error: any) {
      console.error('Error updating company:', error);
      toast.error(error.message || 'Failed to update company');
    } finally {
      setIsSaving(false);
    }
  };

  // Delete company
  const handleDeleteClick = (company: Company) => {
    setSelectedCompany(company);
    setShowDeleteDialog(true);
  };

  // Delete company via API
  const handleDeleteConfirm = async () => {
    if (!selectedCompany) return;

    try {
      setIsSaving(true);
      const response = await companyAPI.delete(selectedCompany.id);
      
      if (response.success) {
        setCompanies(companies.filter(c => c.id !== selectedCompany.id));
        toast.success('Company deleted successfully');
        setShowDeleteDialog(false);
        setSelectedCompany(null);
      }
    } catch (error: any) {
      console.error('Error deleting company:', error);
      toast.error(error.message || 'Failed to delete company');
    } finally {
      setIsSaving(false);
    }
  };

  // Toggle company status via API
  const handleToggleStatus = async (companyId: string, newStatus: 'active' | 'suspended') => {
    try {
      const response = await companyAPI.updateStatus(companyId, newStatus);
      
      if (response.success) {
        setCompanies(companies.map(c =>
          c.id === companyId ? { ...c, status: newStatus } : c
        ));
        toast.success(`Company ${newStatus === 'active' ? 'activated' : 'suspended'} successfully`);
      }
    } catch (error: any) {
      console.error('Error updating company status:', error);
      toast.error(error.message || 'Failed to update company status');
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-50 text-green-700 border-green-200';
      case 'suspended': return 'bg-red-50 text-red-700 border-red-200';
      case 'trial': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'inactive': return 'bg-gray-50 text-gray-700 border-gray-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  // Get plan color
  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'enterprise': return { bg: 'bg-purple-100', text: 'text-purple-600', icon: Crown };
      case 'pro': return { bg: 'bg-blue-100', text: 'text-blue-600', icon: CheckCircle2 };
      case 'basic': return { bg: 'bg-green-100', text: 'text-green-600', icon: CheckCircle2 };
      case 'free': return { bg: 'bg-gray-100', text: 'text-gray-600', icon: CheckCircle2 };
      default: return { bg: 'bg-gray-100', text: 'text-gray-600', icon: CheckCircle2 };
    }
  };

  // Filter companies
  const filteredCompanies = companies.filter(company => {
    if (activeTab === 'active' && company.status !== 'active') return false;
    if (activeTab === 'trial' && company.status !== 'trial') return false;
    if (activeTab === 'suspended' && company.status !== 'suspended') return false;

    if (planFilter !== 'all' && company.plan !== planFilter) return false;

    if (searchQuery && !company.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !company.id.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !company.contactPerson.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    return true;
  });

  const activeCount = companies.filter(c => c.status === 'active').length;
  const trialCount = companies.filter(c => c.status === 'trial').length;
  const suspendedCount = companies.filter(c => c.status === 'suspended').length;
  const totalRevenue = companies.reduce((sum, c) => sum + c.totalRevenue, 0);
  const totalEmployees = companies.reduce((sum, c) => sum + c.employeeCount, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1800px] mx-auto px-6 lg:px-12 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Company Management</h1>
              <p className="text-gray-600 mt-1">Manage all companies and their subscriptions</p>
            </div>
            <Button
              onClick={() => setShowAddDialog(true)}
              className="bg-[#000035] hover:bg-[#000055]"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Company
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-6">
            <Card className="p-6 border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Companies</p>
                  <p className="text-3xl font-bold text-gray-900">{companies.length}</p>
                </div>
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Building2 className="w-7 h-7 text-blue-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6 border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Active</p>
                  <p className="text-3xl font-bold text-green-600">{activeCount}</p>
                </div>
                <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7 text-green-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6 border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Trial</p>
                  <p className="text-3xl font-bold text-yellow-600">{trialCount}</p>
                </div>
                <div className="w-14 h-14 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <AlertCircle className="w-7 h-7 text-yellow-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6 border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Employees</p>
                  <p className="text-3xl font-bold text-gray-900">{totalEmployees}</p>
                </div>
                <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Users className="w-7 h-7 text-purple-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6 border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">₹{(totalRevenue / 100000).toFixed(1)}L</p>
                </div>
                <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-7 h-7 text-orange-600" />
                </div>
              </div>
            </Card>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search by company name, ID, or contact person..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-50 border-gray-200"
              />
            </div>
            <select
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg bg-white text-sm"
            >
              <option value="all">All Plans</option>
              <option value="free">Free</option>
              <option value="basic">Basic</option>
              <option value="pro">Pro</option>
              <option value="enterprise">Enterprise</option>
            </select>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-gray-100">
              <TabsTrigger value="all" className="data-[state=active]:bg-white">
                All ({companies.length})
              </TabsTrigger>
              <TabsTrigger value="active" className="data-[state=active]:bg-white">
                Active ({activeCount})
              </TabsTrigger>
              <TabsTrigger value="trial" className="data-[state=active]:bg-white">
                Trial ({trialCount})
              </TabsTrigger>
              <TabsTrigger value="suspended" className="data-[state=active]:bg-white">
                Suspended ({suspendedCount})
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Companies List */}
      <div className="max-w-[1800px] mx-auto px-6 lg:px-12 py-8">
        {isLoading ? (
          <Card className="p-12 text-center">
            <Loader className="w-16 h-16 text-gray-400 mx-auto mb-4 animate-spin" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading companies...</h3>
            <p className="text-gray-600">Please wait while we fetch your companies</p>
          </Card>
        ) : filteredCompanies.length === 0 ? (
          <Card className="p-12 text-center">
            <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No companies found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </Card>
        ) : (
          <Card className="overflow-hidden border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Company
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Plan
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Employees
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Bookings
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Revenue
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Expiry Date
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCompanies.map((company) => {
                    const planColor = getPlanColor(company.plan);
                    const PlanIcon = planColor.icon;

                    return (
                      <tr key={company.id} className="hover:bg-gray-50 transition-colors">
                        {/* Company */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#000035] rounded-lg flex items-center justify-center flex-shrink-0">
                              <Building2 className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{company.name}</p>
                              <p className="text-xs text-gray-500">{company.id} • {company.industry}</p>
                              <p className="text-xs text-gray-500">{company.city}, {company.country}</p>
                            </div>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          <Badge variant="outline" className={getStatusColor(company.status)}>
                            {company.status}
                          </Badge>
                        </td>

                        {/* Plan */}
                        <td className="px-6 py-4">
                          <Badge variant="outline" className={`${planColor.bg} ${planColor.text} border-0`}>
                            <PlanIcon className="w-3 h-3 mr-1" />
                            {company.plan.toUpperCase()}
                          </Badge>
                        </td>

                        {/* Contact */}
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{company.contactPerson}</p>
                            <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                              <Mail className="w-3 h-3" />
                              {company.email}
                            </p>
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {company.phone}
                            </p>
                          </div>
                        </td>

                        {/* Employees */}
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm font-bold text-gray-900">{company.employeeCount}</p>
                            <p className="text-xs text-gray-500">{company.adminCount} admins</p>
                          </div>
                        </td>

                        {/* Bookings */}
                        <td className="px-6 py-4">
                          <p className="text-sm font-bold text-gray-900">{company.totalBookings}</p>
                        </td>

                        {/* Revenue */}
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm font-bold text-gray-900">₹{(company.totalRevenue / 1000).toFixed(0)}K</p>
                            <p className="text-xs text-gray-500">₹{(company.monthlyRevenue / 1000).toFixed(0)}K/mo</p>
                          </div>
                        </td>

                        {/* Expiry Date */}
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-900">{company.expiryDate}</p>
                          <p className="text-xs text-gray-500">Reg: {company.registrationDate}</p>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 text-right">
                          <div className="flex gap-2 justify-end">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedCompany(company);
                                setShowViewDialog(true);
                              }}
                              className="h-8"
                            >
                              <Eye className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditClick(company)}
                              className="h-8"
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            {company.status === 'active' ? (
                              <Button
                                size="sm"
                                onClick={() => handleToggleStatus(company.id, 'suspended')}
                                className="bg-red-600 hover:bg-red-700 h-8"
                              >
                                <XCircle className="w-3 h-3" />
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                onClick={() => handleToggleStatus(company.id, 'active')}
                                className="bg-green-600 hover:bg-green-700 h-8"
                              >
                                <CheckCircle2 className="w-3 h-3" />
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteClick(company)}
                              className="border-red-300 text-red-600 hover:bg-red-50 h-8"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>

      {/* Add/Edit Company Dialog (Combined) */}
      <Dialog open={showAddDialog || showEditDialog} onOpenChange={(open) => {
        if (!open) {
          setShowAddDialog(false);
          setShowEditDialog(false);
          resetForm();
        }
      }}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{showAddDialog ? 'Add New Company' : 'Edit Company'}</DialogTitle>
            <DialogDescription>
              {showAddDialog ? 'Register a new company on the platform' : 'Update company information'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="company-name">Company Name *</Label>
                <Input
                  id="company-name"
                  value={companyForm.name}
                  onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
                  className="mt-2"
                  placeholder="e.g., Tech Innovations Ltd"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="plan">Plan *</Label>
                <select
                  id="plan"
                  value={companyForm.plan}
                  onChange={(e) => setCompanyForm({ ...companyForm, plan: e.target.value as any })}
                  className="mt-2 w-full px-4 py-2 border border-gray-200 rounded-lg bg-white text-sm"
                >
                  <option value="free">Free</option>
                  <option value="basic">Basic</option>
                  <option value="pro">Pro</option>
                  <option value="enterprise">Enterprise</option>
                </select>
              </div>
              <div>
                <Label htmlFor="status">Status *</Label>
                <select
                  id="status"
                  value={companyForm.status}
                  onChange={(e) => setCompanyForm({ ...companyForm, status: e.target.value as any })}
                  className="mt-2 w-full px-4 py-2 border border-gray-200 rounded-lg bg-white text-sm"
                >
                  <option value="active">Active</option>
                  <option value="trial">Trial</option>
                  <option value="suspended">Suspended</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div>
                <Label htmlFor="business-category">Business Category *</Label>
                <select
                  id="business-category"
                  value={companyForm.businessCategory}
                  onChange={(e) => setCompanyForm({ ...companyForm, businessCategory: e.target.value })}
                  className="mt-2 w-full px-4 py-2 border border-gray-200 rounded-lg bg-white text-sm"
                >
                  <option value="">Select Category</option>
                  <option value="Retail">Retail</option>
                  <option value="Technology">Technology</option>
                  <option value="Finance">Finance</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Logistics">Logistics</option>
                  <option value="Food & Beverage">Food & Beverage</option>
                  <option value="Education">Education</option>
                  <option value="Real Estate">Real Estate</option>
                  <option value="E-commerce">E-commerce</option>
                  <option value="Hospitality">Hospitality</option>
                  <option value="Travel">Travel</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contact-person">Contact Person *</Label>
                <Input
                  id="contact-person"
                  value={companyForm.contactPerson}
                  onChange={(e) => setCompanyForm({ ...companyForm, contactPerson: e.target.value })}
                  className="mt-2"
                  placeholder="Full Name"
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={companyForm.email}
                  onChange={(e) => setCompanyForm({ ...companyForm, email: e.target.value })}
                  className="mt-2"
                  placeholder="email@company.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={companyForm.phone}
                  onChange={(e) => setCompanyForm({ ...companyForm, phone: e.target.value })}
                  className="mt-2"
                  placeholder="+91-9876543210"
                />
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={companyForm.country}
                  onChange={(e) => setCompanyForm({ ...companyForm, country: e.target.value })}
                  className="mt-2"
                  placeholder="India"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="industry">Industry</Label>
                <Input
                  id="industry"
                  value={companyForm.industry}
                  onChange={(e) => setCompanyForm({ ...companyForm, industry: e.target.value })}
                  className="mt-2"
                  placeholder="e.g., Technology, Retail"
                />
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={companyForm.city}
                  onChange={(e) => setCompanyForm({ ...companyForm, city: e.target.value })}
                  className="mt-2"
                  placeholder="Bangalore"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="reg-date">Registration Date *</Label>
                <div className="relative mt-2">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                  <input
                    id="reg-date"
                    type="date"
                    value={companyForm.registrationDate}
                    onChange={(e) => setCompanyForm({ ...companyForm, registrationDate: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg bg-white text-sm"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="exp-date">Expiry Date *</Label>
                <div className="relative mt-2">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                  <input
                    id="exp-date"
                    type="date"
                    value={companyForm.expiryDate}
                    onChange={(e) => setCompanyForm({ ...companyForm, expiryDate: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg bg-white text-sm"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={companyForm.address}
                onChange={(e) => setCompanyForm({ ...companyForm, address: e.target.value })}
                className="mt-2"
                rows={2}
                placeholder="Full address"
              />
            </div>

            <div>
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={companyForm.country}
                onChange={(e) => setCompanyForm({ ...companyForm, country: e.target.value })}
                className="mt-2"
                placeholder="India"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowAddDialog(false);
              setShowEditDialog(false);
              resetForm();
            }} disabled={isSaving}>
              Cancel
            </Button>
            <Button
              onClick={showAddDialog ? handleAddCompany : handleUpdateCompany}
              className="bg-[#000035] hover:bg-[#000055]"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                showAddDialog ? 'Add Company' : 'Update Company'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Company Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="sm:max-w-3xl max-h-[80vh] overflow-y-auto">
          {selectedCompany && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#000035] rounded-xl flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2>{selectedCompany.name}</h2>
                    <p className="text-sm text-gray-600 font-normal">{selectedCompany.id}</p>
                  </div>
                </DialogTitle>
                <DialogDescription>
                  Complete company information and metrics
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 py-4">
                <div className="flex gap-2">
                  <Badge variant="outline" className={getStatusColor(selectedCompany.status)}>
                    {selectedCompany.status}
                  </Badge>
                  <Badge variant="outline" className={`${getPlanColor(selectedCompany.plan).bg} ${getPlanColor(selectedCompany.plan).text} border-0`}>
                    {(() => {
                      const Icon = getPlanColor(selectedCompany.plan).icon;
                      return <Icon className="w-3 h-3 mr-1" />;
                    })()}
                    {selectedCompany.plan.toUpperCase()}
                  </Badge>
                  <Badge variant="outline" className="bg-gray-100 text-gray-700">
                    {selectedCompany.industry}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Card className="p-4 bg-blue-50 border-blue-200">
                    <p className="text-sm text-gray-600 mb-1">Total Employees</p>
                    <p className="text-3xl font-bold text-gray-900">{selectedCompany.employeeCount}</p>
                  </Card>
                  <Card className="p-4 bg-green-50 border-green-200">
                    <p className="text-sm text-gray-600 mb-1">Admin Users</p>
                    <p className="text-3xl font-bold text-gray-900">{selectedCompany.adminCount}</p>
                  </Card>
                  <Card className="p-4 bg-purple-50 border-purple-200">
                    <p className="text-sm text-gray-600 mb-1">Total Bookings</p>
                    <p className="text-3xl font-bold text-gray-900">{selectedCompany.totalBookings}</p>
                  </Card>
                  <Card className="p-4 bg-orange-50 border-orange-200">
                    <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">₹{selectedCompany.totalRevenue.toLocaleString()}</p>
                  </Card>
                </div>

                <Card className="p-4 bg-gray-50">
                  <h3 className="font-semibold mb-3">Contact Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-600" />
                      <span className="font-semibold">{selectedCompany.contactPerson}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-600" />
                      <span>{selectedCompany.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-600" />
                      <span>{selectedCompany.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-600" />
                      <span>{selectedCompany.address}, {selectedCompany.city}, {selectedCompany.country}</span>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 bg-gray-50">
                  <h3 className="font-semibold mb-3">Subscription Details</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-600">Registration Date</p>
                      <p className="font-semibold">{selectedCompany.registrationDate}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Expiry Date</p>
                      <p className="font-semibold">{selectedCompany.expiryDate}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Monthly Revenue</p>
                      <p className="font-semibold">₹{selectedCompany.monthlyRevenue.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Plan</p>
                      <p className="font-semibold">{selectedCompany.plan.toUpperCase()}</p>
                    </div>
                  </div>
                </Card>

                <div>
                  <h3 className="font-semibold mb-3">Enabled Features</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedCompany.features.map((feature, idx) => (
                      <Badge key={idx} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button onClick={() => setShowViewDialog(false)}>
                  Close
                </Button>
                <Button 
                  className="bg-[#000035] hover:bg-[#000055]"
                  onClick={() => {
                    setShowViewDialog(false);
                    setShowSettingsDialog(true);
                  }}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Manage Settings
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Company</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this company? This action cannot be undone and will remove all associated data.
            </DialogDescription>
          </DialogHeader>

          {selectedCompany && (
            <Card className="p-4 bg-red-50 border-red-200">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900">{selectedCompany.name}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedCompany.employeeCount} employees • {selectedCompany.totalBookings} bookings
                  </p>
                </div>
              </div>
            </Card>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Company
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Company Settings Dialog */}
      <Dialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog}>
        <DialogContent className="sm:max-w-4xl max-h-[85vh] overflow-y-auto">
          {selectedCompany && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <Settings className="w-6 h-6 text-[#000035]" />
                  <div>
                    <h2>Company Settings - {selectedCompany.name}</h2>
                    <p className="text-sm text-gray-600 font-normal">{selectedCompany.id}</p>
                  </div>
                </DialogTitle>
                <DialogDescription>
                  Configure company-specific settings, permissions, and features
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 py-4">
                {/* Account Settings */}
                <Card className="p-6 bg-white border-gray-200">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-[#000035]" />
                    Account Settings
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Subscription Status</Label>
                        <Badge variant="outline" className={`${getStatusColor(selectedCompany.status)} mt-2`}>
                          {selectedCompany.status.toUpperCase()}
                        </Badge>
                      </div>
                      <div>
                        <Label>Current Plan</Label>
                        <Badge variant="outline" className={`${getPlanColor(selectedCompany.plan).bg} ${getPlanColor(selectedCompany.plan).text} border-0 mt-2`}>
                          {selectedCompany.plan.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">Auto-renewal</p>
                        <p className="text-sm text-gray-600">Automatically renew subscription on expiry</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <CheckCircle2 className="w-4 h-4 mr-2 text-green-600" />
                        Enabled
                      </Button>
                    </div>
                  </div>
                </Card>

                {/* Feature Access */}
                <Card className="p-6 bg-white border-gray-200">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#000035]" />
                    Feature Access
                  </h3>
                  <div className="space-y-3">
                    {selectedCompany.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                          <span className="font-medium text-gray-900">{feature}</span>
                        </div>
                        <Button variant="outline" size="sm">
                          Configure
                        </Button>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* User Limits */}
                <Card className="p-6 bg-white border-gray-200">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-[#000035]" />
                    User Limits & Quotas
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Employee Users</p>
                        <p className="text-2xl font-bold text-gray-900">{selectedCompany.employeeCount} / Unlimited</p>
                        <div className="mt-2 bg-blue-200 h-2 rounded-full">
                          <div className="bg-blue-600 h-2 rounded-full" style={{width: '45%'}}></div>
                        </div>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Admin Users</p>
                        <p className="text-2xl font-bold text-gray-900">{selectedCompany.adminCount} / {selectedCompany.plan === 'enterprise' ? '20' : selectedCompany.plan === 'pro' ? '10' : '5'}</p>
                        <div className="mt-2 bg-green-200 h-2 rounded-full">
                          <div className="bg-green-600 h-2 rounded-full" style={{width: `${(selectedCompany.adminCount / (selectedCompany.plan === 'enterprise' ? 20 : selectedCompany.plan === 'pro' ? 10 : 5)) * 100}%`}}></div>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-gray-600">Monthly Booking Limit</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {selectedCompany.totalBookings} / {selectedCompany.plan === 'enterprise' ? 'Unlimited' : selectedCompany.plan === 'pro' ? '1000' : '500'}
                        </p>
                      </div>
                      <div className="bg-purple-200 h-2 rounded-full">
                        <div className="bg-purple-600 h-2 rounded-full" style={{width: selectedCompany.plan === 'enterprise' ? '30%' : '60%'}}></div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Billing Settings */}
                <Card className="p-6 bg-white border-gray-200">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-[#000035]" />
                    Billing & Payment
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Monthly Revenue</p>
                        <p className="text-xl font-bold text-gray-900">₹{selectedCompany.monthlyRevenue.toLocaleString()}</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                        <p className="text-xl font-bold text-gray-900">₹{selectedCompany.totalRevenue.toLocaleString()}</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Payment Method</p>
                        <p className="text-sm font-semibold text-gray-900">Credit Card •••• 4242</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-200">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-orange-600" />
                        <div>
                          <p className="font-medium text-gray-900">Subscription Expiry</p>
                          <p className="text-sm text-gray-600">{selectedCompany.expiryDate}</p>
                        </div>
                      </div>
                      <Button size="sm" className="bg-[#000035] hover:bg-[#000055]">
                        Extend Subscription
                      </Button>
                    </div>
                  </div>
                </Card>

                {/* Security Settings */}
                <Card className="p-6 bg-white border-gray-200">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-[#000035]" />
                    Security & Compliance
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                        <p className="text-sm text-gray-600">Require 2FA for all admin users</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <XCircle className="w-4 h-4 mr-2 text-gray-600" />
                        Disabled
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">IP Whitelisting</p>
                        <p className="text-sm text-gray-600">Restrict access to specific IP addresses</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <XCircle className="w-4 h-4 mr-2 text-gray-600" />
                        Disabled
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">API Access</p>
                        <p className="text-sm text-gray-600">Enable REST API access for integrations</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <CheckCircle2 className="w-4 h-4 mr-2 text-green-600" />
                        Enabled
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setShowSettingsDialog(false)}>
                  Close
                </Button>
                <Button className="bg-[#000035] hover:bg-[#000055]" onClick={() => {
                  toast.success('Settings saved successfully!');
                  setShowSettingsDialog(false);
                }}>
                  Save Changes
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}