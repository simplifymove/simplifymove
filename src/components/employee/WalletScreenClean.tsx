import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  Wallet,
  Building2,
  Plus,
  ArrowDownCircle,
  ArrowUpCircle,
  Search,
  User,
  TrendingUp,
  TrendingDown,
  Eye,
  Sparkles,
  ArrowRight,
  CreditCard,
  ArrowRightLeft,
  X,
  CheckCircle2,
  Filter,
  Download,
  Calendar as CalendarIcon
} from 'lucide-react';
import { toast } from 'sonner';

interface Transaction {
  id: number;
  type: 'debit' | 'credit';
  amount: number;
  description: string;
  date: string;
  wallet: 'business' | 'personal';
  status: 'completed' | 'pending' | 'failed';
}

const mockTransactions: Transaction[] = [
  { id: 1, type: 'debit', amount: 8500, description: 'Flight Booking - Mumbai to Delhi', date: '2025-12-18', wallet: 'business', status: 'completed' },
  { id: 2, type: 'credit', amount: 10000, description: 'Wallet Top-up via UPI', date: '2025-12-17', wallet: 'personal', status: 'completed' },
  { id: 3, type: 'debit', amount: 6800, description: 'Hotel Booking - 2 Nights', date: '2025-12-16', wallet: 'business', status: 'completed' },
  { id: 4, type: 'credit', amount: 425, description: 'Cashback from Flight Booking', date: '2025-12-16', wallet: 'business', status: 'completed' },
  { id: 5, type: 'debit', amount: 1200, description: 'Cab Booking - Airport Transfer', date: '2025-12-15', wallet: 'business', status: 'completed' },
  { id: 6, type: 'credit', amount: 2500, description: 'Refund - Cancelled Bus Ticket', date: '2025-12-14', wallet: 'personal', status: 'completed' },
  { id: 7, type: 'debit', amount: 450, description: 'Bike Rental - City Tour', date: '2025-12-13', wallet: 'personal', status: 'completed' },
  { id: 8, type: 'credit', amount: 5000, description: 'Wallet Top-up via Net Banking', date: '2025-12-12', wallet: 'business', status: 'completed' },
];

