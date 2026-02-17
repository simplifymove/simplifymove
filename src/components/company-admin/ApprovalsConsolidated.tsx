import { useState } from 'react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Input } from '../ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { CourierManagementClean } from './CourierManagementClean';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Filter,
  Plane,
  Car,
  Hotel,
  Bus,
  Truck,
  Package,
  Receipt,
  Zap,
  Droplets,
  Flame,
  Smartphone,
  Wifi,
  User,
  Calendar,
  MapPin,
  DollarSign,
  Eye,
  AlertCircle,
} from 'lucide-react';

interface Approval {
  id: number;
  type: 'travel' | 'logistics' | 'expense' | 'utility';
  subType: string;
  employeeName: string;
  department: string;
  description: string;
  amount: number;
  requestDate: string;
  status: 'pending' | 'approved' | 'rejected';
  priority?: 'high' | 'normal' | 'low';
}

const mockApprovals: Approval[] = [
  // Travel
  { id: 1, type: 'travel', subType: 'Flight', employeeName: 'John Doe', department: 'Sales', description: 'Mumbai to Delhi - Business Meeting', amount: 8500, requestDate: '2025-12-20', status: 'pending', priority: 'high' },
  { id: 2, type: 'travel', subType: 'Hotel', employeeName: 'Sarah Wilson', department: 'Marketing', description: 'Taj Hotel, Mumbai - 3 nights', amount: 15000, requestDate: '2025-12-21', status: 'pending' },
  { id: 3, type: 'travel', subType: 'Cab', employeeName: 'Mike Johnson', department: 'Engineering', description: 'Airport pickup - Bangalore', amount: 850, requestDate: '2025-12-22', status: 'pending' },
  
  // Logistics
  { id: 4, type: 'logistics', subType: 'Truck', employeeName: 'Warehouse Team', department: 'Operations', description: 'Medium Truck - Delhi to Jaipur delivery', amount: 12000, requestDate: '2025-12-20', status: 'pending', priority: 'high' },
  { id: 5, type: 'logistics', subType: 'Container', employeeName: 'Supply Chain', department: 'Operations', description: '20ft Container - Mumbai Port', amount: 45000, requestDate: '2025-12-21', status: 'pending' },
  
  // Expenses
  { id: 6, type: 'expense', subType: 'Travel Expense', employeeName: 'Priya Sharma', department: 'HR', description: 'Client meeting travel expenses', amount: 3500, requestDate: '2025-12-19', status: 'pending' },
  { id: 7, type: 'expense', subType: 'Meal', employeeName: 'Amit Kumar', department: 'Sales', description: 'Client dinner - Project discussion', amount: 2800, requestDate: '2025-12-20', status: 'pending' },
  { id: 8, type: 'expense', subType: 'Office Supplies', employeeName: 'Sneha Patel', department: 'Admin', description: 'Stationery for Q1 2026', amount: 5500, requestDate: '2025-12-21', status: 'pending' },
  
  // Utility Bills
  { id: 9, type: 'utility', subType: 'Electricity', employeeName: 'Raghava Boyidi', department: 'Engineering', description: 'Home office electricity bill', amount: 1850, requestDate: '2025-12-18', status: 'pending' },
  { id: 10, type: 'utility', subType: 'Internet', employeeName: 'Priya Sharma', department: 'Marketing', description: 'High-speed internet for remote work', amount: 1499, requestDate: '2025-12-19', status: 'pending' },
  { id: 11, type: 'utility', subType: 'Mobile', employeeName: 'Vikram Singh', department: 'Sales', description: 'Business mobile plan', amount: 899, requestDate: '2025-12-20', status: 'pending' },
];

const typeIcons: { [key: string]: any } = {
  Flight: Plane,
  Hotel: Hotel,
  Cab: Car,
  Bus: Bus,
  Truck: Truck,
  Container: Package,
  'Travel Expense': Receipt,
  Meal: Receipt,
  'Office Supplies': Package,
  Electricity: Zap,
  Internet: Wifi,
  Mobile: Smartphone,
  Water: Droplets,
  Gas: Flame,
};

