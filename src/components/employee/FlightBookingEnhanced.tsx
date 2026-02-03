import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { 
  Plane, 
  Clock, 
  Star, 
  ChevronLeft,
  Zap,
  Shield,
  Coffee,
  Wifi,
  TrendingDown,
  Check,
  ChevronRight,
  Info,
  Users,
  Plus,
  Minus,
  Briefcase,
  UtensilsCrossed,
  X,
  AlertCircle,
  Armchair,
  ShoppingBag
} from 'lucide-react';

// Mock flight data
const mockFlights = [
  {
    id: 1,
    airline: 'IndiGo',
    logo: '6E',
    flightNo: '6E-234',
    departure: '06:00',
    arrival: '08:15',
    duration: '2h 15m',
    price: 4299,
    originalPrice: 5999,
    discount: 28,
    seatsAvailable: 12,
    rating: 4.5,
    reviews: 1250,
    fastest: true,
    cheapest: false,
    stops: 'Non-Stop',
    departureCity: 'Mumbai',
    arrivalCity: 'Delhi',
    departureCode: 'BOM',
    arrivalCode: 'DEL',
    class: 'Economy',
    baggage: '15 kg check-in',
    cabinBag: '7 kg cabin',
    refundable: false,
  },
  {
    id: 2,
    airline: 'Air India',
    logo: 'AI',
    flightNo: 'AI-456',
    departure: '09:30',
    arrival: '11:50',
    duration: '2h 20m',
    price: 5499,
    originalPrice: 7299,
    discount: 25,
    seatsAvailable: 8,
    rating: 4.3,
    reviews: 980,
    fastest: false,
    cheapest: false,
    stops: 'Non-Stop',
    departureCity: 'Mumbai',
    arrivalCity: 'Delhi',
    departureCode: 'BOM',
    arrivalCode: 'DEL',
    class: 'Economy',
    baggage: '20 kg check-in',
    cabinBag: '7 kg cabin',
    refundable: true,
  },
  {
    id: 3,
    airline: 'SpiceJet',
    logo: 'SG',
    flightNo: 'SG-789',
    departure: '12:45',
    arrival: '15:10',
    duration: '2h 25m',
    price: 3799,
    originalPrice: 4999,
    discount: 24,
    seatsAvailable: 24,
    rating: 4.4,
    reviews: 1100,
    fastest: false,
    cheapest: true,
    stops: 'Non-Stop',
    departureCity: 'Mumbai',
    arrivalCity: 'Delhi',
    departureCode: 'BOM',
    arrivalCode: 'DEL',
    class: 'Economy',
    baggage: '15 kg check-in',
    cabinBag: '7 kg cabin',
    refundable: false,
  },
  {
    id: 4,
    airline: 'Vistara',
    logo: 'UK',
    flightNo: 'UK-912',
    departure: '16:20',
    arrival: '18:40',
    duration: '2h 20m',
    price: 6299,
    originalPrice: 8499,
    discount: 26,
    seatsAvailable: 6,
    rating: 4.7,
    reviews: 1500,
    fastest: false,
    cheapest: false,
    stops: 'Non-Stop',
    departureCity: 'Mumbai',
    arrivalCity: 'Delhi',
    departureCode: 'BOM',
    arrivalCode: 'DEL',
    class: 'Premium Economy',
    baggage: '20 kg check-in',
    cabinBag: '10 kg cabin',
    refundable: true,
  },
];

const mealOptions = [
  { id: 'none', name: 'No Meal', price: 0 },
  { id: 'veg', name: 'Vegetarian Meal', price: 350 },
  { id: 'non-veg', name: 'Non-Vegetarian Meal', price: 450 },
  { id: 'jain', name: 'Jain Meal', price: 350 },
  { id: 'premium', name: 'Premium Meal', price: 650 },
];

const baggageOptions = [
  { id: 'none', weight: '0 kg', price: 0 },
  { id: 'extra5', weight: '5 kg', price: 800 },
  { id: 'extra10', weight: '10 kg', price: 1500 },
  { id: 'extra15', weight: '15 kg', price: 2200 },
  { id: 'extra20', weight: '20 kg', price: 2800 },
];

