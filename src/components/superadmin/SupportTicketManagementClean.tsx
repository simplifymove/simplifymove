import { useState } from 'react';
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
  MessageSquare,
  Search,
  Eye,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  Send,
  Building2,
  User,
  Calendar
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface SupportTicket {
  id: string;
  subject: string;
  description: string;
  category: 'technical' | 'billing' | 'general' | 'feature_request' | 'bug_report';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  companyId: string;
  companyName: string;
  createdBy: string;
  createdByEmail: string;
  assignedTo?: string;
  createdDate: string;
  updatedDate: string;
  messages: TicketMessage[];
}

interface TicketMessage {
  id: string;
  sender: string;
  role: 'user' | 'support';
  message: string;
  timestamp: string;
}

const mockTickets: SupportTicket[] = [
  {
    id: 'TICKET-001',
    subject: 'Payment Gateway Integration Issue',
    description: 'We are facing issues with Razorpay integration. Payments are failing intermittently with error code 502.',
    category: 'technical',
    priority: 'urgent',
    status: 'open',
    companyId: 'COMP-001',
    companyName: 'Tech Innovations Ltd',
    createdBy: 'Rajesh Kumar',
    createdByEmail: 'rajesh@techinnovations.com',
    assignedTo: 'Support Team',
    createdDate: '2024-12-24',
    updatedDate: '2024-12-24',
    messages: [
      {
        id: 'MSG-001',
        sender: 'Rajesh Kumar',
        role: 'user',
        message: 'We are facing issues with Razorpay integration. Payments are failing intermittently with error code 502.',
        timestamp: '2024-12-24 10:30 AM',
      },
    ],
  },
  {
    id: 'TICKET-002',
    subject: 'Incorrect Invoice Amount',
    description: 'Last month\'s invoice shows ₹75,000 but we should only be charged ₹50,000 based on our Enterprise plan.',
    category: 'billing',
    priority: 'high',
    status: 'in_progress',
    companyId: 'COMP-005',
    companyName: 'Healthcare Plus',
    createdBy: 'Priya Sharma',
    createdByEmail: 'priya@healthcareplus.com',
    assignedTo: 'Billing Team',
    createdDate: '2024-12-23',
    updatedDate: '2024-12-24',
    messages: [
      {
        id: 'MSG-002',
        sender: 'Priya Sharma',
        role: 'user',
        message: 'Last month\'s invoice shows ₹75,000 but we should only be charged ₹50,000 based on our Enterprise plan.',
        timestamp: '2024-12-23 03:15 PM',
      },
      {
        id: 'MSG-003',
        sender: 'Support Team',
        role: 'support',
        message: 'Thank you for reaching out. We are reviewing your invoice and subscription details. Will get back to you within 24 hours.',
        timestamp: '2024-12-23 04:30 PM',
      },
    ],
  },
  {
    id: 'TICKET-003',
    subject: 'Request for Custom Reports Feature',
    description: 'We would like the ability to create custom reports with specific filters and export formats.',
    category: 'feature_request',
    priority: 'medium',
    status: 'open',
    companyId: 'COMP-002',
    companyName: 'Global Marketing Solutions',
    createdBy: 'Amit Patel',
    createdByEmail: 'amit@globalmarketing.com',
    createdDate: '2024-12-22',
    updatedDate: '2024-12-22',
    messages: [
      {
        id: 'MSG-004',
        sender: 'Amit Patel',
        role: 'user',
        message: 'We would like the ability to create custom reports with specific filters and export formats.',
        timestamp: '2024-12-22 11:00 AM',
      },
    ],
  },
  {
    id: 'TICKET-004',
    subject: 'Dashboard Not Loading',
    description: 'The analytics dashboard is showing a blank screen. Tried clearing cache but issue persists.',
    category: 'bug_report',
    priority: 'high',
    status: 'resolved',
    companyId: 'COMP-003',
    companyName: 'Retail Empire Inc',
    createdBy: 'Sneha Reddy',
    createdByEmail: 'sneha@retailempire.com',
    assignedTo: 'Tech Support',
    createdDate: '2024-12-21',
    updatedDate: '2024-12-22',
    messages: [
      {
        id: 'MSG-005',
        sender: 'Sneha Reddy',
        role: 'user',
        message: 'The analytics dashboard is showing a blank screen. Tried clearing cache but issue persists.',
        timestamp: '2024-12-21 09:30 AM',
      },
      {
        id: 'MSG-006',
        sender: 'Tech Support',
        role: 'support',
        message: 'We identified a caching issue and deployed a fix. Please try refreshing your dashboard now.',
        timestamp: '2024-12-21 02:45 PM',
      },
      {
        id: 'MSG-007',
        sender: 'Sneha Reddy',
        role: 'user',
        message: 'Dashboard is working perfectly now. Thank you for the quick resolution!',
        timestamp: '2024-12-22 10:15 AM',
      },
    ],
  },
  {
    id: 'TICKET-005',
    subject: 'How to Add New Employees',
    description: 'Need guidance on the process to add new employees and assign them roles.',
    category: 'general',
    priority: 'low',
    status: 'closed',
    companyId: 'COMP-004',
    companyName: 'Finance Pro Services',
    createdBy: 'Vikram Singh',
    createdByEmail: 'vikram@financepro.com',
    assignedTo: 'Customer Success',
    createdDate: '2024-12-20',
    updatedDate: '2024-12-21',
    messages: [
      {
        id: 'MSG-008',
        sender: 'Vikram Singh',
        role: 'user',
        message: 'Need guidance on the process to add new employees and assign them roles.',
        timestamp: '2024-12-20 02:00 PM',
      },
      {
        id: 'MSG-009',
        sender: 'Customer Success',
        role: 'support',
        message: 'You can add employees from Company Settings > Employee Management. I\'ve sent you a detailed guide via email.',
        timestamp: '2024-12-20 03:30 PM',
      },
      {
        id: 'MSG-010',
        sender: 'Vikram Singh',
        role: 'user',
        message: 'Got it, thank you! Closing this ticket.',
        timestamp: '2024-12-21 09:00 AM',
      },
    ],
  },
];

