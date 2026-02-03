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
  DollarSign,
  CreditCard,
  FileText,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Download,
  Search,
  Building2,
  TrendingUp,
  Eye
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface Subscription {
  id: string;
  companyId: string;
  companyName: string;
  plan: 'free' | 'basic' | 'pro' | 'enterprise';
  status: 'active' | 'expired' | 'cancelled' | 'trial';
  startDate: string;
  endDate: string;
  monthlyFee: number;
  billingCycle: 'monthly' | 'quarterly' | 'yearly';
  autoRenew: boolean;
  lastPaymentDate: string;
  nextPaymentDate: string;
}

interface Invoice {
  id: string;
  companyId: string;
  companyName: string;
  subscriptionId: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue' | 'failed';
  issueDate: string;
  dueDate: string;
  paidDate?: string;
  paymentMethod: string;
}

const mockSubscriptions: Subscription[] = [
  {
    id: 'SUB-001',
    companyId: 'COMP-001',
    companyName: 'Tech Innovations Ltd',
    plan: 'enterprise',
    status: 'active',
    startDate: '2024-01-15',
    endDate: '2025-01-15',
    monthlyFee: 50000,
    billingCycle: 'yearly',
    autoRenew: true,
    lastPaymentDate: '2024-01-15',
    nextPaymentDate: '2025-01-15',
  },
  {
    id: 'SUB-002',
    companyId: 'COMP-002',
    companyName: 'Global Marketing Solutions',
    plan: 'pro',
    status: 'active',
    startDate: '2024-03-20',
    endDate: '2025-03-20',
    monthlyFee: 15000,
    billingCycle: 'monthly',
    autoRenew: true,
    lastPaymentDate: '2024-12-20',
    nextPaymentDate: '2025-01-20',
  },
  {
    id: 'SUB-003',
    companyId: 'COMP-003',
    companyName: 'Retail Empire Inc',
    plan: 'basic',
    status: 'trial',
    startDate: '2024-12-01',
    endDate: '2024-12-31',
    monthlyFee: 5000,
    billingCycle: 'monthly',
    autoRenew: false,
    lastPaymentDate: '-',
    nextPaymentDate: '2025-01-01',
  },
  {
    id: 'SUB-004',
    companyId: 'COMP-004',
    companyName: 'Finance Pro Services',
    plan: 'pro',
    status: 'expired',
    startDate: '2024-02-10',
    endDate: '2024-11-10',
    monthlyFee: 15000,
    billingCycle: 'monthly',
    autoRenew: false,
    lastPaymentDate: '2024-10-10',
    nextPaymentDate: '-',
  },
  {
    id: 'SUB-005',
    companyId: 'COMP-005',
    companyName: 'Healthcare Plus',
    plan: 'enterprise',
    status: 'active',
    startDate: '2024-01-05',
    endDate: '2025-01-05',
    monthlyFee: 50000,
    billingCycle: 'yearly',
    autoRenew: true,
    lastPaymentDate: '2024-01-05',
    nextPaymentDate: '2025-01-05',
  },
];

const mockInvoices: Invoice[] = [
  {
    id: 'INV-2024-125',
    companyId: 'COMP-001',
    companyName: 'Tech Innovations Ltd',
    subscriptionId: 'SUB-001',
    amount: 50000,
    status: 'paid',
    issueDate: '2024-12-01',
    dueDate: '2024-12-15',
    paidDate: '2024-12-10',
    paymentMethod: 'Bank Transfer',
  },
  {
    id: 'INV-2024-126',
    companyId: 'COMP-002',
    companyName: 'Global Marketing Solutions',
    subscriptionId: 'SUB-002',
    amount: 15000,
    status: 'paid',
    issueDate: '2024-12-20',
    dueDate: '2024-12-30',
    paidDate: '2024-12-22',
    paymentMethod: 'Credit Card',
  },
  {
    id: 'INV-2024-127',
    companyId: 'COMP-005',
    companyName: 'Healthcare Plus',
    subscriptionId: 'SUB-005',
    amount: 50000,
    status: 'pending',
    issueDate: '2024-12-24',
    dueDate: '2025-01-05',
    paymentMethod: 'Bank Transfer',
  },
  {
    id: 'INV-2024-128',
    companyId: 'COMP-004',
    companyName: 'Finance Pro Services',
    subscriptionId: 'SUB-004',
    amount: 15000,
    status: 'overdue',
    issueDate: '2024-11-10',
    dueDate: '2024-11-20',
    paymentMethod: 'Credit Card',
  },
];

