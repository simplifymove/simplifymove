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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  MessageSquare,
  Plus,
  Search,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Send,
  User,
  Calendar,
  Tag,
  Paperclip,
  X
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface TicketMessage {
  id: string;
  sender: 'user' | 'support';
  senderName: string;
  message: string;
  timestamp: string;
  attachments?: string[];
}

interface SupportTicket {
  id: string;
  subject: string;
  category: 'booking' | 'payment' | 'refund' | 'technical' | 'other';
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  createdDate: string;
  lastUpdated: string;
  messages: TicketMessage[];
}

const mockTickets: SupportTicket[] = [
  {
    id: 'TICKET-001',
    subject: 'Flight booking payment failed but amount deducted',
    category: 'payment',
    priority: 'high',
    status: 'in_progress',
    createdDate: '2024-12-23',
    lastUpdated: '2024-12-24',
    messages: [
      {
        id: 'MSG-001',
        sender: 'user',
        senderName: 'Raghava Boyidi',
        message: 'I was trying to book a flight and the payment was deducted from my account but the booking failed. Please help resolve this.',
        timestamp: '2024-12-23 10:30 AM',
      },
      {
        id: 'MSG-002',
        sender: 'support',
        senderName: 'Support Team',
        message: 'We apologize for the inconvenience. We are looking into this issue. Please share your transaction ID so we can expedite the refund process.',
        timestamp: '2024-12-23 11:15 AM',
      },
      {
        id: 'MSG-003',
        sender: 'user',
        senderName: 'Raghava Boyidi',
        message: 'Transaction ID: TXN123456789',
        timestamp: '2024-12-23 11:30 AM',
      },
      {
        id: 'MSG-004',
        sender: 'support',
        senderName: 'Support Team',
        message: 'Thank you for providing the transaction ID. We have initiated the refund and it should reflect in your account within 5-7 business days.',
        timestamp: '2024-12-24 09:00 AM',
      },
    ],
  },
  {
    id: 'TICKET-002',
    subject: 'Need to change hotel booking dates',
    category: 'booking',
    priority: 'medium',
    status: 'open',
    createdDate: '2024-12-24',
    lastUpdated: '2024-12-24',
    messages: [
      {
        id: 'MSG-005',
        sender: 'user',
        senderName: 'Raghava Boyidi',
        message: 'I need to change my hotel booking dates from Dec 25-28 to Dec 26-29. Booking ID: HTL-5678. Is this possible?',
        timestamp: '2024-12-24 02:30 PM',
      },
    ],
  },
  {
    id: 'TICKET-003',
    subject: 'Request refund for cancelled cab ride',
    category: 'refund',
    priority: 'low',
    status: 'resolved',
    createdDate: '2024-12-20',
    lastUpdated: '2024-12-22',
    messages: [
      {
        id: 'MSG-006',
        sender: 'user',
        senderName: 'Raghava Boyidi',
        message: 'I cancelled my cab booking (CAB-1234) but haven\'t received the refund yet.',
        timestamp: '2024-12-20 03:00 PM',
      },
      {
        id: 'MSG-007',
        sender: 'support',
        senderName: 'Support Team',
        message: 'Your refund has been processed and credited to your wallet. Thank you for your patience.',
        timestamp: '2024-12-22 10:00 AM',
      },
    ],
  },
];