const typeColors: { [key: string]: string } = {
  Flight: 'from-blue-400 to-indigo-500',
  Hotel: 'from-purple-400 to-pink-500',
  Cab: 'from-yellow-400 to-orange-500',
  Bus: 'from-green-400 to-emerald-500',
  Truck: 'from-orange-400 to-red-500',
  Container: 'from-slate-400 to-gray-600',
  'Travel Expense': 'from-indigo-400 to-blue-500',
  Meal: 'from-pink-400 to-rose-500',
  'Office Supplies': 'from-teal-400 to-cyan-500',
  Electricity: 'from-yellow-400 to-orange-500',
  Internet: 'from-indigo-400 to-blue-500',
  Mobile: 'from-purple-400 to-pink-500',
  Water: 'from-blue-400 to-cyan-500',
  Gas: 'from-red-400 to-orange-500',
};

export function ApprovalsConsolidated() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('pending');

  const handleApprove = (approval: Approval) => {
    alert(`✅ Approved: ${approval.description}\nEmployee: ${approval.employeeName}\nAmount: ₹${approval.amount.toLocaleString()}`);
  };

  const handleReject = (approval: Approval) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (reason) {
      alert(`❌ Rejected: ${approval.description}\nReason: ${reason}`);
    }
  };

  const getFilteredApprovals = (type: string) => {
    return mockApprovals.filter(a => {
      const matchesType = a.type === type;
      const matchesStatus = filterStatus === 'all' || a.status === filterStatus;
      const matchesSearch = 
        a.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.subType.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesType && matchesStatus && matchesSearch;
    });
  };

  const renderApprovalCard = (approval: Approval) => {
    const Icon = typeIcons[approval.subType] || Receipt;
    const color = typeColors[approval.subType] || 'from-gray-400 to-gray-500';

    return (
      <Card key={approval.id} className="p-5 hover:shadow-lg transition-all border-2 border-gray-200 hover:border-blue-300">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            <div className={`w-12 h-12 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center flex-shrink-0`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h3 className="font-semibold text-gray-900">{approval.employeeName}</h3>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  {approval.department}
                </Badge>
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                  {approval.subType}
                </Badge>
                {approval.priority === 'high' && (
                  <Badge className="bg-red-100 text-red-700">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    High Priority
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-700 mb-1">{approval.description}</p>
              <div className="flex items-center gap-3 text-xs text-gray-600">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {approval.requestDate}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs text-gray-600 mb-1">Amount</p>
              <p className="text-xl font-bold text-gray-900">₹{approval.amount.toLocaleString()}</p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => handleApprove(approval)}
                size="sm"
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                <CheckCircle2 className="w-4 h-4 mr-1" />
                Approve
              </Button>
              <Button
                onClick={() => handleReject(approval)}
                size="sm"
                variant="outline"
                className="border-red-200 text-red-600 hover:bg-red-50"
              >
                <XCircle className="w-4 h-4 mr-1" />
                Reject
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  const travelApprovals = getFilteredApprovals('travel');
  const logisticsApprovals = getFilteredApprovals('logistics');
  const expenseApprovals = getFilteredApprovals('expense');
  const utilityApprovals = getFilteredApprovals('utility');

  const totalPending = mockApprovals.filter(a => a.status === 'pending').length;
  const totalAmount = mockApprovals
    .filter(a => a.status === 'pending')
    .reduce((sum, a) => sum + a.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Approvals Center</h1>
          <p className="text-sm text-gray-600 mt-1">Review and approve all requests, courier services, and more in one place</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-orange-100 text-orange-700 text-base px-4 py-2">
            <Clock className="w-4 h-4 mr-2" />
            {totalPending} Pending
          </Badge>
          <Badge className="bg-blue-100 text-blue-700 text-base px-4 py-2">
            <DollarSign className="w-4 h-4 mr-2" />
            ₹{totalAmount.toLocaleString()}
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <Plane className="w-8 h-8 text-blue-600" />
            <Badge className="bg-blue-100 text-blue-700">
              {mockApprovals.filter(a => a.type === 'travel' && a.status === 'pending').length}
            </Badge>
          </div>
          <p className="text-sm text-gray-600">Travel Requests</p>
          <p className="text-xl font-bold text-gray-900 mt-1">
            ₹{mockApprovals.filter(a => a.type === 'travel' && a.status === 'pending').reduce((s, a) => s + a.amount, 0).toLocaleString()}
          </p>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
          <div className="flex items-center justify-between mb-2">
            <Truck className="w-8 h-8 text-orange-600" />
            <Badge className="bg-orange-100 text-orange-700">
              {mockApprovals.filter(a => a.type === 'logistics' && a.status === 'pending').length}
            </Badge>
          </div>
          <p className="text-sm text-gray-600">Logistics Requests</p>
          <p className="text-xl font-bold text-gray-900 mt-1">
            ₹{mockApprovals.filter(a => a.type === 'logistics' && a.status === 'pending').reduce((s, a) => s + a.amount, 0).toLocaleString()}
          </p>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <Receipt className="w-8 h-8 text-purple-600" />
            <Badge className="bg-purple-100 text-purple-700">
              {mockApprovals.filter(a => a.type === 'expense' && a.status === 'pending').length}
            </Badge>
          </div>
          <p className="text-sm text-gray-600">Expense Claims</p>
          <p className="text-xl font-bold text-gray-900 mt-1">
            ₹{mockApprovals.filter(a => a.type === 'expense' && a.status === 'pending').reduce((s, a) => s + a.amount, 0).toLocaleString()}
          </p>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <div className="flex items-center justify-between mb-2">
            <Zap className="w-8 h-8 text-green-600" />
            <Badge className="bg-green-100 text-green-700">
              {mockApprovals.filter(a => a.type === 'utility' && a.status === 'pending').length}
            </Badge>
          </div>
          <p className="text-sm text-gray-600">Utility Bills</p>
          <p className="text-xl font-bold text-gray-900 mt-1">
            ₹{mockApprovals.filter(a => a.type === 'utility' && a.status === 'pending').reduce((s, a) => s + a.amount, 0).toLocaleString()}
          </p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by employee, description, or type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending Only</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Tabbed Content */}
      <Tabs defaultValue="travel" className="space-y-6">
        <TabsList className="bg-white border shadow-sm">
          <TabsTrigger value="travel" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
            <Plane className="w-4 h-4 mr-2" />
            Travel ({travelApprovals.length})
          </TabsTrigger>
          <TabsTrigger value="logistics" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
            <Truck className="w-4 h-4 mr-2" />
            Logistics ({logisticsApprovals.length})
          </TabsTrigger>
          <TabsTrigger value="expenses" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
            <Receipt className="w-4 h-4 mr-2" />
            Expenses ({expenseApprovals.length})
          </TabsTrigger>
          <TabsTrigger value="utilities" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
            <Zap className="w-4 h-4 mr-2" />
            Utility Bills ({utilityApprovals.length})
          </TabsTrigger>
          <TabsTrigger value="courier" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
            <Package className="w-4 h-4 mr-2" />
            Courier Services
          </TabsTrigger>
        </TabsList>

        <TabsContent value="travel" className="space-y-4">
          {travelApprovals.length > 0 ? (
            travelApprovals.map(renderApprovalCard)
          ) : (
            <Card className="p-12 text-center">
              <Plane className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-600">No travel requests found</p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="logistics" className="space-y-4">
          {logisticsApprovals.length > 0 ? (
            logisticsApprovals.map(renderApprovalCard)
          ) : (
            <Card className="p-12 text-center">
              <Truck className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-600">No logistics requests found</p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="expenses" className="space-y-4">
          {expenseApprovals.length > 0 ? (
            expenseApprovals.map(renderApprovalCard)
          ) : (
            <Card className="p-12 text-center">
              <Receipt className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-600">No expense claims found</p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="utilities" className="space-y-4">
          {utilityApprovals.length > 0 ? (
            utilityApprovals.map(renderApprovalCard)
          ) : (
            <Card className="p-12 text-center">
              <Zap className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-600">No utility bill requests found</p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="courier" className="space-y-4">
          <CourierManagementClean />
        </TabsContent>
      </Tabs>
    </div>
  );
}
