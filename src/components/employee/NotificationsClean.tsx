import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
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
  Bell,
  BellOff,
  Check,
  CheckCheck,
  Trash2,
  Search,
  Filter,
  Plane,
  Car,
  Bus,
  Hotel,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock,
  Info,
  TrendingUp,
  Wallet,
  Calendar,
  FileText,
  Settings,
  X
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface Notification {
  id: string;
  type: 'booking' | 'payment' | 'approval' | 'system' | 'expense' | 'wallet';
  title: string;
  message: string;
  date: string;
  time: string;
  read: boolean;
  priority: 'high' | 'medium' | 'low';
  actionUrl?: string;
}

const mockNotifications: Notification[] = [
  {
    id: 'N001',
    type: 'booking',
    title: 'Flight Booking Confirmed',
    message: 'Your flight from Mumbai to Delhi (Flight AI-401) has been confirmed for Dec 25, 2024.',
    date: '2024-12-24',
    time: '10:30 AM',
    read: false,
    priority: 'high',
  },
  {
    id: 'N002',
    type: 'approval',
    title: 'Travel Request Approved',
    message: 'Your travel request for client meeting in Bangalore has been approved by Sarah Johnson.',
    date: '2024-12-24',
    time: '09:15 AM',
    read: false,
    priority: 'high',
  },
  {
    id: 'N003',
    type: 'wallet',
    title: 'Wallet Credited',
    message: '₹10,000 has been credited to your Business Wallet by your company admin.',
    date: '2024-12-23',
    time: '04:45 PM',
    read: false,
    priority: 'medium',
  },
  {
    id: 'N004',
    type: 'expense',
    title: 'Expense Claim Approved',
    message: 'Your expense claim EXP-2024-001 for ₹4,500 has been approved and will be reimbursed shortly.',
    date: '2024-12-23',
    time: '02:30 PM',
    read: true,
    priority: 'medium',
  },
  {
    id: 'N005',
    type: 'booking',
    title: 'Hotel Check-in Reminder',
    message: 'Reminder: Your hotel check-in at Taj Palace is scheduled for tomorrow at 2:00 PM.',
    date: '2024-12-23',
    time: '11:00 AM',
    read: true,
    priority: 'medium',
  },
  {
    id: 'N006',
    type: 'payment',
    title: 'Payment Successful',
    message: 'Your payment of ₹6,800 for Hotel Booking #HTL-5678 was successful.',
    date: '2024-12-22',
    time: '06:20 PM',
    read: true,
    priority: 'low',
  },
  {
    id: 'N007',
    type: 'system',
    title: 'Policy Update',
    message: 'Your company travel policy has been updated. Please review the new guidelines.',
    date: '2024-12-22',
    time: '10:00 AM',
    read: true,
    priority: 'medium',
  },
  {
    id: 'N008',
    type: 'approval',
    title: 'Expense Claim Rejected',
    message: 'Your expense claim EXP-2024-004 has been rejected. Reason: Missing receipt.',
    date: '2024-12-21',
    time: '03:45 PM',
    read: true,
    priority: 'high',
  },
];

