import { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { 
  Truck, 
  Package, 
  Bike,
  MapPin, 
  Calendar, 
  Clock,
  ChevronLeft,
  ChevronRight,
  Star,
  Shield,
  Check,
  AlertCircle,
  Weight,
  Ruler,
  Box,
  Info,
  Phone,
  User,
  Loader2,
  Navigation,
  DollarSign,
  Download,
  CheckCircle2
} from 'lucide-react';

interface LogisticsBookingProps {
  searchData: {
    from: string;
    to: string;
    date: string;
    serviceType: string;
  };
  onBack: () => void;
  onProceedToCheckout: (vehicle: any, bookingDetails: any) => void;
}

export function LogisticsBooking({ searchData, onBack, onProceedToCheckout }: LogisticsBookingProps) {
  const [step, setStep] = useState<'request' | 'searching' | 'captain-found' | 'otp-pickup' | 'in-transit' | 'otp-delivery' | 'completed'>('request');
  const [quoteDetails, setQuoteDetails] = useState({
    itemDescription: '',
    weight: '',
    dimensions: '',
    specialInstructions: '',
    contactName: '',
    contactPhone: ''
  });
  const [deliveryDetails, setDeliveryDetails] = useState({
    packageDescription: '',
    weight: '',
    recipientName: '',
    recipientPhone: '',
    fragile: false,
  });
  const [estimatedFare, setEstimatedFare] = useState(0);
  const [searchingTimer, setSearchingTimer] = useState(0);
  const [captain, setCaptain] = useState<any>(null);
  const [pickupOTP, setPickupOTP] = useState('');
  const [deliveryOTP, setDeliveryOTP] = useState('');
  const [generatedPickupOTP, setGeneratedPickupOTP] = useState('');
  const [generatedDeliveryOTP, setGeneratedDeliveryOTP] = useState('');
  const [transitProgress, setTransitProgress] = useState(0);
  const [actualFare, setActualFare] = useState(0);
  const [bookingId, setBookingId] = useState('');
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);
  
  // Check if this is a direct booking service (bike or auto) or quote-based (trucks)
  const isDirectBooking = searchData.serviceType === 'logistics-bike' || searchData.serviceType === 'logistics-auto';
  const isQuoteBased = !isDirectBooking;

  // Calculate estimated fare based on distance (mock calculation)
  useEffect(() => {
    if (isDirectBooking) {
      const baseFare = searchData.serviceType === 'logistics-bike' ? 120 : 350;
      const distance = Math.random() * 10 + 5; // Mock distance 5-15 km
      const calculatedFare = Math.round(baseFare + (distance * 10));
      setEstimatedFare(calculatedFare);
    }
  }, [searchData, isDirectBooking]);

  // Simulate captain search
  useEffect(() => {
    if (step === 'searching') {
      const timer = setInterval(() => {
        setSearchingTimer(prev => prev + 1);
      }, 1000);

      // Simulate finding a captain after 5-8 seconds
      const findCaptainTimeout = setTimeout(() => {
        const mockCaptain = {
          name: 'Rajesh Kumar',
          phone: '+91 98765 43210',
          rating: 4.7,
          trips: 1240,
          vehicleNumber: searchData.serviceType === 'logistics-bike' ? 'MH 02 AB 1234' : 'MH 02 CD 5678',
          vehicleType: searchData.serviceType === 'logistics-bike' ? 'Honda Activa' : 'Bajaj Auto',
          eta: '8 mins',
          photo: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=200'
        };
        setCaptain(mockCaptain);
        setStep('captain-found');
        clearInterval(timer);
      }, Math.random() * 3000 + 5000); // 5-8 seconds

      return () => {
        clearInterval(timer);
        clearTimeout(findCaptainTimeout);
      };
    }
  }, [step, searchData.serviceType]);

  const handleRequestDelivery = () => {
    if (!deliveryDetails.packageDescription || !deliveryDetails.weight || 
        !deliveryDetails.recipientName || !deliveryDetails.recipientPhone) {
      return;
    }
    setStep('searching');
  };

  const handleQuoteSubmit = () => {
    const quoteRequest = {
      type: 'quote_request',
      service: searchData.serviceType,
      from: searchData.from,
      to: searchData.to,
      date: searchData.date,
      ...quoteDetails,
      status: 'pending_quote',
      submittedAt: new Date().toISOString()
    };
    
    console.log('Quote Request:', quoteRequest);
    alert('Quote request submitted successfully! Our team will contact you within 2-4 hours with pricing.');
    onBack();
  };

  const handleCancelSearch = () => {
    setStep('request');
    setSearchingTimer(0);
  };

  const handleConfirmBooking = () => {
    // Generate OTPs and booking ID
    const pickupOtp = Math.floor(1000 + Math.random() * 9000).toString();
    const deliveryOtp = Math.floor(1000 + Math.random() * 9000).toString();
    const bookingIdGenerated = `LB${Date.now().toString().slice(-8)}`;
    const mockDistance = (Math.random() * 10 + 5).toFixed(1);
    const mockDuration = Math.round(parseFloat(mockDistance) * 4);
    
    setGeneratedPickupOTP(pickupOtp);
    setGeneratedDeliveryOTP(deliveryOtp);
    setBookingId(bookingIdGenerated);
    setDistance(parseFloat(mockDistance));
    setDuration(mockDuration);
    
    // Calculate actual fare based on distance
    const baseFare = searchData.serviceType === 'logistics-bike' ? 120 : 350;
    const calculatedFare = Math.round(baseFare + (parseFloat(mockDistance) * 10));
    setActualFare(calculatedFare);
    
    setStep('otp-pickup');
  };

  // Quote-Based Flow (Trucks)
  if (isQuoteBased) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50">
        <div className="bg-white border-b sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <Button variant="ghost" onClick={onBack} className="gap-2">
              <ChevronLeft className="w-5 h-5" />
              Back to Search
            </Button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-8">
          <Card className="p-6 bg-gradient-to-r from-orange-600 to-red-600 text-white mb-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Request a Quote</h3>
                <p className="text-white/90">
                  This service requires a custom quotation based on your specific needs. Our team will review your request, contact our vendors, and send you a competitive quote within 2-4 hours.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Logistics Quote Request</h2>
              <p className="text-gray-600">
                Fill in the details below and our team will get back to you with the best pricing
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pickup Location</p>
                <p className="font-semibold text-gray-900">{searchData.from}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Drop Location</p>
                <p className="font-semibold text-gray-900">{searchData.to}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Preferred Date</p>
                <p className="font-semibold text-gray-900">{searchData.date}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Service Type</p>
                <p className="font-semibold text-gray-900">
                  {searchData.serviceType === 'logistics-mini' && 'Mini Truck'}
                  {searchData.serviceType === 'logistics-medium' && 'Medium Truck'}
                  {searchData.serviceType === 'logistics-dcm' && 'DCM Truck'}
                  {searchData.serviceType === 'logistics-container' && 'Container'}
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Item Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={quoteDetails.itemDescription}
                  onChange={(e) => setQuoteDetails({ ...quoteDetails, itemDescription: e.target.value })}
                  placeholder="Describe what you need to transport (e.g., Furniture, Electronics, Construction Materials...)"
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none min-h-[100px]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estimated Weight (kg) <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="number"
                    value={quoteDetails.weight}
                    onChange={(e) => setQuoteDetails({ ...quoteDetails, weight: e.target.value })}
                    placeholder="e.g., 500"
                    className="border-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dimensions (L x W x H cm) <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={quoteDetails.dimensions}
                    onChange={(e) => setQuoteDetails({ ...quoteDetails, dimensions: e.target.value })}
                    placeholder="e.g., 200x150x150"
                    className="border-2"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special Instructions (Optional)
                </label>
                <textarea
                  value={quoteDetails.specialInstructions}
                  onChange={(e) => setQuoteDetails({ ...quoteDetails, specialInstructions: e.target.value })}
                  placeholder="Any special requirements? (e.g., Fragile items, Loading help needed, Time constraints...)"
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none min-h-[80px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={quoteDetails.contactName}
                    onChange={(e) => setQuoteDetails({ ...quoteDetails, contactName: e.target.value })}
                    placeholder="Your name"
                    className="border-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Phone <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={quoteDetails.contactPhone}
                    onChange={(e) => setQuoteDetails({ ...quoteDetails, contactPhone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="border-2"
                    required
                  />
                </div>
              </div>
            </div>

            <Card className="p-4 bg-blue-50 border-blue-200 mt-6">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-900 mb-2">What happens next?</p>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Our team reviews your request and contacts our logistics partners</li>
                    <li>• You'll receive a detailed quote within 2-4 hours</li>
                    <li>• Quote will include breakdown of costs and service details</li>
                    <li>• If approved, amount will be debited from your company's business wallet</li>
                    <li>• You can track your request status in the "My Bookings" section</li>
                  </ul>
                </div>
              </div>
            </Card>

            <div className="mt-8 flex gap-4">
              <Button
                variant="outline"
                onClick={onBack}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleQuoteSubmit}
                disabled={
                  !quoteDetails.itemDescription ||
                  !quoteDetails.weight ||
                  !quoteDetails.dimensions ||
                  !quoteDetails.contactName ||
                  !quoteDetails.contactPhone
                }
                className="flex-1 h-12 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-lg disabled:opacity-50"
              >
                Submit Quote Request
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </div>

            {(!quoteDetails.itemDescription || !quoteDetails.weight || !quoteDetails.dimensions || !quoteDetails.contactName || !quoteDetails.contactPhone) && (
              <p className="mt-3 text-sm text-red-600 text-center">
                Please fill all required fields (*)
              </p>
            )}
          </Card>
        </div>
      </div>
    );
  }

  // Direct Booking Flow (Bike & Auto) - Rapido/Uber Style

  // Step 1: Enter Delivery Details & Request
  if (step === 'request') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
        <div className="bg-white border-b sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <Button variant="ghost" onClick={onBack} className="gap-2">
              <ChevronLeft className="w-5 h-5" />
              Back
            </Button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-8">
          <Card className="p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {searchData.serviceType === 'logistics-bike' ? 'Bike Parcel Delivery' : '3-Wheeler Auto Delivery'}
              </h2>
              <p className="text-gray-600">
                Enter delivery details to find nearby captains
              </p>
            </div>

            {/* Route Info */}
            <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border-2 border-green-200">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-600 mb-1">Pickup Location</p>
                    <p className="font-semibold text-gray-900">{searchData.from}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-center">
                  <div className="h-8 w-px bg-gray-300"></div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-600 mb-1">Drop Location</p>
                    <p className="font-semibold text-gray-900">{searchData.to}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
                  <Calendar className="w-4 h-4 text-gray-600" />
                  <p className="text-sm text-gray-700">{searchData.date}</p>
                </div>
              </div>
            </div>

            {/* Estimated Fare */}
            <Card className="p-4 bg-green-50 border-green-200 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Estimated Fare</p>
                  <p className="text-xs text-gray-500 mt-0.5">Final fare may vary based on actual distance</p>
                </div>
                <p className="text-2xl font-bold text-green-600">₹{estimatedFare}</p>
              </div>
            </Card>

            {/* Delivery Details Form */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Package Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={deliveryDetails.packageDescription}
                  onChange={(e) => setDeliveryDetails({ ...deliveryDetails, packageDescription: e.target.value })}
                  placeholder="What are you sending? (e.g., Documents, Food, Electronics...)"
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none min-h-[80px]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Approximate Weight (kg) <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  value={deliveryDetails.weight}
                  onChange={(e) => setDeliveryDetails({ ...deliveryDetails, weight: e.target.value })}
                  placeholder="e.g., 5"
                  className="border-2"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Recipient Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={deliveryDetails.recipientName}
                    onChange={(e) => setDeliveryDetails({ ...deliveryDetails, recipientName: e.target.value })}
                    placeholder="Full name"
                    className="border-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Recipient Phone <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={deliveryDetails.recipientPhone}
                    onChange={(e) => setDeliveryDetails({ ...deliveryDetails, recipientPhone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="border-2"
                    required
                  />
                </div>
              </div>

              <div 
                onClick={() => setDeliveryDetails({ ...deliveryDetails, fragile: !deliveryDetails.fragile })}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  deliveryDetails.fragile ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                    deliveryDetails.fragile ? 'border-green-500 bg-green-500' : 'border-gray-300'
                  }`}>
                    {deliveryDetails.fragile && <Check className="w-4 h-4 text-white" />}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Fragile Items</p>
                    <p className="text-sm text-gray-600">Captain will handle with extra care</p>
                  </div>
                </div>
              </div>
            </div>

            <Card className="p-4 bg-blue-50 border-blue-200 mt-6">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-900 mb-1">How it works</p>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Your request will be sent to nearby captains</li>
                    <li>• A captain will accept within 2-3 minutes</li>
                    <li>• You'll see captain details and can track live</li>
                    <li>• Pay after successful delivery</li>
                  </ul>
                </div>
              </div>
            </Card>

            <Button
              onClick={handleRequestDelivery}
              disabled={
                !deliveryDetails.packageDescription ||
                !deliveryDetails.weight ||
                !deliveryDetails.recipientName ||
                !deliveryDetails.recipientPhone
              }
              className="w-full h-14 mt-8 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-lg disabled:opacity-50"
            >
              Find Captain
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>

            {(!deliveryDetails.packageDescription || !deliveryDetails.weight || !deliveryDetails.recipientName || !deliveryDetails.recipientPhone) && (
              <p className="mt-3 text-sm text-red-600 text-center">
                Please fill all required fields (*)
              </p>
            )}
          </Card>
        </div>
      </div>
    );
  }

  // Step 2: Searching for Captain
  if (step === 'searching') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center">
        <Card className="p-12 max-w-lg mx-6 text-center">
          <div className="relative w-32 h-32 mx-auto mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-blue-500 rounded-full animate-ping opacity-20"></div>
            <div className="relative w-32 h-32 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center">
              {searchData.serviceType === 'logistics-bike' ? (
                <Bike className="w-16 h-16 text-white" />
              ) : (
                <Truck className="w-16 h-16 text-white" />
              )}
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">Finding Captain...</h2>
          <p className="text-gray-600 mb-6">
            Sending your request to nearby captains
          </p>

          <div className="space-y-3 mb-8">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-sm text-gray-700">Request sent</span>
              <Check className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-700">Waiting for captain to accept</span>
              <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg opacity-50">
              <span className="text-sm text-gray-700">Captain details</span>
              <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
            </div>
          </div>

          <p className="text-sm text-gray-500 mb-6">
            Search time: {searchingTimer} seconds
          </p>

          <Button
            variant="outline"
            onClick={handleCancelSearch}
            className="w-full"
          >
            Cancel Request
          </Button>

          <p className="text-xs text-gray-500 mt-4">
            Usually takes 30-60 seconds to find a captain
          </p>
        </Card>
      </div>
    );
  }

  // Step 3: Captain Found
  if (step === 'captain-found' && captain) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
        <div className="bg-white border-b sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <Button variant="ghost" onClick={handleCancelSearch} className="gap-2">
              <ChevronLeft className="w-5 h-5" />
              Cancel
            </Button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-8">
          {/* Success Banner */}
          <Card className="p-6 bg-gradient-to-r from-green-600 to-blue-600 text-white mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Check className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-1">Captain Found!</h3>
                <p className="text-white/90">Your delivery partner is ready to pickup</p>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-3 gap-6">
            {/* Left Column - Captain Details */}
            <div className="col-span-2 space-y-6">
              {/* Captain Info */}
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Your Captain</h3>
                
                <div className="flex items-center gap-4 mb-6">
                  <img 
                    src={captain.photo} 
                    alt={captain.name}
                    className="w-20 h-20 rounded-full object-cover border-4 border-green-500"
                  />
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-gray-900">{captain.name}</h4>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center gap-1 bg-green-100 px-2 py-1 rounded">
                        <Star className="w-4 h-4 text-green-600 fill-green-600" />
                        <span className="text-sm font-semibold text-green-700">{captain.rating}</span>
                      </div>
                      <span className="text-sm text-gray-600">{captain.trips.toLocaleString()} trips</span>
                    </div>
                  </div>
                  <a 
                    href={`tel:${captain.phone}`}
                    className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center hover:bg-green-700 transition-colors"
                  >
                    <Phone className="w-5 h-5 text-white" />
                  </a>
                </div>

                {/* Vehicle Info */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Vehicle Type</p>
                    <p className="font-semibold text-gray-900">{captain.vehicleType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Vehicle Number</p>
                    <p className="font-semibold text-gray-900">{captain.vehicleNumber}</p>
                  </div>
                </div>

                {/* ETA */}
                <div className="mt-4 p-4 bg-green-50 border-2 border-green-200 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Clock className="w-6 h-6 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-600">Arriving in</p>
                      <p className="text-2xl font-bold text-green-600">{captain.eta}</p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Delivery Details */}
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Delivery Details</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 bg-green-50 rounded-xl">
                    <MapPin className="w-5 h-5 text-green-600 mt-1" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 mb-1">Pickup Location</p>
                      <p className="font-semibold text-gray-900">{searchData.from}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-red-50 rounded-xl">
                    <MapPin className="w-5 h-5 text-red-600 mt-1" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 mb-1">Drop Location</p>
                      <p className="font-semibold text-gray-900">{searchData.to}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                    <Package className="w-5 h-5 text-gray-600 mt-1" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 mb-1">Package Description</p>
                      <p className="font-semibold text-gray-900">{deliveryDetails.packageDescription}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                      <Weight className="w-5 h-5 text-gray-600 mt-1" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-600 mb-1">Weight</p>
                        <p className="font-semibold text-gray-900">{deliveryDetails.weight} kg</p>
                      </div>
                    </div>
                    {deliveryDetails.fragile && (
                      <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-xl">
                        <AlertCircle className="w-5 h-5 text-orange-600 mt-1" />
                        <div className="flex-1">
                          <p className="text-sm text-gray-600 mb-1">Special Care</p>
                          <p className="font-semibold text-orange-700">Fragile Items</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl">
                    <User className="w-5 h-5 text-blue-600 mt-1" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 mb-1">Recipient</p>
                      <p className="font-semibold text-gray-900">{deliveryDetails.recipientName}</p>
                      <p className="text-sm text-gray-600 mt-1">{deliveryDetails.recipientPhone}</p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Instructions */}
              <Card className="p-4 bg-blue-50 border-blue-200">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-900 mb-1">Next Steps</p>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Captain is on the way to pickup location</li>
                      <li>• Please keep the package ready</li>
                      <li>• You can call the captain if needed</li>
                      <li>• Payment will be collected after successful delivery</li>
                      <li>• Track your delivery in "My Bookings" section</li>
                    </ul>
                  </div>
                </div>
              </Card>
            </div>

            {/* Right Column - Fare Summary */}
            <div className="col-span-1">
              <Card className="p-6 sticky top-24 border-2 border-green-200">
                <h3 className="text-xl font-semibold mb-4">Fare Details</h3>
                
                <div className="space-y-3 mb-6 pb-6 border-b">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Base Fare</span>
                    <span className="font-semibold">₹{estimatedFare}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Taxes & Fees</span>
                    <span className="font-semibold">₹{Math.round(estimatedFare * 0.12)}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-6">
                  <span className="text-lg font-semibold">Estimated Total</span>
                  <span className="text-2xl font-bold text-green-600">
                    ₹{(estimatedFare + Math.round(estimatedFare * 0.12)).toLocaleString()}
                  </span>
                </div>

                <p className="text-xs text-gray-500 mb-6 text-center">
                  Final fare may vary based on actual distance and time
                </p>

                <Button 
                  onClick={handleConfirmBooking}
                  className="w-full h-12 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                >
                  Confirm Booking
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>

                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Shield className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-green-700">
                      Pay after delivery. All captains are verified and insured.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}