export function SubscriptionBillingClean() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(mockSubscriptions);
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showSubDetailsDialog, setShowSubDetailsDialog] = useState(false);
  const [showInvoiceDetailsDialog, setShowInvoiceDetailsDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('subscriptions');
  const [planFilter, setPlanFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Get plan color
  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'enterprise': return { bg: 'bg-purple-100', text: 'text-purple-600' };
      case 'pro': return { bg: 'bg-blue-100', text: 'text-blue-600' };
      case 'basic': return { bg: 'bg-green-100', text: 'text-green-600' };
      case 'free': return { bg: 'bg-gray-100', text: 'text-gray-600' };
      default: return { bg: 'bg-gray-100', text: 'text-gray-600' };
    }
  };

  // Get subscription status color
  const getSubStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-50 text-green-700 border-green-200';
      case 'trial': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'expired': return 'bg-red-50 text-red-700 border-red-200';
      case 'cancelled': return 'bg-gray-50 text-gray-700 border-gray-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  // Get invoice status color
  const getInvoiceStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-50 text-green-700 border-green-200';
      case 'pending': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'overdue': return 'bg-red-50 text-red-700 border-red-200';
      case 'failed': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  // Mark invoice as paid
  const handleMarkAsPaid = (invoice: Invoice) => {
    setInvoices(invoices.map(inv =>
      inv.id === invoice.id
        ? {
            ...inv,
            status: 'paid' as const,
            paidDate: new Date().toISOString().split('T')[0],
          }
        : inv
    ));
    toast.success('Invoice marked as paid');
  };

  // Send invoice reminder
  const handleSendReminder = (invoice: Invoice) => {
    toast.success(`Payment reminder sent to ${invoice.companyName}`);
  };

  // Download invoice
  const handleDownloadInvoice = (invoice: Invoice) => {
    toast.success(`Downloading invoice ${invoice.id}...`);
  };

  // Filter subscriptions
  const filteredSubscriptions = subscriptions.filter(sub => {
    if (planFilter !== 'all' && sub.plan !== planFilter) return false;
    if (statusFilter !== 'all' && sub.status !== statusFilter) return false;

    if (searchQuery && !sub.companyName.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !sub.id.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    return true;
  });

  // Filter invoices
  const filteredInvoices = invoices.filter(inv => {
    if (statusFilter !== 'all' && inv.status !== statusFilter) return false;

    if (searchQuery && !inv.companyName.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !inv.id.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    return true;
  });

  const activeSubCount = subscriptions.filter(s => s.status === 'active').length;
  const trialSubCount = subscriptions.filter(s => s.status === 'trial').length;
  const totalMRR = subscriptions.filter(s => s.status === 'active').reduce((sum, s) => sum + s.monthlyFee, 0);
  const paidInvoices = invoices.filter(i => i.status === 'paid').length;
  const overdueInvoices = invoices.filter(i => i.status === 'overdue').length;
  const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1800px] mx-auto px-6 lg:px-12 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Subscription & Billing</h1>
              <p className="text-gray-600 mt-1">Manage subscriptions, invoices, and payments</p>
            </div>
            <Button className="bg-[#000035] hover:bg-[#000055]">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-6 border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Monthly Recurring Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">₹{(totalMRR / 1000).toFixed(0)}K</p>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-600">+15%</span>
                  </div>
                </div>
                <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-7 h-7 text-green-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6 border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Active Subscriptions</p>
                  <p className="text-3xl font-bold text-green-600">{activeSubCount}</p>
                  <p className="text-xs text-gray-600 mt-2">{trialSubCount} on trial</p>
                </div>
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7 text-blue-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6 border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">₹{(totalRevenue / 100000).toFixed(1)}L</p>
                  <p className="text-xs text-gray-600 mt-2">{paidInvoices} invoices paid</p>
                </div>
                <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center">
                  <FileText className="w-7 h-7 text-purple-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6 border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Overdue Invoices</p>
                  <p className="text-3xl font-bold text-red-600">{overdueInvoices}</p>
                  <p className="text-xs text-gray-600 mt-2">Requires attention</p>
                </div>
                <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center">
                  <AlertCircle className="w-7 h-7 text-red-600" />
                </div>
              </div>
            </Card>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search by company name or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-50 border-gray-200"
              />
            </div>
            {activeTab === 'subscriptions' && (
              <select
                value={planFilter}
                onChange={(e) => setPlanFilter(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg bg-white text-sm"
              >
                <option value="all">All Plans</option>
                <option value="enterprise">Enterprise</option>
                <option value="pro">Pro</option>
                <option value="basic">Basic</option>
                <option value="free">Free</option>
              </select>
            )}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg bg-white text-sm"
            >
              <option value="all">All Status</option>
              {activeTab === 'subscriptions' ? (
                <>
                  <option value="active">Active</option>
                  <option value="trial">Trial</option>
                  <option value="expired">Expired</option>
                  <option value="cancelled">Cancelled</option>
                </>
              ) : (
                <>
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                  <option value="overdue">Overdue</option>
                  <option value="failed">Failed</option>
                </>
              )}
            </select>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-gray-100">
              <TabsTrigger value="subscriptions" className="data-[state=active]:bg-white">
                Subscriptions ({subscriptions.length})
              </TabsTrigger>
              <TabsTrigger value="invoices" className="data-[state=active]:bg-white">
                Invoices ({invoices.length})
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1800px] mx-auto px-6 lg:px-12 py-8">
        {activeTab === 'subscriptions' && (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {filteredSubscriptions.length === 0 ? (
              <div className="p-12 text-center">
                <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No subscriptions found</h3>
                <p className="text-gray-600">Try adjusting your search or filters</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Company
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Plan
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Start Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        End Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Monthly Fee
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Billing Cycle
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Auto Renew
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Next Payment
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredSubscriptions.map((sub) => {
                      const planColor = getPlanColor(sub.plan);
                      
                      return (
                        <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-semibold text-gray-900">{sub.companyName}</p>
                              <p className="text-xs text-gray-500">{sub.id} • {sub.companyId}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <Badge variant="outline" className={`${planColor.bg} ${planColor.text} border-0`}>
                              {sub.plan.toUpperCase()}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">
                            <Badge variant="outline" className={getSubStatusColor(sub.status)}>
                              {sub.status}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm text-gray-900">{sub.startDate}</p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm text-gray-900">{sub.endDate}</p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-semibold text-gray-900">₹{sub.monthlyFee.toLocaleString()}</p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm text-gray-700 capitalize">{sub.billingCycle}</p>
                          </td>
                          <td className="px-6 py-4">
                            {sub.autoRenew ? (
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Enabled
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                                <XCircle className="w-3 h-3 mr-1" />
                                Disabled
                              </Badge>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm text-gray-900">{sub.nextPaymentDate}</p>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedSubscription(sub);
                                setShowSubDetailsDialog(true);
                              }}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'invoices' && (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {filteredInvoices.length === 0 ? (
              <div className="p-12 text-center">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No invoices found</h3>
                <p className="text-gray-600">Try adjusting your search or filters</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Invoice ID
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Company
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Issue Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Due Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Paid Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Payment Method
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredInvoices.map((invoice) => (
                      <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-semibold text-gray-900">{invoice.id}</p>
                          <p className="text-xs text-gray-500">{invoice.subscriptionId}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-medium text-gray-900">{invoice.companyName}</p>
                          <p className="text-xs text-gray-500">{invoice.companyId}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-bold text-gray-900">₹{invoice.amount.toLocaleString()}</p>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant="outline" className={getInvoiceStatusColor(invoice.status)}>
                            {invoice.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-900">{invoice.issueDate}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-900">{invoice.dueDate}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-900">{invoice.paidDate || '-'}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-700">{invoice.paymentMethod}</p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2 justify-center">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedInvoice(invoice);
                                setShowInvoiceDetailsDialog(true);
                              }}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDownloadInvoice(invoice)}
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                            {invoice.status === 'pending' || invoice.status === 'overdue' ? (
                              <Button
                                size="sm"
                                onClick={() => handleMarkAsPaid(invoice)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                              </Button>
                            ) : null}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Subscription Details Dialog */}
      <Dialog open={showSubDetailsDialog} onOpenChange={setShowSubDetailsDialog}>
        <DialogContent className="sm:max-w-2xl">
          {selectedSubscription && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <div className={`w-12 h-12 ${getPlanColor(selectedSubscription.plan).bg} rounded-xl flex items-center justify-center`}>
                    <CreditCard className={`w-6 h-6 ${getPlanColor(selectedSubscription.plan).text}`} />
                  </div>
                  <div>
                    <h2>{selectedSubscription.companyName}</h2>
                    <p className="text-sm text-gray-600 font-normal">{selectedSubscription.id}</p>
                  </div>
                </DialogTitle>
                <DialogDescription>
                  Complete subscription details and billing information
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 py-4">
                <div className="flex gap-2">
                  <Badge variant="outline" className={getSubStatusColor(selectedSubscription.status)}>
                    {selectedSubscription.status}
                  </Badge>
                  <Badge variant="outline" className={`${getPlanColor(selectedSubscription.plan).bg} ${getPlanColor(selectedSubscription.plan).text} border-0`}>
                    {selectedSubscription.plan.toUpperCase()}
                  </Badge>
                </div>

                <Card className="p-4 bg-gray-50">
                  <h3 className="font-semibold mb-3">Subscription Details</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-600">Monthly Fee</p>
                      <p className="font-semibold">₹{selectedSubscription.monthlyFee.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Billing Cycle</p>
                      <p className="font-semibold">{selectedSubscription.billingCycle}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Start Date</p>
                      <p className="font-semibold">{selectedSubscription.startDate}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">End Date</p>
                      <p className="font-semibold">{selectedSubscription.endDate}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Last Payment</p>
                      <p className="font-semibold">{selectedSubscription.lastPaymentDate}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Next Payment</p>
                      <p className="font-semibold">{selectedSubscription.nextPaymentDate}</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 bg-blue-50 border-blue-200">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Auto-Renewal</span>
                    {selectedSubscription.autoRenew ? (
                      <Badge className="bg-green-600 text-white border-0">Enabled</Badge>
                    ) : (
                      <Badge className="bg-gray-600 text-white border-0">Disabled</Badge>
                    )}
                  </div>
                </Card>
              </div>

              <DialogFooter>
                <Button onClick={() => setShowSubDetailsDialog(false)}>Close</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Invoice Details Dialog */}
      <Dialog open={showInvoiceDetailsDialog} onOpenChange={setShowInvoiceDetailsDialog}>
        <DialogContent className="sm:max-w-2xl">
          {selectedInvoice && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h2>Invoice Details</h2>
                    <p className="text-sm text-gray-600 font-normal">{selectedInvoice.id}</p>
                  </div>
                </DialogTitle>
                <DialogDescription>
                  Complete invoice information and payment status
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 py-4">
                <div className="flex gap-2">
                  <Badge variant="outline" className={getInvoiceStatusColor(selectedInvoice.status)}>
                    {selectedInvoice.status}
                  </Badge>
                </div>

                <Card className="p-4 bg-gray-50">
                  <h3 className="font-semibold mb-3">Company Information</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 className="w-4 h-4 text-gray-600" />
                    <span className="font-semibold">{selectedInvoice.companyName}</span>
                  </div>
                  <p className="text-sm text-gray-600">{selectedInvoice.companyId}</p>
                </Card>

                <Card className="p-4 bg-gray-50">
                  <h3 className="font-semibold mb-3">Invoice Details</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-600">Amount</p>
                      <p className="text-xl font-bold text-gray-900">₹{selectedInvoice.amount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Payment Method</p>
                      <p className="font-semibold">{selectedInvoice.paymentMethod}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Issue Date</p>
                      <p className="font-semibold">{selectedInvoice.issueDate}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Due Date</p>
                      <p className="font-semibold">{selectedInvoice.dueDate}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Paid Date</p>
                      <p className="font-semibold">{selectedInvoice.paidDate || 'Not paid yet'}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Subscription ID</p>
                      <p className="font-semibold">{selectedInvoice.subscriptionId}</p>
                    </div>
                  </div>
                </Card>
              </div>

              <DialogFooter>
                <Button onClick={() => setShowInvoiceDetailsDialog(false)}>Close</Button>
                <Button className="bg-[#000035] hover:bg-[#000055]" onClick={() => handleDownloadInvoice(selectedInvoice)}>
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}