interface Passenger {
  id: string;
  title: string;
  firstName: string;
  lastName: string;
  age: string;
  gender: string;
  seatPreference: string;
  meal: string;
  extraBaggage: string;
}

interface FlightBookingProps {
  searchData: {
    from: string;
    to: string;
    departDate: string;
    returnDate?: string;
    passengers: string;
    tripType: 'one-way' | 'round-trip';
  };
  onBack: () => void;
  onProceedToCheckout: (flight: any, passengerDetails: any) => void;
}

export function FlightBooking({ searchData, onBack, onProceedToCheckout }: FlightBookingProps) {
  const [step, setStep] = useState<'results' | 'details' | 'passengers' | 'addons'>('results');
  const [selectedFlight, setSelectedFlight] = useState<any>(null);
  const [selectedReturnFlight, setSelectedReturnFlight] = useState<any>(null);
  const [flightLeg, setFlightLeg] = useState<'outbound' | 'return'>('outbound');
  const [sortBy, setSortBy] = useState<'price' | 'duration' | 'departure'>('price');
  const [filterStops, setFilterStops] = useState<'all' | 'non-stop' | '1-stop'>('all');
  const [travelInsurance, setTravelInsurance] = useState(false);
  
  const [passengers, setPassengers] = useState<Passenger[]>([
    {
      id: '1',
      title: 'Mr',
      firstName: '',
      lastName: '',
      age: '',
      gender: 'male',
      seatPreference: 'window',
      meal: 'none',
      extraBaggage: 'none',
    }
  ]);

  const handleFlightSelect = (flight: any) => {
    if (searchData.tripType === 'round-trip') {
      if (flightLeg === 'outbound') {
        setSelectedFlight(flight);
        setFlightLeg('return');
      } else {
        setSelectedReturnFlight(flight);
        setStep('details');
      }
    } else {
      setSelectedFlight(flight);
      setStep('details');
    }
  };

  const handleContinueToPassengers = () => {
    setStep('passengers');
  };

  const handleContinueToAddons = () => {
    setStep('addons');
  };

  const addPassenger = () => {
    const newPassenger: Passenger = {
      id: Date.now().toString(),
      title: 'Mr',
      firstName: '',
      lastName: '',
      age: '',
      gender: 'male',
      seatPreference: 'window',
      meal: 'none',
      extraBaggage: 'none',
    };
    setPassengers([...passengers, newPassenger]);
  };

  const removePassenger = (id: string) => {
    if (passengers.length > 1) {
      setPassengers(passengers.filter(p => p.id !== id));
    }
  };

  const updatePassenger = (id: string, field: keyof Passenger, value: string) => {
    setPassengers(passengers.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ));
  };

  const calculateTotalCost = () => {
    if (!selectedFlight) return { subtotal: 0, addons: 0, insurance: 0, taxes: 0, total: 0 };
    
    const flightCost = selectedFlight.price * passengers.length;
    
    const mealsTotal = passengers.reduce((sum, p) => {
      const meal = mealOptions.find(m => m.id === p.meal);
      return sum + (meal?.price || 0);
    }, 0);
    
    const baggageTotal = passengers.reduce((sum, p) => {
      const baggage = baggageOptions.find(b => b.id === p.extraBaggage);
      return sum + (baggage?.price || 0);
    }, 0);
    
    const addonsTotal = mealsTotal + baggageTotal;
    const insuranceCost = travelInsurance ? 299 * passengers.length : 0;
    const subtotal = flightCost + addonsTotal + insuranceCost;
    const taxes = Math.round(subtotal * 0.12);
    const total = subtotal + taxes;
    
    return { 
      subtotal: flightCost, 
      addons: addonsTotal, 
      insurance: insuranceCost, 
      taxes, 
      total 
    };
  };

  const handleBookNow = () => {
    if (!selectedFlight) return;
    
    const passengerDetails = {
      passengers: passengers,
      class: selectedFlight.class,
      tripType: searchData.tripType,
      departDate: searchData.departDate,
      returnDate: searchData.returnDate,
      travelInsurance: travelInsurance,
      totalCost: calculateTotalCost(),
    };
    
    onProceedToCheckout(selectedFlight, passengerDetails);
  };

  // Sort flights
  const sortedFlights = [...mockFlights].sort((a, b) => {
    if (sortBy === 'price') return a.price - b.price;
    if (sortBy === 'duration') return a.duration.localeCompare(b.duration);
    if (sortBy === 'departure') return a.departure.localeCompare(b.departure);
    return 0;
  });

  // Filter flights
  const filteredFlights = sortedFlights.filter(flight => {
    if (filterStops === 'all') return true;
    if (filterStops === 'non-stop') return flight.stops === 'Non-Stop';
    if (filterStops === '1-stop') return flight.stops !== 'Non-Stop';
    return true;
  });

  // Results View
  if (step === 'results') {
    const isRoundTrip = searchData.tripType === 'round-trip';
    const currentRoute = flightLeg === 'outbound' 
      ? `${searchData.from} → ${searchData.to}`
      : `${searchData.to} → ${searchData.from}`;
    const currentDate = flightLeg === 'outbound' ? searchData.departDate : searchData.returnDate;

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between mb-4">
              <Button variant="ghost" onClick={onBack} className="gap-2">
                <ChevronLeft className="w-5 h-5" />
                Modify Search
              </Button>
              <div className="text-center">
                <h2 className="font-semibold text-gray-900">
                  {currentRoute}
                </h2>
                <p className="text-sm text-gray-600">
                  {currentDate} • {searchData.passengers} {searchData.passengers === '1' ? 'Passenger' : 'Passengers'}
                </p>
              </div>
              <div className="w-24"></div>
            </div>
            
            {/* Round Trip Indicator */}
            {isRoundTrip && (
              <div className="flex items-center justify-center gap-4 mt-2">
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    flightLeg === 'outbound' 
                      ? 'bg-[#000035] text-white' 
                      : selectedFlight 
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-200 text-gray-500'
                  }`}>
                    {selectedFlight && flightLeg !== 'outbound' && <Check className="w-4 h-4 mr-1" />}
                    <Plane className="w-4 h-4 rotate-90" />
                    <span className="font-medium">Outbound: {searchData.from} → {searchData.to}</span>
                    <span className="text-xs opacity-75">({searchData.departDate})</span>
                  </div>
                  
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                  
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    flightLeg === 'return' 
                      ? 'bg-[#000035] text-white' 
                      : selectedFlight 
                        ? 'bg-blue-50 text-blue-700 cursor-pointer hover:bg-blue-100'
                        : 'bg-gray-200 text-gray-400'
                  }`}
                    onClick={() => {
                      if (selectedFlight && flightLeg === 'outbound') {
                        setFlightLeg('return');
                      }
                    }}
                  >
                    {selectedReturnFlight && <Check className="w-4 h-4 mr-1" />}
                    <Plane className="w-4 h-4 rotate-90" />
                    <span className="font-medium">Return: {searchData.to} → {searchData.from}</span>
                    <span className="text-xs opacity-75">({searchData.returnDate})</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Filters & Sort */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex gap-3">
              <Button 
                variant={filterStops === 'all' ? 'default' : 'outline'}
                onClick={() => setFilterStops('all')}
                className="rounded-full"
              >
                All Flights
              </Button>
              <Button 
                variant={filterStops === 'non-stop' ? 'default' : 'outline'}
                onClick={() => setFilterStops('non-stop')}
                className="rounded-full"
              >
                Non-Stop
              </Button>
              <Button 
                variant={filterStops === '1-stop' ? 'default' : 'outline'}
                onClick={() => setFilterStops('1-stop')}
                className="rounded-full"
              >
                1 Stop
              </Button>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant={sortBy === 'price' ? 'default' : 'outline'}
                onClick={() => setSortBy('price')}
                size="sm"
              >
                Cheapest
              </Button>
              <Button 
                variant={sortBy === 'duration' ? 'default' : 'outline'}
                onClick={() => setSortBy('duration')}
                size="sm"
              >
                Fastest
              </Button>
              <Button 
                variant={sortBy === 'departure' ? 'default' : 'outline'}
                onClick={() => setSortBy('departure')}
                size="sm"
              >
                Earliest
              </Button>
            </div>
          </div>

          {/* Results Header */}
          <div className="mb-4">
            <p className="text-gray-600">
              {filteredFlights.length} flights found
            </p>
          </div>

          {/* Flight Cards */}
          <div className="space-y-4">
            {filteredFlights.map((flight) => (
              <Card key={flight.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-500">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    {/* Airline Info */}
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="font-bold text-blue-600">{flight.logo}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{flight.airline}</h3>
                        <p className="text-sm text-gray-600">{flight.flightNo}</p>
                      </div>
                    </div>

                    {/* Badges */}
                    <div className="flex gap-2">
                      {flight.cheapest && (
                        <Badge className="bg-green-600">
                          <TrendingDown className="w-3 h-3 mr-1" />
                          Cheapest
                        </Badge>
                      )}
                      {flight.fastest && (
                        <Badge className="bg-blue-600">
                          <Zap className="w-3 h-3 mr-1" />
                          Fastest
                        </Badge>
                      )}
                      {flight.discount > 0 && (
                        <Badge variant="outline" className="border-orange-500 text-orange-600">
                          {flight.discount}% OFF
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Flight Route */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">{flight.departure}</p>
                      <p className="text-sm text-gray-600">{flight.departureCode}</p>
                    </div>

                    <div className="flex-1 px-6">
                      <div className="relative">
                        <div className="h-px bg-gray-300 w-full"></div>
                        <Plane className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-5 h-5 text-blue-600 rotate-90 bg-white" />
                      </div>
                      <div className="text-center mt-2">
                        <p className="text-sm font-medium text-gray-700">{flight.duration}</p>
                        <p className="text-xs text-gray-500">{flight.stops}</p>
                      </div>
                    </div>

                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">{flight.arrival}</p>
                      <p className="text-sm text-gray-600">{flight.arrivalCode}</p>
                    </div>
                  </div>

                  {/* Flight Details */}
                  <div className="flex items-center gap-6 mb-4 pb-4 border-b text-sm">
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-gray-600" />
                      <span className="text-gray-700">{flight.baggage}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4 text-gray-600" />
                      <span className="text-gray-700">{flight.cabinBag}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-gray-700">{flight.rating} ({flight.reviews})</span>
                    </div>
                    {flight.refundable && (
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        <Shield className="w-3 h-3 mr-1" />
                        Refundable
                      </Badge>
                    )}
                  </div>

                  {/* Price & CTA */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500 line-through">₹{flight.originalPrice.toLocaleString()}</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-gray-900">₹{flight.price.toLocaleString()}</span>
                        <span className="text-sm text-gray-600">per person</span>
                      </div>
                      <p className="text-xs text-gray-500">{flight.seatsAvailable} seats left</p>
                    </div>
                    <Button 
                      onClick={() => handleFlightSelect(flight)}
                      className="bg-[#000035] hover:bg-[#000055] px-8"
                    >
                      Select Flight
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Flight Details View
  if (step === 'details' && selectedFlight) {
    const isRoundTrip = searchData.tripType === 'round-trip';
    const totalFlightCost = isRoundTrip && selectedReturnFlight
      ? (selectedFlight.price + selectedReturnFlight.price) * passengers.length
      : selectedFlight.price * passengers.length;
    const totalTaxes = Math.round(totalFlightCost * 0.12);

    return (
      <div className="min-h-screen bg-gray-50">
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
            <div className="col-span-2 space-y-6">
              {/* Outbound Flight Card */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center">
                      <span className="text-2xl font-bold text-blue-600">{selectedFlight.logo}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-2xl font-bold text-gray-900">{selectedFlight.airline}</h2>
                        {isRoundTrip && (
                          <Badge className="bg-[#000035]">Outbound</Badge>
                        )}
                      </div>
                      <p className="text-gray-600">{selectedFlight.flightNo} • {selectedFlight.class}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">{searchData.departDate}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-center p-6 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-1">Departure</p>
                      <p className="text-3xl font-bold text-gray-900">{selectedFlight.departure}</p>
                      <p className="text-gray-700">{selectedFlight.departureCity}</p>
                      <p className="text-sm text-gray-600">{selectedFlight.departureCode}</p>
                    </div>
                    
                    <div className="flex-1 px-8 max-w-md">
                      <div className="relative">
                        <div className="h-1 bg-[#000035] rounded-full"></div>
                        <Plane className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-[#000035] rotate-90 bg-white" />
                      </div>
                      <div className="text-center mt-3">
                        <p className="font-semibold text-gray-900">{selectedFlight.duration}</p>
                        <p className="text-sm text-gray-600">{selectedFlight.stops}</p>
                      </div>
                    </div>

                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-1">Arrival</p>
                      <p className="text-3xl font-bold text-gray-900">{selectedFlight.arrival}</p>
                      <p className="text-gray-700">{selectedFlight.arrivalCity}</p>
                      <p className="text-sm text-gray-600">{selectedFlight.arrivalCode}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 max-w-4xl mx-auto">
                    <div className="p-4 bg-gray-50 rounded-xl text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Briefcase className="w-5 h-5 text-blue-600" />
                        <span className="font-semibold text-gray-900">Baggage</span>
                      </div>
                      <p className="text-gray-700">{selectedFlight.baggage}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Users className="w-5 h-5 text-blue-600" />
                        <span className="font-semibold text-gray-900">Passengers</span>
                      </div>
                      <p className="text-gray-700">{passengers.length} {passengers.length === 1 ? 'Adult' : 'Adults'}</p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-xl text-center border-2 border-green-200">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Check className="w-5 h-5 text-green-600" />
                        <span className="font-semibold text-green-900">Status</span>
                      </div>
                      <p className="text-green-700 font-semibold">✓ Confirmed</p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Return Flight Card - Only for Round Trip */}
              {isRoundTrip && selectedReturnFlight && (
                <Card className="p-6 border-2 border-blue-200">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center">
                        <span className="text-2xl font-bold text-green-600">{selectedReturnFlight.logo}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-2xl font-bold text-gray-900">{selectedReturnFlight.airline}</h2>
                          <Badge className="bg-blue-600">Return</Badge>
                        </div>
                        <p className="text-gray-600">{selectedReturnFlight.flightNo} • {selectedReturnFlight.class}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">{searchData.returnDate}</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center justify-center p-6 bg-blue-50 rounded-xl border border-blue-200">
                      <div className="text-center">
                        <p className="text-sm text-gray-600 mb-1">Departure</p>
                        <p className="text-3xl font-bold text-gray-900">{selectedReturnFlight.departure}</p>
                        <p className="text-gray-700">{searchData.to}</p>
                        <p className="text-sm text-gray-600">{selectedReturnFlight.arrivalCode}</p>
                      </div>
                      
                      <div className="flex-1 px-8 max-w-md">
                        <div className="relative">
                          <div className="h-1 bg-blue-600 rounded-full"></div>
                          <Plane className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-blue-600 rotate-90 bg-white" />
                        </div>
                        <div className="text-center mt-3">
                          <p className="font-semibold text-gray-900">{selectedReturnFlight.duration}</p>
                          <p className="text-sm text-gray-600">{selectedReturnFlight.stops}</p>
                        </div>
                      </div>

                      <div className="text-center">
                        <p className="text-sm text-gray-600 mb-1">Arrival</p>
                        <p className="text-3xl font-bold text-gray-900">{selectedReturnFlight.arrival}</p>
                        <p className="text-gray-700">{searchData.from}</p>
                        <p className="text-sm text-gray-600">{selectedReturnFlight.departureCode}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 max-w-4xl mx-auto">
                      <div className="p-4 bg-blue-50 rounded-xl text-center">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <Briefcase className="w-5 h-5 text-blue-600" />
                          <span className="font-semibold text-gray-900">Baggage</span>
                        </div>
                        <p className="text-gray-700">{selectedReturnFlight.baggage}</p>
                      </div>
                      <div className="p-4 bg-blue-50 rounded-xl text-center">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <Users className="w-5 h-5 text-blue-600" />
                          <span className="font-semibold text-gray-900">Passengers</span>
                        </div>
                        <p className="text-gray-700">{passengers.length} {passengers.length === 1 ? 'Adult' : 'Adults'}</p>
                      </div>
                      <div className="p-4 bg-green-50 rounded-xl text-center border-2 border-green-200">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <Check className="w-5 h-5 text-green-600" />
                          <span className="font-semibold text-green-900">Status</span>
                        </div>
                        <p className="text-green-700 font-semibold">✓ Confirmed</p>
                      </div>
                    </div>
                  </div>
                </Card>
              )}

              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Fare Rules</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Cancellation</p>
                      <p className="text-sm text-gray-600">
                        {selectedFlight.refundable 
                          ? 'Cancellation fee applies. ₹3000 per passenger before 3 hours of departure.' 
                          : 'Non-refundable ticket. No cancellation allowed.'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Date Change</p>
                      <p className="text-sm text-gray-600">Date change allowed with ₹2500 + fare difference</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Web Check-in</p>
                      <p className="text-sm text-gray-600">Available 48 hours before departure</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <div className="col-span-1">
              <Card className="p-6 sticky top-24">
                <h3 className="text-xl font-semibold mb-4">Fare Summary</h3>
                
                <div className="space-y-3 mb-6 pb-6 border-b">
                  {isRoundTrip && selectedReturnFlight ? (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Outbound Flight ({passengers.length} pax)</span>
                        <span className="font-semibold">₹{(selectedFlight.price * passengers.length).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Return Flight ({passengers.length} pax)</span>
                        <span className="font-semibold">₹{(selectedReturnFlight.price * passengers.length).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm pt-2 border-t">
                        <span className="text-gray-600">Taxes & Fees</span>
                        <span className="font-semibold">₹{totalTaxes.toLocaleString()}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Base Fare ({passengers.length} passenger{passengers.length > 1 ? 's' : ''})</span>
                        <span className="font-semibold">₹{(selectedFlight.price * passengers.length).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Taxes & Fees</span>
                        <span className="font-semibold">₹{totalTaxes.toLocaleString()}</span>
                      </div>
                    </>
                  )}
                </div>

                <div className="flex justify-between items-center mb-6">
                  <span className="text-lg font-semibold">Total Amount</span>
                  <span className="text-2xl font-bold text-blue-600">
                    ₹{(totalFlightCost + totalTaxes).toLocaleString()}
                  </span>
                </div>

                <Button 
                  onClick={handleContinueToPassengers}
                  className="w-full h-12 bg-[#000035] hover:bg-[#000055] text-lg"
                >
                  Continue
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>

                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Info className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-green-700">
                      {isRoundTrip && selectedReturnFlight
                        ? `Great savings on your round trip booking!`
                        : `You're getting ${selectedFlight.discount}% discount on this flight!`}
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

  // Passenger Details View
  if (step === 'passengers' && selectedFlight) {
    const isFormValid = passengers.every(p => 
      p.firstName.trim() !== '' && 
      p.lastName.trim() !== '' && 
      p.age.trim() !== ''
    );

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <Button variant="ghost" onClick={() => setStep('details')} className="gap-2">
              <ChevronLeft className="w-5 h-5" />
              Back to Flight Details
            </Button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-3 gap-8">
            <div className="col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Passenger Details</h2>
                <Button onClick={addPassenger} variant="outline" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Passenger
                </Button>
              </div>

              {passengers.map((passenger, index) => (
                <Card key={passenger.id} className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Passenger {index + 1}</h3>
                    {passengers.length > 1 && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => removePassenger(passenger.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Remove
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Title
                      </label>
                      <select 
                        value={passenger.title}
                        onChange={(e) => updatePassenger(passenger.id, 'title', e.target.value)}
                        className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                      >
                        <option value="Mr">Mr</option>
                        <option value="Mrs">Mrs</option>
                        <option value="Ms">Ms</option>
                        <option value="Miss">Miss</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <Input 
                        value={passenger.firstName}
                        onChange={(e) => updatePassenger(passenger.id, 'firstName', e.target.value)}
                        placeholder="Enter first name"
                        className="border-2"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <Input 
                        value={passenger.lastName}
                        onChange={(e) => updatePassenger(passenger.id, 'lastName', e.target.value)}
                        placeholder="Enter last name"
                        className="border-2"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Age <span className="text-red-500">*</span>
                      </label>
                      <Input 
                        type="number"
                        value={passenger.age}
                        onChange={(e) => updatePassenger(passenger.id, 'age', e.target.value)}
                        placeholder="Enter age"
                        className="border-2"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Gender
                      </label>
                      <select 
                        value={passenger.gender}
                        onChange={(e) => updatePassenger(passenger.id, 'gender', e.target.value)}
                        className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Seat Preference
                      </label>
                      <select 
                        value={passenger.seatPreference}
                        onChange={(e) => updatePassenger(passenger.id, 'seatPreference', e.target.value)}
                        className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                      >
                        <option value="window">Window</option>
                        <option value="aisle">Aisle</option>
                        <option value="middle">Middle</option>
                      </select>
                    </div>
                  </div>
                </Card>
              ))}

              <Card className="p-6 bg-blue-50 border-blue-200">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-900 mb-1">Important Note</p>
                    <p className="text-sm text-blue-700">
                      Please ensure passenger names match exactly as per government ID. 
                      Name changes are not allowed after booking.
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            <div className="col-span-1">
              <Card className="p-6 sticky top-24">
                <h3 className="text-xl font-semibold mb-4">Booking Summary</h3>
                
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Flight</p>
                  <p className="font-semibold text-gray-900">{selectedFlight.airline}</p>
                  <p className="text-sm text-gray-600">{selectedFlight.flightNo}</p>
                </div>

                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Route</p>
                  <p className="font-semibold text-gray-900">
                    {searchData.from} → {searchData.to}
                  </p>
                  <p className="text-sm text-gray-600">{searchData.departDate}</p>
                </div>

                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Passengers</p>
                  <p className="font-semibold text-gray-900">{passengers.length} Traveller{passengers.length > 1 ? 's' : ''}</p>
                </div>

                <div className="space-y-3 mb-6 pb-6 border-b">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Flight Cost</span>
                    <span className="font-semibold">₹{(selectedFlight.price * passengers.length).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Taxes & Fees</span>
                    <span className="font-semibold">₹{Math.round(selectedFlight.price * passengers.length * 0.12).toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-6">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-2xl font-bold text-blue-600">
                    ₹{(selectedFlight.price * passengers.length + Math.round(selectedFlight.price * passengers.length * 0.12)).toLocaleString()}
                  </span>
                </div>

                <Button 
                  onClick={handleContinueToAddons}
                  disabled={!isFormValid}
                  className="w-full h-12 bg-[#000035] hover:bg-[#000055] text-lg disabled:opacity-50"
                >
                  Continue to Add-ons
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>

                {!isFormValid && (
                  <p className="mt-3 text-sm text-red-600 text-center">
                    Please fill all required fields
                  </p>
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Add-ons View (Meals, Baggage, Insurance)
  if (step === 'addons' && selectedFlight) {
    const costs = calculateTotalCost();

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <Button variant="ghost" onClick={() => setStep('passengers')} className="gap-2">
              <ChevronLeft className="w-5 h-5" />
              Back to Passenger Details
            </Button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-3 gap-8">
            <div className="col-span-2 space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Add-ons & Services</h2>

              {/* Travel Insurance */}
              <Card className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Shield className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-1">Travel Insurance</h3>
                      <p className="text-sm text-gray-600 mb-2">
                        Protect your trip with comprehensive travel insurance covering cancellations, 
                        medical emergencies, and baggage loss.
                      </p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-600" />
                          Trip cancellation up to ₹50,000
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-600" />
                          Medical emergency coverage
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-600" />
                          Baggage loss/delay compensation
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-4">
                    <p className="text-xl font-bold text-gray-900 mb-2">₹299<span className="text-sm font-normal text-gray-600">/person</span></p>
                    <Button 
                      variant={travelInsurance ? "default" : "outline"}
                      onClick={() => setTravelInsurance(!travelInsurance)}
                      size="sm"
                    >
                      {travelInsurance ? (
                        <>
                          <Check className="w-4 h-4 mr-1" />
                          Added
                        </>
                      ) : (
                        'Add'
                      )}
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Meals & Baggage for each passenger */}
              {passengers.map((passenger, index) => (
                <Card key={passenger.id} className="p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Passenger {index + 1}: {passenger.firstName} {passenger.lastName}
                  </h3>

                  {/* Meal Selection */}
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <UtensilsCrossed className="w-5 h-5 text-gray-700" />
                      <h4 className="font-semibold text-gray-900">Select Meal</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {mealOptions.map((meal) => (
                        <button
                          key={meal.id}
                          onClick={() => updatePassenger(passenger.id, 'meal', meal.id)}
                          className={`p-4 border-2 rounded-lg text-left transition-all ${
                            passenger.meal === meal.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-blue-300'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-gray-900">{meal.name}</span>
                            {passenger.meal === meal.id && (
                              <Check className="w-5 h-5 text-blue-600" />
                            )}
                          </div>
                          <p className="text-sm text-gray-600">
                            {meal.price === 0 ? 'Free' : `��${meal.price}`}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Extra Baggage */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Briefcase className="w-5 h-5 text-gray-700" />
                      <h4 className="font-semibold text-gray-900">Extra Baggage</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Included: {selectedFlight.baggage}
                    </p>
                    <div className="grid grid-cols-3 gap-3">
                      {baggageOptions.map((baggage) => (
                        <button
                          key={baggage.id}
                          onClick={() => updatePassenger(passenger.id, 'extraBaggage', baggage.id)}
                          className={`p-4 border-2 rounded-lg text-center transition-all ${
                            passenger.extraBaggage === baggage.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-blue-300'
                          }`}
                        >
                          <div className="flex flex-col items-center">
                            <span className="font-medium text-gray-900 mb-1">{baggage.weight}</span>
                            <p className="text-sm text-gray-600">
                              {baggage.price === 0 ? 'No Extra' : `₹${baggage.price}`}
                            </p>
                            {passenger.extraBaggage === baggage.id && (
                              <Check className="w-5 h-5 text-blue-600 mt-2" />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="col-span-1">
              <Card className="p-6 sticky top-24">
                <h3 className="text-xl font-semibold mb-4">Final Summary</h3>
                
                <div className="space-y-3 mb-6 pb-6 border-b">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Flight Cost</span>
                    <span className="font-semibold">₹{costs.subtotal.toLocaleString()}</span>
                  </div>
                  
                  {costs.addons > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Meals & Baggage</span>
                      <span className="font-semibold">₹{costs.addons.toLocaleString()}</span>
                    </div>
                  )}
                  
                  {costs.insurance > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Travel Insurance</span>
                      <span className="font-semibold">₹{costs.insurance.toLocaleString()}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Taxes & Fees</span>
                    <span className="font-semibold">₹{costs.taxes.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-6">
                  <span className="text-lg font-semibold">Grand Total</span>
                  <span className="text-2xl font-bold text-blue-600">
                    ₹{costs.total.toLocaleString()}
                  </span>
                </div>

                <Button 
                  onClick={handleBookNow}
                  className="w-full h-12 bg-[#000035] hover:bg-[#000055] text-lg"
                >
                  Proceed to Payment
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>

                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Info className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-green-700">
                      You're saving ₹{((selectedFlight.originalPrice - selectedFlight.price) * passengers.length).toLocaleString()} on this booking!
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