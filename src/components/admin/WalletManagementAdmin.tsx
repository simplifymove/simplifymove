import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { 
  Wallet, 
  Plus, 
  ArrowUpCircle,
  ArrowDownCircle,
  TrendingUp,
  Users,
  Calendar,
  DollarSign,
  Search,
  Filter,
  X
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

const mockEmployees = [
  { id: 1, name: 'John Doe', department: 'Sales' },
  { id: 2, name: 'Jane Smith', department: 'Operations' },
  { id: 3, name: 'Mike Johnson', department: 'Marketing' },
  { id: 4, name: 'Sarah Williams', department: 'Engineering' },
];

const mockDepartments = ['Sales', 'Operations', 'Marketing', 'Engineering', 'Finance'];

const initialTransactions = [
  { id: 1, type: 'debit', employee: 'John Doe', amount: 42500, description: 'Flight Booking - Mumbai to New York', date: '2025-12-19', wallet: 'business' },
  { id: 2, type: 'credit', employee: 'Admin', amount: 50000, description: 'Monthly Budget Allocation', date: '2025-12-18', wallet: 'business' },
  { id: 3, type: 'debit', employee: 'Jane Smith', amount: 15000, description: 'Hotel Booking - Training Program', date: '2025-12-18', wallet: 'business' },
  { id: 4, type: 'credit', employee: 'Mike Johnson', amount: 5000, description: 'Personal Wallet Top-up', date: '2025-12-17', wallet: 'personal' },
  { id: 5, type: 'debit', employee: 'Sarah Williams', amount: 1200, description: 'Bus Booking - Client Visit', date: '2025-12-17', wallet: 'business' },
];

export function WalletManagementAdmin() {
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [transactions, setTransactions] = useState(initialTransactions);
  const [searchQuery, setSearchQuery] = useState('');
  const [transactionTypeFilter, setTransactionTypeFilter] = useState('all');
  const [walletTypeFilter, setWalletTypeFilter] = useState('all');
  const [walletData, setWalletData] = useState({
    selectedTarget: '',
    targetType: 'employee' as 'employee' | 'department',
    amount: '',
    walletType: 'Business Wallet' as 'Business Wallet' | 'Personal Wallet'
  });

  const handleTopUp = () => {
    if (!walletData.amount || parseFloat(walletData.amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (!walletData.selectedTarget) {
      toast.error('Please select an employee or department');
      return;
    }

    const amount = parseFloat(walletData.amount);
    const currentDate = new Date().toISOString().split('T')[0];
    const walletType = walletData.walletType === 'Business Wallet' ? 'business' : 'personal';

    if (walletData.targetType === 'employee') {
      const employee = mockEmployees.find(e => e.id.toString() === walletData.selectedTarget);
      
      // Add new transaction
      const newTransaction = {
        id: transactions.length + 1,
        type: 'credit' as const,
        employee: employee?.name || 'Unknown',
        amount: amount,
        description: `Wallet Top-up by Admin - ${walletData.walletType}`,
        date: currentDate,
        wallet: walletType
      };
      
      setTransactions([newTransaction, ...transactions]);
      toast.success(`₹${amount.toLocaleString()} added to ${employee?.name}'s ${walletData.walletType}`);
    } else {
      // For department-wise, add multiple transactions
      const departmentEmployees = mockEmployees.filter(e => e.department === walletData.selectedTarget);
      const newTransactions = departmentEmployees.map((emp, index) => ({
        id: transactions.length + 1 + index,
        type: 'credit' as const,
        employee: emp.name,
        amount: amount,
        description: `Department Top-up by Admin - ${walletData.walletType}`,
        date: currentDate,
        wallet: walletType
      }));
      
      setTransactions([...newTransactions, ...transactions]);
      toast.success(`₹${amount.toLocaleString()} added to ${departmentEmployees.length} employees in ${walletData.selectedTarget} department`);
    }

    setShowTopUpModal(false);
    setWalletData({
      selectedTarget: '',
      targetType: 'employee',
      amount: '',
      walletType: 'Business Wallet'
    });
  };

  // Filter transactions based on search and filters
  const filteredTransactions = transactions.filter((transaction) => {
    // Search filter
    const matchesSearch = transaction.employee.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         transaction.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Transaction type filter
    const matchesTransactionType = transactionTypeFilter === 'all' || transaction.type === transactionTypeFilter;
    
    // Wallet type filter
    const matchesWalletType = walletTypeFilter === 'all' || transaction.wallet === walletTypeFilter;
    
    return matchesSearch && matchesTransactionType && matchesWalletType;
  });

  const clearAllFilters = () => {
    setSearchQuery('');
    setTransactionTypeFilter('all');
    setWalletTypeFilter('all');
  };

  const hasActiveFilters = searchQuery || transactionTypeFilter !== 'all' || walletTypeFilter !== 'all';

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="mb-2">Wallet Management</h1>
            <p className="text-gray-600">Manage corporate and employee wallets</p>
          </div>
          <Button 
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            onClick={() => setShowTopUpModal(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Funds
          </Button>
        </div>
      </div>

      {/* Wallet Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="text-sm text-purple-700 mb-1">Corporate Wallet</div>
              <div className="text-3xl text-purple-900 mb-2">₹3,05,480</div>
              <div className="text-xs text-purple-700">Available Balance</div>
            </div>
            <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
              <Wallet className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="text-sm text-blue-700 mb-1">Total Allocated</div>
              <div className="text-3xl text-blue-900 mb-2">₹1,10,000</div>
              <div className="text-xs text-blue-700">Employee Wallets</div>
            </div>
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="text-sm text-green-700 mb-1">This Month Spend</div>
              <div className="text-3xl text-green-900 mb-2">₹58,700</div>
              <div className="text-xs text-green-700 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +12% from last month
              </div>
            </div>
            <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="text-sm text-orange-700 mb-1">Pending Approvals</div>
              <div className="text-3xl text-orange-900 mb-2">5</div>
              <div className="text-xs text-orange-700">Wallet top-up requests</div>
            </div>
            <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center">
              <ArrowUpCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>
      </div>

      {/* Transactions */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="mb-1">Recent Transactions</h3>
            <p className="text-sm text-gray-600">All wallet activity across the company</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search by employee name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11"
              />
            </div>

            {/* Transaction Type Filter */}
            <div className="relative min-w-[180px]">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none z-10" />
              <select
                value={transactionTypeFilter}
                onChange={(e) => setTransactionTypeFilter(e.target.value)}
                className="w-full h-11 pl-10 pr-10 rounded-md border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              >
                <option value="all">All Transactions</option>
                <option value="credit">Credit Only</option>
                <option value="debit">Debit Only</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Wallet Type Filter */}
            <div className="relative min-w-[180px]">
              <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none z-10" />
              <select
                value={walletTypeFilter}
                onChange={(e) => setWalletTypeFilter(e.target.value)}
                className="w-full h-11 pl-10 pr-10 rounded-md border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              >
                <option value="all">All Wallets</option>
                <option value="business">Business Wallet</option>
                <option value="personal">Personal Wallet</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllFilters}
                className="h-11 px-4"
              >
                <X className="w-4 h-4 mr-2" />
                Clear
              </Button>
            )}
          </div>

          {/* Active Filters Summary */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Showing {filteredTransactions.length} of {transactions.length} transactions</span>
            </div>
          )}
        </div>

        {/* Transaction List */}
        {filteredTransactions.length > 0 ? (
          <div className="space-y-4">
            {filteredTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center gap-4 p-4 rounded-lg border hover:bg-gray-50 transition-colors"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  transaction.type === 'credit' 
                    ? 'bg-green-100' 
                    : 'bg-red-100'
                }`}>
                  {transaction.type === 'credit' ? (
                    <ArrowUpCircle className="w-6 h-6 text-green-600" />
                  ) : (
                    <ArrowDownCircle className="w-6 h-6 text-red-600" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900">{transaction.employee}</span>
                    <Badge className={`text-xs ${
                      transaction.wallet === 'business' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-purple-100 text-purple-700'
                    }`}>
                      {transaction.wallet === 'business' ? 'Business' : 'Personal'}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600">{transaction.description}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(transaction.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </div>
                </div>

                <div className={`text-right ${
                  transaction.type === 'credit' 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}>
                  <div className="text-xl font-semibold">
                    {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500">
            No transactions found
          </div>
        )}

        <Button variant="outline" className="w-full mt-6">
          Load More Transactions
        </Button>
      </Card>

      {/* Top-up Modal */}
      {showTopUpModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md bg-white shadow-2xl rounded-lg">
            <div className="p-6">
              <div className="mb-6">
                <h2 className="text-xl">Add Funds to Wallet</h2>
                <p className="text-sm text-gray-600 mt-1">Choose how you want to add funds</p>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handleTopUp(); }}>
                <div className="space-y-5">
                  {/* Selection Type Dropdown - FIRST DROPDOWN */}
                  <div>
                    <Label htmlFor="selection-type" className="text-sm font-medium text-gray-900 mb-2 block">Add Funds By</Label>
                    <div className="relative">
                      <select 
                        id="selection-type"
                        className="w-full h-11 px-3 pr-10 rounded-md border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none" 
                        value={walletData.targetType} 
                        onChange={(e) => setWalletData({ 
                          ...walletData, 
                          targetType: e.target.value as 'employee' | 'department',
                          selectedTarget: '' // Reset selection when switching type
                        })}
                      >
                        <option value="employee">Employee Wise</option>
                        <option value="department">Department Wise</option>
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Conditional Dropdown - Employee or Department - SECOND DROPDOWN */}
                  <div>
                    <Label htmlFor="select-target" className="text-sm font-medium text-gray-900 mb-2 block">
                      {walletData.targetType === 'employee' ? 'Select Employee' : 'Select Department'}
                    </Label>
                    <div className="relative">
                      <select 
                        id="select-target"
                        className="w-full h-11 px-3 pr-10 rounded-md border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none text-gray-600" 
                        value={walletData.selectedTarget} 
                        onChange={(e) => setWalletData({ ...walletData, selectedTarget: e.target.value })}
                      >
                        <option value="">
                          {walletData.targetType === 'employee' ? 'Choose employee...' : 'Choose department...'}
                        </option>
                        {walletData.targetType === 'employee' ? (
                          mockEmployees.map((emp) => (
                            <option key={emp.id} value={emp.id.toString()}>
                              {emp.name} - {emp.department}
                            </option>
                          ))
                        ) : (
                          mockDepartments.map((dept) => (
                            <option key={dept} value={dept}>
                              {dept}
                            </option>
                          ))
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
                    <Label htmlFor="amount" className="text-sm font-medium text-gray-900 mb-2 block">Amount (₹)</Label>
                    <Input 
                      id="amount"
                      type="number"
                      placeholder="Enter amount" 
                      value={walletData.amount} 
                      onChange={(e) => setWalletData({ ...walletData, amount: e.target.value })}
                      className="h-11"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="wallet-type" className="text-sm font-medium text-gray-900 mb-2 block">Wallet Type</Label>
                    <div className="relative">
                      <select 
                        id="wallet-type"
                        className="w-full h-11 px-3 pr-10 rounded-md border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none" 
                        value={walletData.walletType} 
                        onChange={(e) => setWalletData({ ...walletData, walletType: e.target.value as 'Business Wallet' | 'Personal Wallet' })}
                      >
                        <option value="Business Wallet">Business Wallet</option>
                        <option value="Personal Wallet">Personal Wallet</option>
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
                      setShowTopUpModal(false);
                      setWalletData({ 
                        selectedTarget: '',
                        targetType: 'employee',
                        amount: '',
                        walletType: 'Business Wallet'
                      });
                    }}
                    className="flex-1 h-11"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Funds
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