export function SupportTicketManagementClean() {
  const [tickets, setTickets] = useState<SupportTicket[]>(mockTickets);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [replyMessage, setReplyMessage] = useState('');

  // Get category color
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'technical': return { bg: 'bg-blue-100', text: 'text-blue-600' };
      case 'billing': return { bg: 'bg-green-100', text: 'text-green-600' };
      case 'general': return { bg: 'bg-gray-100', text: 'text-gray-600' };
      case 'feature_request': return { bg: 'bg-purple-100', text: 'text-purple-600' };
      case 'bug_report': return { bg: 'bg-red-100', text: 'text-red-600' };
      default: return { bg: 'bg-gray-100', text: 'text-gray-600' };
    }
  };

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-50 text-red-700 border-red-200';
      case 'high': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'medium': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-blue-50 text-blue-700 border-blue-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'in_progress': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'resolved': return 'bg-green-50 text-green-700 border-green-200';
      case 'closed': return 'bg-gray-50 text-gray-700 border-gray-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  // Update ticket status
  const handleUpdateStatus = (ticket: SupportTicket, newStatus: SupportTicket['status']) => {
    setTickets(tickets.map(t => t.id === ticket.id
      ? { ...t, status: newStatus, updatedDate: new Date().toISOString().split('T')[0] }
      : t
    ));
    if (selectedTicket?.id === ticket.id) {
      setSelectedTicket({ ...ticket, status: newStatus });
    }
    toast.success(`Ticket status updated to ${newStatus}`);
  };

  // Send reply
  const handleSendReply = () => {
    if (!selectedTicket || !replyMessage.trim()) return;

    const newMessage: TicketMessage = {
      id: `MSG-${Date.now()}`,
      sender: 'Support Team',
      role: 'support',
      message: replyMessage,
      timestamp: new Date().toLocaleString('en-IN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }),
    };

    const updatedTicket = {
      ...selectedTicket,
      messages: [...selectedTicket.messages, newMessage],
      updatedDate: new Date().toISOString().split('T')[0],
    };

    setTickets(tickets.map(t => t.id === selectedTicket.id ? updatedTicket : t));
    setSelectedTicket(updatedTicket);
    setReplyMessage('');
    toast.success('Reply sent successfully');
  };

  // Filter tickets
  const filteredTickets = tickets.filter(ticket => {
    if (activeTab !== 'all' && ticket.status !== activeTab) return false;
    if (categoryFilter !== 'all' && ticket.category !== categoryFilter) return false;
    if (priorityFilter !== 'all' && ticket.priority !== priorityFilter) return false;

    if (searchQuery && !ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !ticket.companyName.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !ticket.createdBy.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    return true;
  });

  const openTickets = tickets.filter(t => t.status === 'open').length;
  const inProgressTickets = tickets.filter(t => t.status === 'in_progress').length;
  const resolvedTickets = tickets.filter(t => t.status === 'resolved').length;
  const urgentTickets = tickets.filter(t => t.priority === 'urgent').length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1800px] mx-auto px-6 lg:px-12 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Support Ticket Management</h1>
              <p className="text-gray-600 mt-1">Manage and resolve customer support tickets</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-6 border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Open Tickets</p>
                  <p className="text-3xl font-bold text-yellow-600">{openTickets}</p>
                </div>
                <div className="w-14 h-14 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <Clock className="w-7 h-7 text-yellow-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6 border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">In Progress</p>
                  <p className="text-3xl font-bold text-blue-600">{inProgressTickets}</p>
                </div>
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                  <MessageSquare className="w-7 h-7 text-blue-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6 border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Resolved</p>
                  <p className="text-3xl font-bold text-green-600">{resolvedTickets}</p>
                </div>
                <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7 text-green-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6 border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Urgent</p>
                  <p className="text-3xl font-bold text-red-600">{urgentTickets}</p>
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
                placeholder="Search by subject, company, user, or ticket ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-50 border-gray-200"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg bg-white text-sm"
            >
              <option value="all">All Categories</option>
              <option value="technical">Technical</option>
              <option value="billing">Billing</option>
              <option value="general">General</option>
              <option value="feature_request">Feature Request</option>
              <option value="bug_report">Bug Report</option>
            </select>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg bg-white text-sm"
            >
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-gray-100">
              <TabsTrigger value="all" className="data-[state=active]:bg-white">
                All ({tickets.length})
              </TabsTrigger>
              <TabsTrigger value="open" className="data-[state=active]:bg-white">
                Open ({openTickets})
              </TabsTrigger>
              <TabsTrigger value="in_progress" className="data-[state=active]:bg-white">
                In Progress ({inProgressTickets})
              </TabsTrigger>
              <TabsTrigger value="resolved" className="data-[state=active]:bg-white">
                Resolved ({resolvedTickets})
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Tickets List */}
      <div className="max-w-[1800px] mx-auto px-6 lg:px-12 py-8">
        {filteredTickets.length === 0 ? (
          <Card className="p-12 text-center">
            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No tickets found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredTickets.map((ticket) => {
              const categoryColor = getCategoryColor(ticket.category);

              return (
                <Card key={ticket.id} className="p-6 border-gray-200 hover:shadow-lg transition-all">
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 ${categoryColor.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <MessageSquare className={`w-7 h-7 ${categoryColor.text}`} />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-bold text-gray-900">{ticket.subject}</h3>
                            <Badge variant="outline" className={getStatusColor(ticket.status)}>
                              {ticket.status.replace('_', ' ')}
                            </Badge>
                            <Badge variant="outline" className={getPriorityColor(ticket.priority)}>
                              {ticket.priority}
                            </Badge>
                            <Badge variant="outline" className={`${categoryColor.bg} ${categoryColor.text} border-0`}>
                              {ticket.category.replace('_', ' ')}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{ticket.description}</p>
                        </div>
                      </div>

                      {/* Metadata */}
                      <div className="grid grid-cols-4 gap-4 mb-4">
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <p className="text-xs text-gray-600 mb-1">Company</p>
                          <p className="text-sm font-semibold text-gray-900 truncate">{ticket.companyName}</p>
                        </div>
                        <div className="bg-green-50 p-3 rounded-lg">
                          <p className="text-xs text-gray-600 mb-1">Created By</p>
                          <p className="text-sm font-semibold text-gray-900 truncate">{ticket.createdBy}</p>
                        </div>
                        <div className="bg-purple-50 p-3 rounded-lg">
                          <p className="text-xs text-gray-600 mb-1">Created</p>
                          <p className="text-sm font-semibold text-gray-900">{ticket.createdDate}</p>
                        </div>
                        <div className="bg-orange-50 p-3 rounded-lg">
                          <p className="text-xs text-gray-600 mb-1">Messages</p>
                          <p className="text-sm font-semibold text-gray-900">{ticket.messages.length}</p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedTicket(ticket);
                            setShowDetailsDialog(true);
                          }}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                        {ticket.status === 'open' && (
                          <Button
                            size="sm"
                            onClick={() => handleUpdateStatus(ticket, 'in_progress')}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            Start Working
                          </Button>
                        )}
                        {ticket.status === 'in_progress' && (
                          <Button
                            size="sm"
                            onClick={() => handleUpdateStatus(ticket, 'resolved')}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            Mark Resolved
                          </Button>
                        )}
                        {ticket.status === 'resolved' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUpdateStatus(ticket, 'closed')}
                          >
                            Close Ticket
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Ticket Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="sm:max-w-3xl max-h-[80vh] overflow-y-auto">
          {selectedTicket && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <div className={`w-12 h-12 ${getCategoryColor(selectedTicket.category).bg} rounded-xl flex items-center justify-center`}>
                    <MessageSquare className={`w-6 h-6 ${getCategoryColor(selectedTicket.category).text}`} />
                  </div>
                  <div>
                    <h2>{selectedTicket.subject}</h2>
                    <p className="text-sm text-gray-600 font-normal">{selectedTicket.id}</p>
                  </div>
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6 py-4">
                {/* Status Badges */}
                <div className="flex gap-2">
                  <Badge variant="outline" className={getStatusColor(selectedTicket.status)}>
                    {selectedTicket.status.replace('_', ' ')}
                  </Badge>
                  <Badge variant="outline" className={getPriorityColor(selectedTicket.priority)}>
                    {selectedTicket.priority}
                  </Badge>
                  <Badge variant="outline" className={`${getCategoryColor(selectedTicket.category).bg} ${getCategoryColor(selectedTicket.category).text} border-0`}>
                    {selectedTicket.category.replace('_', ' ')}
                  </Badge>
                </div>

                {/* Ticket Info */}
                <Card className="p-4 bg-gray-50">
                  <h3 className="font-semibold mb-3">Ticket Information</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-600">Company</p>
                      <p className="font-semibold">{selectedTicket.companyName}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Company ID</p>
                      <p className="font-semibold">{selectedTicket.companyId}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Created By</p>
                      <p className="font-semibold">{selectedTicket.createdBy}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Email</p>
                      <p className="font-semibold text-xs">{selectedTicket.createdByEmail}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Created Date</p>
                      <p className="font-semibold">{selectedTicket.createdDate}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Last Updated</p>
                      <p className="font-semibold">{selectedTicket.updatedDate}</p>
                    </div>
                  </div>
                </Card>

                {/* Description */}
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{selectedTicket.description}</p>
                </div>

                {/* Messages */}
                <div>
                  <h3 className="font-semibold mb-3">Conversation ({selectedTicket.messages.length})</h3>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {selectedTicket.messages.map((message) => (
                      <div
                        key={message.id}
                        className={`p-4 rounded-lg ${
                          message.role === 'support'
                            ? 'bg-blue-50 border-l-4 border-blue-600'
                            : 'bg-gray-50 border-l-4 border-gray-300'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 ${message.role === 'support' ? 'bg-blue-600' : 'bg-gray-600'} rounded-full flex items-center justify-center`}>
                              <span className="text-white text-xs font-bold">
                                {message.sender.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{message.sender}</p>
                              <p className="text-xs text-gray-600">{message.role === 'support' ? 'Support Team' : 'Customer'}</p>
                            </div>
                          </div>
                          <p className="text-xs text-gray-600">{message.timestamp}</p>
                        </div>
                        <p className="text-gray-700">{message.message}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reply Section */}
                {selectedTicket.status !== 'closed' && (
                  <div>
                    <h3 className="font-semibold mb-2">Send Reply</h3>
                    <Textarea
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      placeholder="Type your response here..."
                      rows={4}
                      className="mb-3"
                    />
                    <Button
                      onClick={handleSendReply}
                      className="bg-[#000035] hover:bg-[#000055]"
                      disabled={!replyMessage.trim()}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Send Reply
                    </Button>
                  </div>
                )}
              </div>

              <DialogFooter>
                <div className="flex gap-2 w-full justify-between">
                  <div className="flex gap-2">
                    {selectedTicket.status === 'open' && (
                      <Button
                        onClick={() => {
                          handleUpdateStatus(selectedTicket, 'in_progress');
                        }}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Start Working
                      </Button>
                    )}
                    {selectedTicket.status === 'in_progress' && (
                      <Button
                        onClick={() => {
                          handleUpdateStatus(selectedTicket, 'resolved');
                        }}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Mark Resolved
                      </Button>
                    )}
                    {selectedTicket.status === 'resolved' && (
                      <Button
                        onClick={() => {
                          handleUpdateStatus(selectedTicket, 'closed');
                          setShowDetailsDialog(false);
                        }}
                      >
                        Close Ticket
                      </Button>
                    )}
                  </div>
                  <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
                    Close
                  </Button>
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}