export function WalletScreenClean() {
  const [businessBalance, setBusinessBalance] = useState(45000);
  const [personalBalance, setPersonalBalance] = useState(12500);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  
  // Add Money Dialog
  const [showAddMoneyDialog, setShowAddMoneyDialog] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<'business' | 'personal'>('business');
  const [addAmount, setAddAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVV, setCardCVV] = useState('');
  const [selectedBank, setSelectedBank] = useState('');
  
  // Transfer Dialog
  const [showTransferDialog, setShowTransferDialog] = useState(false);
  const [transferFrom, setTransferFrom] = useState<'business' | 'personal'>('personal');
  const [transferTo, setTransferTo] = useState<'business' | 'personal'>('business');
  const [transferAmount, setTransferAmount] = useState('');

  const handleAddMoney = () => {
    const amount = parseFloat(addAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (paymentMethod === 'upi' && !upiId) {
      toast.error('Please enter UPI ID');
      return;
    }
    if (paymentMethod === 'card' && (!cardNumber || !cardExpiry || !cardCVV)) {
      toast.error('Please fill all card details');
      return;
    }
    if (paymentMethod === 'netbanking' && !selectedBank) {
      toast.error('Please select a bank');
      return;
    }

    if (selectedWallet === 'business') {
      setBusinessBalance(businessBalance + amount);
    } else {
      setPersonalBalance(personalBalance + amount);
    }

    toast.success(`Successfully added ₹${amount.toLocaleString()} to ${selectedWallet} wallet!`);
    setAddAmount('');
    setUpiId('');
    setCardNumber('');
    setCardExpiry('');
    setCardCVV('');
    setSelectedBank('');
    setShowAddMoneyDialog(false);
  };

  const handleTransfer = () => {
    const amount = parseFloat(transferAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (transferFrom === transferTo) {
      toast.error('Cannot transfer to the same wallet');
      return;
    }

    const fromBalance = transferFrom === 'business' ? businessBalance : personalBalance;
    if (amount > fromBalance) {
      toast.error('Insufficient balance');
      return;
    }

    if (transferFrom === 'business') {
      setBusinessBalance(businessBalance - amount);
      setPersonalBalance(personalBalance + amount);
    } else {
      setPersonalBalance(personalBalance - amount);
      setBusinessBalance(businessBalance + amount);
    }

    toast.success(`Successfully transferred ₹${amount.toLocaleString()} from ${transferFrom} to ${transferTo} wallet!`);
    setTransferAmount('');
    setShowTransferDialog(false);
  };

  const filteredTransactions = mockTransactions.filter(transaction => {
    if (activeTab === 'business' && transaction.wallet !== 'business') return false;
    if (activeTab === 'personal' && transaction.wallet !== 'personal') return false;
    if (searchQuery && !transaction.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const totalBalance = businessBalance + personalBalance;
  const monthlySpent = mockTransactions
    .filter(t => t.type === 'debit')
    .reduce((sum, t) => sum + t.amount, 0);
  const monthlyReceived = mockTransactions
    .filter(t => t.type === 'credit')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Wallet</h1>
              <p className="text-gray-600 mt-1">Manage your business and personal funds</p>
            </div>
            <div className="flex gap-3">
              <Button 
                onClick={() => setShowTransferDialog(true)}
                variant="outline"
                className="border-gray-300"
              >
                <ArrowRightLeft className="w-5 h-5 mr-2" />
                Transfer
              </Button>
              <Button 
                onClick={() => setShowAddMoneyDialog(true)}
                className="bg-[#000035] hover:bg-[#000055] shadow-lg"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Money
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Balance Cards - Using #000035 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Business Wallet */}
          <Card className="relative overflow-hidden border-0 shadow-xl">
            <div className="absolute inset-0 bg-[#000035]"></div>
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40"></div>
            
            <div className="relative p-8">
              <div className="flex items-start justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-white/90">Business Wallet</p>
                    <p className="text-xs text-white/70 mt-0.5">For work expenses</p>
                  </div>
                </div>
                <Sparkles className="w-5 h-5 text-yellow-300" />
              </div>

              <div className="mb-8">
                <p className="text-4xl font-bold text-white mb-1">₹{businessBalance.toLocaleString()}</p>
                <p className="text-sm text-white/90">Available Balance</p>
              </div>

              <div className="flex gap-3">
                <Button 
                  size="sm" 
                  onClick={() => {
                    setSelectedWallet('business');
                    setShowAddMoneyDialog(true);
                  }}
                  className="flex-1 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-0"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Money
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => {
                    setTransferFrom('business');
                    setTransferTo('personal');
                    setShowTransferDialog(true);
                  }}
                  className="flex-1 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border-white/20"
                >
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Transfer
                </Button>
              </div>
            </div>
          </Card>

          {/* Personal Wallet */}
          <Card className="relative overflow-hidden border-0 shadow-xl">
            <div className="absolute inset-0 bg-[#000035]"></div>
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40"></div>
            
            <div className="relative p-8">
              <div className="flex items-start justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-white/90">Personal Wallet</p>
                    <p className="text-xs text-white/70 mt-0.5">For personal use</p>
                  </div>
                </div>
                <Sparkles className="w-5 h-5 text-yellow-300" />
              </div>

              <div className="mb-8">
                <p className="text-4xl font-bold text-white mb-1">₹{personalBalance.toLocaleString()}</p>
                <p className="text-sm text-white/90">Available Balance</p>
              </div>

              <div className="flex gap-3">
                <Button 
                  size="sm" 
                  onClick={() => {
                    setSelectedWallet('personal');
                    setShowAddMoneyDialog(true);
                  }}
                  className="flex-1 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-0"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Money
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => {
                    setTransferFrom('personal');
                    setTransferTo('business');
                    setShowTransferDialog(true);
                  }}
                  className="flex-1 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border-white/20"
                >
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Transfer
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6 border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Balance</p>
                <p className="text-3xl font-bold text-gray-900">₹{totalBalance.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                <Wallet className="w-6 h-6 text-[#000035]" />
              </div>
            </div>
          </Card>

          <Card className="p-6 border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">This Month Spent</p>
                <p className="text-3xl font-bold text-red-600">₹{monthlySpent.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6 border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">This Month Received</p>
                <p className="text-3xl font-bold text-green-600">₹{monthlyReceived.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Search & Tabs */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white border-gray-200"
            />
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-gray-100">
              <TabsTrigger value="all" className="data-[state=active]:bg-white">
                All Transactions
              </TabsTrigger>
              <TabsTrigger value="business" className="data-[state=active]:bg-white">
                Business
              </TabsTrigger>
              <TabsTrigger value="personal" className="data-[state=active]:bg-white">
                Personal
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Transactions List */}
        <div className="space-y-3">
          {filteredTransactions.length === 0 ? (
            <Card className="p-12 text-center">
              <Wallet className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No transactions found</h3>
              <p className="text-gray-600">Try adjusting your search or filters</p>
            </Card>
          ) : (
            filteredTransactions.map((transaction) => (
              <Card
                key={transaction.id}
                className="p-5 border-gray-200 hover:shadow-md transition-all group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      transaction.type === 'credit' 
                        ? 'bg-green-100' 
                        : 'bg-gray-100'
                    }`}>
                      {transaction.type === 'credit' ? (
                        <ArrowDownCircle className="w-6 h-6 text-green-600" />
                      ) : (
                        <ArrowUpCircle className="w-6 h-6 text-gray-600" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900">{transaction.description}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <p className="text-sm text-gray-500">{transaction.date}</p>
                        <Badge variant="outline" className={
                          transaction.wallet === 'business' 
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-purple-50 text-purple-700 border-purple-200'
                        }>
                          {transaction.wallet === 'business' ? 'Business' : 'Personal'}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="text-right flex items-center gap-3">
                    <div>
                      <p className={`text-xl font-bold ${
                        transaction.type === 'credit' ? 'text-green-600' : 'text-gray-900'
                      }`}>
                        {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{transaction.status}</p>
                    </div>
                    <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Add Money Dialog */}
      <Dialog open={showAddMoneyDialog} onOpenChange={setShowAddMoneyDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Money to Wallet</DialogTitle>
            <DialogDescription>
              Choose your wallet and payment method
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Select Wallet */}
            <div>
              <Label>Select Wallet</Label>
              <Select value={selectedWallet} onValueChange={(value: 'business' | 'personal') => setSelectedWallet(value)}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="business">Business Wallet (₹{businessBalance.toLocaleString()})</SelectItem>
                  <SelectItem value="personal">Personal Wallet (₹{personalBalance.toLocaleString()})</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Amount */}
            <div>
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={addAmount}
                onChange={(e) => setAddAmount(e.target.value)}
                className="mt-2"
              />
            </div>

            {/* Payment Method */}
            <div>
              <Label>Payment Method</Label>
              <Tabs value={paymentMethod} onValueChange={(value: any) => setPaymentMethod(value)} className="mt-2">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="upi">UPI</TabsTrigger>
                  <TabsTrigger value="card">Card</TabsTrigger>
                  <TabsTrigger value="netbanking">Net Banking</TabsTrigger>
                </TabsList>

                <TabsContent value="upi" className="space-y-3 mt-4">
                  <div>
                    <Label htmlFor="upi">UPI ID</Label>
                    <Input
                      id="upi"
                      placeholder="yourname@upi"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="card" className="space-y-3 mt-4">
                  <div>
                    <Label htmlFor="card-number">Card Number</Label>
                    <Input
                      id="card-number"
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="expiry">Expiry</Label>
                      <Input
                        id="expiry"
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        type="password"
                        placeholder="123"
                        value={cardCVV}
                        onChange={(e) => setCardCVV(e.target.value)}
                        className="mt-2"
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="netbanking" className="space-y-3 mt-4">
                  <div>
                    <Label>Select Bank</Label>
                    <Select value={selectedBank} onValueChange={setSelectedBank}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Choose your bank" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hdfc">HDFC Bank</SelectItem>
                        <SelectItem value="icici">ICICI Bank</SelectItem>
                        <SelectItem value="sbi">State Bank of India</SelectItem>
                        <SelectItem value="axis">Axis Bank</SelectItem>
                        <SelectItem value="kotak">Kotak Mahindra Bank</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddMoneyDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAddMoney}
              className="bg-[#000035] hover:bg-[#000055]"
            >
              Add ₹{addAmount || '0'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Transfer Money Dialog */}
      <Dialog open={showTransferDialog} onOpenChange={setShowTransferDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Transfer Between Wallets</DialogTitle>
            <DialogDescription>
              Move funds between your business and personal wallets
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* From Wallet */}
            <div>
              <Label>From Wallet</Label>
              <Select value={transferFrom} onValueChange={(value: 'business' | 'personal') => {
                setTransferFrom(value);
                setTransferTo(value === 'business' ? 'personal' : 'business');
              }}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="business">Business Wallet (₹{businessBalance.toLocaleString()})</SelectItem>
                  <SelectItem value="personal">Personal Wallet (₹{personalBalance.toLocaleString()})</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Transfer Icon */}
            <div className="flex justify-center">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <ArrowDownCircle className="w-5 h-5 text-[#000035]" />
              </div>
            </div>

            {/* To Wallet */}
            <div>
              <Label>To Wallet</Label>
              <Select value={transferTo} onValueChange={(value: 'business' | 'personal') => setTransferTo(value)}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="business" disabled={transferFrom === 'business'}>
                    Business Wallet (₹{businessBalance.toLocaleString()})
                  </SelectItem>
                  <SelectItem value="personal" disabled={transferFrom === 'personal'}>
                    Personal Wallet (₹{personalBalance.toLocaleString()})
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Amount */}
            <div>
              <Label htmlFor="transfer-amount">Amount to Transfer</Label>
              <Input
                id="transfer-amount"
                type="number"
                placeholder="Enter amount"
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
                className="mt-2"
              />
              <p className="text-xs text-gray-500 mt-1">
                Available: ₹{(transferFrom === 'business' ? businessBalance : personalBalance).toLocaleString()}
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTransferDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleTransfer}
              className="bg-[#000035] hover:bg-[#000055]"
            >
              <ArrowRightLeft className="w-4 h-4 mr-2" />
              Transfer ₹{transferAmount || '0'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}