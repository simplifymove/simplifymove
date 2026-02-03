import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '../ui/sheet';
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
  Plus, 
  Upload, 
  X, 
  Receipt, 
  Calendar, 
  DollarSign, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Search,
  Download,
  Eye,
  ArrowRight,
  Plane,
  Car,
  Bus,
  Hotel,
  Utensils,
  Fuel,
  ParkingCircle,
  Wifi,
  ShoppingCart,
  MoreHorizontal,
  AlertCircle,
  Link as LinkIcon,
  User,
  Edit,
  Trash2 as Trash
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface ExpenseClaim {
  id: string;
  date: string;
  category: string;
  amount: number;
  description: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Reimbursed';
  submittedDate: string;
  receipts: number;
  linkedBooking?: string;
  approver?: string;
  rejectionReason?: string;
}

const expenseClaims: ExpenseClaim[] = [
  {
    id: 'EXP-2024-001',
    date: '2024-12-15',
    category: 'Travel - Flight',
    amount: 4500,
    description: 'Mumbai to Delhi client meeting',
    status: 'Approved',
    submittedDate: '2024-12-16',
    receipts: 1,
    linkedBooking: 'TRV-45678',
    approver: 'Sarah Johnson',
  },
  {
    id: 'EXP-2024-002',
    date: '2024-12-18',
    category: 'Meals',
    amount: 850,
    description: 'Client dinner at Taj Hotel',
    status: 'Pending',
    submittedDate: '2024-12-19',
    receipts: 1,
  },
  {
    id: 'EXP-2024-003',
    date: '2024-12-20',
    category: 'Accommodation',
    amount: 6500,
    description: '3 nights hotel stay - Delhi',
    status: 'Reimbursed',
    submittedDate: '2024-12-21',
    receipts: 1,
    linkedBooking: 'TRV-45679',
    approver: 'Sarah Johnson',
  },
  {
    id: 'EXP-2024-004',
    date: '2024-12-22',
    category: 'Travel - Cab',
    amount: 450,
    description: 'Airport to office transport',
    status: 'Rejected',
    submittedDate: '2024-12-23',
    receipts: 0,
    rejectionReason: 'No receipt attached. Please resubmit with valid receipt.',
  },
  {
    id: 'EXP-2024-005',
    date: '2024-12-10',
    category: 'Fuel',
    amount: 1200,
    description: 'Fuel expenses for company vehicle',
    status: 'Approved',
    submittedDate: '2024-12-11',
    receipts: 2,
    approver: 'Michael Chen',
  },
  {
    id: 'EXP-2024-006',
    date: '2024-12-08',
    category: 'Parking',
    amount: 300,
    description: 'Airport parking fees',
    status: 'Reimbursed',
    submittedDate: '2024-12-09',
    receipts: 1,
    approver: 'Sarah Johnson',
  },
];

const categories = [
  'Travel - Flight',
  'Travel - Cab',
  'Travel - Bus',
  'Accommodation',
  'Meals',
  'Fuel',
  'Parking',
  'Communication',
  'Office Supplies',
  'Other',
];

