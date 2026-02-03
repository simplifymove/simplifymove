import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { 
  MapPin, 
  Clock, 
  Star, 
  ChevronLeft,
  Zap,
  Shield,
  Info,
  Navigation,
  Check,
  Bike as BikeIcon,
  Fuel
} from 'lucide-react';

// Mock bike data
const mockBikes = [
  {
    id: 1,
    name: 'Rapido Bike',
    model: 'Activa, Jupiter',
    type: 'Scooter',
    price: 5,
    estimatedFare: 80,
    estimatedTime: '12 mins',
    distance: '16 km',
    rating: 4.4,
    image: '🛵',
    features: ['Quick', 'Affordable', 'Helmet Provided'],
    fuelType: 'Petrol',
    cancellationFee: 'Free till pickup',
  },
  {
    id: 2,
    name: 'Uber Moto',
    model: 'Pulsar, Apache',
    type: 'Motorcycle',
    price: 6,
    estimatedFare: 96,
    estimatedTime: '10 mins',
    distance: '16 km',
    rating: 4.6,
    image: '🏍️',
    features: ['Fast', 'Helmet', 'Experienced Rider'],
    fuelType: 'Petrol',
    cancellationFee: '₹20 after 3 mins',
  },
  {
    id: 3,
    name: 'Electric Bike',
    model: 'Ola S1, Ather',
    type: 'Electric Scooter',
    price: 7,
    estimatedFare: 112,
    estimatedTime: '11 mins',
    distance: '16 km',
    rating: 4.7,
    image: '⚡',
    features: ['Eco-Friendly', 'Silent', 'Helmet Provided'],
    fuelType: 'Electric',
    cancellationFee: '₹25 after 3 mins',
  },
  {
    id: 4,
    name: 'Premium Bike',
    model: 'Royal Enfield, Duke',
    type: 'Heavy Bike',
    price: 10,
    estimatedFare: 160,
    estimatedTime: '9 mins',
    distance: '16 km',
    rating: 4.8,
    image: '🏍️',
    features: ['Premium', 'Comfortable', 'Professional'],
    fuelType: 'Petrol',
    cancellationFee: '₹40 after 3 mins',
  },
];

interface BikeBookingProps {
  searchData: {
    pickup: string;
    drop: string;
    date: string;
    time: string;
  };
  onBack: () => void;
  onProceedToCheckout: (bike: any, tripDetails: any) => void;
}

