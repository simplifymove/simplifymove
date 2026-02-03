import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  MapPin, 
  Clock, 
  Star, 
  Check, 
  ChevronLeft,
  Wifi,
  Tv,
  Coffee,
  UtensilsCrossed,
  Zap,
  Shield,
  Users,
  Info
} from 'lucide-react';

// Mock bus data
const mockBuses = [
  {
    id: 1,
    operator: 'VRL Travels',
    busType: 'AC Sleeper (2+1)',
    departure: '22:00',
    arrival: '07:30',
    duration: '9h 30m',
    price: 1200,
    originalPrice: 1500,
    discount: 20,
    seatsAvailable: 18,
    rating: 4.5,
    reviews: 1250,
    amenities: ['WiFi', 'Charging Point', 'Blanket', 'Water Bottle'],
    cancellationPolicy: 'Free cancellation till 6 hours before departure',
    pickupPoints: ['Dadar', 'Thane', 'Vashi'],
    dropPoints: ['Shivaji Nagar', 'Wakad', 'Hinjewadi'],
  },
  {
    id: 2,
    operator: 'Sharma Travels',
    busType: 'AC Seater (2+2)',
    departure: '06:00',
    arrival: '13:00',
    duration: '7h 00m',
    price: 800,
    originalPrice: 1000,
    discount: 20,
    seatsAvailable: 24,
    rating: 4.3,
    reviews: 890,
    amenities: ['Charging Point', 'Reading Light', 'Water Bottle'],
    cancellationPolicy: 'Free cancellation till 12 hours before departure',
    pickupPoints: ['Dadar', 'Kurla', 'Panvel'],
    dropPoints: ['Shivaji Nagar', 'Kothrud', 'Deccan'],
  },
  {
    id: 3,
    operator: 'RedBus Express',
    busType: 'Volvo Multi-Axle AC Sleeper',
    departure: '23:30',
    arrival: '08:00',
    duration: '8h 30m',
    price: 1500,
    originalPrice: 2000,
    discount: 25,
    seatsAvailable: 12,
    rating: 4.8,
    reviews: 2100,
    amenities: ['WiFi', 'TV', 'Charging Point', 'Blanket', 'Pillow', 'Water Bottle'],
    cancellationPolicy: 'Free cancellation till 6 hours before departure',
    pickupPoints: ['Dadar', 'Thane', 'Kalyan', 'Vashi'],
    dropPoints: ['Wakad', 'Hinjewadi', 'Shivaji Nagar', 'Kothrud'],
  },
];

// Seat layout (sample)
const generateSeatLayout = (busType: string) => {
  if (busType.includes('Sleeper')) {
    // Lower deck
    const lowerDeck = [
      ['L1', 'L2', null, 'L3'],
      ['L4', 'L5', null, 'L6'],
      ['L7', 'L8', null, 'L9'],
      ['L10', 'L11', null, 'L12'],
      ['L13', 'L14', null, 'L15'],
      ['L16', 'L17', null, 'L18'],
      ['L19', 'L20', null, 'L21'],
    ];
    // Upper deck
    const upperDeck = [
      ['U1', 'U2', null, 'U3'],
      ['U4', 'U5', null, 'U6'],
      ['U7', 'U8', null, 'U9'],
      ['U10', 'U11', null, 'U12'],
      ['U13', 'U14', null, 'U15'],
      ['U16', 'U17', null, 'U18'],
    ];
    return { lower: lowerDeck, upper: upperDeck };
  } else {
    // Seater layout
    const seats = [
      ['1A', '1B', null, '1C', '1D'],
      ['2A', '2B', null, '2C', '2D'],
      ['3A', '3B', null, '3C', '3D'],
      ['4A', '4B', null, '4C', '4D'],
      ['5A', '5B', null, '5C', '5D'],
      ['6A', '6B', null, '6C', '6D'],
      ['7A', '7B', null, '7C', '7D'],
      ['8A', '8B', null, '8C', '8D'],
      ['9A', '9B', null, '9C', '9D'],
      ['10A', '10B', null, '10C', '10D'],
    ];
    return { lower: seats, upper: null };
  }
};

