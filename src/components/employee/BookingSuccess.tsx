import { Card } from '../ui/card';
import { Button } from '../ui/button';
import {
  Plane,
  Package,
  Users,
  Shield,
  Check,
  Info,
  Wallet,
  CreditCard,
  Smartphone,
  Building2,
  ChevronRight
} from 'lucide-react';

interface Flight {
  id: number;
  airline: string;
  logo: string;
  flightNo: string;
  departure: string;
  arrival: string;
  duration: string;
  price: number;
  originalPrice: number;
  discount: number;
}

interface BookingSuccessProps {
  flight: Flight;
  from: string;
  to: string;
  paymentMethod: 'wallet' | 'card' | 'upi' | 'netbanking' | 'paylater';
  confirmationNumber: string;
  walletBalance: number;
  onBookAnother: () => void;
}

export function BookingSuccess({ 
  flight, 
  from, 
  to, 
  paymentMethod, 
  confirmationNumber,
  walletBalance,
  onBookAnother
}: BookingSuccessProps) {
  const totalAmount = flight.price + Math.round(flight.price * 0.12);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Success Header */}
      <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <Check className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-5xl mb-4">Booking Confirmed!</h1>
          <p className="text-2xl text-white/90 mb-4">Your flight has been booked successfully</p>
          <div className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-8 py-4 text-xl">
            Confirmation: <span className="font-mono font-bold text-2xl">{confirmationNumber}</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Success Message Card */}
          <Card className="p-8 text-center border-2 border-green-500 bg-gradient-to-br from-white to-green-50">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl mb-4 text-green-600">Payment Successful!</h2>
            <p className="text-xl text-gray-600 mb-6">
              ₹{totalAmount} has been deducted from your {paymentMethod === 'wallet' ? 'wallet' : 'account'}
            </p>
            <div className="bg-white rounded-lg p-6 max-w-2xl mx-auto shadow-lg">
              <div className="text-sm text-gray-600 mb-2">Booking Confirmation Number</div>
              <div className="text-3xl font-mono font-bold text-green-600 mb-4 tracking-wider">
                {confirmationNumber}
              </div>
              <div className="text-sm text-gray-600">
                📧 A confirmation email has been sent to your registered email address
              </div>
            </div>
          </Card>

          {/* Flight Details Card */}
          <Card className="p-6">
            <h3 className="text-2xl mb-6 flex items-center gap-2">
              <Plane className="w-6 h-6 text-blue-600" />
              Flight Details
            </h3>
            
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-6 mb-6 border border-blue-200">
              <div className="grid grid-cols-12 gap-6 items-center">
                {/* Airline Info */}
                <div className="col-span-3">
                  <div className="text-5xl mb-2">{flight.logo}</div>
                  <div className="text-xl mb-1">{flight.airline}</div>
                  <div className="text-sm text-gray-600">{flight.flightNo}</div>
                </div>

                {/* Flight Times */}
                <div className="col-span-9">
                  <div className="flex items-center justify-between">
                    <div className="text-center">
                      <div className="text-4xl mb-2">{flight.departure}</div>
                      <div className="text-lg text-gray-600 font-medium">{from}</div>
                      <div className="text-sm text-gray-500">BOM Airport</div>
                    </div>

                    <div className="flex-1 px-6">
                      <div className="relative">
                        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
                        <Plane className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-blue-600 bg-white p-1 rounded-full border-2 border-blue-500" />
                      </div>
                      <div className="text-center font-medium text-gray-600 mt-6">
                        {flight.duration}
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="text-4xl mb-2">{flight.arrival}</div>
                      <div className="text-lg text-gray-600 font-medium">{to}</div>
                      <div className="text-sm text-gray-500">DEL Airport</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Details */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <Package className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                <div className="text-sm text-gray-600">Baggage</div>
                <div className="font-medium">15 kg</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <Users className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                <div className="text-sm text-gray-600">Passengers</div>
                <div className="font-medium">1 Adult</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <Shield className="w-6 h-6 mx-auto mb-2 text-green-600" />
                <div className="text-sm text-gray-600">Status</div>
                <div className="font-medium text-green-600">✓ Confirmed</div>
              </div>
            </div>
          </Card>

          {/* Payment Details Card */}
          <Card className="p-6">
            <h3 className="text-2xl mb-6 flex items-center gap-2">
              {paymentMethod === 'wallet' && <Wallet className="w-6 h-6 text-blue-600" />}
              {paymentMethod === 'card' && <CreditCard className="w-6 h-6 text-purple-600" />}
              {paymentMethod === 'upi' && <Smartphone className="w-6 h-6 text-green-600" />}
              {paymentMethod === 'netbanking' && <Building2 className="w-6 h-6 text-orange-600" />}
              Payment Summary
            </h3>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-lg">
                <span className="text-gray-600">Base Fare</span>
                <span>₹{flight.price}</span>
              </div>
              <div className="flex justify-between text-lg">
                <span className="text-gray-600">Taxes & Fees</span>
                <span>₹{Math.round(flight.price * 0.12)}</span>
              </div>
              {flight.discount > 0 && (
                <div className="flex justify-between text-lg text-green-600">
                  <span>Discount ({flight.discount}%)</span>
                  <span>-₹{Math.round(flight.originalPrice - flight.price)}</span>
                </div>
              )}
              <div className="border-t-2 pt-3"></div>
              <div className="flex justify-between items-center text-3xl">
                <span className="font-medium">Total Paid</span>
                <span className="text-green-600 font-bold">₹{totalAmount}</span>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Check className="w-5 h-5 text-green-600" />
                <span className="font-medium text-gray-900">
                  Paid via {paymentMethod === 'wallet' ? 'SimplifyMove Wallet' : 
                           paymentMethod === 'card' ? 'Credit/Debit Card' :
                           paymentMethod === 'upi' ? 'UPI' : 'Net Banking'}
                </span>
              </div>
              {paymentMethod === 'wallet' && (
                <div className="text-sm text-gray-600 flex items-center gap-2">
                  <Wallet className="w-4 h-4" />
                  Remaining Wallet Balance: <span className="font-medium text-blue-600">₹{walletBalance - totalAmount}</span>
                </div>
              )}
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              size="lg"
              className="text-lg py-6 border-2 hover:bg-gray-50"
              onClick={onBookAnother}
            >
              <ChevronRight className="w-5 h-5 mr-2 rotate-180" />
              Book Another Trip
            </Button>
            <Button 
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white text-lg py-6"
              onClick={() => window.print()}
            >
              📥 Download Ticket
            </Button>
          </div>

          {/* Next Steps Info */}
          <Card className="p-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white">
            <h3 className="text-2xl mb-6 flex items-center gap-2">
              <Info className="w-6 h-6" />
              What's Next?
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-4xl mb-3">📧</div>
                <div className="font-medium mb-2 text-lg">Check Your Email</div>
                <div className="text-sm text-white/80">Confirmation sent to your registered email</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-4xl mb-3">🎫</div>
                <div className="font-medium mb-2 text-lg">Web Check-in</div>
                <div className="text-sm text-white/80">Opens 48 hours before departure</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-4xl mb-3">✈️</div>
                <div className="font-medium mb-2 text-lg">Arrive Early</div>
                <div className="text-sm text-white/80">Reach airport 2 hours before flight</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
