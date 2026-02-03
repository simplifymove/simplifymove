import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Switch } from '../ui/switch';
import { 
  DollarSign, 
  Users, 
  Settings,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  X,
  Plane,
  Hotel,
  Briefcase,
  Truck,
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Building2
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

// Initial data
const initialPolicies = [
  { id: 1, name: 'Domestic Flight Policy', category: 'travel', type: 'Flight', rule: 'Economy class only', department: 'All', limit: 15000, status: 'active' },
  { id: 2, name: 'International Flight Policy', category: 'travel', type: 'Flight', rule: 'Business class for 6+ hours', department: 'Management', limit: 100000, status: 'active' },
  { id: 3, name: 'Hotel Booking Policy', category: 'travel', type: 'Hotel', rule: '4-star max, ₹5000/night', department: 'All', limit: 5000, status: 'active' },
  { id: 4, name: 'Local Transport Policy', category: 'logistics', type: 'Cab', rule: 'Sedan/Hatchback only', department: 'All', limit: 2000, status: 'active' },
  { id: 5, name: 'Delivery Truck Policy', category: 'logistics', type: 'Truck', rule: 'Mini Truck for <500kg', department: 'Operations', limit: 3500, status: 'active' },
];

const initialBudgets = [
  { id: 1, department: 'Sales', allocated: 500000, spent: 325000, remaining: 175000, period: 'Monthly', employees: 12 },
  { id: 2, department: 'Marketing', allocated: 350000, spent: 280000, remaining: 70000, period: 'Monthly', employees: 8 },
  { id: 3, department: 'Engineering', allocated: 400000, spent: 185000, remaining: 215000, period: 'Monthly', employees: 15 },
  { id: 4, department: 'Operations', allocated: 450000, spent: 390000, remaining: 60000, period: 'Monthly', employees: 10 },
  { id: 5, department: 'Finance', allocated: 200000, spent: 95000, remaining: 105000, period: 'Monthly', employees: 6 },
];

const mockEmployees = [
  { id: 1, name: 'John Doe', department: 'Sales' },
  { id: 2, name: 'Jane Smith', department: 'Operations' },
  { id: 3, name: 'Mike Johnson', department: 'Marketing' },
  { id: 4, name: 'Sarah Williams', department: 'Engineering' },
];

const mockDepartments = ['Sales', 'Operations', 'Marketing', 'Engineering', 'Finance'];

export function PolicyBudget() {
  const [activeTab, setActiveTab] = useState('policies');
  const [policies, setPolicies] = useState(initialPolicies);
  const [budgets, setBudgets] = useState(initialBudgets);
  
  // Search and filters
  const [policySearch, setPolicySearch] = useState('');
  const [policyCategoryFilter, setPolicyCategoryFilter] = useState('all');
  const [policyStatusFilter, setPolicyStatusFilter] = useState('all');
  
  const [budgetSearch, setBudgetSearch] = useState('');
  
  // Modals
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<typeof initialPolicies[0] | null>(null);
  const [editingBudget, setEditingBudget] = useState<typeof initialBudgets[0] | null>(null);
  
  // Form data
  const [policyForm, setPolicyForm] = useState({
    name: '',
    category: 'travel',
    type: 'Flight',
    rule: '',
    department: 'All',
    limit: '',
    status: 'active'
  });
  
  const [budgetForm, setBudgetForm] = useState({
    department: '',
    allocated: '',
    period: 'Monthly'
  });

  // Approval workflow states
  const [requirePersonalApproval, setRequirePersonalApproval] = useState(true);
  const [requireBusinessApproval, setRequireBusinessApproval] = useState(true);
  const [businessThreshold, setBusinessThreshold] = useState('5000');
  const [autoApproveUnder, setAutoApproveUnder] = useState('2000');

  // Policy handlers
  const openAddPolicyModal = () => {
    setEditingPolicy(null);
    setPolicyForm({
      name: '',
      category: 'travel',
      type: 'Flight',
      rule: '',
      department: 'All',
      limit: '',
      status: 'active'
    });
    setShowPolicyModal(true);
  };

  const openEditPolicyModal = (policy: typeof initialPolicies[0]) => {
    setEditingPolicy(policy);
    setPolicyForm({
      name: policy.name,
      category: policy.category,
      type: policy.type,
      rule: policy.rule,
      department: policy.department,
      limit: policy.limit.toString(),
      status: policy.status
    });
    setShowPolicyModal(true);
  };

  const handleSavePolicy = () => {
    if (!policyForm.name || !policyForm.rule || !policyForm.limit) {
      toast.error('Please fill all required fields');
      return;
    }

    if (editingPolicy) {
      setPolicies(policies.map(p => p.id === editingPolicy.id ? {
        ...p,
        name: policyForm.name,
        category: policyForm.category,
        type: policyForm.type,
        rule: policyForm.rule,
        department: policyForm.department,
        limit: parseFloat(policyForm.limit),
        status: policyForm.status
      } : p));
      toast.success('Policy updated successfully');
    } else {
      const newPolicy = {
        id: policies.length + 1,
        name: policyForm.name,
        category: policyForm.category,
        type: policyForm.type,
        rule: policyForm.rule,
        department: policyForm.department,
        limit: parseFloat(policyForm.limit),
        status: policyForm.status
      };
      setPolicies([...policies, newPolicy]);
      toast.success('Policy added successfully');
    }

    setShowPolicyModal(false);
    setEditingPolicy(null);
  };

  const handleDeletePolicy = (policy: typeof initialPolicies[0]) => {
    if (confirm(`Are you sure you want to delete "${policy.name}"?`)) {
      setPolicies(policies.filter(p => p.id !== policy.id));
      toast.success('Policy deleted successfully');
    }
  };

  // Budget handlers
  const openAddBudgetModal = () => {
    setEditingBudget(null);
    setBudgetForm({
      department: '',
      allocated: '',
      period: 'Monthly'
    });
    setShowBudgetModal(true);
  };

  const openEditBudgetModal = (budget: typeof initialBudgets[0]) => {
    setEditingBudget(budget);
    setBudgetForm({
      department: budget.department,
      allocated: budget.allocated.toString(),
      period: budget.period
    });
    setShowBudgetModal(true);
  };

  const handleSaveBudget = () => {
    if (!budgetForm.department || !budgetForm.allocated) {
      toast.error('Please fill all required fields');
      return;
    }

    const allocated = parseFloat(budgetForm.allocated);

    if (editingBudget) {
      setBudgets(budgets.map(b => b.id === editingBudget.id ? {
        ...b,
        department: budgetForm.department,
        allocated: allocated,
        remaining: allocated - (b.allocated - b.remaining),
        period: budgetForm.period
      } : b));
      toast.success('Budget updated successfully');
    } else {
      const newBudget = {
        id: budgets.length + 1,
        department: budgetForm.department,
        allocated: allocated,
        spent: 0,
        remaining: allocated,
        period: budgetForm.period,
        employees: mockEmployees.filter(e => e.department === budgetForm.department).length
      };
      setBudgets([...budgets, newBudget]);
      toast.success('Budget allocated successfully');
    }

    setShowBudgetModal(false);
    setEditingBudget(null);
  };

  // Filter functions
  const filteredPolicies = policies.filter(policy => {
    const matchesSearch = policy.name.toLowerCase().includes(policySearch.toLowerCase()) ||
                         policy.rule.toLowerCase().includes(policySearch.toLowerCase());
    const matchesCategory = policyCategoryFilter === 'all' || policy.category === policyCategoryFilter;
    const matchesStatus = policyStatusFilter === 'all' || policy.status === policyStatusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const filteredBudgets = budgets.filter(budget =>
    budget.department.toLowerCase().includes(budgetSearch.toLowerCase())
  );

  const clearPolicyFilters = () => {
    setPolicySearch('');
    setPolicyCategoryFilter('all');
    setPolicyStatusFilter('all');
  };

  const hasPolicyFilters = policySearch || policyCategoryFilter !== 'all' || policyStatusFilter !== 'all';

  // Calculate total budgets
  const totalAllocated = budgets.reduce((sum, b) => sum + b.allocated, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const totalRemaining = budgets.reduce((sum, b) => sum + b.remaining, 0);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2">Policy & Budget Management</h1>
        <p className="text-gray-600">Configure travel policies, logistics rules, and manage departmental budgets</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
          <TabsTrigger value="policies" className="gap-2">
            <Briefcase className="w-4 h-4" />
            Policies
          </TabsTrigger>
          <TabsTrigger value="budgets" className="gap-2">
            <DollarSign className="w-4 h-4" />
            Budgets
          </TabsTrigger>
          <TabsTrigger value="approvals" className="gap-2">
            <Settings className="w-4 h-4" />
            Approval Rules
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Policies */}
        <TabsContent value="policies" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="text-sm text-blue-700 mb-1">Total Policies</div>
                  <div className="text-3xl text-blue-900">{policies.length}</div>
                </div>
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="text-sm text-green-700 mb-1">Active Policies</div>
                  <div className="text-3xl text-green-900">{policies.filter(p => p.status === 'active').length}</div>
                </div>
                <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="text-sm text-purple-700 mb-1">Travel Policies</div>
                  <div className="text-3xl text-purple-900">{policies.filter(p => p.category === 'travel').length}</div>
                </div>
                <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
                  <Plane className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="text-sm text-orange-700 mb-1">Logistics Policies</div>
                  <div className="text-3xl text-orange-900">{policies.filter(p => p.category === 'logistics').length}</div>
                </div>
                <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center">
                  <Truck className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>
          </div>

          {/* Policies List */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="mb-1">All Policies</h3>
                <p className="text-sm text-gray-600">Manage travel and logistics policies</p>
              </div>
              <Button 
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                onClick={openAddPolicyModal}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Policy
              </Button>
            </div>

            {/* Search and Filters */}
            <div className="mb-6 space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search Bar */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    placeholder="Search by policy name or rule..."
                    value={policySearch}
                    onChange={(e) => setPolicySearch(e.target.value)}
                    className="pl-10 h-11"
                  />
                </div>

                {/* Category Filter */}
                <div className="relative min-w-[180px]">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none z-10" />
                  <select
                    value={policyCategoryFilter}
                    onChange={(e) => setPolicyCategoryFilter(e.target.value)}
                    className="w-full h-11 pl-10 pr-10 rounded-md border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                  >
                    <option value="all">All Categories</option>
                    <option value="travel">Travel Only</option>
                    <option value="logistics">Logistics Only</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* Status Filter */}
                <div className="relative min-w-[180px]">
                  <AlertCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none z-10" />
                  <select
                    value={policyStatusFilter}
                    onChange={(e) => setPolicyStatusFilter(e.target.value)}
                    className="w-full h-11 pl-10 pr-10 rounded-md border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active Only</option>
                    <option value="inactive">Inactive Only</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* Clear Filters */}
                {hasPolicyFilters && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearPolicyFilters}
                    className="h-11 px-4"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Clear
                  </Button>
                )}
              </div>

              {hasPolicyFilters && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>Showing {filteredPolicies.length} of {policies.length} policies</span>
                </div>
              )}
            </div>

            {/* Policies Table */}
            {filteredPolicies.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Policy Name</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Category</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Type</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Rule</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Department</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Limit</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPolicies.map((policy) => (
                      <tr key={policy.id} className="border-t hover:bg-gray-50">
                        <td className="py-3 px-4">{policy.name}</td>
                        <td className="py-3 px-4">
                          <Badge className={policy.category === 'travel' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}>
                            {policy.category === 'travel' ? 'Travel' : 'Logistics'}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">{policy.type}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{policy.rule}</td>
                        <td className="py-3 px-4">{policy.department}</td>
                        <td className="py-3 px-4">₹{policy.limit.toLocaleString()}</td>
                        <td className="py-3 px-4">
                          <Badge className={policy.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                            {policy.status === 'active' ? 'Active' : 'Inactive'}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => openEditPolicyModal(policy)}
                              className="h-8 px-3"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 px-3"
                              onClick={() => handleDeletePolicy(policy)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                No policies found
              </div>
            )}
          </Card>
        </TabsContent>

        {/* Tab 2: Budgets */}
        <TabsContent value="budgets" className="space-y-6">
          {/* Budget Stats */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="text-sm text-blue-700 mb-1">Total Allocated</div>
                  <div className="text-3xl text-blue-900">₹{totalAllocated.toLocaleString()}</div>
                  <div className="text-xs text-blue-700 mt-1">Monthly Budget</div>
                </div>
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-red-50 to-red-100 border-red-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="text-sm text-red-700 mb-1">Total Spent</div>
                  <div className="text-3xl text-red-900">₹{totalSpent.toLocaleString()}</div>
                  <div className="text-xs text-red-700 mt-1">{((totalSpent / totalAllocated) * 100).toFixed(0)}% utilized</div>
                </div>
                <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="text-sm text-green-700 mb-1">Total Remaining</div>
                  <div className="text-3xl text-green-900">₹{totalRemaining.toLocaleString()}</div>
                  <div className="text-xs text-green-700 mt-1">Available to spend</div>
                </div>
                <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>
          </div>

          {/* Budgets List */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="mb-1">Department Budgets</h3>
                <p className="text-sm text-gray-600">Allocate and track budgets by department</p>
              </div>
              <Button 
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                onClick={openAddBudgetModal}
              >
                <Plus className="w-4 h-4 mr-2" />
                Allocate Budget
              </Button>
            </div>

            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Search by department..."
                  value={budgetSearch}
                  onChange={(e) => setBudgetSearch(e.target.value)}
                  className="pl-10 h-11"
                />
              </div>
            </div>

            {/* Budgets Table */}
            {filteredBudgets.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Department</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Allocated</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Spent</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Remaining</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Utilization</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Period</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Employees</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBudgets.map((budget) => {
                      const utilization = (budget.spent / budget.allocated) * 100;
                      return (
                        <tr key={budget.id} className="border-t hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <Building2 className="w-4 h-4 text-gray-400" />
                              <span className="font-medium">{budget.department}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">₹{budget.allocated.toLocaleString()}</td>
                          <td className="py-3 px-4 text-red-600">₹{budget.spent.toLocaleString()}</td>
                          <td className="py-3 px-4 text-green-600">₹{budget.remaining.toLocaleString()}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 bg-gray-200 rounded-full h-2 w-24">
                                <div
                                  className={`h-2 rounded-full ${
                                    utilization > 90
                                      ? 'bg-red-500'
                                      : utilization > 70
                                      ? 'bg-yellow-500'
                                      : 'bg-green-500'
                                  }`}
                                  style={{ width: `${Math.min(utilization, 100)}%` }}
                                />
                              </div>
                              <span className="text-sm text-gray-600 w-12">{utilization.toFixed(0)}%</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <Badge className="bg-purple-100 text-purple-700">{budget.period}</Badge>
                          </td>
                          <td className="py-3 px-4">{budget.employees}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => openEditBudgetModal(budget)}
                                className="h-8 px-3"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                No budgets found
              </div>
            )}
          </Card>
        </TabsContent>

        {/* Tab 3: Approval Rules */}
        <TabsContent value="approvals" className="space-y-6">
          <Card className="p-6">
            <div className="mb-6">
              <h3 className="mb-1">Approval Workflow Configuration</h3>
              <p className="text-sm text-gray-600">Configure automatic approval rules and thresholds</p>
            </div>

            <div className="max-w-2xl space-y-6">
              {/* Auto-Approve Under Amount */}
              <div className="border rounded-lg p-4">
                <div className="mb-4">
                  <div className="text-gray-900 mb-1">Auto-Approve Threshold</div>
                  <div className="text-sm text-gray-600">Bookings under this amount will be automatically approved</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">Auto-approve all bookings under</span>
                  <div className="relative w-32">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                    <Input
                      type="number"
                      value={autoApproveUnder}
                      onChange={(e) => setAutoApproveUnder(e.target.value)}
                      className="pl-7 h-10"
                    />
                  </div>
                </div>
              </div>

              {/* Personal Trips Approval */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="text-gray-900">Require Approval for Personal Trips</div>
                    <div className="text-sm text-gray-600">All personal trips will need manager approval</div>
                  </div>
                  <Switch
                    checked={requirePersonalApproval}
                    onCheckedChange={setRequirePersonalApproval}
                  />
                </div>
              </div>

              {/* Business Trips Approval */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-gray-900">Require Approval for High-Value Business Trips</div>
                    <div className="text-sm text-gray-600">Business trips exceeding threshold need approval</div>
                  </div>
                  <Switch
                    checked={requireBusinessApproval}
                    onCheckedChange={setRequireBusinessApproval}
                  />
                </div>
                
                {requireBusinessApproval && (
                  <div className="mt-4">
                    <Label htmlFor="threshold">Approval Threshold</Label>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-gray-600">Business trips over</span>
                      <div className="relative w-32">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                        <Input
                          id="threshold"
                          type="number"
                          value={businessThreshold}
                          onChange={(e) => setBusinessThreshold(e.target.value)}
                          className="pl-7 h-10"
                        />
                      </div>
                      <span className="text-gray-600">require approval</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Multi-Level Approval */}
              <div className="border rounded-lg p-4">
                <div className="mb-4">
                  <div className="text-gray-900 mb-1">Multi-Level Approval</div>
                  <div className="text-sm text-gray-600">Configure approval hierarchy for different amounts</div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-gray-600">Under ₹{autoApproveUnder}</span>
                    <span className="text-gray-400">→</span>
                    <span className="font-medium">Auto-Approved</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <AlertCircle className="w-4 h-4 text-yellow-600" />
                    <span className="text-gray-600">₹{autoApproveUnder} - ₹{businessThreshold}</span>
                    <span className="text-gray-400">→</span>
                    <span className="font-medium">Manager Approval</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <span className="text-gray-600">Above ₹{businessThreshold}</span>
                    <span className="text-gray-400">→</span>
                    <span className="font-medium">Senior Manager + Finance Approval</span>
                  </div>
                </div>
              </div>

              <Button 
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                onClick={() => toast.success('Approval workflow settings saved successfully')}
              >
                <Settings className="w-4 h-4 mr-2" />
                Save Workflow Settings
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add/Edit Policy Modal */}
      {showPolicyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="min-h-screen w-full flex items-center justify-center py-8">
            <Card className="w-full max-w-lg bg-white shadow-2xl rounded-lg my-auto">
              <div className="p-6">
                <div className="mb-6">
                  <h2 className="text-xl">{editingPolicy ? 'Edit Policy' : 'Add New Policy'}</h2>
                  <p className="text-sm text-gray-600 mt-1">Configure travel or logistics policy</p>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); handleSavePolicy(); }}>
                  <div className="space-y-4">
                  <div>
                    <Label htmlFor="policy-name" className="text-sm font-medium text-gray-900 mb-2 block">Policy Name *</Label>
                    <Input 
                      id="policy-name"
                      placeholder="e.g., Domestic Flight Policy" 
                      value={policyForm.name} 
                      onChange={(e) => setPolicyForm({ ...policyForm, name: e.target.value })}
                      className="h-11"
                    />
                  </div>

                  <div>
                    <Label htmlFor="category" className="text-sm font-medium text-gray-900 mb-2 block">Category *</Label>
                    <div className="relative">
                      <select 
                        id="category"
                        className="w-full h-11 px-3 pr-10 rounded-md border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none" 
                        value={policyForm.category} 
                        onChange={(e) => setPolicyForm({ ...policyForm, category: e.target.value })}
                      >
                        <option value="travel">Travel</option>
                        <option value="logistics">Logistics</option>
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="type" className="text-sm font-medium text-gray-900 mb-2 block">Type *</Label>
                    <div className="relative">
                      <select 
                        id="type"
                        className="w-full h-11 px-3 pr-10 rounded-md border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none" 
                        value={policyForm.type} 
                        onChange={(e) => setPolicyForm({ ...policyForm, type: e.target.value })}
                      >
                        {policyForm.category === 'travel' ? (
                          <>
                            <option value="Flight">Flight</option>
                            <option value="Hotel">Hotel</option>
                            <option value="Cab">Cab</option>
                            <option value="Bus">Bus</option>
                          </>
                        ) : (
                          <>
                            <option value="Bike">Bike</option>
                            <option value="Auto">3 Wheeler Auto</option>
                            <option value="Truck">Mini Truck</option>
                            <option value="Container">Container</option>
                          </>
                        )}
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="rule" className="text-sm font-medium text-gray-900 mb-2 block">Rule Description *</Label>
                    <Input 
                      id="rule"
                      placeholder="e.g., Economy class only for domestic flights" 
                      value={policyForm.rule} 
                      onChange={(e) => setPolicyForm({ ...policyForm, rule: e.target.value })}
                      className="h-11"
                    />
                  </div>

                  <div>
                    <Label htmlFor="department" className="text-sm font-medium text-gray-900 mb-2 block">Applicable Department</Label>
                    <div className="relative">
                      <select 
                        id="department"
                        className="w-full h-11 px-3 pr-10 rounded-md border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none" 
                        value={policyForm.department} 
                        onChange={(e) => setPolicyForm({ ...policyForm, department: e.target.value })}
                      >
                        <option value="All">All Departments</option>
                        {mockDepartments.map(dept => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="limit" className="text-sm font-medium text-gray-900 mb-2 block">Spending Limit (₹) *</Label>
                    <Input 
                      id="limit"
                      type="number"
                      placeholder="Enter limit amount" 
                      value={policyForm.limit} 
                      onChange={(e) => setPolicyForm({ ...policyForm, limit: e.target.value })}
                      className="h-11"
                    />
                  </div>

                  <div>
                    <Label htmlFor="status" className="text-sm font-medium text-gray-900 mb-2 block">Status</Label>
                    <div className="relative">
                      <select 
                        id="status"
                        className="w-full h-11 px-3 pr-10 rounded-md border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none" 
                        value={policyForm.status} 
                        onChange={(e) => setPolicyForm({ ...policyForm, status: e.target.value })}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3 mt-6">
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowPolicyModal(false);
                      setEditingPolicy(null);
                    }}
                    className="flex-1 h-11"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {editingPolicy ? 'Update Policy' : 'Add Policy'}
                  </Button>
                </div>
              </form>
            </div>
          </Card>
        </div>
      </div>
      )}

      {/* Add/Edit Budget Modal */}
      {showBudgetModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md bg-white shadow-2xl rounded-lg">
            <div className="p-6">
              <div className="mb-6">
                <h2 className="text-xl">{editingBudget ? 'Edit Budget' : 'Allocate Budget'}</h2>
                <p className="text-sm text-gray-600 mt-1">Set department budget allocation</p>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handleSaveBudget(); }}>
                <div className="space-y-5">
                  <div>
                    <Label htmlFor="budget-department" className="text-sm font-medium text-gray-900 mb-2 block">Department *</Label>
                    <div className="relative">
                      <select 
                        id="budget-department"
                        className="w-full h-11 px-3 pr-10 rounded-md border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none" 
                        value={budgetForm.department} 
                        onChange={(e) => setBudgetForm({ ...budgetForm, department: e.target.value })}
                        disabled={!!editingBudget}
                      >
                        <option value="">Select department...</option>
                        {mockDepartments.map(dept => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="allocated" className="text-sm font-medium text-gray-900 mb-2 block">Budget Amount (₹) *</Label>
                    <Input 
                      id="allocated"
                      type="number"
                      placeholder="Enter budget amount" 
                      value={budgetForm.allocated} 
                      onChange={(e) => setBudgetForm({ ...budgetForm, allocated: e.target.value })}
                      className="h-11"
                    />
                  </div>

                  <div>
                    <Label htmlFor="period" className="text-sm font-medium text-gray-900 mb-2 block">Budget Period</Label>
                    <div className="relative">
                      <select 
                        id="period"
                        className="w-full h-11 px-3 pr-10 rounded-md border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none" 
                        value={budgetForm.period} 
                        onChange={(e) => setBudgetForm({ ...budgetForm, period: e.target.value })}
                      >
                        <option value="Monthly">Monthly</option>
                        <option value="Quarterly">Quarterly</option>
                        <option value="Yearly">Yearly</option>
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3 mt-6">
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowBudgetModal(false);
                      setEditingBudget(null);
                    }}
                    className="flex-1 h-11"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {editingBudget ? 'Update Budget' : 'Allocate Budget'}
                  </Button>
                </div>
              </form>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
