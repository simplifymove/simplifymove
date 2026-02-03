import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { 
  MapPin, 
  Clock, 
  Star, 
  Users, 
  ChevronLeft,
  Zap,
  Shield,
  Info,
  Navigation,
  Package as LuggageIcon,
  Check,
  Car
} from 'lucide-react';

// Mock cab data
const mockCabs = [
  {
    id: 1,
    name: 'Ola Sedan',
    category: 'Sedan',
    model: 'Swift Dzire, Xcent',
    capacity: 4,
    luggage: 2,
    price: 12,
    estimatedFare: 240,
    estimatedTime: '20 mins',
    distance: '20 km',
    rating: 4.5,
    image: '🚗',
    features: ['AC', 'Comfortable', 'Affordable'],
    cancellationFee: 'Free till pickup',
  },
  {
    id: 2,
    name: 'Uber Premium',
    category: 'Premium Sedan',
    model: 'Honda City, Ciaz',
    capacity: 4,
    luggage: 3,
    price: 18,
    estimatedFare: 360,
    estimatedTime: '15 mins',
    distance: '20 km',
    rating: 4.7,
    image: '🚙',
    features: ['AC', 'Premium', 'Spacious'],
    cancellationFee: '₹50 after 5 mins',
  },
  {
    id: 3,
    name: 'XL SUV',
    category: 'SUV',
    model: 'Ertiga, Innova',
    capacity: 6,
    luggage: 4,
    price: 22,
    estimatedFare: 440,
    estimatedTime: '18 mins',
    distance: '20 km',
    rating: 4.6,
    image: '🚐',
    features: ['AC', 'Extra Space', '6 Seater'],
    cancellationFee: '₹75 after 5 mins',
  },
  {
    id: 4,
    name: 'Luxury',
    category: 'Luxury Sedan',
    model: 'BMW, Audi, Mercedes',
    capacity: 4,
    luggage: 3,
    price: 45,
    estimatedFare: 900,
    estimatedTime: '25 mins',
    distance: '20 km',
    rating: 4.9,
    image: '🚘',
    features: ['Premium AC', 'Luxury', 'Professional Driver'],
    cancellationFee: '₹150 after 5 mins',
  },
];

interface CabBookingProps {
  searchData: {
    pickup: string;
    drop: string;
    date: string;
    time: string;
  };
  onBack: () => void;
  onProceedToCheckout: (cab: any, tripDetails: any) => void;
}

