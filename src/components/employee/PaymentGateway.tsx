import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  ArrowLeft,
  CheckCircle2,
  MapPin,
  Calendar,
  Clock,
  Plane,
  Bus,
  Car,
  Hotel,
  Truck,
  Building2,
  Wallet,
  CreditCard,
  Shield,
  Info,
  AlertCircle,
  User,
  Mail,
  Phone,
  FileText,
  Lock,
  ChevronRight
} from 'lucide-react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface PaymentGatewayProps {
  booking: any;
  onBack: () => void;
  onPaymentSuccess: () => void;
}

export function PaymentGateway({ booking, onBack, onPaymentSuccess }: PaymentGatewayProps) {
  const [selectedWallet, setSelectedWallet] = useState<'business' | 'personal'>('business');
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [processing, setProcessing] = useState(false);

  const getServiceIcon = (service: string) => {
    switch (service) {
      case 'Flight': return Plane;
      case 'Bus': return Bus;
      case 'Cab': return Car;
      case 'Hotel': return Hotel;
      case 'Truck': return Truck;
      default: return Plane;
    }
  };

  const handlePayment = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setShowPaymentSuccess(true);
      setTimeout(() => {
        onPaymentSuccess();
      }, 3000);
    }, 2000);
  };

  const ServiceIcon = getServiceIcon(booking.service);

  if (showPaymentSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center animate-in fade-in zoom-in duration-500">
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-in zoom-in duration-700">
            <CheckCircle2 className="w-12 h-12 text-white" />
          </div>
          
          <h2 className="mb-2 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Payment Successful!
          </h2>
          <p className="text-gray-600 mb-6">
            Your booking has been confirmed
          </p>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Booking ID</span>
              <span className="text-sm font-mono">{booking.id}</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Amount Paid</span>
              <span className="text-green-600">₹{booking.amount.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Payment Method</span>
              <span className="text-sm">{selectedWallet === 'business' ? 'Business' : 'Personal'} Wallet</span>
            </div>
          </div>

          <div className="space-y-2">
            <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
              <FileText className="w-4 h-4 mr-2" />
              Download Invoice
            </Button>
            <Button variant="outline" className="w-full">
              View Booking Details
            </Button>
          </div>

          <p className="text-xs text-gray-500 mt-6">
            A confirmation email has been sent to your registered email address
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Bookings</span>
            </button>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-green-600" />
              <span className="text-sm text-gray-600">Secure Payment</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="mb-2">Complete Your Payment</h1>
          <p className="text-gray-600">Review your booking details and proceed with payment</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Booking Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Approval Status Banner */}
            <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-green-900 mb-1">Request Approved</h3>
                  <p className="text-sm text-green-700 mb-2">
                    Your booking request has been approved by {booking.approver}
                  </p>
                  {booking.approvalNotes && (
                    <div className="bg-white/60 rounded-lg p-3 text-sm text-green-800">
                      <div className="flex items-start gap-2">
                        <Info className="w-4 h-4 mt-0.5" />
                        <div>
                          <div className="font-medium mb-1">Approval Notes:</div>
                          <div>{booking.approvalNotes}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Trip Details */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <ServiceIcon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3>{booking.service} Booking</h3>
                    <p className="text-sm text-gray-600">Booking ID: {booking.id}</p>
                  </div>
                </div>
                {booking.purpose && (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg px-5 py-3 border-2 border-blue-300 shadow-sm">
                    <div className="text-xs text-blue-700 mb-1 font-semibold uppercase tracking-wide">Travel Purpose</div>
                    <div className="text-sm text-blue-900 font-medium">{booking.purpose}</div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {/* Route */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex-1">
                      <div className="text-sm text-gray-600 mb-1">From</div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-lg">{booking.from}</span>
                      </div>
                    </div>
                    <div className="px-4">
                      <ChevronRight className="w-6 h-6 text-gray-400" />
                    </div>
                    <div className="flex-1 text-right">
                      <div className="text-sm text-gray-600 mb-1">To</div>
                      <div className="flex items-center justify-end gap-2">
                        <span className="text-lg">{booking.to}</span>
                        <MapPin className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Departure Date</div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">
                          {new Date(booking.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                    {booking.departureTime && (
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Departure Time</div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{booking.departureTime}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Service Specific Details */}
                {booking.flightNo && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-sm text-gray-600 mb-1">Flight Number</div>
                      <div className="text-sm font-mono">{booking.flightNo}</div>
                    </div>
                    {booking.returnDate && (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-sm text-gray-600 mb-1">Return Date</div>
                        <div className="text-sm">
                          {new Date(booking.returnDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {booking.nights && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-sm text-gray-600 mb-1">Duration</div>
                      <div className="text-sm">{booking.nights} Nights</div>
                    </div>
                    {booking.roomType && (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-sm text-gray-600 mb-1">Room Type</div>
                        <div className="text-sm">{booking.roomType}</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Card>

            {/* Payment Method Selection */}
            <Card className="p-6">
              <h3 className="mb-4">Select Payment Method</h3>
              
              <div className="space-y-3">
                {/* Business Wallet */}
                <button
                  onClick={() => setSelectedWallet('business')}
                  className={`w-full p-4 rounded-lg border-2 transition-all ${
                    selectedWallet === 'business'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      selectedWallet === 'business' ? 'bg-blue-600' : 'bg-gray-100'
                    }`}>
                      <Building2 className={`w-6 h-6 ${
                        selectedWallet === 'business' ? 'text-white' : 'text-gray-600'
                      }`} />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Business Wallet</span>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          Recommended
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        Available Balance: ₹45,000
                      </div>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedWallet === 'business'
                        ? 'border-blue-600 bg-blue-600'
                        : 'border-gray-300'
                    }`}>
                      {selectedWallet === 'business' && (
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      )}
                    </div>
                  </div>
                </button>

                {/* Personal Wallet */}
                <button
                  onClick={() => setSelectedWallet('personal')}
                  className={`w-full p-4 rounded-lg border-2 transition-all ${
                    selectedWallet === 'personal'
                      ? 'border-green-600 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      selectedWallet === 'personal' ? 'bg-green-600' : 'bg-gray-100'
                    }`}>
                      <Wallet className={`w-6 h-6 ${
                        selectedWallet === 'personal' ? 'text-white' : 'text-gray-600'
                      }`} />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-medium">Personal Wallet</div>
                      <div className="text-sm text-gray-600 mt-1">
                        Available Balance: ₹12,500
                      </div>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedWallet === 'personal'
                        ? 'border-green-600 bg-green-600'
                        : 'border-gray-300'
                    }`}>
                      {selectedWallet === 'personal' && (
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      )}
                    </div>
                  </div>
                </button>
              </div>

              <div className="mt-4 p-3 bg-blue-50 rounded-lg flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-600 mt-0.5" />
                <p className="text-xs text-blue-800">
                  Since this is a business booking, payment will be deducted from your Business Wallet. 
                  You can select Personal Wallet if you wish to pay from your personal account.
                </p>
              </div>
            </Card>

            {/* Terms & Conditions */}
            <Card className="p-6 bg-gray-50">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-gray-600 mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-sm mb-2">Payment Security & Terms</h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• Your payment information is encrypted and secure</li>
                    <li>• Cancellation policy applies as per service provider terms</li>
                    <li>• Refunds will be processed to the same payment method</li>
                    <li>• By proceeding, you agree to our Terms of Service</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Price Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className="p-6">
                <h3 className="mb-4">Price Summary</h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Base Fare</span>
                    <span className="text-sm">₹{(booking.amount * 0.70).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Taxes & Fees</span>
                    <span className="text-sm">₹{(booking.amount * 0.12).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Service Charges</span>
                    <span className="text-sm">₹{(booking.amount * 0.08).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">GST (18%)</span>
                    <span className="text-sm">₹{(booking.amount * 0.10).toLocaleString()}</span>
                  </div>
                  
                  <div className="border-t pt-3 mt-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="">Total Amount</span>
                      <span className="text-2xl text-gray-900">₹{booking.amount.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Payment Method</span>
                      <span className={selectedWallet === 'business' ? 'text-blue-600' : 'text-green-600'}>
                        {selectedWallet === 'business' ? 'Business' : 'Personal'} Wallet
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 py-6"
                  onClick={handlePayment}
                  disabled={processing}
                >
                  {processing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5 mr-2" />
                      Pay ₹{booking.amount.toLocaleString()}
                    </>
                  )}
                </Button>

                <div className="mt-4 text-center">
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                    <Shield className="w-3 h-3" />
                    <span>100% Secure Payment</span>
                  </div>
                </div>
              </Card>

              {/* Support Card */}
              <Card className="p-4 mt-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                <div className="text-center">
                  <div className="text-sm mb-2">Need Help?</div>
                  <p className="text-xs text-gray-600 mb-3">
                    Our support team is available 24/7
                  </p>
                  <Button variant="outline" size="sm" className="w-full bg-white">
                    Contact Support
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}