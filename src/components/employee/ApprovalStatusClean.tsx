import { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import {
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Search,
  Plane,
  Bus,
  Car,
  Hotel,
  Truck,
  MapPin,
  Calendar,
  User,
  MessageSquare,
  ArrowRight,
  RefreshCw,
  Bell,
  Eye,
  TrendingUp
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface ApprovalRequest {
  id: string;
  type: 'travel' | 'expense';
  service: string;
  from: string;
  to: string;
  date: string;
  amount: number;
  requestedDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'escalated';
  approver: string;
  approverRole: string;
  priority: 'low' | 'medium' | 'high';
  reason?: string;
  comments?: string[];
  estimatedApprovalTime?: string;
  lastUpdated: string;
}

const mockRequests: ApprovalRequest[] = [
  {
    id: 'APR-001',
    type: 'travel',
    service: 'Flight',
    from: 'Mumbai',
    to: 'Singapore',
    date: '2025-01-15',
    amount: 25000,
    requestedDate: '2024-12-24',
    status: 'pending',
    approver: 'Sarah Johnson',
    approverRole: 'Manager',
    priority: 'high',
    reason: 'Client meeting and conference attendance',
    estimatedApprovalTime: '2 hours',
    lastUpdated: '2024-12-24 10:30 AM',
  },
  {
    id: 'APR-002',
    type: 'travel',
    service: 'Hotel',
    from: 'Delhi',
    to: 'The Grand Plaza',
    date: '2025-01-10',
    amount: 8500,
    requestedDate: '2024-12-23',
    status: 'approved',
    approver: 'Michael Chen',
    approverRole: 'Director',
    priority: 'medium',
    reason: 'Business development visit',
    comments: ['Approved. Please book within budget guidelines.'],
    lastUpdated: '2024-12-23 03:45 PM',
  },
  {
    id: 'APR-003',
    type: 'expense',
    service: 'Cab',
    from: 'Airport',
    to: 'Client Office',
    date: '2024-12-20',
    amount: 650,
    requestedDate: '2024-12-21',
    status: 'rejected',
    approver: 'Sarah Johnson',
    approverRole: 'Manager',
    priority: 'low',
    reason: 'Travel reimbursement',
    comments: ['No pre-approval obtained for this expense. Please follow process next time.'],
    lastUpdated: '2024-12-22 11:00 AM',
  },
  {
    id: 'APR-004',
    type: 'travel',
    service: 'Bus',
    from: 'Bangalore',
    to: 'Mysore',
    date: '2025-01-05',
    amount: 1200,
    requestedDate: '2024-12-23',
    status: 'escalated',
    approver: 'Sarah Johnson',
    approverRole: 'Manager',
    priority: 'medium',
    reason: 'Site visit for project assessment',
    comments: ['Escalated to Director for final approval due to budget constraints.'],
    estimatedApprovalTime: '1 day',
    lastUpdated: '2024-12-23 04:20 PM',
  },
  {
    id: 'APR-005',
    type: 'expense',
    service: 'Hotel',
    from: 'Mumbai',
    to: 'Business Hotel',
    date: '2024-12-18',
    amount: 4500,
    requestedDate: '2024-12-19',
    status: 'approved',
    approver: 'Michael Chen',
    approverRole: 'Director',
    priority: 'high',
    reason: 'Emergency client meeting accommodation',
    comments: ['Approved under emergency provisions.'],
    lastUpdated: '2024-12-19 09:15 AM',
  },
];

export function ApprovalStatusClean() {
  const [requests, setRequests] = useState<ApprovalRequest[]>(mockRequests);
  const [selectedRequest, setSelectedRequest] = useState<ApprovalRequest | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());

  // Simulate real-time updates
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      setLastRefreshed(new Date());
      
      // Simulate random status updates
      setRequests(prevRequests => {
        const pendingRequests = prevRequests.filter(r => r.status === 'pending');
        if (pendingRequests.length > 0 && Math.random() > 0.7) {
          const randomRequest = pendingRequests[Math.floor(Math.random() * pendingRequests.length)];
          const newStatus = Math.random() > 0.5 ? 'approved' : 'escalated';
          
          toast.success(`Status Updated: ${randomRequest.id}`, {
            description: `Your request has been ${newStatus}`,
          });

          return prevRequests.map(r =>
            r.id === randomRequest.id
              ? {
                  ...r,
                  status: newStatus as any,
                  lastUpdated: new Date().toLocaleString(),
                  comments: newStatus === 'approved'
                    ? [...(r.comments || []), 'Approved automatically']
                    : [...(r.comments || []), 'Escalated for higher approval'],
                }
              : r
          );
        }
        return prevRequests;
      });
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [autoRefresh]);

  // Manual refresh
  const handleRefresh = () => {
    setLastRefreshed(new Date());
    toast.success('Refreshed approval status');
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-50 text-green-700 border-green-200';
      case 'rejected': return 'bg-red-50 text-red-700 border-red-200';
      case 'pending': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'escalated': return 'bg-orange-50 text-orange-700 border-orange-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return CheckCircle2;
      case 'rejected': return XCircle;
      case 'pending': return Clock;
      case 'escalated': return AlertCircle;
      default: return Clock;
    }
  };

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-50 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-gray-50 text-gray-700 border-gray-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  // Get service icon
  const getServiceIcon = (service: string) => {
    switch (service) {
      case 'Flight': return Plane;
      case 'Bus': return Bus;
      case 'Cab': return Car;
      case 'Hotel': return Hotel;
      case 'Truck': return Truck;
      default: return MapPin;
    }
  };

  // Get service color
  const getServiceColor = (service: string) => {
    switch (service) {
      case 'Flight': return { bg: 'bg-blue-100', text: 'text-blue-600' };
      case 'Bus': return { bg: 'bg-green-100', text: 'text-green-600' };
      case 'Cab': return { bg: 'bg-yellow-100', text: 'text-yellow-600' };
      case 'Hotel': return { bg: 'bg-purple-100', text: 'text-purple-600' };
      case 'Truck': return { bg: 'bg-orange-100', text: 'text-orange-600' };
      default: return { bg: 'bg-gray-100', text: 'text-gray-600' };
    }
  };

  // Filter requests
  const filteredRequests = requests.filter(request => {
    if (activeTab === 'pending' && request.status !== 'pending') return false;
    if (activeTab === 'approved' && request.status !== 'approved') return false;
    if (activeTab === 'rejected' && request.status !== 'rejected') return false;
    if (activeTab === 'escalated' && request.status !== 'escalated') return false;

    if (searchQuery && !request.id.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !request.service.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !request.from.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !request.to.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    return true;
  });

  const pendingCount = requests.filter(r => r.status === 'pending').length;
  const approvedCount = requests.filter(r => r.status === 'approved').length;
  const rejectedCount = requests.filter(r => r.status === 'rejected').length;
  const escalatedCount = requests.filter(r => r.status === 'escalated').length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Approval Status</h1>
              <p className="text-gray-600 mt-1">Track your pending and approved requests in real-time</p>
            </div>
            <div className="flex items-center gap-3">
              {/* Auto-refresh Toggle */}
              <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg">
                <input
                  type="checkbox"
                  id="auto-refresh"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  className="w-4 h-4"
                />
                <label htmlFor="auto-refresh" className="text-sm text-gray-700 cursor-pointer">
                  Auto-refresh
                </label>
              </div>
              <Button
                variant="outline"
                onClick={handleRefresh}
                className="border-gray-300"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>

          {/* Last Updated */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
            <Clock className="w-4 h-4" />
            <span>Last updated: {lastRefreshed.toLocaleTimeString()}</span>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-6 border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Pending</p>
                  <p className="text-3xl font-bold text-yellow-600">{pendingCount}</p>
                </div>
                <div className="w-14 h-14 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <Clock className="w-7 h-7 text-yellow-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6 border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Approved</p>
                  <p className="text-3xl font-bold text-green-600">{approvedCount}</p>
                </div>
                <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7 text-green-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6 border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Escalated</p>
                  <p className="text-3xl font-bold text-orange-600">{escalatedCount}</p>
                </div>
                <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center">
                  <AlertCircle className="w-7 h-7 text-orange-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6 border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Rejected</p>
                  <p className="text-3xl font-bold text-red-600">{rejectedCount}</p>
                </div>
                <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center">
                  <XCircle className="w-7 h-7 text-red-600" />
                </div>
              </div>
            </Card>
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search by ID, service, location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-50 border-gray-200"
            />
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-gray-100">
              <TabsTrigger value="all" className="data-[state=active]:bg-white">
                All ({requests.length})
              </TabsTrigger>
              <TabsTrigger value="pending" className="data-[state=active]:bg-white">
                Pending ({pendingCount})
              </TabsTrigger>
              <TabsTrigger value="approved" className="data-[state=active]:bg-white">
                Approved ({approvedCount})
              </TabsTrigger>
              <TabsTrigger value="escalated" className="data-[state=active]:bg-white">
                Escalated ({escalatedCount})
              </TabsTrigger>
              <TabsTrigger value="rejected" className="data-[state=active]:bg-white">
                Rejected ({rejectedCount})
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Requests List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredRequests.length === 0 ? (
          <Card className="p-12 text-center">
            <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No approval requests found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredRequests.map((request) => {
              const StatusIcon = getStatusIcon(request.status);
              const ServiceIcon = getServiceIcon(request.service);
              const serviceColor = getServiceColor(request.service);

              return (
                <Card
                  key={request.id}
                  className="p-6 border-gray-200 hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => {
                    setSelectedRequest(request);
                    setShowDetailsDialog(true);
                  }}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`w-14 h-14 ${serviceColor.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <ServiceIcon className={`w-7 h-7 ${serviceColor.text}`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-bold text-gray-900">{request.service} - {request.type === 'travel' ? 'Travel Request' : 'Expense Claim'}</h3>
                            <Badge variant="outline" className={getStatusColor(request.status)}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {request.status}
                            </Badge>
                            <Badge variant="outline" className={getPriorityColor(request.priority)}>
                              {request.priority} priority
                            </Badge>
                          </div>

                          {/* Route */}
                          <div className="flex items-center gap-2 text-gray-700 mb-3">
                            <MapPin className="w-4 h-4 text-blue-600" />
                            <span className="font-medium text-sm">{request.from}</span>
                            <ArrowRight className="w-4 h-4 text-gray-400" />
                            <span className="font-medium text-sm">{request.to}</span>
                          </div>

                          {/* Details Grid */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                            <div>
                              <p className="text-gray-600">Request ID</p>
                              <p className="font-semibold">{request.id}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Travel Date</p>
                              <p className="font-semibold">{request.date}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Approver</p>
                              <p className="font-semibold">{request.approver}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Amount</p>
                              <p className="font-semibold text-gray-900">₹{request.amount.toLocaleString()}</p>
                            </div>
                          </div>

                          {/* Estimated Time (for pending) */}
                          {request.status === 'pending' && request.estimatedApprovalTime && (
                            <div className="bg-blue-50 p-3 rounded-lg flex items-center gap-2">
                              <Clock className="w-4 h-4 text-blue-600" />
                              <span className="text-sm text-blue-700">
                                Estimated approval time: <span className="font-semibold">{request.estimatedApprovalTime}</span>
                              </span>
                            </div>
                          )}

                          {/* Latest Comment */}
                          {request.comments && request.comments.length > 0 && (
                            <div className="bg-gray-50 p-3 rounded-lg mt-3">
                              <div className="flex items-start gap-2">
                                <MessageSquare className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5" />
                                <div>
                                  <p className="text-xs text-gray-600 mb-1">Latest Comment:</p>
                                  <p className="text-sm text-gray-900">{request.comments[request.comments.length - 1]}</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                      </div>

                      {/* Last Updated */}
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>Last updated: {request.lastUpdated}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedRequest && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <div className={`w-12 h-12 ${getServiceColor(selectedRequest.service).bg} rounded-xl flex items-center justify-center`}>
                    {(() => {
                      const ServiceIcon = getServiceIcon(selectedRequest.service);
                      return <ServiceIcon className={`w-6 h-6 ${getServiceColor(selectedRequest.service).text}`} />;
                    })()}
                  </div>
                  <div>
                    <h2>{selectedRequest.service} Request</h2>
                    <p className="text-sm text-gray-600 font-normal">{selectedRequest.id}</p>
                  </div>
                </DialogTitle>
                <DialogDescription>
                  Complete approval request details and status timeline
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 py-4">
                {/* Status */}
                <div className="flex gap-2">
                  <Badge variant="outline" className={getStatusColor(selectedRequest.status)}>
                    {(() => {
                      const StatusIcon = getStatusIcon(selectedRequest.status);
                      return <StatusIcon className="w-3 h-3 mr-1" />;
                    })()}
                    {selectedRequest.status}
                  </Badge>
                  <Badge variant="outline" className={getPriorityColor(selectedRequest.priority)}>
                    {selectedRequest.priority} priority
                  </Badge>
                  <Badge variant="outline" className="border-gray-200">
                    {selectedRequest.type === 'travel' ? 'Travel Request' : 'Expense Claim'}
                  </Badge>
                </div>

                {/* Trip Details */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-3">Request Details</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">From</p>
                      <p className="font-semibold">{selectedRequest.from}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">To</p>
                      <p className="font-semibold">{selectedRequest.to}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Travel Date</p>
                      <p className="font-semibold">{selectedRequest.date}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Amount</p>
                      <p className="font-semibold text-gray-900">₹{selectedRequest.amount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Requested On</p>
                      <p className="font-semibold">{selectedRequest.requestedDate}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Last Updated</p>
                      <p className="font-semibold">{selectedRequest.lastUpdated}</p>
                    </div>
                  </div>
                </div>

                {/* Reason */}
                {selectedRequest.reason && (
                  <div>
                    <h3 className="font-semibold mb-2">Request Reason</h3>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedRequest.reason}</p>
                  </div>
                )}

                {/* Approver Info */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-3">Approver Information</h3>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-[#000035] rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{selectedRequest.approver}</p>
                      <p className="text-sm text-gray-600">{selectedRequest.approverRole}</p>
                    </div>
                  </div>
                </div>

                {/* Estimated Time */}
                {selectedRequest.status === 'pending' && selectedRequest.estimatedApprovalTime && (
                  <div className="bg-yellow-50 p-4 rounded-lg flex items-center gap-3">
                    <Clock className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900">Estimated Approval Time</p>
                      <p className="text-sm text-gray-700">{selectedRequest.estimatedApprovalTime}</p>
                    </div>
                  </div>
                )}

                {/* Comments */}
                {selectedRequest.comments && selectedRequest.comments.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3">Comments & Updates</h3>
                    <div className="space-y-3">
                      {selectedRequest.comments.map((comment, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-start gap-3">
                            <MessageSquare className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm text-gray-900">{comment}</p>
                              <p className="text-xs text-gray-500 mt-1">Comment #{index + 1}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
