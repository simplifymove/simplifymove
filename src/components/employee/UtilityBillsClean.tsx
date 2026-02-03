import { useState } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
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
  Zap,
  Droplets,
  Flame,
  Smartphone,
  Wifi,
  Tv,
  CheckCircle2,
  Clock,
  Calendar,
  ChevronRight,
  ArrowLeft,
  Receipt,
  TrendingUp,
  AlertCircle,
  Plus
} from 'lucide-react';

const billCategories = [
  { id: 'electricity', name: 'Electricity', icon: Zap, bgColor: 'bg-yellow-50', color: 'text-yellow-600', description: 'Pay electricity bills' },
  { id: 'water', name: 'Water', icon: Droplets, bgColor: 'bg-blue-50', color: 'text-blue-600', description: 'Pay water bills' },
  { id: 'gas', name: 'Gas', icon: Flame, bgColor: 'bg-red-50', color: 'text-red-600', description: 'Pay gas bills' },
  { id: 'mobile', name: 'Mobile', icon: Smartphone, bgColor: 'bg-purple-50', color: 'text-purple-600', description: 'Recharge mobile' },
  { id: 'internet', name: 'Internet', icon: Wifi, bgColor: 'bg-indigo-50', color: 'text-indigo-600', description: 'Pay broadband bills' },
  { id: 'dth', name: 'DTH/Cable', icon: Tv, bgColor: 'bg-green-50', color: 'text-green-600', description: 'Pay TV bills' },
];

const operators: Record<string, { id: string; name: string }[]> = {
  electricity: [
    { id: 'bescom', name: 'BESCOM (Bangalore)' },
    { id: 'msedcl', name: 'MSEDCL (Maharashtra)' },
    { id: 'tata_power', name: 'Tata Power' },
    { id: 'bses', name: 'BSES Delhi' },
    { id: 'adani', name: 'Adani Electricity' },
  ],
  water: [
    { id: 'bwssb', name: 'BWSSB Bangalore' },
    { id: 'delhijal', name: 'Delhi Jal Board' },
    { id: 'mumbai_water', name: 'Mumbai Water' },
  ],
  gas: [
    { id: 'indane', name: 'Indane Gas' },
    { id: 'hp_gas', name: 'HP Gas' },
    { id: 'bharat_gas', name: 'Bharat Gas' },
  ],
  mobile: [
    { id: 'jio', name: 'Jio' },
    { id: 'airtel', name: 'Airtel' },
    { id: 'vi', name: 'Vi' },
    { id: 'bsnl', name: 'BSNL' },
  ],
  internet: [
    { id: 'jio_fiber', name: 'JioFiber' },
    { id: 'airtel_fiber', name: 'Airtel Fiber' },
    { id: 'act', name: 'ACT Fibernet' },
  ],
  dth: [
    { id: 'tata_play', name: 'Tata Play' },
    { id: 'airtel_dth', name: 'Airtel Digital TV' },
    { id: 'dish_tv', name: 'Dish TV' },
  ],
};

interface PaymentHistory {
  id: string;
  category: string;
  operator: string;
  amount: number;
  date: string;
  status: 'success' | 'pending' | 'failed';
  billNumber: string;
}

const mockHistory: PaymentHistory[] = [
  { id: 'PAY001', category: 'electricity', operator: 'BESCOM (Bangalore)', amount: 1250, date: '2025-12-15', status: 'success', billNumber: '123456789' },
  { id: 'PAY002', category: 'mobile', operator: 'Jio', amount: 599, date: '2025-12-10', status: 'success', billNumber: '9876543210' },
  { id: 'PAY003', category: 'internet', operator: 'JioFiber', amount: 899, date: '2025-12-05', status: 'success', billNumber: 'JF123456' },
  { id: 'PAY004', category: 'water', operator: 'BWSSB Bangalore', amount: 450, date: '2025-12-01', status: 'success', billNumber: 'WTR789012' },
  { id: 'PAY005', category: 'gas', operator: 'Indane Gas', amount: 950, date: '2025-11-28', status: 'success', billNumber: 'GAS456789' },
];

type PaymentStep = 'category' | 'operator' | 'details' | 'confirm' | 'success';

