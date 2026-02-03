import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import {
  Plane,
  Bus,
  Car,
  Hotel,
  Truck,
  RefreshCw,
  Calendar,
  MapPin,
  XCircle,
  CheckCircle2,
  ArrowRight,
  Clock,
  DollarSign,
  Info,
  Search
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface CancelledBooking {
  id: string;
  service: string;
  from: string;
  to: string;
  originalDate: string;
  cancelledDate: string;
  cancellationReason: string;
  cost: number;
  vendor: string;
  tripType: 'Business' | 'Personal';
  refundStatus: 'Pending' | 'Processed' | 'Completed';
  refundAmount: number;
  canRebook: boolean;
  // Service specific details
  flightNo?: string;
  departureTime?: string;
  arrivalTime?: string;
  nights?: number;
  roomType?: string;
  busType?: string;
}

const cancelledBookings: CancelledBooking[] = [
  {
    id: 'ORD-006',
    service: 'Flight',
    from: 'Delhi',
    to: 'Goa',
    originalDate: '2025-11-28',
    cancelledDate: '2025-11-20',
    cancellationReason: 'Change in travel plans',
    cost: 5200,
    vendor: 'Air India',
    tripType: 'Personal',
    refundStatus: 'Completed',
    refundAmount: 4680,
    canRebook: true,
    flightNo: 'AI-456',
    departureTime: '09:30 AM',
    arrivalTime: '11:45 AM',
  },
  {
    id: 'ORD-007',
    service: 'Hotel',
    from: 'Mumbai',
    to: 'Taj Palace',
    originalDate: '2025-12-05',
    cancelledDate: '2025-12-01',
    cancellationReason: 'Meeting postponed',
    cost: 8500,
    vendor: 'Booking.com',
    tripType: 'Business',
    refundStatus: 'Processed',
    refundAmount: 7650,
    canRebook: true,
    nights: 2,
    roomType: 'Deluxe Suite',
  },
  {
    id: 'ORD-008',
    service: 'Bus',
    from: 'Pune',
    to: 'Bangalore',
    originalDate: '2025-11-15',
    cancelledDate: '2025-11-10',
    cancellationReason: 'Emergency came up',
    cost: 1200,
    vendor: 'RedBus',
    tripType: 'Personal',
    refundStatus: 'Completed',
    refundAmount: 1080,
    canRebook: true,
    busType: 'AC Sleeper',
  },
  {
    id: 'ORD-009',
    service: 'Cab',
    from: 'Airport',
    to: 'Hotel',
    originalDate: '2025-11-05',
    cancelledDate: '2025-11-04',
    cancellationReason: 'Flight cancelled',
    cost: 450,
    vendor: 'Ola',
    tripType: 'Business',
    refundStatus: 'Completed',
    refundAmount: 450,
    canRebook: false,
  },
];

export function RebookingClean() {
  const [bookings, setBookings] = useState<CancelledBooking[]>(cancelledBookings);
  const [selectedBooking, setSelectedBooking] = useState<CancelledBooking | null>(null);
  const [showRebookDialog, setShowRebookDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Rebooking form data
  const [rebookData, setRebookData] = useState({
    newDate: '',
    sameDateRange: true,
    sameVendor: true,
    notes: '',
  });

  // Handle rebook
  const handleRebook = () => {
    if (!selectedBooking) return;

    if (!rebookData.newDate) {
      toast.error('Please select a new date');
      return;
    }

    const newDate = new Date(rebookData.newDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (newDate < today) {
      toast.error('Please select a future date');
      return;
    }

    // Simulate rebooking
    toast.success('Booking request submitted successfully!', {
      description: `Your ${selectedBooking.service} from ${selectedBooking.from} to ${selectedBooking.to} has been requested for ${rebookData.newDate}`,
    });

    // Remove from cancelled bookings list (in real app, this would create a new booking)
    setBookings(bookings.filter(b => b.id !== selectedBooking.id));
    
    setShowRebookDialog(false);
    setSelectedBooking(null);
    setRebookData({ newDate: '', sameDateRange: true, sameVendor: true, notes: '' });
  };

  // Get service icon
  const getServiceIcon = (service: string) => {
    switch (service) {
      case 'Flight': return Plane;
      case 'Bus': return Bus;
      case 'Cab': return Car;
      case 'Hotel': return Hotel;
      case 'Truck': return Truck;
      default: return Car;
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

  // Get refund status color
  const getRefundStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-50 text-green-700 border-green-200';
      case 'Processed': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'Pending': return 'bg-orange-50 text-orange-700 border-orange-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  // Filter bookings
  const filteredBookings = bookings.filter(booking => {
    if (searchQuery && !booking.id.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !booking.from.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !booking.to.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const rebookableCount = bookings.filter(b => b.canRebook).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Rebook Cancelled Trips</h1>
            <p className="text-gray-600 mt-1">Easily rebook your cancelled journeys</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <Card className="p-6 border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Cancelled Trips</p>
                  <p className="text-3xl font-bold text-gray-900">{bookings.length}</p>
                </div>
                <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center">
                  <XCircle className="w-7 h-7 text-red-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6 border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Available to Rebook</p>
                  <p className="text-3xl font-bold text-blue-600">{rebookableCount}</p>
                </div>
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                  <RefreshCw className="w-7 h-7 text-blue-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6 border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Refunds</p>
                  <p className="text-3xl font-bold text-green-600">
                    ₹{bookings.reduce((sum, b) => sum + b.refundAmount, 0).toLocaleString()}
                  </p>
                </div>
                <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-7 h-7 text-green-600" />
                </div>
              </div>
            </Card>
          </div>

          {/* Search */}
          <div className="relative mt-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search by booking ID, location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-50 border-gray-200"
            />
          </div>
        </div>
      </div>

      {/* Bookings List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredBookings.length === 0 ? (
          <Card className="p-12 text-center">
            <RefreshCw className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No cancelled trips found</h3>
            <p className="text-gray-600">You don't have any cancelled bookings to rebook</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => {
              const ServiceIcon = getServiceIcon(booking.service);
              const serviceColor = getServiceColor(booking.service);

              return (
                <Card key={booking.id} className="p-6 border-gray-200 hover:shadow-lg transition-all">
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
                            <h3 className="font-bold text-gray-900">{booking.service}</h3>
                            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                              <XCircle className="w-3 h-3 mr-1" />
                              Cancelled
                            </Badge>
                            {booking.canRebook && (
                              <Badge className="bg-blue-600 text-white border-0">
                                Can Rebook
                              </Badge>
                            )}
                          </div>

                          {/* Route */}
                          <div className="flex items-center gap-2 text-gray-700 mb-3">
                            <MapPin className="w-4 h-4 text-blue-600 flex-shrink-0" />
                            <span className="font-medium">{booking.from}</span>
                            <ArrowRight className="w-4 h-4 text-gray-400" />
                            <span className="font-medium">{booking.to}</span>
                          </div>

                          {/* Details Grid */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600">Original Date</p>
                              <p className="font-semibold">{booking.originalDate}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Cancelled On</p>
                              <p className="font-semibold">{booking.cancelledDate}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Vendor</p>
                              <p className="font-semibold">{booking.vendor}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Trip Type</p>
                              <p className="font-semibold">{booking.tripType}</p>
                            </div>
                          </div>

                          {/* Service Specific Details */}
                          {booking.service === 'Flight' && booking.flightNo && (
                            <div className="mt-3 p-3 bg-blue-50 rounded-lg text-sm">
                              <p className="text-gray-700">
                                <span className="font-medium">Flight:</span> {booking.flightNo} • 
                                {booking.departureTime} - {booking.arrivalTime}
                              </p>
                            </div>
                          )}
                          {booking.service === 'Hotel' && booking.nights && (
                            <div className="mt-3 p-3 bg-purple-50 rounded-lg text-sm">
                              <p className="text-gray-700">
                                <span className="font-medium">{booking.nights} nights</span> • {booking.roomType}
                              </p>
                            </div>
                          )}
                          {booking.service === 'Bus' && booking.busType && (
                            <div className="mt-3 p-3 bg-green-50 rounded-lg text-sm">
                              <p className="text-gray-700">
                                <span className="font-medium">{booking.busType}</span>
                              </p>
                            </div>
                          )}

                          {/* Cancellation Reason */}
                          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600 mb-1">Cancellation Reason</p>
                            <p className="text-sm text-gray-900">{booking.cancellationReason}</p>
                          </div>
                        </div>

                        {/* Right Side - Cost & Actions */}
                        <div className="flex flex-col items-end gap-3 min-w-[180px]">
                          <div className="text-right">
                            <p className="text-2xl font-bold text-gray-900">₹{booking.cost.toLocaleString()}</p>
                            <p className="text-xs text-gray-500">Original Amount</p>
                          </div>

                          {/* Refund Info */}
                          <div className="bg-green-50 p-3 rounded-lg w-full">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-gray-600">Refund</span>
                              <Badge variant="outline" className={`text-xs ${getRefundStatusColor(booking.refundStatus)}`}>
                                {booking.refundStatus}
                              </Badge>
                            </div>
                            <p className="font-bold text-green-700">₹{booking.refundAmount.toLocaleString()}</p>
                          </div>

                          {/* Rebook Button */}
                          {booking.canRebook ? (
                            <Button
                              onClick={() => {
                                setSelectedBooking(booking);
                                setShowRebookDialog(true);
                              }}
                              className="w-full bg-[#000035] hover:bg-[#000055]"
                            >
                              <RefreshCw className="w-4 h-4 mr-2" />
                              Rebook
                            </Button>
                          ) : (
                            <div className="text-center p-2 bg-gray-100 rounded text-xs text-gray-600">
                              Not available for rebooking
                            </div>
                          )}
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

      {/* Rebook Dialog */}
      <Dialog open={showRebookDialog} onOpenChange={setShowRebookDialog}>
        <DialogContent className="sm:max-w-2xl">
          {selectedBooking && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <div className={`w-12 h-12 ${getServiceColor(selectedBooking.service).bg} rounded-xl flex items-center justify-center`}>
                    {(() => {
                      const ServiceIcon = getServiceIcon(selectedBooking.service);
                      return <ServiceIcon className={`w-6 h-6 ${getServiceColor(selectedBooking.service).text}`} />;
                    })()}
                  </div>
                  <div>
                    <h2>Rebook {selectedBooking.service}</h2>
                    <p className="text-sm text-gray-600 font-normal">{selectedBooking.id}</p>
                  </div>
                </DialogTitle>
                <DialogDescription>
                  Rebook your cancelled trip with the same or modified details
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 py-4">
                {/* Original Trip Info */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-3">Original Trip Details</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">From</p>
                      <p className="font-semibold">{selectedBooking.from}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">To</p>
                      <p className="font-semibold">{selectedBooking.to}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Original Date</p>
                      <p className="font-semibold">{selectedBooking.originalDate}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Vendor</p>
                      <p className="font-semibold">{selectedBooking.vendor}</p>
                    </div>
                  </div>
                </div>

                {/* New Date Selection */}
                <div>
                  <Label htmlFor="new-date">New Travel Date *</Label>
                  <Input
                    id="new-date"
                    type="date"
                    value={rebookData.newDate}
                    onChange={(e) => setRebookData({ ...rebookData, newDate: e.target.value })}
                    className="mt-2"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                {/* Preferences */}
                <div className="space-y-3">
                  <Label>Booking Preferences</Label>
                  
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <input
                      type="checkbox"
                      id="same-vendor"
                      checked={rebookData.sameVendor}
                      onChange={(e) => setRebookData({ ...rebookData, sameVendor: e.target.checked })}
                      className="w-5 h-5"
                    />
                    <Label htmlFor="same-vendor" className="cursor-pointer flex-1">
                      <p className="font-medium text-gray-900">Same Vendor</p>
                      <p className="text-sm text-gray-600">Book with {selectedBooking.vendor}</p>
                    </Label>
                  </div>

                  {selectedBooking.service === 'Hotel' && (
                    <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                      <input
                        type="checkbox"
                        id="same-range"
                        checked={rebookData.sameDateRange}
                        onChange={(e) => setRebookData({ ...rebookData, sameDateRange: e.target.checked })}
                        className="w-5 h-5"
                      />
                      <Label htmlFor="same-range" className="cursor-pointer flex-1">
                        <p className="font-medium text-gray-900">Same Duration</p>
                        <p className="text-sm text-gray-600">{selectedBooking.nights} nights stay</p>
                      </Label>
                    </div>
                  )}
                </div>

                {/* Cost Estimate */}
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 mb-1">Cost Estimate</p>
                      <p className="text-sm text-gray-700 mb-3">
                        Original booking cost: ₹{selectedBooking.cost.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-700">
                        Refund amount: ₹{selectedBooking.refundAmount.toLocaleString()} 
                        <Badge variant="outline" className={`ml-2 text-xs ${getRefundStatusColor(selectedBooking.refundStatus)}`}>
                          {selectedBooking.refundStatus}
                        </Badge>
                      </p>
                      <p className="text-xs text-gray-600 mt-2">
                        Note: Actual pricing may vary based on availability and current rates
                      </p>
                    </div>
                  </div>
                </div>

                {/* Additional Notes */}
                <div>
                  <Label htmlFor="notes">Additional Notes (Optional)</Label>
                  <Input
                    id="notes"
                    placeholder="Any special requests or preferences..."
                    value={rebookData.notes}
                    onChange={(e) => setRebookData({ ...rebookData, notes: e.target.value })}
                    className="mt-2"
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setShowRebookDialog(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleRebook}
                  className="bg-[#000035] hover:bg-[#000055]"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Confirm Rebooking
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