export function BikeBooking({ searchData, onBack, onProceedToCheckout }: BikeBookingProps) {
  const [selectedBike, setSelectedBike] = useState<any>(null);
  const [pickupAddress, setPickupAddress] = useState(searchData.pickup);
  const [dropAddress, setDropAddress] = useState(searchData.drop);
  const [specialInstructions, setSpecialInstructions] = useState('');

  const handleBookNow = (bike: any) => {
    const tripDetails = {
      pickup: pickupAddress,
      drop: dropAddress,
      date: searchData.date,
      time: searchData.time,
      specialInstructions,
    };
    
    onProceedToCheckout(bike, tripDetails);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-teal-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={onBack} className="gap-2">
              <ChevronLeft className="w-5 h-5" />
              Modify Search
            </Button>
            <div className="text-center">
              <h2 className="font-semibold text-gray-900">Choose Your Bike</h2>
              <p className="text-sm text-gray-600">{searchData.date} • {searchData.time}</p>
            </div>
            <div className="w-24"></div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-3 gap-8">
          {/* Left: Trip Details & Available Bikes */}
          <div className="col-span-2 space-y-6">
            {/* Trip Route */}
            <Card className="p-6 bg-gradient-to-r from-green-50 to-teal-50">
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
                  <span>~16 km</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>~20 mins</span>
                </div>
              </div>
            </Card>

            {/* Available Bikes */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Available Bikes</h2>
              <p className="text-gray-600 mb-6">Beat the traffic, save time and money</p>
              
              <div className="space-y-4">
                {mockBikes.map((bike) => (
                  <Card 
                    key={bike.id} 
                    className={`overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer border-2 ${
                      selectedBike?.id === bike.id ? 'border-green-500 bg-green-50' : 'hover:border-green-500'
                    }`}
                    onClick={() => setSelectedBike(bike)}
                  >
                    <div className="p-6">
                      <div className="flex items-center gap-6">
                        {/* Bike Icon */}
                        <div className="text-6xl">{bike.image}</div>

                        {/* Details */}
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-gray-900">{bike.name}</h3>
                            <div className="flex items-center gap-1 bg-green-600 text-white px-2 py-1 rounded-lg">
                              <Star className="w-3 h-3 fill-white" />
                              <span className="text-sm font-semibold">{bike.rating}</span>
                            </div>
                            {bike.fuelType === 'Electric' && (
                              <Badge className="bg-gradient-to-r from-green-500 to-teal-500">
                                Eco-Friendly
                              </Badge>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-3 mb-3">
                            <p className="text-sm text-gray-600">{bike.model}</p>
                            <Badge variant="outline" className="gap-1">
                              <Fuel className="w-3 h-3" />
                              {bike.fuelType}
                            </Badge>
                          </div>

                          <div className="flex items-center gap-6 text-sm text-gray-600 mb-3">
                            <div className="flex items-center gap-2">
                              <BikeIcon className="w-4 h-4" />
                              <span>{bike.type}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              <span>{bike.estimatedTime}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Zap className="w-4 h-4" />
                              <span>Fastest Route</span>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {bike.features.map((feature) => (
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
                          <p className="text-3xl font-bold text-gray-900 mb-1">₹{bike.estimatedFare}</p>
                          <p className="text-xs text-gray-500">₹{bike.price}/km</p>
                          <Badge className="mt-2 bg-green-600 text-xs">{bike.estimatedTime}</Badge>
                        </div>
                      </div>

                      {/* Cancellation Policy */}
                      <div className="mt-4 pt-4 border-t flex items-center gap-2 text-sm text-gray-600">
                        <Info className="w-4 h-4" />
                        <span>Cancellation: {bike.cancellationFee}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Why Choose Bike */}
              <Card className="mt-6 p-6 bg-gradient-to-r from-green-100 to-teal-100 border-green-300">
                <h3 className="font-bold text-gray-900 mb-4">Why Choose Bike Ride?</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-3xl mb-2">⚡</div>
                    <p className="text-sm font-semibold text-gray-900">Save Time</p>
                    <p className="text-xs text-gray-600">Beat traffic jams</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl mb-2">💰</div>
                    <p className="text-sm font-semibold text-gray-900">Save Money</p>
                    <p className="text-xs text-gray-600">50% cheaper than cabs</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl mb-2">🌱</div>
                    <p className="text-sm font-semibold text-gray-900">Eco-Friendly</p>
                    <p className="text-xs text-gray-600">Lower carbon footprint</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Right: Booking Summary */}
          <div className="col-span-1">
            <Card className="p-6 sticky top-24 border-2 border-green-200">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Booking Summary</h3>

              {selectedBike ? (
                <>
                  {/* Selected Bike */}
                  <div className="mb-6 pb-6 border-b">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="text-4xl">{selectedBike.image}</div>
                      <div>
                        <p className="font-bold text-gray-900">{selectedBike.name}</p>
                        <p className="text-sm text-gray-600">{selectedBike.type}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Model:</span>
                        <span className="font-semibold">{selectedBike.model}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Fuel Type:</span>
                        <span className="font-semibold">{selectedBike.fuelType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">ETA:</span>
                        <span className="font-semibold">{selectedBike.estimatedTime}</span>
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
                      className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none resize-none"
                      rows={3}
                    />
                  </div>

                  {/* Price Breakdown */}
                  <div className="space-y-3 mb-6 pb-6 border-b">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Base Fare</span>
                      <span className="font-semibold">₹{selectedBike.estimatedFare}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Taxes & Fees</span>
                      <span className="font-semibold">₹{Math.round(selectedBike.estimatedFare * 0.05)}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mb-6">
                    <span className="text-lg font-semibold">Estimated Total</span>
                    <span className="text-2xl font-bold text-green-600">
                      ₹{(selectedBike.estimatedFare + Math.round(selectedBike.estimatedFare * 0.05)).toLocaleString()}
                    </span>
                  </div>

                  <Button 
                    onClick={() => handleBookNow(selectedBike)}
                    className="w-full h-12 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-lg"
                  >
                    Book Now
                  </Button>

                  <div className="mt-4 space-y-3">
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="flex items-start gap-2">
                        <Shield className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-green-700">
                          Helmet provided for your safety
                        </p>
                      </div>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-start gap-2">
                        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-blue-700">
                          Fare may vary based on actual distance and time
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <BikeIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Select a bike to continue</p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