export function CabBooking({ searchData, onBack, onProceedToCheckout }: CabBookingProps) {
  const [selectedCab, setSelectedCab] = useState<any>(null);
  const [pickupAddress, setPickupAddress] = useState(searchData.pickup);
  const [dropAddress, setDropAddress] = useState(searchData.drop);
  const [specialInstructions, setSpecialInstructions] = useState('');

  const handleBookNow = (cab: any) => {
    const tripDetails = {
      pickup: pickupAddress,
      drop: dropAddress,
      date: searchData.date,
      time: searchData.time,
      specialInstructions,
    };
    
    onProceedToCheckout(cab, tripDetails);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={onBack} className="gap-2">
              <ChevronLeft className="w-5 h-5" />
              Modify Search
            </Button>
            <div className="text-center">
              <h2 className="font-semibold text-gray-900">Choose Your Ride</h2>
              <p className="text-sm text-gray-600">{searchData.date} • {searchData.time}</p>
            </div>
            <div className="w-24"></div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-3 gap-8">
          {/* Left: Trip Details & Available Cabs */}
          <div className="col-span-2 space-y-6">
            {/* Trip Route */}
            <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div className="w-0.5 h-16 bg-gray-300"></div>
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                </div>
                <div className="flex-1 space-y-6">
                  <div>
                    <label className="text-xs text-gray-600 font-semibold mb-1 block">PICKUP LOCATION</label>
                    <Input
                      value={pickupAddress}
                      onChange={(e) => setPickupAddress(e.target.value)}
                      className="bg-white border-2"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600 font-semibold mb-1 block">DROP LOCATION</label>
                    <Input
                      value={dropAddress}
                      onChange={(e) => setDropAddress(e.target.value)}
                      className="bg-white border-2"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Navigation className="w-4 h-4" />
                  <span>~20 km</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>~30 mins</span>
                </div>
              </div>
            </Card>

            {/* Available Cabs */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Available Rides</h2>
              <div className="space-y-4">
                {mockCabs.map((cab) => (
                  <Card 
                    key={cab.id} 
                    className={`overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer border-2 ${
                      selectedCab?.id === cab.id ? 'border-blue-500 bg-blue-50' : 'hover:border-blue-500'
                    }`}
                    onClick={() => setSelectedCab(cab)}
                  >
                    <div className="p-6">
                      <div className="flex items-center gap-6">
                        {/* Car Icon */}
                        <div className="text-6xl">{cab.image}</div>

                        {/* Details */}
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-gray-900">{cab.name}</h3>
                            <div className="flex items-center gap-1 bg-blue-600 text-white px-2 py-1 rounded-lg">
                              <Star className="w-3 h-3 fill-white" />
                              <span className="text-sm font-semibold">{cab.rating}</span>
                            </div>
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-3">{cab.model}</p>

                          <div className="flex items-center gap-6 text-sm text-gray-600 mb-3">
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4" />
                              <span>{cab.capacity} seats</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <LuggageIcon className="w-4 h-4" />
                              <span>{cab.luggage} bags</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              <span>{cab.estimatedTime}</span>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {cab.features.map((feature) => (
                              <Badge key={feature} variant="outline" className="gap-1">
                                <Check className="w-3 h-3" />
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <p className="text-sm text-gray-600 mb-1">Estimated Fare</p>
                          <p className="text-3xl font-bold text-gray-900 mb-1">₹{cab.estimatedFare}</p>
                          <p className="text-xs text-gray-500">₹{cab.price}/km</p>
                          <Badge className="mt-2 bg-green-600 text-xs">{cab.estimatedTime}</Badge>
                        </div>
                      </div>

                      {/* Cancellation Policy */}
                      <div className="mt-4 pt-4 border-t flex items-center gap-2 text-sm text-gray-600">
                        <Info className="w-4 h-4" />
                        <span>Cancellation: {cab.cancellationFee}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Booking Summary */}
          <div className="col-span-1">
            <Card className="p-6 sticky top-24 border-2 border-blue-200">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Booking Summary</h3>

              {selectedCab ? (
                <>
                  {/* Selected Cab */}
                  <div className="mb-6 pb-6 border-b">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="text-4xl">{selectedCab.image}</div>
                      <div>
                        <p className="font-bold text-gray-900">{selectedCab.name}</p>
                        <p className="text-sm text-gray-600">{selectedCab.category}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Capacity:</span>
                        <span className="font-semibold">{selectedCab.capacity} passengers</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Luggage:</span>
                        <span className="font-semibold">{selectedCab.luggage} bags</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">ETA:</span>
                        <span className="font-semibold">{selectedCab.estimatedTime}</span>
                      </div>
                    </div>
                  </div>

                  {/* Trip Details */}
                  <div className="mb-6 pb-6 border-b">
                    <p className="font-semibold text-gray-900 mb-3">Trip Details</p>
                    <div className="space-y-2 text-sm">
                      <div>
                        <p className="text-gray-600 mb-1">Pickup</p>
                        <p className="font-medium text-gray-900">{pickupAddress}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 mb-1">Drop</p>
                        <p className="font-medium text-gray-900">{dropAddress}</p>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date & Time:</span>
                        <span className="font-semibold">{searchData.date} {searchData.time}</span>
                      </div>
                    </div>
                  </div>

                  {/* Special Instructions */}
                  <div className="mb-6 pb-6 border-b">
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Special Instructions (Optional)
                    </label>
                    <textarea
                      value={specialInstructions}
                      onChange={(e) => setSpecialInstructions(e.target.value)}
                      placeholder="Any special requirements?"
                      className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none resize-none"
                      rows={3}
                    />
                  </div>

                  {/* Price Breakdown */}
                  <div className="space-y-3 mb-6 pb-6 border-b">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Base Fare</span>
                      <span className="font-semibold">₹{selectedCab.estimatedFare}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Taxes & Fees</span>
                      <span className="font-semibold">₹{Math.round(selectedCab.estimatedFare * 0.05)}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mb-6">
                    <span className="text-lg font-semibold">Estimated Total</span>
                    <span className="text-2xl font-bold text-blue-600">
                      ₹{(selectedCab.estimatedFare + Math.round(selectedCab.estimatedFare * 0.05)).toLocaleString()}
                    </span>
                  </div>

                  <Button 
                    onClick={() => handleBookNow(selectedCab)}
                    className="w-full h-12 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-lg"
                  >
                    Book Now
                  </Button>

                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-blue-700">
                        Fare may vary based on actual distance and time. Final fare will be calculated after trip completion.
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <Car className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Select a ride to continue</p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