export function NotificationsClean() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [notificationToDelete, setNotificationToDelete] = useState<Notification | null>(null);

  // Mark as read
  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
    toast.success('Notification marked as read');
  };

  // Mark all as read
  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    toast.success('All notifications marked as read');
  };

  // Delete notification
  const handleDeleteClick = (notification: Notification) => {
    setNotificationToDelete(notification);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = () => {
    if (notificationToDelete) {
      setNotifications(notifications.filter(n => n.id !== notificationToDelete.id));
      toast.success('Notification deleted');
      setShowDeleteDialog(false);
      setNotificationToDelete(null);
    }
  };

  // Delete all read notifications
  const handleDeleteAllRead = () => {
    const readCount = notifications.filter(n => n.read).length;
    if (readCount === 0) {
      toast.error('No read notifications to delete');
      return;
    }
    setNotifications(notifications.filter(n => !n.read));
    toast.success(`${readCount} read notifications deleted`);
  };

  // Get icon for notification type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'booking': return Plane;
      case 'payment': return Wallet;
      case 'approval': return CheckCircle2;
      case 'system': return Settings;
      case 'expense': return FileText;
      case 'wallet': return Wallet;
      default: return Bell;
    }
  };

  // Get color for notification type
  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'booking': return { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-200' };
      case 'payment': return { bg: 'bg-green-100', text: 'text-green-600', border: 'border-green-200' };
      case 'approval': return { bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-200' };
      case 'system': return { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-200' };
      case 'expense': return { bg: 'bg-orange-100', text: 'text-orange-600', border: 'border-orange-200' };
      case 'wallet': return { bg: 'bg-yellow-100', text: 'text-yellow-600', border: 'border-yellow-200' };
      default: return { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-200' };
    }
  };

  // Get priority badge color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-50 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-gray-50 text-gray-700 border-gray-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  // Filter notifications
  const filteredNotifications = notifications.filter(notification => {
    // Tab filter
    if (activeTab === 'unread' && notification.read) return false;
    if (activeTab === 'read' && !notification.read) return false;

    // Search filter
    if (searchQuery && !notification.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !notification.message.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Type filter
    if (filterType !== 'all' && notification.type !== filterType) return false;

    // Priority filter
    if (filterPriority !== 'all' && notification.priority !== filterPriority) return false;

    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
                {unreadCount > 0 && (
                  <Badge className="bg-red-600 text-white border-0">
                    {unreadCount} new
                  </Badge>
                )}
              </div>
              <p className="text-gray-600 mt-1">Stay updated with your latest activities</p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleDeleteAllRead}
                className="border-gray-300"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear Read
              </Button>
              <Button
                onClick={handleMarkAllAsRead}
                className="bg-[#000035] hover:bg-[#000055]"
              >
                <CheckCheck className="w-4 h-4 mr-2" />
                Mark All Read
              </Button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search notifications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-50 border-gray-200"
              />
            </div>
            <div className="flex gap-3">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg bg-white text-sm"
              >
                <option value="all">All Types</option>
                <option value="booking">Booking</option>
                <option value="payment">Payment</option>
                <option value="approval">Approval</option>
                <option value="expense">Expense</option>
                <option value="wallet">Wallet</option>
                <option value="system">System</option>
              </select>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg bg-white text-sm"
              >
                <option value="all">All Priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
            <TabsList className="bg-gray-100">
              <TabsTrigger value="all" className="data-[state=active]:bg-white">
                All ({notifications.length})
              </TabsTrigger>
              <TabsTrigger value="unread" className="data-[state=active]:bg-white">
                Unread ({unreadCount})
              </TabsTrigger>
              <TabsTrigger value="read" className="data-[state=active]:bg-white">
                Read ({notifications.length - unreadCount})
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredNotifications.length === 0 ? (
          <Card className="p-12 text-center">
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No notifications found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => {
              const Icon = getNotificationIcon(notification.type);
              const colors = getNotificationColor(notification.type);

              return (
                <Card
                  key={notification.id}
                  className={`p-5 border-2 transition-all group cursor-pointer ${
                    notification.read 
                      ? 'border-gray-200 bg-white' 
                      : 'border-blue-200 bg-blue-50/30'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-6 h-6 ${colors.text}`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 leading-relaxed">{notification.message}</p>
                        </div>
                        
                        {/* Actions */}
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleMarkAsRead(notification.id)}
                              title="Mark as read"
                            >
                              <Check className="w-4 h-4 text-green-600" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteClick(notification)}
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      </div>

                      {/* Meta Info */}
                      <div className="flex items-center gap-4 flex-wrap mt-3">
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          <span>{notification.date} at {notification.time}</span>
                        </div>
                        <Badge variant="outline" className={`text-xs ${colors.border} ${colors.text}`}>
                          {notification.type}
                        </Badge>
                        <Badge variant="outline" className={`text-xs ${getPriorityColor(notification.priority)}`}>
                          {notification.priority} priority
                        </Badge>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Notification</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this notification? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {notificationToDelete && (
            <Card className="p-4 bg-gray-50">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">{notificationToDelete.title}</p>
                  <p className="text-sm text-gray-600 mt-1">{notificationToDelete.message}</p>
                </div>
              </div>
            </Card>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