export function ExpenseClaimsEmployeeClean() {
  const [showSubmitSheet, setShowSubmitSheet] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState<ExpenseClaim | null>(null);
  const [editingClaim, setEditingClaim] = useState<ExpenseClaim | null>(null);
  const [claimToDelete, setClaimToDelete] = useState<ExpenseClaim | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [claims, setClaims] = useState<ExpenseClaim[]>(expenseClaims);

  // Form state
  const [formData, setFormData] = useState({
    date: '',
    category: '',
    amount: '',
    description: '',
    linkedBooking: '',
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setAttachments([...attachments, ...filesArray]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setFormData({ date: '', category: '', amount: '', description: '', linkedBooking: '' });
    setAttachments([]);
    setEditingClaim(null);
  };

  const handleSubmit = () => {
    if (!formData.date || !formData.category || !formData.amount) {
      toast.error('Please fill all required fields');
      return;
    }

    if (editingClaim) {
      // Update existing claim
      setClaims(claims.map(claim => 
        claim.id === editingClaim.id 
          ? {
              ...claim,
              date: formData.date,
              category: formData.category,
              amount: parseFloat(formData.amount),
              description: formData.description,
              linkedBooking: formData.linkedBooking,
              receipts: attachments.length,
            }
          : claim
      ));
      toast.success('Expense claim updated successfully!');
    } else {
      // Create new claim
      const newClaim: ExpenseClaim = {
        id: `EXP-2024-${String(claims.length + 1).padStart(3, '0')}`,
        date: formData.date,
        category: formData.category,
        amount: parseFloat(formData.amount),
        description: formData.description,
        status: 'Pending',
        submittedDate: new Date().toISOString().split('T')[0],
        receipts: attachments.length,
        linkedBooking: formData.linkedBooking || undefined,
      };
      setClaims([newClaim, ...claims]);
      toast.success('Expense claim submitted successfully!');
    }

    setShowSubmitSheet(false);
    resetForm();
  };

  const handleEdit = (claim: ExpenseClaim) => {
    // Only allow editing of Pending or Rejected claims
    if (claim.status !== 'Pending' && claim.status !== 'Rejected') {
      toast.error('Only pending or rejected claims can be edited');
      return;
    }

    setEditingClaim(claim);
    setFormData({
      date: claim.date,
      category: claim.category,
      amount: claim.amount.toString(),
      description: claim.description,
      linkedBooking: claim.linkedBooking || '',
    });
    setShowSubmitSheet(true);
  };

  const handleDeleteClick = (claim: ExpenseClaim) => {
    // Only allow deleting of Pending or Rejected claims
    if (claim.status !== 'Pending' && claim.status !== 'Rejected') {
      toast.error('Only pending or rejected claims can be deleted');
      return;
    }
    setClaimToDelete(claim);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = () => {
    if (claimToDelete) {
      setClaims(claims.filter(claim => claim.id !== claimToDelete.id));
      toast.success(`Expense claim ${claimToDelete.id} deleted successfully!`);
      setShowDeleteDialog(false);
      setClaimToDelete(null);
    }
  };

  const getCategoryIcon = (category: string) => {
    if (category.includes('Flight')) return Plane;
    if (category.includes('Cab')) return Car;
    if (category.includes('Bus')) return Bus;
    if (category.includes('Accommodation')) return Hotel;
    if (category.includes('Meals')) return Utensils;
    if (category.includes('Fuel')) return Fuel;
    if (category.includes('Parking')) return ParkingCircle;
    if (category.includes('Communication')) return Wifi;
    if (category.includes('Supplies')) return ShoppingCart;
    return Receipt;
  };

  const getCategoryColor = (category: string) => {
    if (category.includes('Flight')) return { bg: 'bg-blue-100', text: 'text-blue-600', solid: 'bg-[#000035]' };
    if (category.includes('Cab')) return { bg: 'bg-yellow-100', text: 'text-yellow-600', solid: 'bg-[#000035]' };
    if (category.includes('Bus')) return { bg: 'bg-green-100', text: 'text-green-600', solid: 'bg-[#000035]' };
    if (category.includes('Accommodation')) return { bg: 'bg-purple-100', text: 'text-purple-600', solid: 'bg-[#000035]' };
    if (category.includes('Meals')) return { bg: 'bg-orange-100', text: 'text-orange-600', solid: 'bg-[#000035]' };
    if (category.includes('Fuel')) return { bg: 'bg-red-100', text: 'text-red-600', solid: 'bg-[#000035]' };
    if (category.includes('Parking')) return { bg: 'bg-indigo-100', text: 'text-indigo-600', solid: 'bg-[#000035]' };
    return { bg: 'bg-gray-100', text: 'text-gray-600', solid: 'bg-[#000035]' };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-green-50 text-green-700 border-green-200';
      case 'Rejected': return 'bg-red-50 text-red-700 border-red-200';
      case 'Pending': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'Reimbursed': return 'bg-blue-50 text-blue-700 border-blue-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved': return CheckCircle;
      case 'Rejected': return XCircle;
      case 'Pending': return Clock;
      case 'Reimbursed': return DollarSign;
      default: return AlertCircle;
    }
  };

  const filteredClaims = claims.filter(claim => {
    if (activeTab === 'pending' && claim.status !== 'Pending') return false;
    if (activeTab === 'approved' && claim.status !== 'Approved') return false;
    if (activeTab === 'reimbursed' && claim.status !== 'Reimbursed') return false;
    if (activeTab === 'rejected' && claim.status !== 'Rejected') return false;
    
    if (searchQuery && !claim.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !claim.id.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !claim.category.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const totalClaimed = claims.reduce((sum, claim) => sum + claim.amount, 0);
  const pendingAmount = claims.filter(c => c.status === 'Pending').reduce((sum, claim) => sum + claim.amount, 0);
  const approvedAmount = claims.filter(c => c.status === 'Approved' || c.status === 'Reimbursed').reduce((sum, claim) => sum + claim.amount, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Expense Claims</h1>
              <p className="text-gray-600 mt-1">Submit and track your expense reimbursements</p>
            </div>
            
            <Button 
              onClick={() => setShowSubmitSheet(true)}
              className="bg-[#000035] hover:bg-[#000055] shadow-lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Submit Expense
            </Button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <Card className="p-6 border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Claimed</p>
                  <p className="text-3xl font-bold text-gray-900">₹{totalClaimed.toLocaleString()}</p>
                  <p className="text-xs text-gray-500 mt-1">{claims.length} claims</p>
                </div>
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Receipt className="w-7 h-7 text-blue-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6 border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Pending Approval</p>
                  <p className="text-3xl font-bold text-yellow-600">₹{pendingAmount.toLocaleString()}</p>
                  <p className="text-xs text-gray-500 mt-1">{claims.filter(c => c.status === 'Pending').length} pending</p>
                </div>
                <div className="w-14 h-14 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <Clock className="w-7 h-7 text-yellow-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6 border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Approved / Reimbursed</p>
                  <p className="text-3xl font-bold text-green-600">₹{approvedAmount.toLocaleString()}</p>
                  <p className="text-xs text-gray-500 mt-1">{claims.filter(c => c.status === 'Approved' || c.status === 'Reimbursed').length} approved</p>
                </div>
                <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-7 h-7 text-green-600" />
                </div>
              </div>
            </Card>
          </div>

          {/* Search Bar */}
          <div className="mt-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search by description, ID, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-50 border-gray-200"
              />
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
            <TabsList className="bg-gray-100">
              <TabsTrigger value="all" className="data-[state=active]:bg-white">
                All Claims
              </TabsTrigger>
              <TabsTrigger value="pending" className="data-[state=active]:bg-white">
                Pending
              </TabsTrigger>
              <TabsTrigger value="approved" className="data-[state=active]:bg-white">
                Approved
              </TabsTrigger>
              <TabsTrigger value="reimbursed" className="data-[state=active]:bg-white">
                Reimbursed
              </TabsTrigger>
              <TabsTrigger value="rejected" className="data-[state=active]:bg-white">
                Rejected
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Claims Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-4">
          {filteredClaims.length === 0 ? (
            <Card className="p-12 text-center">
              <Receipt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No expense claims found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your search or filters</p>
              <Button onClick={() => setShowSubmitSheet(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Submit New Expense
              </Button>
            </Card>
          ) : (
            filteredClaims.map((claim) => {
              const CategoryIcon = getCategoryIcon(claim.category);
              const StatusIcon = getStatusIcon(claim.status);
              const categoryColor = getCategoryColor(claim.category);
              
              return (
                <Card 
                  key={claim.id} 
                  className="overflow-hidden hover:shadow-lg transition-all border-gray-200 group cursor-pointer"
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Left Side - Color Bar */}
                    <div className={`w-full md:w-2 ${categoryColor.solid}`}></div>
                    
                    {/* Main Content */}
                    <div className="flex-1 p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        {/* Left Section */}
                        <div className="flex items-start gap-4 flex-1">
                          {/* Icon */}
                          <div className={`w-14 h-14 ${categoryColor.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                            <CategoryIcon className={`w-7 h-7 ${categoryColor.text}`} />
                          </div>

                          {/* Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2 flex-wrap">
                              <h3 className="text-lg font-bold text-gray-900">{claim.description}</h3>
                              <Badge variant="outline" className={getStatusColor(claim.status)}>
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {claim.status}
                              </Badge>
                            </div>

                            {/* Category & ID */}
                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                              <div className="flex items-center gap-1">
                                <Receipt className="w-4 h-4 text-gray-400" />
                                <span className="font-medium text-gray-700">{claim.category}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <FileText className="w-4 h-4 text-gray-400" />
                                <span>{claim.id}</span>
                              </div>
                            </div>

                            {/* Meta Info */}
                            <div className="flex items-center gap-4 text-sm text-gray-600 flex-wrap">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                <span>Expense Date: {claim.date}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4 text-gray-400" />
                                <span>Submitted: {claim.submittedDate}</span>
                              </div>
                              {claim.receipts > 0 && (
                                <div className="flex items-center gap-1">
                                  <FileText className="w-4 h-4 text-gray-400" />
                                  <span>{claim.receipts} receipt{claim.receipts > 1 ? 's' : ''}</span>
                                </div>
                              )}
                            </div>

                            {/* Additional Info */}
                            {claim.linkedBooking && (
                              <div className="mt-2 flex items-center gap-2 text-sm">
                                <LinkIcon className="w-4 h-4 text-blue-600" />
                                <span className="text-gray-600">Linked to booking:</span>
                                <span className="font-medium text-blue-600">{claim.linkedBooking}</span>
                              </div>
                            )}
                            {claim.approver && (
                              <div className="mt-2 flex items-center gap-2 text-sm">
                                <User className="w-4 h-4 text-green-600" />
                                <span className="text-gray-600">Approved by:</span>
                                <span className="font-medium text-gray-700">{claim.approver}</span>
                              </div>
                            )}
                            {claim.rejectionReason && (
                              <div className="mt-2 flex items-start gap-2 text-sm">
                                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                                <div>
                                  <span className="text-gray-600">Reason:</span>
                                  <span className="font-medium text-red-600 ml-1">{claim.rejectionReason}</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Right Section */}
                        <div className="flex flex-col items-end gap-3 lg:min-w-[180px]">
                          <div className="text-right">
                            <p className="text-2xl font-bold text-gray-900">₹{claim.amount.toLocaleString()}</p>
                            <p className="text-xs text-gray-500 mt-1">Claim Amount</p>
                          </div>

                          {/* Actions */}
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="gap-2" onClick={() => { setSelectedClaim(claim); setShowViewDialog(true); }}>
                              <Eye className="w-4 h-4" />
                              View
                            </Button>
                            {claim.receipts > 0 && (
                              <Button variant="outline" size="sm" className="gap-2">
                                <Download className="w-4 h-4" />
                              </Button>
                            )}
                            <Button variant="outline" size="sm" className="gap-2" onClick={() => handleEdit(claim)}>
                              <Edit className="w-4 h-4" />
                              Edit
                            </Button>
                            <Button variant="outline" size="sm" className="gap-2" onClick={() => handleDeleteClick(claim)}>
                              <Trash className="w-4 h-4" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </div>

      {/* Submit Expense Sheet */}
      <Sheet open={showSubmitSheet} onOpenChange={setShowSubmitSheet}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto p-6">
          <SheetHeader className="mb-6">
            <SheetTitle>Submit New Expense</SheetTitle>
            <SheetDescription>
              Fill in the details below to submit your expense claim
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-6">
            <div>
              <Label htmlFor="date">Expense Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="amount">Amount (₹) *</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Brief description of the expense..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="mt-1.5"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="linkedBooking">Linked Booking (Optional)</Label>
              <Input
                id="linkedBooking"
                placeholder="e.g., TRV-12345"
                value={formData.linkedBooking}
                onChange={(e) => setFormData({ ...formData, linkedBooking: e.target.value })}
                className="mt-1.5"
              />
            </div>

            <div>
              <Label>Upload Receipts</Label>
              <div className="mt-1.5">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="mb-2 text-sm text-gray-600">
                      <span className="font-medium">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PDF, PNG, JPG (MAX. 5MB)</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    multiple
                    accept="image/*,.pdf"
                    onChange={handleFileUpload}
                  />
                </label>

                {/* Attachments List */}
                {attachments.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {attachments.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-gray-600" />
                          <span className="text-sm text-gray-900">{file.name}</span>
                          <span className="text-xs text-gray-500">
                            ({(file.size / 1024).toFixed(0)} KB)
                          </span>
                        </div>
                        <button
                          onClick={() => removeAttachment(index)}
                          className="p-1 hover:bg-gray-200 rounded"
                        >
                          <X className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-6 border-t">
              <Button
                variant="outline"
                onClick={() => setShowSubmitSheet(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                className="flex-1 bg-[#000035] hover:bg-[#000055]"
              >
                Submit Claim
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* View Expense Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="w-full sm:max-w-xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Expense Claim Details</DialogTitle>
            <DialogDescription>
              View the details of the selected expense claim
            </DialogDescription>
          </DialogHeader>

          {selectedClaim && (
            <div className="space-y-6 mt-6">
              <div>
                <Label htmlFor="date">Expense Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={selectedClaim.date}
                  readOnly
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={selectedClaim.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="amount">Amount (₹)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={selectedClaim.amount}
                  readOnly
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of the expense..."
                  value={selectedClaim.description}
                  readOnly
                  className="mt-2"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="linkedBooking">Linked Booking (Optional)</Label>
                <Input
                  id="linkedBooking"
                  placeholder="e.g., TRV-12345"
                  value={selectedClaim.linkedBooking || ''}
                  readOnly
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Upload Receipts</Label>
                <div className="mt-2">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <p className="mb-2 text-sm text-gray-600">
                        <span className="font-medium">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">PDF, PNG, JPG (MAX. 5MB)</p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      multiple
                      accept="image/*,.pdf"
                      onChange={handleFileUpload}
                    />
                  </label>

                  {/* Attachments List */}
                  {attachments.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {attachments.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-gray-600" />
                            <span className="text-sm text-gray-900">{file.name}</span>
                            <span className="text-xs text-gray-500">
                              ({(file.size / 1024).toFixed(0)} KB)
                            </span>
                          </div>
                          <button
                            onClick={() => removeAttachment(index)}
                            className="p-1 hover:bg-gray-200 rounded"
                          >
                            <X className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowViewDialog(false)}
                  className="flex-1"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Expense Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="w-full sm:max-w-xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Delete Expense Claim</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this expense claim? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {claimToDelete && (
            <div className="space-y-6 mt-6">
              <div>
                <Label htmlFor="date">Expense Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={claimToDelete.date}
                  readOnly
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={claimToDelete.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="amount">Amount (₹)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={claimToDelete.amount}
                  readOnly
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of the expense..."
                  value={claimToDelete.description}
                  readOnly
                  className="mt-2"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="linkedBooking">Linked Booking (Optional)</Label>
                <Input
                  id="linkedBooking"
                  placeholder="e.g., TRV-12345"
                  value={claimToDelete.linkedBooking || ''}
                  readOnly
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Upload Receipts</Label>
                <div className="mt-2">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <p className="mb-2 text-sm text-gray-600">
                        <span className="font-medium">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">PDF, PNG, JPG (MAX. 5MB)</p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      multiple
                      accept="image/*,.pdf"
                      onChange={handleFileUpload}
                    />
                  </label>

                  {/* Attachments List */}
                  {attachments.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {attachments.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-gray-600" />
                            <span className="text-sm text-gray-900">{file.name}</span>
                            <span className="text-xs text-gray-500">
                              ({(file.size / 1024).toFixed(0)} KB)
                            </span>
                          </div>
                          <button
                            onClick={() => removeAttachment(index)}
                            className="p-1 hover:bg-gray-200 rounded"
                          >
                            <X className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteDialog(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleDeleteConfirm}
                  className="flex-1 bg-red-500 hover:bg-red-600"
                >
                  Delete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}