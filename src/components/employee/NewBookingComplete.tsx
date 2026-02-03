import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { BookingSuccess } from './BookingSuccess';
import { HotelBooking } from './HotelBookingEnhanced';
import { BusBooking } from './BusBooking';
import { CabBooking } from './CabBooking';
import { BikeBooking } from './BikeBooking';
import { FlightBooking } from './FlightBookingEnhanced';
import { LogisticsBooking } from './LogisticsBooking';
import { WalletManagementClean as WalletManagement } from './WalletManagementClean';
import { 
  Plane, 
  Hotel, 
  Bus, 
  Car, 
  Bike, 
  Truck,
  Calendar,
  MapPin,
  Users,
  Package,
  CreditCard,
  ChevronDown,
  ArrowRightLeft,
  Search,
  Wallet,
  Building2,
  Smartphone,
  Shield,
  Check,
  FileCheck,
  Clock
} from 'lucide-react';

// Service categories
const travelServices = [
  { id: 'flight', icon: Plane, label: 'Flights' },
  { id: 'hotel', icon: Hotel, label: 'Hotels' },
  { id: 'bus', icon: Bus, label: 'Buses' },
  { id: 'cab', icon: Car, label: 'Cabs' },
  { id: 'bike', icon: Bike, label: 'Bikes' },
];

const logisticsServices = [
  { id: 'logistics-bike', icon: Bike, label: 'Bike Delivery' },
  { id: 'logistics-auto', icon: Truck, label: '3W Auto' },
  { id: 'logistics-mini', icon: Truck, label: 'Mini Truck' },
  { id: 'logistics-medium', icon: Truck, label: 'Medium Truck' },
  { id: 'logistics-dcm', icon: Truck, label: 'DCM' },
  { id: 'logistics-container', icon: Package, label: 'Container' },
];

export interface PrefilledBookingData {
  service: string;
  from?: string;
  to?: string;
  tripType?: 'one-way' | 'round-trip';
  passengers?: string;
  checkInDate?: string;
  checkOutDate?: string;
  pickupTime?: string;
}

interface NewBookingCompleteProps {
  prefilledData?: PrefilledBookingData;
}