export function UtilityBillsClean() {
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [currentStep, setCurrentStep] = useState<PaymentStep>('category');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedOperator, setSelectedOperator] = useState('');
  const [consumerNumber, setConsumerNumber] = useState('');
  const [fetchedBill, setFetchedBill] = useState<{ amount: number; dueDate: string } | null>(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentStep('operator');
  };

  const handleOperatorSelect = (operatorId: string) => {
    setSelectedOperator(operatorId);
    setCurrentStep('details');
  };

  const handleFetchBill = () => {
    setFetchedBill({ amount: 1250, dueDate: '2025-12-31' });
    setCurrentStep('confirm');
  };

  const handlePayment = () => {
    setShowSuccessDialog(true);
    setTimeout(() => {
      setShowSuccessDialog(false);
      resetPayment();
    }, 2500);
  };

  const resetPayment = () => {
    setCurrentStep('category');
    setSelectedCategory('');
    setSelectedOperator('');
    setConsumerNumber('');
    setFetchedBill(null);
  };

  const goBack = () => {
    if (currentStep === 'operator') {
      setCurrentStep('category');
      setSelectedOperator('');
    } else if (currentStep === 'details') {
      setCurrentStep('operator');
      setConsumerNumber('');
    } else if (currentStep === 'confirm') {
      setCurrentStep('details');
      setFetchedBill(null);
    }
  };

  const getCategoryData = (categoryId: string) => {
    return billCategories.find(c => c.id === categoryId);
  };

  const totalPaid = mockHistory.reduce((sum, p) => sum + p.amount, 0);
  const avgBill = Math.round(totalPaid / mockHistory.length);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#000035] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold mb-2">Utility Bills</h1>
          <p className="text-gray-300">Pay all your bills quickly and securely</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 pb-12 space-y-6">
        {/* Main Bill Payment Card */}
        <Card className="bg-white border-0 rounded-2xl shadow-lg overflow-hidden">
          <div className="p-8">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-[#000035] mb-1">Select Your Service</h2>
              <p className="text-gray-600 text-sm">Choose the bill you want to pay</p>
            </div>

            {/* Bill Category Grid */}
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-8">
              {billCategories.map((category) => {
                const Icon = category.icon;
                const isSelected = selectedCategory === category.id;
                
                return (
                  <button
                    key={category.id}
                    onClick={() => {
                      setSelectedCategory(category.id);
                      setSelectedOperator('');
                      setConsumerNumber('');
                      setFetchedBill(null);
                    }}
                    className={`relative rounded-xl p-4 transition-all duration-200 ${
                      isSelected
                        ? 'bg-[#000035] shadow-lg scale-105'
                        : 'bg-white border-2 border-gray-200 hover:border-[#000035] hover:shadow-md'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all ${
                        isSelected 
                          ? 'bg-white' 
                          : category.bgColor
                      }`}>
                        <Icon className={`w-6 h-6 ${category.color}`} />
                      </div>
                      <span className={`text-xs font-medium ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                        {category.name}
                      </span>
                    </div>
                    {isSelected && (
                      <div className="absolute top-2 right-2">
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Payment Form */}
            {selectedCategory && (
              <div className="border-t border-gray-200 pt-6 space-y-5 animate-in fade-in duration-300">
                <div className="grid md:grid-cols-2 gap-5">
                  {/* Operator Selection */}
                  <div>
                    <Label htmlFor="operator" className="text-sm font-semibold text-gray-900 mb-2 block">
                      Select Provider
                    </Label>
                    <Select value={selectedOperator} onValueChange={setSelectedOperator}>
                      <SelectTrigger className="h-11 text-sm rounded-lg border-gray-300 hover:border-[#000035]">
                        <SelectValue placeholder="Choose your service provider" />
                      </SelectTrigger>
                      <SelectContent>
                        {operators[selectedCategory]?.map((operator) => (
                          <SelectItem key={operator.id} value={operator.id} className="text-sm">
                            {operator.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Consumer Number */}
                  <div className={!selectedOperator ? 'opacity-50' : ''}>
                    <Label htmlFor="consumer-number" className="text-sm font-semibold text-gray-900 mb-2 block">
                      Consumer Number
                    </Label>
                    <Input
                      id="consumer-number"
                      placeholder="Enter consumer number or mobile"
                      value={consumerNumber}
                      onChange={(e) => setConsumerNumber(e.target.value)}
                      disabled={!selectedOperator}
                      className="h-11 text-sm rounded-lg border-gray-300 hover:border-[#000035] focus:border-[#000035]"
                    />
                  </div>
                </div>

                {/* Fetch Bill Button */}
                {selectedOperator && consumerNumber && !fetchedBill && (
                  <div className="animate-in fade-in duration-200">
                    <Button
                      onClick={handleFetchBill}
                      className="w-full h-11 bg-[#000035] hover:bg-[#000055] rounded-lg shadow-sm font-semibold"
                    >
                      <Receipt className="w-4 h-4 mr-2" />
                      Fetch Bill Details
                    </Button>
                  </div>
                )}

                {/* Bill Details & Payment */}
                {fetchedBill && (
                  <div className="animate-in fade-in duration-300">
                    <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6 space-y-4">
                      <div className="flex items-center justify-between pb-4 border-b border-gray-300">
                        <h3 className="font-bold text-[#000035]">Bill Summary</h3>
                        <Badge className="bg-green-50 text-green-700 border border-green-200 px-3 py-1">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div className="bg-white rounded-lg p-4 border border-gray-200">
                            <p className="text-xs text-gray-500 mb-1">Consumer Number</p>
                            <p className="font-semibold text-gray-900">{consumerNumber}</p>
                          </div>
                          
                          <div className="bg-white rounded-lg p-4 border border-gray-200">
                            <p className="text-xs text-gray-500 mb-1">Service Provider</p>
                            <p className="font-semibold text-gray-900">
                              {operators[selectedCategory]?.find(o => o.id === selectedOperator)?.name}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="bg-white rounded-lg p-4 border border-gray-200">
                            <p className="text-xs text-gray-500 mb-2">Due Date</p>
                            <Badge className="bg-orange-50 text-orange-700 border border-orange-200 px-3 py-1">
                              <Clock className="w-3 h-3 mr-1" />
                              {fetchedBill.dueDate}
                            </Badge>
                          </div>

                          <div className="bg-[#000035] rounded-lg p-4 border border-[#000035]">
                            <p className="text-xs text-gray-300 mb-1">Amount to Pay</p>
                            <p className="text-3xl font-bold text-white">₹{fetchedBill.amount.toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                      
                      <Button
                        onClick={handlePayment}
                        className="w-full h-12 bg-green-600 hover:bg-green-700 font-bold rounded-lg shadow-md mt-2"
                      >
                        <CheckCircle2 className="w-5 h-5 mr-2" />
                        Pay ₹{fetchedBill.amount.toLocaleString()} Now
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Empty State */}
            {!selectedCategory && (
              <div className="text-center py-12 border-t border-gray-200">
                <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Receipt className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">Select a Bill Category</h3>
                <p className="text-gray-500 text-sm">Choose a service from the options above to get started</p>
              </div>
            )}
          </div>
        </Card>

        {/* Monthly Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-5 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-gray-500 mb-1">This Month</p>
                <p className="text-2xl font-bold text-[#000035]">₹{totalPaid.toLocaleString()}</p>
                <p className="text-xs text-gray-600 mt-2 flex items-center gap-1">
                  <Receipt className="w-3 h-3" />
                  Total Paid
                </p>
              </div>
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <Receipt className="w-5 h-5 text-[#000035]" />
              </div>
            </div>
          </Card>

          <Card className="p-5 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-gray-500 mb-1">Bills Paid</p>
                <p className="text-2xl font-bold text-[#000035]">{mockHistory.length}</p>
                <p className="text-xs text-gray-600 mt-2 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Successful
                </p>
              </div>
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-[#000035]" />
              </div>
            </div>
          </Card>

          <Card className="p-5 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-gray-500 mb-1">Upcoming</p>
                <p className="text-2xl font-bold text-[#000035]">2</p>
                <p className="text-xs text-gray-600 mt-2 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Due Soon
                </p>
              </div>
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-[#000035]" />
              </div>
            </div>
          </Card>

          <Card className="p-5 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-gray-500 mb-1">Avg. Bill</p>
                <p className="text-2xl font-bold text-[#000035]">₹{avgBill.toLocaleString()}</p>
                <p className="text-xs text-gray-600 mt-2 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  Monthly Avg.
                </p>
              </div>
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-[#000035]" />
              </div>
            </div>
          </Card>
        </div>

        {/* Payment History */}
        <div>
          <h2 className="text-xl font-bold text-[#000035] mb-1">Recent Payments</h2>
          <p className="text-gray-600 text-sm mb-4">Your recent bill payment history</p>
          <div className="space-y-3">
            {mockHistory.map((payment) => {
              const categoryData = getCategoryData(payment.category);
              const Icon = categoryData?.icon || Receipt;
              
              return (
                <Card
                  key={payment.id}
                  className="p-4 border border-gray-200 hover:shadow-md transition-shadow rounded-xl"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className={`w-10 h-10 rounded-lg ${categoryData?.bgColor || 'bg-gray-100'} flex items-center justify-center`}>
                        <Icon className={`w-5 h-5 ${categoryData?.color || 'text-gray-600'}`} />
                      </div>
                      
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 text-sm">{payment.operator}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Calendar className="w-3 h-3" />
                            {payment.date}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Receipt className="w-3 h-3" />
                            {payment.billNumber}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="font-bold text-gray-900">₹{payment.amount.toLocaleString()}</p>
                        <Badge className="mt-1 bg-green-50 text-green-700 border border-green-200 text-xs px-2 py-0.5">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Paid
                        </Badge>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {currentStep !== 'category' && currentStep !== 'success' && (
                <Button variant="ghost" size="sm" onClick={goBack} className="mr-2 -ml-2">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              )}
              {currentStep === 'category' && 'Select Bill Category'}
              {currentStep === 'operator' && 'Select Operator'}
              {currentStep === 'details' && 'Enter Details'}
              {currentStep === 'confirm' && 'Confirm Payment'}
              {currentStep === 'success' && 'Payment Successful'}
            </DialogTitle>
            <DialogDescription>
              {currentStep === 'category' && 'Choose the type of bill you want to pay'}
              {currentStep === 'operator' && 'Select your service provider'}
              {currentStep === 'details' && 'Enter your account details to fetch bill'}
              {currentStep === 'confirm' && 'Review and confirm your payment'}
              {currentStep === 'success' && 'Your payment has been processed successfully'}
            </DialogDescription>
          </DialogHeader>

          {/* Step 1: Category Selection */}
          {currentStep === 'category' && (
            <div className="grid grid-cols-2 gap-3 py-4">
              {billCategories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => handleCategorySelect(category.id)}
                    className="relative overflow-hidden rounded-lg border-2 border-gray-200 hover:border-blue-400 transition-all p-6 flex flex-col items-center gap-3 group"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-10 transition-opacity`}></div>
                    <div className={`relative w-12 h-12 rounded-xl bg-gradient-to-br ${category.bg} flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 ${category.iconColor}`} />
                    </div>
                    <span className="relative text-sm font-medium text-gray-900">{category.name}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Step 2: Operator Selection */}
          {currentStep === 'operator' && selectedCategory && (
            <div className="space-y-2 py-4">
              {operators[selectedCategory]?.map((operator) => (
                <button
                  key={operator.id}
                  onClick={() => handleOperatorSelect(operator.id)}
                  className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all text-left group"
                >
                  <span className="text-sm font-medium text-gray-900">{operator.name}</span>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                </button>
              ))}
            </div>
          )}

          {/* Step 3: Enter Details */}
          {currentStep === 'details' && (
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="consumer-number">Consumer Number / Mobile Number</Label>
                <Input
                  id="consumer-number"
                  placeholder="Enter your consumer number"
                  value={consumerNumber}
                  onChange={(e) => setConsumerNumber(e.target.value)}
                  className="mt-2"
                />
              </div>
              <Button 
                onClick={handleFetchBill} 
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700" 
                disabled={!consumerNumber}
              >
                Fetch Bill Details
              </Button>
            </div>
          )}

          {/* Step 4: Confirm Payment */}
          {currentStep === 'confirm' && fetchedBill && (
            <div className="space-y-6 py-4">
              <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 p-6 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Consumer Number</span>
                  <span className="text-sm font-semibold text-gray-900">{consumerNumber}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Due Date</span>
                  <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                    <Clock className="w-3 h-3 mr-1" />
                    {fetchedBill.dueDate}
                  </Badge>
                </div>
                <div className="border-t border-blue-200 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900">Total Amount</span>
                    <span className="text-2xl font-bold text-blue-600">₹{fetchedBill.amount.toLocaleString()}</span>
                  </div>
                </div>
              </Card>
              <Button 
                onClick={handlePayment} 
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg h-12"
              >
                Pay ₹{fetchedBill.amount.toLocaleString()}
              </Button>
            </div>
          )}

          {/* Step 5: Success */}
          {currentStep === 'success' && (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Payment Successful!</h3>
              <p className="text-sm text-gray-600">Your bill has been paid successfully</p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              Payment Successful
            </DialogTitle>
            <DialogDescription>
              Your bill payment has been processed successfully
            </DialogDescription>
          </DialogHeader>

          <div className="text-center py-8">
            <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Payment Successful!</h3>
            <p className="text-sm text-gray-600">Your bill has been paid successfully</p>
          </div>

          <DialogFooter>
            <Button
              onClick={() => setShowSuccessDialog(false)}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg h-12"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}