export function SupportTicketsClean() {
  const [tickets, setTickets] = useState<SupportTicket[]>(mockTickets);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [newMessage, setNewMessage] = useState('');

  // New Ticket Form
  const [newTicket, setNewTicket] = useState({
    subject: '',
    category: 'booking' as const,
    priority: 'medium' as const,
    message: '',
  });

  // Create new ticket
  const handleCreateTicket = () => {
    if (!newTicket.subject || !newTicket.message) {
      toast.error('Please fill in all required fields');
      return;
    }

    const ticket: SupportTicket = {
      id: `TICKET-${String(tickets.length + 1).padStart(3, '0')}`,
      subject: newTicket.subject,
      category: newTicket.category,
      priority: newTicket.priority,
      status: 'open',
      createdDate: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0],
      messages: [
        {
          id: `MSG-${Date.now()}`,
          sender: 'user',
          senderName: 'Raghava Boyidi',
          message: newTicket.message,
          timestamp: new Date().toLocaleString('en-US', { 
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          }),
        },
      ],
    };

    setTickets([ticket, ...tickets]);
    toast.success('Support ticket created successfully!');
    setNewTicket({ subject: '', category: 'booking', priority: 'medium', message: '' });
    setShowCreateDialog(false);
  };

  // Send reply message
  const handleSendReply = () => {
    if (!newMessage.trim() || !selectedTicket) {
      toast.error('Please enter a message');
      return;
    }

    const message: TicketMessage = {
      id: `MSG-${Date.now()}`,
      sender: 'user',
      senderName: 'Raghava Boyidi',
      message: newMessage,
      timestamp: new Date().toLocaleString('en-US', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }),
    };

    setTickets(tickets.map(ticket => 
      ticket.id === selectedTicket.id
        ? { ...ticket, messages: [...ticket.messages, message], lastUpdated: new Date().toISOString().split('T')[0] }
        : ticket
    ));

    setSelectedTicket({
      ...selectedTicket,
      messages: [...selectedTicket.messages, message],
    });

    setNewMessage('');
    toast.success('Message sent successfully!');
  };

  // Close ticket
  const handleCloseTicket = () => {
    if (!selectedTicket) return;

    setTickets(tickets.map(ticket =>
      ticket.id === selectedTicket.id
        ? { ...ticket, status: 'closed' as const }
        : ticket
    ));

    setSelectedTicket({ ...selectedTicket, status: 'closed' });
    toast.success('Ticket closed successfully!');
    setShowViewDialog(false);
    setSelectedTicket(null);
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'in_progress': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'resolved': return 'bg-green-50 text-green-700 border-green-200';
      case 'closed': return 'bg-gray-50 text-gray-700 border-gray-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return AlertCircle;
      case 'in_progress': return Clock;
      case 'resolved': return CheckCircle2;
      case 'closed': return XCircle;
      default: return AlertCircle;
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

  // Get category color
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'booking': return { bg: 'bg-blue-100', text: 'text-blue-600' };
      case 'payment': return { bg: 'bg-green-100', text: 'text-green-600' };
      case 'refund': return { bg: 'bg-purple-100', text: 'text-purple-600' };
      case 'technical': return { bg: 'bg-orange-100', text: 'text-orange-600' };
      case 'other': return { bg: 'bg-gray-100', text: 'text-gray-600' };
      default: return { bg: 'bg-gray-100', text: 'text-gray-600' };
    }
  };

  // Filter tickets
  const filteredTickets = tickets.filter(ticket => {
    if (activeTab === 'open' && ticket.status !== 'open') return false;
    if (activeTab === 'in_progress' && ticket.status !== 'in_progress') return false;
    if (activeTab === 'resolved' && ticket.status !== 'resolved') return false;
    if (activeTab === 'closed' && ticket.status !== 'closed') return false;

    if (searchQuery && !ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !ticket.id.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Support Tickets</h1>
              <p className="text-gray-600 mt-1">Get help with your bookings and account</p>
            </div>
            <Button
              onClick={() => setShowCreateDialog(true)}
              className="bg-[#000035] hover:bg-[#000055]"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Ticket
            </Button>
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search tickets by subject or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-50 border-gray-200"
            />
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-gray-100">
              <TabsTrigger value="all" className="data-[state=active]:bg-white">
                All ({tickets.length})
              </TabsTrigger>
              <TabsTrigger value="open" className="data-[state=active]:bg-white">
                Open ({tickets.filter(t => t.status === 'open').length})
              </TabsTrigger>
              <TabsTrigger value="in_progress" className="data-[state=active]:bg-white">
                In Progress ({tickets.filter(t => t.status === 'in_progress').length})
              </TabsTrigger>
              <TabsTrigger value="resolved" className="data-[state=active]:bg-white">
                Resolved ({tickets.filter(t => t.status === 'resolved').length})
              </TabsTrigger>
              <TabsTrigger value="closed" className="data-[state=active]:bg-white">
                Closed ({tickets.filter(t => t.status === 'closed').length})
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Tickets List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredTickets.length === 0 ? (
          <Card className="p-12 text-center">
            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No tickets found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search or filters</p>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create New Ticket
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredTickets.map((ticket) => {
              const StatusIcon = getStatusIcon(ticket.status);
              const categoryColor = getCategoryColor(ticket.category);

              return (
                <Card
                  key={ticket.id}
                  className="p-6 border-gray-200 hover:shadow-lg transition-all cursor-pointer group"
                  onClick={() => {
                    setSelectedTicket(ticket);
                    setShowViewDialog(true);
                  }}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`w-12 h-12 ${categoryColor.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <MessageSquare className={`w-6 h-6 ${categoryColor.text}`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">{ticket.subject}</h3>
                          <p className="text-sm text-gray-600 line-clamp-1">
                            {ticket.messages[ticket.messages.length - 1].message}
                          </p>
                        </div>
                        <Badge variant="outline" className={getStatusColor(ticket.status)}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {ticket.status.replace('_', ' ')}
                        </Badge>
                      </div>

                      {/* Meta */}
                      <div className="flex items-center gap-4 flex-wrap mt-3">
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Tag className="w-3 h-3" />
                          <span>{ticket.id}</span>
                        </div>
                        <Badge variant="outline" className="text-xs border-gray-200">
                          {ticket.category}
                        </Badge>
                        <Badge variant="outline" className={`text-xs ${getPriorityColor(ticket.priority)}`}>
                          {ticket.priority} priority
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Calendar className="w-3 h-3" />
                          <span>Updated {ticket.lastUpdated}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <MessageSquare className="w-3 h-3" />
                          <span>{ticket.messages.length} messages</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Create Ticket Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Create Support Ticket</DialogTitle>
            <DialogDescription>
              Describe your issue and our support team will help you
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="subject">Subject *</Label>
              <Input
                id="subject"
                placeholder="Brief description of your issue"
                value={newTicket.subject}
                onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                className="mt-2"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={newTicket.category}
                  onValueChange={(value: any) => setNewTicket({ ...newTicket, category: value })}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="booking">Booking Issue</SelectItem>
                    <SelectItem value="payment">Payment Issue</SelectItem>
                    <SelectItem value="refund">Refund Request</SelectItem>
                    <SelectItem value="technical">Technical Problem</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="priority">Priority *</Label>
                <Select
                  value={newTicket.priority}
                  onValueChange={(value: any) => setNewTicket({ ...newTicket, priority: value })}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="message">Message *</Label>
              <Textarea
                id="message"
                placeholder="Describe your issue in detail..."
                value={newTicket.message}
                onChange={(e) => setNewTicket({ ...newTicket, message: e.target.value })}
                className="mt-2"
                rows={5}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateTicket}
              className="bg-[#000035] hover:bg-[#000055]"
            >
              <Send className="w-4 h-4 mr-2" />
              Create Ticket
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Ticket Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="sm:max-w-3xl max-h-[80vh] overflow-y-auto">
          {selectedTicket && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <MessageSquare className="w-6 h-6 text-[#000035]" />
                  <div className="flex-1">
                    <h2>{selectedTicket.subject}</h2>
                    <p className="text-sm text-gray-600 font-normal">{selectedTicket.id}</p>
                  </div>
                </DialogTitle>
                <DialogDescription>
                  View conversation and respond to this ticket
                </DialogDescription>
              </DialogHeader>

              {/* Ticket Info */}
              <div className="flex gap-2 py-4 border-b">
                <Badge variant="outline" className={getStatusColor(selectedTicket.status)}>
                  {(() => {
                    const StatusIcon = getStatusIcon(selectedTicket.status);
                    return <StatusIcon className="w-3 h-3 mr-1" />;
                  })()}
                  {selectedTicket.status.replace('_', ' ')}
                </Badge>
                <Badge variant="outline" className="border-gray-200">
                  {selectedTicket.category}
                </Badge>
                <Badge variant="outline" className={getPriorityColor(selectedTicket.priority)}>
                  {selectedTicket.priority} priority
                </Badge>
              </div>

              {/* Messages */}
              <div className="space-y-4 py-4">
                {selectedTicket.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.sender === 'user' ? 'bg-[#000035]' : 'bg-blue-600'
                    }`}>
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div className={`flex-1 ${message.sender === 'user' ? 'text-right' : ''}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-sm text-gray-900">{message.senderName}</p>
                        <p className="text-xs text-gray-500">{message.timestamp}</p>
                      </div>
                      <div className={`inline-block p-4 rounded-lg ${
                        message.sender === 'user' 
                          ? 'bg-[#000035] text-white' 
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        <p className="text-sm">{message.message}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Reply Box */}
              {selectedTicket.status !== 'closed' && (
                <div className="border-t pt-4">
                  <Label htmlFor="reply">Reply to this ticket</Label>
                  <div className="flex gap-2 mt-2">
                    <Textarea
                      id="reply"
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1"
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button
                      onClick={handleSendReply}
                      className="bg-[#000035] hover:bg-[#000055]"
                      disabled={!newMessage.trim()}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Send Reply
                    </Button>
                    {selectedTicket.status !== 'closed' && (
                      <Button
                        variant="outline"
                        onClick={handleCloseTicket}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Close Ticket
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {selectedTicket.status === 'closed' && (
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-600">This ticket is closed. Create a new ticket if you need further assistance.</p>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
