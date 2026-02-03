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
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { 
  Search,
  Calendar,
  MapPin,
  Clock,
  Star,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Plane,
  Bus,
  Car,
  Hotel,
  Truck,
  Package as PackageIcon,
  ArrowRight,
  Download,
  Eye,
  Filter,
  ChevronRight,
  FileText,
  X as XIcon
} from 'lucide-react';
import { toast } from 'sonner';

const orders = [
  {
    id: 'ORD-001',
    service: 'Flight',
    tripType: 'Business',
    date: '2025-12-28',
    cost: 4500,
    status: 'Confirmed',
    from: 'Mumbai',
    to: 'Delhi',
    vendor: 'IndiGo',
    bookingDate: '2025-12-10',
    flightNo: '6E-234',
    departureTime: '10:30 AM',
    arrivalTime: '12:45 PM',
  },
  {
    id: 'ORD-002',
    service: 'Hotel',
    tripType: 'Business',
    date: '2025-12-25',
    cost: 3500,
    status: 'Confirmed',
    from: 'Delhi',
    to: 'The Grand Plaza',
    vendor: 'Agoda',
    bookingDate: '2025-12-10',
    nights: 3,
    roomType: 'Deluxe Room',
  },
  {
    id: 'ORD-003',
    service: 'Truck',
    tripType: 'Business',
    date: '2025-12-22',
    cost: 850,
    status: 'Pending Approval',
    from: 'Warehouse A',
    to: 'Client Site',
    vendor: 'Porter',
    bookingDate: '2025-12-09',
  },
  {
    id: 'ORD-004',
    service: 'Cab',
    tripType: 'Business',
    date: '2025-12-15',
    cost: 285,
    status: 'Completed',
    from: 'Office',
    to: 'Airport',
    vendor: 'Uber',
    bookingDate: '2025-12-15',
    rating: 5
  },
  {
    id: 'ORD-005',
    service: 'Bus',
    tripType: 'Business',
    date: '2025-12-10',
    cost: 850,
    status: 'Completed',
    from: 'Bangalore',
    to: 'Mumbai',
    vendor: 'RedBus',
    bookingDate: '2025-11-28',
    busType: 'AC Sleeper',
    rating: 4
  },
  {
    id: 'ORD-006',
    service: 'Flight',
    tripType: 'Personal',
    date: '2025-11-28',
    cost: 5200,
    status: 'Cancelled',
    from: 'Delhi',
    to: 'Goa',
    vendor: 'Air India',
    bookingDate: '2025-11-15',
    flightNo: 'AI-456',
  },
];