interface BusBookingProps {
  searchData: {
    from: string;
    to: string;
    date: string;
  };
  onBack: () => void;
  onProceedToCheckout: (bus: any, seatDetails: any) => void;
}

export function BusBooking({ searchData, onBack, onProceedToCheckout }: BusBookingProps) {
  const [step, setStep] = useState<'results' | 'seats'>('results');
  const [selectedBus, setSelectedBus] = useState<any>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [bookedSeats] = useState<string[]>(['L5', 'L11', 'U3', 'U7', '2A', '3C', '5B']); // Mock booked seats
  const [selectedPickup, setSelectedPickup] = useState('');
  const [selectedDrop, setSelectedDrop] = useState('');
  const [viewDeck, setViewDeck] = useState<'lower' | 'upper'>('lower');

  const amenityIcons: any = {
    'WiFi': Wifi,
    'TV': Tv,
    'Charging Point': Zap,
    'Blanket': '🛏️',
    'Pillow': '💤',
    'Water Bottle': '💧',
    'Reading Light': '💡',
  };

  const handleBusSelect = (bus: any) => {
    setSelectedBus(bus);
    setSelectedSeats([]);
    setSelectedPickup(bus.pickupPoints[0]);
    setSelectedDrop(bus.dropPoints[0]);
    setStep('seats');
  };

  const handleSeatClick = (seat: string) => {
    if (bookedSeats.includes(seat)) return; // Already booked
    
    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seat));
    } else {
      if (selectedSeats.length < 6) { // Max 6 seats
        setSelectedSeats([...selectedSeats, seat]);
      }
    }
  };

  const handleProceedToCheckout = () => {
    if (selectedSeats.length === 0 || !selectedPickup || !selectedDrop) return;
    
    const seatDetails = {
      seats: selectedSeats,
      pickupPoint: selectedPickup,
      dropPoint: selectedDrop,
      date: searchData.date,
    };
    
    onProceedToCheckout(selectedBus, seatDetails);
  };

  const getSeatClass = (seat: string) => {
    if (bookedSeats.includes(seat)) {
      return 'bg-gray-300 cursor-not-allowed';
    }
    if (selectedSeats.includes(seat)) {
      return 'bg-green-500 text-white';
    }
    return 'bg-white border-2 border-gray-300 hover:border-blue-500 cursor-pointer';
  };

  // Results View
  if (step === 'results') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Header */}
        <div className="bg-white border-b sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <Button variant="ghost" onClick={onBack} className="gap-2">
                <ChevronLeft className="w-5 h-5" />
                Modify Search
              </Button>
              <div className="text-center">
                <h2 className="font-semibold text-gray-900">{searchData.from} → {searchData.to}</h2>
                <p className="text-sm text-gray-600">{searchData.date}</p>
              </div>
              <div className="w-24"></div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-8">
          {/* Results Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Available Buses</h2>
            <p className="text-gray-600">{mockBuses.length} buses found for your journey</p>
          </div>

          {/* Bus Cards */}
          <div className="space-y-4">
            {mockBuses.map((bus) => (
              <Card key={bus.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-500">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{bus.operator}</h3>
                        <div className="flex items-center gap-2">
                          <div className="bg-blue-600 text-white px-2 py-1 rounded-lg flex items-center gap-1">
                            <Star className="w-3 h-3 fill-white" />
                            <span className="text-sm font-semibold">{bus.rating}</span>
                          </div>
                          <span className="text-xs text-gray-600">({bus.reviews} reviews)</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{bus.busType}</p>
                    </div>
                    {bus.discount > 0 && (
                      <Badge className="bg-green-600 text-lg px-3 py-1">
                        {bus.discount}% OFF
                      </Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-12 gap-6 items-center mb-4">
                    {/* Departure */}
                    <div className="col-span-3">
                      <p className="text-3xl font-bold text-gray-900">{bus.departure}</p>
                      <p className="text-sm text-gray-600">{searchData.from}</p>
                    </div>

                    {/* Duration */}
                    <div className="col-span-3 text-center">
                      <div className="flex items-center gap-2 justify-center mb-1">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <div className="flex-1 h-0.5 bg-gray-300"></div>
                        <Clock className="w-5 h-5 text-gray-600" />
                        <div className="flex-1 h-0.5 bg-gray-300"></div>
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      </div>
                      <p className="text-sm font-semibold text-gray-700">{bus.duration}</p>
                    </div>

                    {/* Arrival */}
                    <div className="col-span-3">
                      <p className="text-3xl font-bold text-gray-900">{bus.arrival}</p>
                      <p className="text-sm text-gray-600">{searchData.to}</p>
                    </div>

                    {/* Price & CTA */}
                    <div className="col-span-3 text-right">
                      <p className="text-sm text-gray-500 line-through">₹{bus.originalPrice}</p>
                      <p className="text-3xl font-bold text-gray-900 mb-1">₹{bus.price}</p>
                      <p className="text-xs text-green-600 mb-3">{bus.seatsAvailable} seats left</p>
                      <Button 
                        onClick={() => handleBusSelect(bus)}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                      >
                        Select Seats
                      </Button>
                    </div>
                  </div>

                  {/* Amenities */}
                  <div className="flex items-center gap-2 mb-4 pb-4 border-b flex-wrap">
                    {bus.amenities.map((amenity) => {
                      const IconOrEmoji = amenityIcons[amenity];
                      return (
                        <Badge key={amenity} variant="outline" className="gap-1.5">
                          {IconOrEmoji && (
                            typeof IconOrEmoji === 'string' ? (
                              <span>{IconOrEmoji}</span>
                            ) : (
                              <IconOrEmoji className="w-3 h-3" />
                            )
                          )}
                          <span className="text-xs">{amenity}</span>
                        </Badge>
                      );
                    })}
                  </div>

                  {/* Boarding & Dropping Points */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600 mb-1">Boarding Points:</p>
                      <p className="font-medium text-gray-900">{bus.pickupPoints.join(', ')}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 mb-1">Dropping Points:</p>
                      <p className="font-medium text-gray-900">{bus.dropPoints.join(', ')}</p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Seat Selection View
  if (step === 'seats' && selectedBus) {
    const seatLayout = generateSeatLayout(selectedBus.busType);
    const basePrice = selectedBus.price;
    const subtotal = basePrice * selectedSeats.length;
    const taxes = Math.round(subtotal * 0.05);
    const total = subtotal + taxes;

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Header */}
        <div className="bg-white border-b sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <Button variant="ghost" onClick={() => setStep('results')} className="gap-2">
              <ChevronLeft className="w-5 h-5" />
              Back to Results
            </Button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-3 gap-8">
            {/* Left: Seat Layout */}
            <div className="col-span-2">
              <Card className="p-6">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Your Seats</h2>
                  <p className="text-gray-600">Click on available seats to select (Max 6 seats)</p>
                </div>

                {/* Deck Selector for Sleeper */}
                {seatLayout.upper && (
                  <div className="flex gap-2 mb-6">
                    <Button
                      variant={viewDeck === 'lower' ? 'default' : 'outline'}
                      onClick={() => setViewDeck('lower')}
                      className="flex-1"
                    >
                      Lower Deck
                    </Button>
                    <Button
                      variant={viewDeck === 'upper' ? 'default' : 'outline'}
                      onClick={() => setViewDeck('upper')}
                      className="flex-1"
                    >
                      Upper Deck
                    </Button>
                  </div>
                )}

                {/* Legend */}
                <div className="flex gap-6 mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-white border-2 border-gray-300 rounded"></div>
                    <span className="text-sm">Available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-500 rounded"></div>
                    <span className="text-sm">Selected</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-300 rounded"></div>
                    <span className="text-sm">Booked</span>
                  </div>
                </div>

                {/* Seat Grid */}
                <div className="bg-gray-100 p-8 rounded-xl">
                  {/* Driver indicator */}
                  <div className="mb-8 flex justify-end">
                    <div className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold">
                      🚗 Driver
                    </div>
                  </div>

                  <div className="space-y-3">
                    {(viewDeck === 'lower' ? seatLayout.lower : seatLayout.upper || seatLayout.lower).map((row, rowIndex) => (
                      <div key={rowIndex} className="flex gap-3 justify-center">
                        {row.map((seat, seatIndex) => (
                          seat ? (
                            <button
                              key={seatIndex}
                              onClick={() => handleSeatClick(seat)}
                              className={`w-14 h-14 rounded-lg font-semibold text-sm transition-all ${getSeatClass(seat)}`}
                              disabled={bookedSeats.includes(seat)}
                            >
                              {seat}
                            </button>
                          ) : (
                            <div key={seatIndex} className="w-14"></div>
                          )
                        ))}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Boarding & Dropping Points */}
                <div className="grid grid-cols-2 gap-6 mt-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Boarding Point</label>
                    <select
                      value={selectedPickup}
                      onChange={(e) => setSelectedPickup(e.target.value)}
                      className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                    >
                      {selectedBus.pickupPoints.map((point: string) => (
                        <option key={point} value={point}>{point}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Dropping Point</label>
                    <select
                      value={selectedDrop}
                      onChange={(e) => setSelectedDrop(e.target.value)}
                      className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                    >
                      {selectedBus.dropPoints.map((point: string) => (
                        <option key={point} value={point}>{point}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </Card>
            </div>

            {/* Right: Booking Summary */}
            <div className="col-span-1">
              <Card className="p-6 sticky top-24 border-2 border-blue-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Booking Summary</h3>

                {/* Bus Details */}
                <div className="mb-6 pb-6 border-b">
                  <p className="font-semibold text-gray-900 mb-1">{selectedBus.operator}</p>
                  <p className="text-sm text-gray-600 mb-3">{selectedBus.busType}</p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Departure:</span>
                      <span className="font-semibold">{selectedBus.departure}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Arrival:</span>
                      <span className="font-semibold">{selectedBus.arrival}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-semibold">{selectedBus.duration}</span>
                    </div>
                  </div>
                </div>

                {/* Selected Seats */}
                <div className="mb-6 pb-6 border-b">
                  <p className="font-semibold text-gray-900 mb-2">Selected Seats</p>
                  {selectedSeats.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {selectedSeats.map(seat => (
                        <Badge key={seat} className="bg-green-600">{seat}</Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No seats selected</p>
                  )}
                </div>

                {/* Price Breakdown */}
                {selectedSeats.length > 0 && (
                  <>
                    <div className="space-y-3 mb-6 pb-6 border-b">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Base Fare × {selectedSeats.length}</span>
                        <span className="font-semibold">₹{subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Taxes & Fees</span>
                        <span className="font-semibold">₹{taxes.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mb-6">
                      <span className="text-lg font-semibold">Total Amount</span>
                      <span className="text-2xl font-bold text-blue-600">₹{total.toLocaleString()}</span>
                    </div>
                  </>
                )}

                <Button 
                  onClick={handleProceedToCheckout}
                  disabled={selectedSeats.length === 0}
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg disabled:opacity-50"
                >
                  {selectedSeats.length === 0 ? 'Select Seats' : 'Proceed to Payment'}
                </Button>

                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Shield className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-green-700">{selectedBus.cancellationPolicy}</p>
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