export function NewBookingComplete({ prefilledData }: NewBookingCompleteProps) {
  // Category state - Travel or Logistics
  const [category, setCategory] = useState<'travel' | 'logistics'>('travel');
  
  // State management
  const [selectedService, setSelectedService] = useState(prefilledData?.service || 'flight');
  const [bookingStep, setBookingStep] = useState<'search' | 'service' | 'approval-review' | 'checkout' | 'success'>('search');
  const [showWalletManagement, setShowWalletManagement] = useState(false);
  
  // Search form states
  const [from, setFrom] = useState(prefilledData?.from || 'Mumbai');
  const [to, setTo] = useState(prefilledData?.to || 'Delhi');
  const [departDate, setDepartDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [passengers, setPassengers] = useState(prefilledData?.passengers || '1');
  const [tripType, setTripType] = useState<'one-way' | 'round-trip'>(prefilledData?.tripType || 'round-trip');
  const [checkInDate, setCheckInDate] = useState(prefilledData?.checkInDate || '');
  const [checkOutDate, setCheckOutDate] = useState(prefilledData?.checkOutDate || '');
  const [guests, setGuests] = useState('2');
  const [pickupTime, setPickupTime] = useState(prefilledData?.pickupTime || '14:00');
  
  // Booking data
  const [selectedBookingItem, setSelectedBookingItem] = useState<any>(null);
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const [bookingConfirmationNumber, setBookingConfirmationNumber] = useState('');
  
  // Travel Type state (Business or Personal)
  const [travelType, setTravelType] = useState<'business' | 'personal'>('personal');
  
  // Approval Request Modal
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approvalRequestId, setApprovalRequestId] = useState('');
  
  // Payment states
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'wallet' | 'card' | 'upi' | 'netbanking'>('wallet');
  const [selectedWalletType, setSelectedWalletType] = useState<'business' | 'personal' | 'both'>('business');
  const [businessWalletBalance, setBusinessWalletBalance] = useState(45000);
  const [personalWalletBalance, setPersonalWalletBalance] = useState(12500);
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVV, setCardCVV] = useState('');
  const [upiId, setUpiId] = useState('');
  const [selectedBank, setSelectedBank] = useState('');

  // Get current services based on category
  const currentServices = category === 'travel' ? travelServices : logisticsServices;

  // Handle wallet balance updates
  const handleUpdateWalletBalances = (business: number, personal: number) => {
    setBusinessWalletBalance(business);
    setPersonalWalletBalance(personal);
  };

  // Handle category change
  const handleCategoryChange = (newCategory: 'travel' | 'logistics') => {
    setCategory(newCategory);
    // Set default service for the category
    if (newCategory === 'travel') {
      setSelectedService('flight');
    } else {
      setSelectedService('logistics-bike');
    }
  };

  // Handle service selection
  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId);
  };

  // Handle search
  const handleSearch = () => {
    // Validate based on service type
    if (selectedService === 'hotel') {
      if (!to || !checkInDate || !checkOutDate) {
        alert('Please fill all required fields');
        return;
      }
    } else if (selectedService === 'cab' || selectedService === 'bike') {
      if (!from || !to || !departDate || !pickupTime) {
        alert('Please fill all required fields');
        return;
      }
    } else {
      if (!from || !to || !departDate) {
        alert('Please fill all required fields');
        return;
      }
    }
    setBookingStep('service');
  };

  // Swap from and to
  const handleSwapCities = () => {
    const temp = from;
    setFrom(to);
    setTo(temp);
  };

  // Handle proceed to checkout from service pages
  const handleProceedToCheckout = (item: any, details: any) => {
    setSelectedBookingItem(item);
    setBookingDetails(details);
    
    // If Business travel, go to approval review page
    if (travelType === 'business') {
      setBookingStep('approval-review');
    } else {
      // Personal travel goes directly to checkout
      setBookingStep('checkout');
    }
  };

  // Handle back to search
  const handleBackToSearch = () => {
    setBookingStep('search');
  };

  // Complete booking
  const handleCompleteBooking = () => {
    if (!selectedBookingItem) return;

    const totalAmount = calculateTotalAmount();

    // Validate payment method
    if (selectedPaymentMethod === 'wallet') {
      if (selectedWalletType === 'business' && businessWalletBalance < totalAmount) {
        alert('Insufficient Business Wallet balance');
        return;
      }
      if (selectedWalletType === 'personal' && personalWalletBalance < totalAmount) {
        alert('Insufficient Personal Wallet balance');
        return;
      }
      if (selectedWalletType === 'both' && (businessWalletBalance + personalWalletBalance) < totalAmount) {
        alert('Insufficient combined wallet balance');
        return;
      }
    }

    if (selectedPaymentMethod === 'card') {
      if (!cardNumber || !cardExpiry || !cardCVV) {
        alert('Please fill all card details');
        return;
      }
    }

    if (selectedPaymentMethod === 'upi' && !upiId) {
      alert('Please enter UPI ID');
      return;
    }

    if (selectedPaymentMethod === 'netbanking' && !selectedBank) {
      alert('Please select a bank');
      return;
    }

    // Generate confirmation number
    const confirmationNum = 'SMV' + Math.random().toString(36).substring(2, 12).toUpperCase();
    setBookingConfirmationNumber(confirmationNum);
    setBookingStep('success');
  };

  // Calculate total amount
  const calculateTotalAmount = () => {
    if (!selectedBookingItem) return 0;
    
    let baseAmount = 0;
    
    if (selectedService === 'flight') {
      baseAmount = selectedBookingItem.price * parseInt(passengers);
    } else if (selectedService === 'hotel' && bookingDetails) {
      const nights = bookingDetails.totalNights || 1;
      const rooms = bookingDetails.roomCount || 1;
      baseAmount = selectedBookingItem.price * nights * rooms;
    } else if (selectedService === 'bus' && bookingDetails) {
      baseAmount = selectedBookingItem.price * (bookingDetails.seats?.length || 1);
    } else if (selectedService === 'cab' || selectedService === 'bike') {
      baseAmount = selectedBookingItem.estimatedFare || selectedBookingItem.price;
    } else {
      baseAmount = selectedService === 'logistics-bike' ? selectedBookingItem.price * 2 : selectedService === 'logistics-auto' ? selectedBookingItem.price * 3 : selectedService === 'logistics-mini' ? selectedBookingItem.price * 4 : selectedService === 'logistics-medium' ? selectedBookingItem.price * 5 : selectedService === 'logistics-dcm' ? selectedBookingItem.price * 6 : selectedService === 'logistics-container' ? selectedBookingItem.price * 7 : selectedServiceItem.price || selectedBookingItem.estimatedFare || 0;
    }
    
    const taxes = Math.round(baseAmount * 0.12);
    return baseAmount + taxes;
  };

  // Reset booking
  const handleBookAnother = () => {
    setCategory('travel');
    setSelectedService('flight');
    setBookingStep('search');
    setSelectedBookingItem(null);
    setBookingDetails(null);
    setFrom('Mumbai');
    setTo('Delhi');
    setDepartDate('');
    setReturnDate('');
    setPassengers('1');
    setCardNumber('');
    setCardExpiry('');
    setCardCVV('');
    setUpiId('');
    setSelectedBank('');
  };

  // Success Page
  if (bookingStep === 'success' && selectedBookingItem) {
    return (
      <BookingSuccess
        flight={selectedBookingItem}
        from={from}
        to={to}
        paymentMethod={selectedPaymentMethod}
        confirmationNumber={bookingConfirmationNumber}
        walletBalance={selectedWalletType === 'business' ? businessWalletBalance : personalWalletBalance}
        onBookAnother={handleBookAnother}
      />
    );
  }

  // Checkout Page
  if (bookingStep === 'checkout' && selectedBookingItem) {
    const totalAmount = calculateTotalAmount();
    const baseAmount = selectedService === 'flight' 
      ? selectedBookingItem.price * parseInt(passengers)
      : selectedService === 'hotel' && bookingDetails
      ? selectedBookingItem.price * (bookingDetails.totalNights || 1) * (bookingDetails.roomCount || 1)
      : selectedService === 'bus' && bookingDetails
      ? selectedBookingItem.price * (bookingDetails.seats?.length || 1)
      : selectedService === 'cab' || selectedService === 'bike'
      ? selectedBookingItem.estimatedFare || selectedBookingItem.price
      : 0;
    
    const taxes = Math.round(baseAmount * 0.12);

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-3 gap-8">
            {/* Left: Booking Summary & Passenger Details */}
            <div className="col-span-2 space-y-6">
              {/* Booking Summary */}
              <Card className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Booking Summary</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                    {selectedService === 'flight' && <Plane className="w-8 h-8 text-blue-600" />}
                    {selectedService === 'hotel' && <Hotel className="w-8 h-8 text-orange-600" />}
                    {selectedService === 'bus' && <Bus className="w-8 h-8 text-purple-600" />}
                    {selectedService === 'cab' && <Car className="w-8 h-8 text-yellow-600" />}
                    {selectedService === 'bike' && <Bike className="w-8 h-8 text-green-600" />}
                    
                    <div className="flex-1">
                      <p className="font-bold text-gray-900">
                        {selectedBookingItem.airline || selectedBookingItem.name || selectedBookingItem.operator}
                      </p>
                      <p className="text-sm text-gray-600">
                        {selectedService === 'flight' && `${selectedBookingItem.flightNo} • ${from} → ${to}`}
                        {selectedService === 'hotel' && selectedBookingItem.location}
                        {selectedService === 'bus' && `${from} → ${to}`}
                        {(selectedService === 'cab' || selectedService === 'bike') && `${from} → ${to}`}
                      </p>
                    </div>
                  </div>

                  {/* Additional Details */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {selectedService === 'flight' && (
                      <>
                        <div>
                          <p className="text-gray-600">Departure</p>
                          <p className="font-semibold">{selectedBookingItem.departure} • {departDate}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Passengers</p>
                          <p className="font-semibold">{passengers}</p>
                        </div>
                      </>
                    )}
                    {selectedService === 'hotel' && bookingDetails && (
                      <>
                        <div>
                          <p className="text-gray-600">Check-in</p>
                          <p className="font-semibold">{bookingDetails.checkIn}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Check-out</p>
                          <p className="font-semibold">{bookingDetails.checkOut}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Rooms</p>
                          <p className="font-semibold">{bookingDetails.roomCount}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Nights</p>
                          <p className="font-semibold">{bookingDetails.totalNights}</p>
                        </div>
                      </>
                    )}
                    {selectedService === 'bus' && bookingDetails && (
                      <>
                        <div>
                          <p className="text-gray-600">Seats</p>
                          <p className="font-semibold">{bookingDetails.seats?.join(', ')}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Boarding</p>
                          <p className="font-semibold">{bookingDetails.pickupPoint}</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </Card>

              {/* Payment Methods */}
              <Card className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Select Payment Method</h3>
                
                <div className="space-y-4">
                  {/* Wallet */}
                  <div
                    onClick={() => setSelectedPaymentMethod('wallet')}
                    className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      selectedPaymentMethod === 'wallet'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedPaymentMethod === 'wallet' ? 'border-blue-500' : 'border-gray-300'
                      }`}>
                        {selectedPaymentMethod === 'wallet' && (
                          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        )}
                      </div>
                      <Wallet className="w-6 h-6 text-blue-600" />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">Wallet</p>
                        <p className="text-sm text-gray-600">Choose from your wallets</p>
                      </div>
                      {(selectedWalletType === 'business' ? businessWalletBalance >= totalAmount : personalWalletBalance >= totalAmount) && (
                        <Badge className="bg-green-600">Recommended</Badge>
                      )}
                    </div>
                    
                    {/* Wallet Type Selection */}
                    {selectedPaymentMethod === 'wallet' && (
                      <div className="mt-4 pt-4 border-t space-y-3">
                        {/* Business Wallet */}
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedWalletType('business');
                          }}
                          className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            selectedWalletType === 'business'
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-blue-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                selectedWalletType === 'business' ? 'border-blue-500' : 'border-gray-300'
                              }`}>
                                {selectedWalletType === 'business' && (
                                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                )}
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900 flex items-center gap-2">
                                  <Building2 className="w-4 h-4 text-blue-600" />
                                  Business Wallet
                                </p>
                                <p className="text-sm text-gray-600">For official expenses</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-gray-900">₹{businessWalletBalance.toLocaleString()}</p>
                              {businessWalletBalance >= totalAmount ? (
                                <Badge className="bg-green-600 text-xs mt-1">Sufficient</Badge>
                              ) : (
                                <Badge variant="outline" className="text-red-600 border-red-600 text-xs mt-1">
                                  Low Balance
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Personal Wallet */}
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedWalletType('personal');
                          }}
                          className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            selectedWalletType === 'personal'
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-blue-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                selectedWalletType === 'personal' ? 'border-blue-500' : 'border-gray-300'
                              }`}>
                                {selectedWalletType === 'personal' && (
                                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                )}
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900 flex items-center gap-2">
                                  <Wallet className="w-4 h-4 text-purple-600" />
                                  Personal Wallet
                                </p>
                                <p className="text-sm text-gray-600">For personal expenses</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-gray-900">₹{personalWalletBalance.toLocaleString()}</p>
                              {personalWalletBalance >= totalAmount ? (
                                <Badge className="bg-green-600 text-xs mt-1">Sufficient</Badge>
                              ) : (
                                <Badge variant="outline" className="text-red-600 border-red-600 text-xs mt-1">
                                  Low Balance
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Use Both Wallets - Always show as an option */}
                        {(businessWalletBalance + personalWalletBalance) >= totalAmount && (
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedWalletType('both');
                            }}
                            className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                              selectedWalletType === 'both'
                                ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-purple-50'
                                : 'border-gray-200 hover:border-blue-300'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                  selectedWalletType === 'both' ? 'border-blue-500' : 'border-gray-300'
                                }`}>
                                  {selectedWalletType === 'both' && (
                                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                  )}
                                </div>
                                <div>
                                  <p className="font-semibold text-gray-900 flex items-center gap-2">
                                    <Building2 className="w-4 h-4 text-blue-600" />
                                    <Wallet className="w-4 h-4 text-purple-600" />
                                    Use Both Wallets
                                  </p>
                                  <p className="text-sm text-gray-600">Split payment across wallets</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-gray-900">₹{(businessWalletBalance + personalWalletBalance).toLocaleString()}</p>
                                <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-xs mt-1">Combined Balance</Badge>
                              </div>
                            </div>

                            {/* Split Breakdown */}
                            {selectedWalletType === 'both' && (
                              <div className="pt-3 border-t space-y-2">
                                <p className="text-xs text-gray-600 mb-2">Payment will be split as:</p>
                                <div className="flex items-center justify-between text-sm">
                                  <div className="flex items-center gap-2">
                                    <Building2 className="w-3 h-3 text-blue-600" />
                                    <span className="text-gray-600">Business Wallet</span>
                                  </div>
                                  <span className="font-medium text-gray-900">
                                    -₹{Math.min(businessWalletBalance, totalAmount).toLocaleString()}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                  <div className="flex items-center gap-2">
                                    <Wallet className="w-3 h-3 text-purple-600" />
                                    <span className="text-gray-600">Personal Wallet</span>
                                  </div>
                                  <span className="font-medium text-gray-900">
                                    -₹{Math.max(0, totalAmount - businessWalletBalance).toLocaleString()}
                                  </span>
                                </div>
                                <div className="pt-2 border-t">
                                  <div className="flex items-center justify-between text-sm font-semibold">
                                    <span className="text-gray-700">Total Payment</span>
                                    <span className="text-green-600">₹{totalAmount.toLocaleString()}</span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Credit/Debit Card */}
                  <div
                    onClick={() => setSelectedPaymentMethod('card')}
                    className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      selectedPaymentMethod === 'card'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedPaymentMethod === 'card' ? 'border-blue-500' : 'border-gray-300'
                      }`}>
                        {selectedPaymentMethod === 'card' && (
                          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        )}
                      </div>
                      <CreditCard className="w-6 h-6 text-purple-600" />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">Credit / Debit Card</p>
                        <p className="text-sm text-gray-600">Visa, Mastercard, Amex</p>
                      </div>
                    </div>
                    {selectedPaymentMethod === 'card' && (
                      <div className="space-y-3 mt-4 pt-4 border-t">
                        <Input
                          placeholder="Card Number"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="h-11"
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <Input
                            placeholder="MM/YY"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            className="h-11"
                          />
                          <Input
                            placeholder="CVV"
                            value={cardCVV}
                            onChange={(e) => setCardCVV(e.target.value)}
                            className="h-11"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* UPI */}
                  <div
                    onClick={() => setSelectedPaymentMethod('upi')}
                    className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      selectedPaymentMethod === 'upi'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedPaymentMethod === 'upi' ? 'border-blue-500' : 'border-gray-300'
                      }`}>
                        {selectedPaymentMethod === 'upi' && (
                          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        )}
                      </div>
                      <Smartphone className="w-6 h-6 text-green-600" />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">UPI</p>
                        <p className="text-sm text-gray-600">Google Pay, PhonePe, Paytm</p>
                      </div>
                    </div>
                    {selectedPaymentMethod === 'upi' && (
                      <div className="mt-4 pt-4 border-t">
                        <Input
                          placeholder="Enter UPI ID"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          className="h-11"
                        />
                      </div>
                    )}
                  </div>

                  {/* Net Banking */}
                  <div
                    onClick={() => setSelectedPaymentMethod('netbanking')}
                    className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      selectedPaymentMethod === 'netbanking'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedPaymentMethod === 'netbanking' ? 'border-blue-500' : 'border-gray-300'
                      }`}>
                        {selectedPaymentMethod === 'netbanking' && (
                          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        )}
                      </div>
                      <Building2 className="w-6 h-6 text-indigo-600" />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">Net Banking</p>
                        <p className="text-sm text-gray-600">All major banks supported</p>
                      </div>
                    </div>
                    {selectedPaymentMethod === 'netbanking' && (
                      <div className="mt-4 pt-4 border-t">
                        <select
                          value={selectedBank}
                          onChange={(e) => setSelectedBank(e.target.value)}
                          className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                        >
                          <option value="">Select Bank</option>
                          <option value="hdfc">HDFC Bank</option>
                          <option value="icici">ICICI Bank</option>
                          <option value="sbi">State Bank of India</option>
                          <option value="axis">Axis Bank</option>
                        </select>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </div>

            {/* Right: Price Summary */}
            <div className="col-span-1">
              <Card className="p-6 sticky top-24 border-2 border-blue-200">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Price Summary</h3>
                
                <div className="space-y-4 mb-6 pb-6 border-b">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Base Fare</span>
                    <span className="font-semibold">₹{baseAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Taxes & Fees</span>
                    <span className="font-semibold">₹{taxes.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-6">
                  <span className="text-xl font-bold">Total Amount</span>
                  <span className="text-3xl font-bold text-blue-600">₹{totalAmount.toLocaleString()}</span>
                </div>

                <Button
                  onClick={handleCompleteBooking}
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg mb-4"
                >
                  Pay Now
                </Button>

                <div className="space-y-3">
                  <div className="flex items-start gap-2 p-3 bg-green-50 rounded-lg">
                    <Shield className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-green-700">100% secure payment with SSL encryption</p>
                  </div>
                  <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                    <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-blue-700">Instant booking confirmation</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Approval Review Page (for Business Travel)
  if (bookingStep === 'approval-review' && selectedBookingItem) {
    const totalAmount = calculateTotalAmount();
    const baseAmount = selectedService === 'flight' 
      ? selectedBookingItem.price * parseInt(passengers)
      : selectedService === 'hotel' && bookingDetails
      ? selectedBookingItem.price * (bookingDetails.totalNights || 1) * (bookingDetails.roomCount || 1)
      : selectedService === 'bus' && bookingDetails
      ? selectedBookingItem.price * (bookingDetails.seats?.length || 1)
      : selectedService === 'cab' || selectedService === 'bike'
      ? selectedBookingItem.estimatedFare || selectedBookingItem.price
      : 0;
    
    const taxes = Math.round(baseAmount * 0.12);

    const handleSendApprovalRequest = () => {
      // Generate approval request ID
      const requestId = 'APR' + Math.random().toString(36).substring(2, 12).toUpperCase();
      setApprovalRequestId(requestId);
      setBookingConfirmationNumber(requestId);
      
      // Show beautiful modal
      setShowApprovalModal(true);
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-6xl mx-auto px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-[#000035] flex items-center justify-center">
                <FileCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Business Travel Approval Request</h1>
                <p className="text-gray-600">Review details and send for admin approval</p>
              </div>
            </div>
            <div className="bg-gray-50 border-l-4 border-[#000035] p-4 rounded-lg">
              <p className="text-sm text-gray-700">
                <strong>Business Travel Policy:</strong> All business travel bookings require admin approval before confirmation. 
                No payment will be deducted until your request is approved.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-8">
            {/* Left Column: Booking Details */}
            <div className="col-span-2 space-y-6">
              {/* Booking Summary */}
              <Card className="p-6 border-2 border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  {selectedService === 'flight' && <Plane className="w-6 h-6 text-[#000035]" />}
                  {selectedService === 'hotel' && <Hotel className="w-6 h-6 text-[#000035]" />}
                  {selectedService === 'bus' && <Bus className="w-6 h-6 text-[#000035]" />}
                  {selectedService === 'cab' && <Car className="w-6 h-6 text-[#000035]" />}
                  {selectedService === 'bike' && <Bike className="w-6 h-6 text-[#000035]" />}
                  Booking Details
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    {selectedService === 'flight' && <Plane className="w-8 h-8 text-blue-600" />}
                    {selectedService === 'hotel' && <Hotel className="w-8 h-8 text-orange-600" />}
                    {selectedService === 'bus' && <Bus className="w-8 h-8 text-purple-600" />}
                    {selectedService === 'cab' && <Car className="w-8 h-8 text-yellow-600" />}
                    {selectedService === 'bike' && <Bike className="w-8 h-8 text-green-600" />}
                    
                    <div className="flex-1">
                      <p className="font-bold text-xl text-gray-900">
                        {selectedBookingItem.airline || selectedBookingItem.name || selectedBookingItem.operator}
                      </p>
                      <p className="text-gray-600">
                        {selectedService === 'flight' && `${selectedBookingItem.flightNo} • ${from} → ${to}`}
                        {selectedService === 'hotel' && selectedBookingItem.location}
                        {selectedService === 'bus' && `${from} → ${to}`}
                        {(selectedService === 'cab' || selectedService === 'bike') && `${from} → ${to}`}
                      </p>
                    </div>
                  </div>

                  {/* Travel Details Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    {selectedService === 'flight' && (
                      <>
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600 mb-1">Departure</p>
                          <p className="font-semibold text-gray-900">{selectedBookingItem.departure}</p>
                          <p className="text-sm text-gray-600">{departDate}</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600 mb-1">Arrival</p>
                          <p className="font-semibold text-gray-900">{selectedBookingItem.arrival}</p>
                          <p className="text-sm text-gray-600">{departDate}</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600 mb-1">Duration</p>
                          <p className="font-semibold text-gray-900">{selectedBookingItem.duration}</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600 mb-1">Passengers</p>
                          <p className="font-semibold text-gray-900">{passengers} Adult(s)</p>
                        </div>
                      </>
                    )}
                    {selectedService === 'hotel' && bookingDetails && (
                      <>
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600 mb-1">Check-in</p>
                          <p className="font-semibold text-gray-900">{bookingDetails.checkIn}</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600 mb-1">Check-out</p>
                          <p className="font-semibold text-gray-900">{bookingDetails.checkOut}</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600 mb-1">Rooms</p>
                          <p className="font-semibold text-gray-900">{bookingDetails.roomCount}</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600 mb-1">Nights</p>
                          <p className="font-semibold text-gray-900">{bookingDetails.totalNights}</p>
                        </div>
                      </>
                    )}
                    {selectedService === 'bus' && bookingDetails && (
                      <>
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600 mb-1">Seats</p>
                          <p className="font-semibold text-gray-900">{bookingDetails.seats?.join(', ')}</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600 mb-1">Boarding Point</p>
                          <p className="font-semibold text-gray-900">{bookingDetails.pickupPoint}</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </Card>

              {/* Cost Breakdown */}
              <Card className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Cost Breakdown</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-lg">
                    <span className="text-gray-600">Base Fare</span>
                    <span className="font-semibold">₹{baseAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-lg">
                    <span className="text-gray-600">Taxes & Fees</span>
                    <span className="font-semibold">₹{taxes.toLocaleString()}</span>
                  </div>
                  <div className="border-t-2 pt-3"></div>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-gray-900">Total Amount</span>
                    <span className="text-3xl font-bold text-blue-600">₹{totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Right Column: Action Card */}
            <div className="col-span-1">
              <Card className="p-6 sticky top-24 border-2 border-blue-200 bg-gradient-to-br from-white to-blue-50">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center mx-auto mb-4">
                    <Building2 className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Business Travel</h3>
                  <p className="text-sm text-gray-600">Company funded travel</p>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                    <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900 text-sm">Pending Approval</p>
                      <p className="text-xs text-gray-600">Admin will review within 24 hours</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                    <Shield className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900 text-sm">No Payment Yet</p>
                      <p className="text-xs text-gray-600">Payment after approval only</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                    <Check className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900 text-sm">Email Notification</p>
                      <p className="text-xs text-gray-600">You'll be notified of approval status</p>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleSendApprovalRequest}
                  className="w-full h-14 bg-[#000035] hover:bg-[#000055] text-white text-lg mb-3"
                >
                  <FileCheck className="w-5 h-5 mr-2" />
                  Send Approval Request
                </Button>

                <Button
                  onClick={() => setBookingStep('service')}
                  variant="outline"
                  className="w-full h-12"
                >
                  ← Back to Results
                </Button>
              </Card>
            </div>
          </div>

          {/* Beautiful Approval Success Modal */}
          {showApprovalModal && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-300">
              <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 animate-in zoom-in duration-300">
                {/* Header with gradient background */}
                <div className="bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 rounded-t-2xl p-8 text-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                  <div className="relative z-10">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce shadow-lg">
                      <Check className="w-12 h-12 text-green-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">Request Sent Successfully!</h2>
                    <p className="text-white/90 text-lg">Your approval request has been submitted</p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 space-y-6">
                  {/* Request ID Card */}
                  <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-2">Approval Request ID</p>
                      <p className="text-3xl font-mono font-bold text-[#000035] tracking-wider mb-2">
                        {approvalRequestId}
                      </p>
                      <p className="text-xs text-gray-500">Save this ID for future reference</p>
                    </div>
                  </div>

                  {/* Info Cards */}
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <Clock className="w-6 h-6 text-[#000035] flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-gray-900 mb-1">Under Review</p>
                        <p className="text-sm text-gray-600">Admin will review your request within 24 hours</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <Shield className="w-6 h-6 text-[#000035] flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-gray-900 mb-1">No Payment Deducted</p>
                        <p className="text-sm text-gray-600">Payment will be processed only after approval</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <Package className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-gray-900 mb-1">Email Confirmation Sent</p>
                        <p className="text-sm text-gray-600">Check your inbox for request details and updates</p>
                      </div>
                    </div>
                  </div>

                  {/* Total Amount */}
                  <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg p-4 border border-orange-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Pending Approval Amount</p>
                        <p className="text-2xl font-bold text-orange-600">₹{totalAmount.toLocaleString()}</p>
                      </div>
                      <div className="text-5xl">💼</div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3 pt-2">
                    <Button
                      onClick={() => {
                        setShowApprovalModal(false);
                        handleBookAnother();
                      }}
                      className="w-full h-12 bg-[#000035] hover:bg-[#000055] text-white text-lg"
                    >
                      Done
                    </Button>
                    <Button
                      onClick={() => setShowApprovalModal(false)}
                      variant="outline"
                      className="w-full h-12 border-2"
                    >
                      View Request Details
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Service-specific pages
  if (bookingStep === 'service') {
    // Hotels
    if (selectedService === 'hotel') {
      return (
        <HotelBooking
          searchData={{
            location: to,
            checkIn: checkInDate,
            checkOut: checkOutDate,
            guests: guests,
          }}
          onBack={handleBackToSearch}
          onProceedToCheckout={handleProceedToCheckout}
        />
      );
    }

    // Buses
    if (selectedService === 'bus') {
      return (
        <BusBooking
          searchData={{
            from,
            to,
            date: departDate,
          }}
          onBack={handleBackToSearch}
          onProceedToCheckout={handleProceedToCheckout}
        />
      );
    }

    // Cabs
    if (selectedService === 'cab') {
      return (
        <CabBooking
          searchData={{
            pickup: from,
            drop: to,
            date: departDate,
            time: pickupTime,
          }}
          onBack={handleBackToSearch}
          onProceedToCheckout={handleProceedToCheckout}
        />
      );
    }

    // Bikes
    if (selectedService === 'bike') {
      return (
        <BikeBooking
          searchData={{
            pickup: from,
            drop: to,
            date: departDate,
            time: pickupTime,
          }}
          onBack={handleBackToSearch}
          onProceedToCheckout={handleProceedToCheckout}
        />
      );
    }

    // Flights
    if (selectedService === 'flight') {
      return (
        <FlightBooking
          searchData={{
            from,
            to,
            departDate,
            returnDate: tripType === 'round-trip' ? returnDate : undefined,
            passengers,
            tripType,
          }}
          onBack={handleBackToSearch}
          onProceedToCheckout={handleProceedToCheckout}
        />
      );
    }

    // Logistics
    if (selectedService.startsWith('logistics')) {
      return (
        <LogisticsBooking
          searchData={{
            from,
            to,
            date: departDate,
            serviceType: selectedService,
          }}
          onBack={handleBackToSearch}
          onProceedToCheckout={handleProceedToCheckout}
        />
      );
    }
  }

  // Search Page
  return (
    <div className="min-h-screen flex flex-col">
      {/* WalletManagement Modal */}
      {showWalletManagement && (
        <WalletManagement 
          onClose={() => setShowWalletManagement(false)} 
          businessBalance={businessWalletBalance}
          personalBalance={personalWalletBalance}
          onUpdateBalances={handleUpdateWalletBalances}
        />
      )}

      {/* Hero Section with Search Widget */}
      <div className="bg-[#000035] relative overflow-hidden flex-grow">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-6xl mx-auto px-6 py-16 relative z-10">
          <div className="text-center mb-8">
            <h1 className="text-5xl text-white mb-3">
              {category === 'travel' ? 'Book Your Journey' : 'Logistics Services'}
            </h1>
            <p className="text-xl text-white/90">
              {category === 'travel' ? 'Travel Made Simple' : 'Cargo & Delivery Solutions'}
            </p>
          </div>

          {/* Search Widget Card */}
          <Card className="p-6 shadow-2xl">
            {/* Category Tabs with Underline */}
            <div className="mb-4">
              <div className="flex items-center justify-between gap-8 border-b border-gray-200">
                <div className="flex items-center gap-8">
                  <button
                    onClick={() => handleCategoryChange('travel')}
                    className={`pb-2.5 text-base font-medium transition-all relative ${
                      category === 'travel'
                        ? 'text-gray-900'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Travel
                    {category === 'travel' && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#000035]"></div>
                    )}
                  </button>
                  
                  <button
                    onClick={() => handleCategoryChange('logistics')}
                    className={`pb-2.5 text-base font-medium transition-all relative ${
                      category === 'logistics'
                        ? 'text-gray-900'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Logistics
                    {category === 'logistics' && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#000035]"></div>
                    )}
                  </button>
                </div>

                {/* Travel Purpose moved to right side */}
                <div className="flex items-center gap-3 pb-2.5">
                  <span className="text-sm font-medium text-gray-700">Travel Purpose:</span>
                  <button
                    onClick={() => setTravelType('personal')}
                    className={`flex items-center gap-2 px-4 py-1.5 rounded-lg transition-all ${
                      travelType === 'personal'
                        ? 'bg-[#000035] text-white shadow-md'
                        : 'text-gray-700 hover:bg-gray-100 border border-gray-300'
                    }`}
                  >
                    <Users className="w-4 h-4" />
                    <span className="text-sm font-medium">Personal</span>
                  </button>
                  <button
                    onClick={() => setTravelType('business')}
                    className={`flex items-center gap-2 px-4 py-1.5 rounded-lg transition-all ${
                      travelType === 'business'
                        ? 'bg-[#000035] text-white shadow-md'
                        : 'text-gray-700 hover:bg-gray-100 border border-gray-300'
                    }`}
                  >
                    <Building2 className="w-4 h-4" />
                    <span className="text-sm font-medium">Business</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Service Icon Buttons */}
            <div className="flex items-center gap-2 mb-5 pb-4 border-b">
              {currentServices.map((service) => {
                const IconComponent = service.icon;
                return (
                  <button
                    key={service.id}
                    onClick={() => handleServiceSelect(service.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                      selectedService === service.id
                        ? 'bg-[#000035] text-white shadow-md'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span className="text-sm font-medium">{service.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Trip Type Toggle - Only for flights */}
            {selectedService === 'flight' && (
              <div className="flex items-center gap-6 mb-6">
                <button
                  onClick={() => setTripType('one-way')}
                  className={`flex items-center gap-2 pb-2 border-b-2 transition-all ${
                    tripType === 'one-way'
                      ? 'border-[#000035] text-[#000035]'
                      : 'border-transparent text-gray-600'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    tripType === 'one-way' ? 'border-[#000035]' : 'border-gray-300'
                  }`}>
                    {tripType === 'one-way' && <div className="w-3 h-3 rounded-full bg-[#000035]"></div>}
                  </div>
                  <span className="font-medium">One Way</span>
                </button>
                
                <button
                  onClick={() => setTripType('round-trip')}
                  className={`flex items-center gap-2 pb-2 border-b-2 transition-all ${
                    tripType === 'round-trip'
                      ? 'border-[#000035] text-[#000035]'
                      : 'border-transparent text-gray-600'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    tripType === 'round-trip' ? 'border-[#000035]' : 'border-gray-300'
                  }`}>
                    {tripType === 'round-trip' && <div className="w-3 h-3 rounded-full bg-[#000035]"></div>}
                  </div>
                  <span className="font-medium">Round Trip</span>
                </button>

                <div className="flex-1"></div>

                {/* Passenger Selector */}
                <div className="flex items-center gap-3 px-4 py-2 border rounded-lg hover:border-gray-400 cursor-pointer">
                  <Users className="w-5 h-5 text-gray-600" />
                  <span className="text-sm">{passengers} Traveller</span>
                  <ChevronDown className="w-4 h-4 text-gray-600" />
                </div>
              </div>
            )}

            {/* Search Inputs - Different layouts for different services */}
            {selectedService === 'hotel' ? (
              // Hotel search form
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-5">
                  <label className="block text-xs text-gray-600 mb-2 font-medium uppercase">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                    <Input
                      value={to}
                      onChange={(e) => setTo(e.target.value)}
                      className="h-12 pl-10 border-2 focus:border-blue-500"
                      placeholder="Enter city or hotel"
                    />
                  </div>
                </div>

                <div className="col-span-2">
                  <label className="block text-xs text-gray-600 mb-2 font-medium uppercase">Check-in</label>
                  <Input
                    type="date"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    className="h-12 px-3 border-2 focus:border-blue-500"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs text-gray-600 mb-2 font-medium uppercase">Check-out</label>
                  <Input
                    type="date"
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    className="h-12 px-3 border-2 focus:border-blue-500"
                  />
                </div>

                <div className="col-span-3">
                  <label className="block text-xs text-transparent mb-2">-</label>
                  <Button
                    onClick={handleSearch}
                    className="w-full h-12 bg-[#000035] hover:bg-[#000055] text-white font-medium shadow-lg hover:shadow-xl transition-all"
                  >
                    <Search className="w-5 h-5 mr-2" />
                    SEARCH
                  </Button>
                </div>
              </div>
            ) : selectedService === 'cab' || selectedService === 'bike' ? (
              // Cab/Bike search form
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-3">
                  <label className="block text-xs text-gray-600 mb-2 font-medium uppercase">Pickup</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                    <Input
                      value={from}
                      onChange={(e) => setFrom(e.target.value)}
                      className="h-12 pl-10 border-2 focus:border-blue-500"
                      placeholder="Enter location"
                    />
                  </div>
                </div>

                <div className="col-span-1 flex items-center justify-center pt-6">
                  <button
                    onClick={handleSwapCities}
                    className="w-10 h-10 rounded-full bg-white border-2 border-[#000035] flex items-center justify-center hover:bg-gray-50 transition-all shadow-md hover:shadow-lg"
                  >
                    <ArrowRightLeft className="w-4 h-4 text-[#000035]" strokeWidth={1.5} />
                  </button>
                </div>

                <div className="col-span-3">
                  <label className="block text-xs text-gray-600 mb-2 font-medium uppercase">Drop</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                    <Input
                      value={to}
                      onChange={(e) => setTo(e.target.value)}
                      className="h-12 pl-10 border-2 focus:border-blue-500"
                      placeholder="Enter location"
                    />
                  </div>
                </div>

                <div className="col-span-2">
                  <label className="block text-xs text-gray-600 mb-2 font-medium uppercase">Date</label>
                  <Input
                    type="date"
                    value={departDate}
                    onChange={(e) => setDepartDate(e.target.value)}
                    className="h-12 px-3 border-2 focus:border-blue-500"
                  />
                </div>

                <div className="col-span-3">
                  <label className="block text-xs text-transparent mb-2">-</label>
                  <Button
                    onClick={handleSearch}
                    className="w-full h-12 bg-[#000035] hover:bg-[#000055] text-white font-medium shadow-lg hover:shadow-xl transition-all"
                  >
                    <Search className="w-5 h-5 mr-2" />
                    SEARCH
                  </Button>
                </div>
              </div>
            ) : (
              // Flight/Bus search form
              <div className="grid grid-cols-12 gap-4">
                <div className={selectedService === 'flight' && tripType === 'round-trip' ? 'col-span-2' : 'col-span-3'}>
                  <label className="block text-xs text-gray-600 mb-2 font-medium uppercase">From</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                    <Input
                      value={from}
                      onChange={(e) => setFrom(e.target.value)}
                      className="h-12 pl-10 border-2 focus:border-blue-500"
                      placeholder="Enter city"
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">India</div>
                </div>

                <div className="col-span-1 flex items-center justify-center pt-6">
                  <button
                    onClick={handleSwapCities}
                    className="w-10 h-10 rounded-full bg-white border-2 border-[#000035] flex items-center justify-center hover:bg-gray-50 transition-all shadow-md hover:shadow-lg"
                  >
                    <ArrowRightLeft className="w-4 h-4 text-[#000035]" strokeWidth={1.5} />
                  </button>
                </div>

                <div className={selectedService === 'flight' && tripType === 'round-trip' ? 'col-span-2' : 'col-span-3'}>
                  <label className="block text-xs text-gray-600 mb-2 font-medium uppercase">To</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                    <Input
                      value={to}
                      onChange={(e) => setTo(e.target.value)}
                      className="h-12 pl-10 border-2 focus:border-blue-500"
                      placeholder="Enter city"
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">India</div>
                </div>

                <div className={selectedService === 'flight' && tripType === 'round-trip' ? 'col-span-2' : 'col-span-2'}>
                  <label className="block text-xs text-gray-600 mb-2 font-medium uppercase">Departure</label>
                  <Input
                    type="date"
                    value={departDate}
                    onChange={(e) => setDepartDate(e.target.value)}
                    placeholder="dd-mm-yyyy"
                    className="h-12 px-3 border-2 focus:border-blue-500"
                  />
                </div>

                {selectedService === 'flight' && tripType === 'round-trip' && (
                  <div className="col-span-2">
                    <label className="block text-xs text-gray-600 mb-2 font-medium uppercase">Return</label>
                    <Input
                      type="date"
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      placeholder="dd-mm-yyyy"
                      className="h-12 px-3 border-2 focus:border-blue-500"
                    />
                  </div>
                )}

                <div className={selectedService === 'flight' && tripType === 'round-trip' ? 'col-span-3' : 'col-span-3'}>
                  <label className="block text-xs text-transparent mb-2">-</label>
                  <Button
                    onClick={handleSearch}
                    className="w-full h-12 bg-[#000035] hover:bg-[#000055] text-white font-medium shadow-lg hover:shadow-xl transition-all"
                  >
                    <Search className="w-5 h-5 mr-2" />
                    SEARCH
                  </Button>
                </div>
              </div>
            )}
          </Card>

          {/* Offers Banner */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <Card className="p-4 bg-white/10 backdrop-blur-sm border border-white/30 hover:bg-white/15 hover:border-white/50 transition-all hover:scale-105">
              <div className="text-sm text-white/90 mb-1">FLASH DEAL</div>
              <div className="text-xl font-bold text-white mb-1">Up to 30% OFF</div>
              <div className="text-xs text-white/80">On domestic bookings</div>
            </Card>
            <Card className="p-4 bg-white/10 backdrop-blur-sm border border-white/30 hover:bg-white/15 hover:border-white/50 transition-all hover:scale-105">
              <div className="text-sm text-white/90 mb-1">WALLET OFFER</div>
              <div className="text-xl font-bold text-white mb-1">Flat ₹500 OFF</div>
              <div className="text-xs text-white/80">On wallet payment</div>
            </Card>
            <Card className="p-4 bg-white/10 backdrop-blur-sm border border-white/30 hover:bg-white/15 hover:border-white/50 transition-all hover:scale-105">
              <div className="text-sm text-white/90 mb-1">FIRST BOOKING</div>
              <div className="text-xl font-bold text-white mb-1">Extra 10% OFF</div>
              <div className="text-xs text-white/80">Use code: FIRST10</div>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-400">
              © 2025 SimplifyMove. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <span className="flex items-center gap-2">
                <Smartphone className="w-4 h-4" />
                +91 1800-123-4567
              </span>
              <span>•</span>
              <span>support@simplifymove.com</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}