export function MyOrdersClean() {
  const [selectedOrder, setSelectedOrder] = useState<typeof orders[0] | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [ordersList, setOrdersList] = useState(orders);

  // Handle cancel booking
  const handleCancelBooking = () => {
    if (selectedOrder && cancelReason.trim()) {
      // Update order status to Cancelled
      setOrdersList(prevOrders => 
        prevOrders.map(order => 
          order.id === selectedOrder.id 
            ? { ...order, status: 'Cancelled' as const }
            : order
        )
      );
      
      // Show success message
      toast.success(`Booking ${selectedOrder.id} has been cancelled successfully`);
      
      // Reset states
      setShowCancelDialog(false);
      setCancelReason('');
      setSelectedOrder(null);
    } else {
      toast.error('Please provide a cancellation reason');
    }
  };

  // Handle download invoice
  const handleDownloadInvoice = () => {
    if (selectedOrder) {
      toast.success(`Downloading invoice for ${selectedOrder.id}`);
      // In real implementation, this would trigger actual PDF download
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed': return 'bg-green-50 text-green-700 border-green-200';
      case 'Pending Approval': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'Completed': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Cancelled': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Confirmed': return CheckCircle2;
      case 'Pending Approval': return AlertCircle;
      case 'Completed': return CheckCircle2;
      case 'Cancelled': return XCircle;
      default: return AlertCircle;
    }
  };

  const getServiceIcon = (service: string) => {
    switch (service) {
      case 'Flight': return Plane;
      case 'Bus': return Bus;
      case 'Cab': return Car;
      case 'Hotel': return Hotel;
      case 'Truck': return Truck;
      default: return PackageIcon;
    }
  };

  const getServiceColor = (service: string) => {
    switch (service) {
      case 'Flight': return { bg: 'bg-blue-100', text: 'text-blue-600', gradient: 'from-blue-500 to-blue-600' };
      case 'Bus': return { bg: 'bg-green-100', text: 'text-green-600', gradient: 'from-green-500 to-green-600' };
      case 'Cab': return { bg: 'bg-yellow-100', text: 'text-yellow-600', gradient: 'from-yellow-500 to-yellow-600' };
      case 'Hotel': return { bg: 'bg-purple-100', text: 'text-purple-600', gradient: 'from-purple-500 to-purple-600' };
      case 'Truck': return { bg: 'bg-orange-100', text: 'text-orange-600', gradient: 'from-orange-500 to-orange-600' };
      default: return { bg: 'bg-gray-100', text: 'text-gray-600', gradient: 'from-gray-500 to-gray-600' };
    }
  };

  const filteredOrders = ordersList.filter(order => {
    if (activeTab === 'upcoming' && (order.status === 'Completed' || order.status === 'Cancelled')) {
      return false;
    }
    if (activeTab === 'completed' && order.status !== 'Completed') {
      return false;
    }
    if (activeTab === 'cancelled' && order.status !== 'Cancelled') {
      return false;
    }
    if (searchQuery && !order.id.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !order.from.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !order.to.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Trips</h1>
              <p className="text-gray-600 mt-1">View and manage all your bookings</p>
            </div>
            
            {/* Search Bar */}
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search by booking ID, location..."
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
                All Trips
              </TabsTrigger>
              <TabsTrigger value="upcoming" className="data-[state=active]:bg-white">
                Upcoming
              </TabsTrigger>
              <TabsTrigger value="completed" className="data-[state=active]:bg-white">
                Completed
              </TabsTrigger>
              <TabsTrigger value="cancelled" className="data-[state=active]:bg-white">
                Cancelled
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Orders Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-4">
          {filteredOrders.length === 0 ? (
            <Card className="p-12 text-center">
              <PackageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No trips found</h3>
              <p className="text-gray-600">Try adjusting your search or filters</p>
            </Card>
          ) : (
            filteredOrders.map((order) => {
              const ServiceIcon = getServiceIcon(order.service);
              const StatusIcon = getStatusIcon(order.status);
              const serviceColor = getServiceColor(order.service);
              
              return (
                <Card 
                  key={order.id} 
                  className="overflow-hidden hover:shadow-lg transition-all border-gray-200 group cursor-pointer"
                  onClick={() => setSelectedOrder(order)}
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Left Side - Service Icon & Color Bar */}
                    <div className={`w-full md:w-2 bg-gradient-to-b ${serviceColor.gradient}`}></div>
                    
                    {/* Main Content */}
                    <div className="flex-1 p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        {/* Left Section */}
                        <div className="flex items-start gap-4 flex-1">
                          {/* Icon */}
                          <div className={`w-14 h-14 ${serviceColor.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                            <ServiceIcon className={`w-7 h-7 ${serviceColor.text}`} />
                          </div>

                          {/* Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2 flex-wrap">
                              <h3 className="text-lg font-bold text-gray-900">{order.service}</h3>
                              <Badge variant="outline" className={getStatusColor(order.status)}>
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {order.status}
                              </Badge>
                              <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                                {order.tripType}
                              </Badge>
                            </div>

                            {/* Route */}
                            <div className="flex items-center gap-2 text-gray-700 mb-3">
                              <MapPin className="w-4 h-4 text-blue-600 flex-shrink-0" />
                              <span className="font-medium">{order.from}</span>
                              <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                              <span className="font-medium">{order.to}</span>
                            </div>

                            {/* Meta Info */}
                            <div className="flex items-center gap-4 text-sm text-gray-600 flex-wrap">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                <span>{order.date}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <PackageIcon className="w-4 h-4 text-gray-400" />
                                <span>{order.id}</span>
                              </div>
                              {order.vendor && (
                                <div className="flex items-center gap-1">
                                  <span className="text-gray-500">via</span>
                                  <span className="font-medium text-gray-700">{order.vendor}</span>
                                </div>
                              )}
                            </div>

                            {/* Additional Details */}
                            {order.service === 'Flight' && order.flightNo && (
                              <div className="mt-2 text-sm text-gray-600">
                                <span className="font-medium">Flight:</span> {order.flightNo} • {order.departureTime} - {order.arrivalTime}
                              </div>
                            )}
                            {order.service === 'Hotel' && order.nights && (
                              <div className="mt-2 text-sm text-gray-600">
                                <span className="font-medium">{order.nights} nights</span> • {order.roomType}
                              </div>
                            )}
                            {order.service === 'Bus' && order.busType && (
                              <div className="mt-2 text-sm text-gray-600">
                                <span className="font-medium">{order.busType}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Right Section */}
                        <div className="flex flex-col items-end gap-3 lg:min-w-[180px]">
                          <div className="text-right">
                            <p className="text-2xl font-bold text-gray-900">₹{order.cost.toLocaleString()}</p>
                            <p className="text-xs text-gray-500 mt-1">Total Amount</p>
                          </div>

                          {/* Rating */}
                          {order.rating && order.rating > 0 && (
                            <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded-full">
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                              <span className="text-sm font-medium text-yellow-700">{order.rating}.0</span>
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="gap-2"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedOrder(order);
                              }}
                            >
                              <Eye className="w-4 h-4" />
                              View
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="gap-2"
                              onClick={(e) => {
                                e.stopPropagation();
                                // Handle download
                              }}
                            >
                              <Download className="w-4 h-4" />
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

        {/* Summary Stats */}
        {filteredOrders.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <Card className="p-4 text-center border-gray-200">
              <p className="text-3xl font-bold text-blue-600">{filteredOrders.length}</p>
              <p className="text-sm text-gray-600 mt-1">Total Trips</p>
            </Card>
            <Card className="p-4 text-center border-gray-200">
              <p className="text-3xl font-bold text-green-600">
                {filteredOrders.filter(o => o.status === 'Confirmed').length}
              </p>
              <p className="text-sm text-gray-600 mt-1">Confirmed</p>
            </Card>
            <Card className="p-4 text-center border-gray-200">
              <p className="text-3xl font-bold text-gray-600">
                {filteredOrders.filter(o => o.status === 'Completed').length}
              </p>
              <p className="text-sm text-gray-600 mt-1">Completed</p>
            </Card>
            <Card className="p-4 text-center border-gray-200">
              <p className="text-3xl font-bold text-purple-600">
                ₹{filteredOrders.reduce((sum, o) => sum + o.cost, 0).toLocaleString()}
              </p>
              <p className="text-sm text-gray-600 mt-1">Total Spent</p>
            </Card>
          </div>
        )}
      </div>

      {/* Order Details Dialog */}
      <Dialog open={selectedOrder !== null} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl">
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <div className={`w-12 h-12 ${getServiceColor(selectedOrder.service).bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    {(() => {
                      const ServiceIcon = getServiceIcon(selectedOrder.service);
                      return <ServiceIcon className={`w-6 h-6 ${getServiceColor(selectedOrder.service).text}`} />;
                    })()}
                  </div>
                  <div>
                    <h2>{selectedOrder.service} Booking</h2>
                    <p className="text-sm text-gray-600 font-normal">{selectedOrder.id}</p>
                  </div>
                </DialogTitle>
                <DialogDescription>
                  View complete details of your booking
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Status and Type */}
                <div className="flex gap-2">
                  <Badge variant="outline" className={getStatusColor(selectedOrder.status)}>
                    {(() => {
                      const StatusIcon = getStatusIcon(selectedOrder.status);
                      return <StatusIcon className="w-3 h-3 mr-1" />;
                    })()}
                    {selectedOrder.status}
                  </Badge>
                  <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                    {selectedOrder.tripType}
                  </Badge>
                </div>

                {/* Route Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-3">Trip Details</h3>
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">From</p>
                      <p className="font-semibold">{selectedOrder.from}</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">To</p>
                      <p className="font-semibold">{selectedOrder.to}</p>
                    </div>
                  </div>
                </div>

                {/* Additional Service Details */}
                {selectedOrder.service === 'Flight' && selectedOrder.flightNo && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-3">Flight Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Flight Number</p>
                        <p className="font-semibold">{selectedOrder.flightNo}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Departure</p>
                        <p className="font-semibold">{selectedOrder.departureTime}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Arrival</p>
                        <p className="font-semibold">{selectedOrder.arrivalTime}</p>
                      </div>
                    </div>
                  </div>
                )}

                {selectedOrder.service === 'Hotel' && selectedOrder.nights && (
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-3">Hotel Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Room Type</p>
                        <p className="font-semibold">{selectedOrder.roomType}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Duration</p>
                        <p className="font-semibold">{selectedOrder.nights} nights</p>
                      </div>
                    </div>
                  </div>
                )}

                {selectedOrder.service === 'Bus' && selectedOrder.busType && (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-3">Bus Information</h3>
                    <div>
                      <p className="text-sm text-gray-600">Bus Type</p>
                      <p className="font-semibold">{selectedOrder.busType}</p>
                    </div>
                  </div>
                )}

                {/* General Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Travel Date</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <p className="font-semibold">{selectedOrder.date}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Booking Date</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <p className="font-semibold">{selectedOrder.bookingDate}</p>
                    </div>
                  </div>
                  {selectedOrder.vendor && (
                    <div>
                      <p className="text-sm text-gray-600">Vendor</p>
                      <p className="font-semibold">{selectedOrder.vendor}</p>
                    </div>
                  )}
                  {selectedOrder.rating && selectedOrder.rating > 0 && (
                    <div>
                      <p className="text-sm text-gray-600">Rating</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <p className="font-semibold">{selectedOrder.rating}.0</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Cost */}
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Amount</span>
                    <span className="text-2xl font-bold text-gray-900">₹{selectedOrder.cost.toLocaleString()}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button className="flex-1 bg-[#000035] hover:bg-[#000055] text-white" onClick={handleDownloadInvoice}>
                    <Download className="w-4 h-4 mr-2" />
                    Download Invoice
                  </Button>
                  {selectedOrder.status === 'Confirmed' && (
                    <Button variant="outline" className="flex-1" onClick={() => setShowCancelDialog(true)}>
                      Cancel Booking
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Cancel Booking Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent className="max-w-2xl">
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <div className={`w-12 h-12 ${getServiceColor(selectedOrder.service).bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    {(() => {
                      const ServiceIcon = getServiceIcon(selectedOrder.service);
                      return <ServiceIcon className={`w-6 h-6 ${getServiceColor(selectedOrder.service).text}`} />;
                    })()}
                  </div>
                  <div>
                    <h2>Cancel {selectedOrder.service} Booking</h2>
                    <p className="text-sm text-gray-600 font-normal">{selectedOrder.id}</p>
                  </div>
                </DialogTitle>
                <DialogDescription>
                  Provide a reason for cancelling this booking
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Status and Type */}
                <div className="flex gap-2">
                  <Badge variant="outline" className={getStatusColor(selectedOrder.status)}>
                    {(() => {
                      const StatusIcon = getStatusIcon(selectedOrder.status);
                      return <StatusIcon className="w-3 h-3 mr-1" />;
                    })()}
                    {selectedOrder.status}
                  </Badge>
                  <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                    {selectedOrder.tripType}
                  </Badge>
                </div>

                {/* Route Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-3">Trip Details</h3>
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">From</p>
                      <p className="font-semibold">{selectedOrder.from}</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">To</p>
                      <p className="font-semibold">{selectedOrder.to}</p>
                    </div>
                  </div>
                </div>

                {/* Additional Service Details */}
                {selectedOrder.service === 'Flight' && selectedOrder.flightNo && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-3">Flight Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Flight Number</p>
                        <p className="font-semibold">{selectedOrder.flightNo}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Departure</p>
                        <p className="font-semibold">{selectedOrder.departureTime}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Arrival</p>
                        <p className="font-semibold">{selectedOrder.arrivalTime}</p>
                      </div>
                    </div>
                  </div>
                )}

                {selectedOrder.service === 'Hotel' && selectedOrder.nights && (
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-3">Hotel Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Room Type</p>
                        <p className="font-semibold">{selectedOrder.roomType}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Duration</p>
                        <p className="font-semibold">{selectedOrder.nights} nights</p>
                      </div>
                    </div>
                  </div>
                )}

                {selectedOrder.service === 'Bus' && selectedOrder.busType && (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-3">Bus Information</h3>
                    <div>
                      <p className="text-sm text-gray-600">Bus Type</p>
                      <p className="font-semibold">{selectedOrder.busType}</p>
                    </div>
                  </div>
                )}

                {/* General Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Travel Date</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <p className="font-semibold">{selectedOrder.date}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Booking Date</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <p className="font-semibold">{selectedOrder.bookingDate}</p>
                    </div>
                  </div>
                  {selectedOrder.vendor && (
                    <div>
                      <p className="text-sm text-gray-600">Vendor</p>
                      <p className="font-semibold">{selectedOrder.vendor}</p>
                    </div>
                  )}
                  {selectedOrder.rating && selectedOrder.rating > 0 && (
                    <div>
                      <p className="text-sm text-gray-600">Rating</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <p className="font-semibold">{selectedOrder.rating}.0</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Cost */}
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Amount</span>
                    <span className="text-2xl font-bold text-gray-900">₹{selectedOrder.cost.toLocaleString()}</span>
                  </div>
                </div>

                {/* Cancellation Reason */}
                <div>
                  <Label htmlFor="cancel-reason">Cancellation Reason *</Label>
                  <Textarea
                    id="cancel-reason"
                    placeholder="Please provide a reason for cancelling this booking..."
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    rows={4}
                    className="mt-2"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
                  Go Back
                </Button>
                <Button 
                  className="bg-red-600 hover:bg-red-700 text-white" 
                  onClick={handleCancelBooking}
                  disabled={!cancelReason.trim()}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Confirm Cancellation
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}