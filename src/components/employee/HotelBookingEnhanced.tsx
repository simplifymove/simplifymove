import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { 
  MapPin, 
  Calendar, 
  Users, 
  Star, 
  Wifi, 
  Coffee, 
  Car as ParkingIcon, 
  Dumbbell, 
  UtensilsCrossed, 
  Check, 
  ChevronDown,
  ChevronLeft,
  Heart,
  Share2,
  ImageIcon,
  Plus,
  Minus,
  X,
  ChevronRight,
  Shield,
  Info,
  AlertCircle,
  Bed,
  Clock
} from 'lucide-react';

// Mock hotel data
const mockHotels = [
  {
    id: 1,
    name: 'The Grand Palace Hotel',
    location: 'Connaught Place, New Delhi',
    distance: '2.5 km from city center',
    rating: 4.8,
    reviews: 1250,
    price: 4500,
    originalPrice: 6000,
    discount: 25,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
    amenities: ['Free WiFi', 'Pool', 'Parking', 'Gym', 'Restaurant'],
    roomType: 'Deluxe Room',
    bestSeller: true,
    maxOccupancy: 3,
  },
  {
    id: 2,
    name: 'Royal Comfort Suites',
    location: 'Karol Bagh, New Delhi',
    distance: '3.2 km from city center',
    rating: 4.6,
    reviews: 890,
    price: 3200,
    originalPrice: 4500,
    discount: 29,
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
    amenities: ['Free WiFi', 'Breakfast', 'Parking', 'AC'],
    roomType: 'Superior Room',
    bestSeller: false,
    maxOccupancy: 2,
  },
  {
    id: 3,
    name: 'Luxury Inn & Spa',
    location: 'Aerocity, New Delhi',
    distance: '1.8 km from airport',
    rating: 4.9,
    reviews: 2100,
    price: 6800,
    originalPrice: 9000,
    discount: 24,
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800',
    amenities: ['Free WiFi', 'Pool', 'Spa', 'Gym', 'Restaurant', 'Bar'],
    roomType: 'Executive Suite',
    bestSeller: true,
    maxOccupancy: 4,
  },
  {
    id: 4,
    name: 'Budget Stay Inn',
    location: 'Paharganj, New Delhi',
    distance: '0.8 km from railway station',
    rating: 4.2,
    reviews: 450,
    price: 1800,
    originalPrice: 2500,
    discount: 28,
    image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800',
    amenities: ['Free WiFi', 'Breakfast', 'AC'],
    roomType: 'Standard Room',
    bestSeller: false,
    maxOccupancy: 2,
  },
];

const mealPlans = [
  { id: 'room-only', name: 'Room Only', price: 0, description: 'No meals included' },
  { id: 'breakfast', name: 'Room + Breakfast', price: 500, description: 'Complimentary breakfast' },
  { id: 'half-board', name: 'Half Board', price: 1200, description: 'Breakfast + Dinner' },
  { id: 'full-board', name: 'Full Board', price: 2000, description: 'Breakfast + Lunch + Dinner' },
];

interface Room {
  id: string;
  guests: Array<{
    id: string;
    title: string;
    firstName: string;
    lastName: 'string';
    age: string;
  }>;
  mealPlan: string;
  extraBed: boolean;
  earlyCheckIn: boolean;
  lateCheckOut: boolean;
}

interface HotelBookingProps {
  searchData: {
    location: string;
    checkIn: string;
    checkOut: string;
    guests: string;
  };
  onBack: () => void;
  onProceedToCheckout: (hotel: any, roomDetails: any) => void;
}

export function HotelBooking({ searchData, onBack, onProceedToCheckout }: HotelBookingProps) {
  const [step, setStep] = useState<'results' | 'details' | 'guests' | 'addons'>('results');
  const [selectedHotel, setSelectedHotel] = useState<any>(null);
  const [sortBy, setSortBy] = useState<'price' | 'rating'>('price');
  
  const [rooms, setRooms] = useState<Room[]>([
    {
      id: '1',
      guests: [
        { id: '1', title: 'Mr', firstName: '', lastName: '', age: '' }
      ],
      mealPlan: 'room-only',
      extraBed: false,
      earlyCheckIn: false,
      lateCheckOut: false,
    }
  ]);

  const [specialRequests, setSpecialRequests] = useState('');

  const calculateNights = () => {
    const checkIn = new Date(searchData.checkIn);
    const checkOut = new Date(searchData.checkOut);
    const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const nights = calculateNights();

  const handleHotelSelect = (hotel: any) => {
    setSelectedHotel(hotel);
    setStep('details');
  };

  const handleContinueToGuests = () => {
    setStep('guests');
  };

  const handleContinueToAddons = () => {
    setStep('addons');
  };

  const addRoom = () => {
    const newRoom: Room = {
      id: Date.now().toString(),
      guests: [
        { id: Date.now().toString(), title: 'Mr', firstName: '', lastName: '', age: '' }
      ],
      mealPlan: 'room-only',
      extraBed: false,
      earlyCheckIn: false,
      lateCheckOut: false,
    };
    setRooms([...rooms, newRoom]);
  };

  const removeRoom = (roomId: string) => {
    if (rooms.length > 1) {
      setRooms(rooms.filter(r => r.id !== roomId));
    }
  };

  const addGuestToRoom = (roomId: string) => {
    setRooms(rooms.map(room => {
      if (room.id === roomId) {
        const newGuest = {
          id: Date.now().toString(),
          title: 'Mr',
          firstName: '',
          lastName: '',
          age: ''
        };
        return { ...room, guests: [...room.guests, newGuest] };
      }
      return room;
    }));
  };

  const removeGuestFromRoom = (roomId: string, guestId: string) => {
    setRooms(rooms.map(room => {
      if (room.id === roomId && room.guests.length > 1) {
        return { ...room, guests: room.guests.filter(g => g.id !== guestId) };
      }
      return room;
    }));
  };

  const updateGuest = (roomId: string, guestId: string, field: string, value: string) => {
    setRooms(rooms.map(room => {
      if (room.id === roomId) {
        return {
          ...room,
          guests: room.guests.map(guest => 
            guest.id === guestId ? { ...guest, [field]: value } : guest
          )
        };
      }
      return room;
    }));
  };

  const updateRoomMealPlan = (roomId: string, mealPlanId: string) => {
    setRooms(rooms.map(room => 
      room.id === roomId ? { ...room, mealPlan: mealPlanId } : room
    ));
  };

  const toggleRoomOption = (roomId: string, option: 'extraBed' | 'earlyCheckIn' | 'lateCheckOut') => {
    setRooms(rooms.map(room => 
      room.id === roomId ? { ...room, [option]: !room[option] } : room
    ));
  };

  const calculateTotalCost = () => {
    if (!selectedHotel) return { subtotal: 0, meals: 0, extras: 0, taxes: 0, total: 0 };
    
    const roomCost = selectedHotel.price * rooms.length * nights;
    
    const mealsTotal = rooms.reduce((sum, room) => {
      const meal = mealPlans.find(m => m.id === room.mealPlan);
      return sum + ((meal?.price || 0) * nights);
    }, 0);
    
    const extrasTotal = rooms.reduce((sum, room) => {
      let extras = 0;
      if (room.extraBed) extras += 800 * nights;
      if (room.earlyCheckIn) extras += 1000;
      if (room.lateCheckOut) extras += 1000;
      return sum + extras;
    }, 0);
    
    const subtotal = roomCost + mealsTotal + extrasTotal;
    const taxes = Math.round(subtotal * 0.12);
    const total = subtotal + taxes;
    
    return { subtotal: roomCost, meals: mealsTotal, extras: extrasTotal, taxes, total };
  };

  const handleBookNow = () => {
    if (!selectedHotel) return;
    
    const bookingDetails = {
      rooms: rooms,
      checkIn: searchData.checkIn,
      checkOut: searchData.checkOut,
      totalNights: nights,
      roomCount: rooms.length,
      specialRequests: specialRequests,
      totalCost: calculateTotalCost(),
    };
    
    onProceedToCheckout(selectedHotel, bookingDetails);
  };

  // Sort hotels
  const sortedHotels = [...mockHotels].sort((a, b) => {
    if (sortBy === 'price') return a.price - b.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0;
  });

  // Results View
  if (step === 'results') {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <Button variant="ghost" onClick={onBack} className="gap-2">
                <ChevronLeft className="w-5 h-5" />
                Modify Search
              </Button>
              <div className="text-center">
                <h2 className="font-semibold text-gray-900">{searchData.location}</h2>
                <p className="text-sm text-gray-600">
                  {searchData.checkIn} - {searchData.checkOut} • {nights} {nights === 1 ? 'Night' : 'Nights'}
                </p>
              </div>
              <div className="w-24"></div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Filters & Sort */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex gap-3">
              <Button 
                variant={sortBy === 'price' ? 'default' : 'outline'}
                onClick={() => setSortBy('price')}
                className="rounded-full"
              >
                Lowest Price
              </Button>
              <Button 
                variant={sortBy === 'rating' ? 'default' : 'outline'}
                onClick={() => setSortBy('rating')}
                className="rounded-full"
              >
                Highest Rating
              </Button>
            </div>
            
            <p className="text-gray-600">{sortedHotels.length} properties found</p>
          </div>

          {/* Hotel Cards */}
          <div className="space-y-4">
            {sortedHotels.map((hotel) => (
              <Card key={hotel.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 border-2 hover:border-orange-500">
                <div className="flex gap-0">
                  {/* Hotel Image */}
                  <div className="relative w-80 h-64 flex-shrink-0">
                    <img 
                      src={hotel.image} 
                      alt={hotel.name}
                      className="w-full h-full object-cover"
                    />
                    {hotel.bestSeller && (
                      <Badge className="absolute top-3 left-3 bg-[#000035]">
                        Bestseller
                      </Badge>
                    )}
                    {hotel.discount > 0 && (
                      <Badge className="absolute top-3 right-3 bg-green-600">
                        {hotel.discount}% OFF
                      </Badge>
                    )}
                  </div>

                  {/* Hotel Details */}
                  <div className="flex-1 p-6 flex flex-col">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-1">{hotel.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                          <MapPin className="w-4 h-4" />
                          <span>{hotel.location}</span>
                        </div>
                        <p className="text-xs text-gray-500">{hotel.distance}</p>
                      </div>
                      <div className="text-right">
                        <div className="bg-orange-600 text-white px-3 py-1 rounded-lg flex items-center gap-1 mb-1">
                          <Star className="w-4 h-4 fill-white" />
                          <span className="font-bold">{hotel.rating}</span>
                        </div>
                        <p className="text-xs text-gray-600">{hotel.reviews} reviews</p>
                      </div>
                    </div>

                    {/* Room Type */}
                    <div className="mb-4 p-3 bg-orange-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Bed className="w-4 h-4 text-orange-600" />
                        <span className="font-medium text-gray-900">{hotel.roomType}</span>
                      </div>
                      <p className="text-xs text-gray-600">Max {hotel.maxOccupancy} guests</p>
                    </div>

                    {/* Amenities */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {hotel.amenities.map((amenity, idx) => (
                        <Badge key={idx} variant="outline" className="gap-1.5">
                          <Check className="w-3 h-3 text-green-600" />
                          <span className="text-xs">{amenity}</span>
                        </Badge>
                      ))}
                    </div>

                    {/* Spacer */}
                    <div className="flex-1"></div>

                    {/* Price & CTA */}
                    <div className="flex items-end justify-between pt-4 border-t">
                      <div>
                        <p className="text-xs text-gray-500 line-through">₹{hotel.originalPrice.toLocaleString()}</p>
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="text-3xl font-bold text-gray-900">₹{hotel.price.toLocaleString()}</span>
                          <span className="text-sm text-gray-600">per night</span>
                        </div>
                        <p className="text-xs text-gray-500">+ ₹{Math.round(hotel.price * nights * 0.12)} taxes</p>
                      </div>
                      <Button 
                        onClick={() => handleHotelSelect(hotel)}
                        className="bg-[#000035] hover:bg-[#000055] px-8 h-12"
                      >
                        Select Room
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
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

  // Hotel Details View
  if (step === 'details' && selectedHotel) {
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
              {/* Hotel Details Card */}
              <Card className="p-6">
                <img 
                  src={selectedHotel.image} 
                  alt={selectedHotel.name}
                  className="w-full h-80 object-cover rounded-xl mb-6"
                />
                
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">{selectedHotel.name}</h2>
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <MapPin className="w-5 h-5" />
                      <span>{selectedHotel.location}</span>
                    </div>
                    <p className="text-sm text-gray-500">{selectedHotel.distance}</p>
                  </div>
                  <div className="text-right">
                    <div className="bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 mb-2">
                      <Star className="w-5 h-5 fill-white" />
                      <span className="text-xl font-bold">{selectedHotel.rating}</span>
                    </div>
                    <p className="text-sm text-gray-600">{selectedHotel.reviews} reviews</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="p-4 bg-orange-50 rounded-xl">
                    <Bed className="w-6 h-6 text-orange-600 mb-2" />
                    <p className="text-sm text-gray-600">Room Type</p>
                    <p className="font-semibold text-gray-900">{selectedHotel.roomType}</p>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-xl">
                    <Users className="w-6 h-6 text-orange-600 mb-2" />
                    <p className="text-sm text-gray-600">Max Occupancy</p>
                    <p className="font-semibold text-gray-900">{selectedHotel.maxOccupancy} guests</p>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-xl">
                    <Clock className="w-6 h-6 text-orange-600 mb-2" />
                    <p className="text-sm text-gray-600">Check-in/out</p>
                    <p className="font-semibold text-gray-900">2 PM / 11 AM</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">Amenities</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {selectedHotel.amenities.map((amenity: string, idx: number) => (
                      <div key={idx} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <Check className="w-5 h-5 text-green-600" />
                        <span className="text-gray-900">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Policies */}
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Hotel Policies</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Check-in</p>
                      <p className="text-sm text-gray-600">After 2:00 PM. Early check-in subject to availability.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Check-out</p>
                      <p className="text-sm text-gray-600">Before 11:00 AM. Late check-out available for extra charge.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Cancellation</p>
                      <p className="text-sm text-gray-600">Free cancellation up to 24 hours before check-in.</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <div className="col-span-1">
              <Card className="p-6 sticky top-24">
                <h3 className="text-xl font-semibold mb-4">Booking Summary</h3>
                
                <div className="space-y-3 mb-6 pb-6 border-b">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Check-in</span>
                    <span className="font-semibold">{searchData.checkIn}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Check-out</span>
                    <span className="font-semibold">{searchData.checkOut}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Nights</span>
                    <span className="font-semibold">{nights}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Rooms</span>
                    <span className="font-semibold">{rooms.length}</span>
                  </div>
                </div>

                <div className="space-y-3 mb-6 pb-6 border-b">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Room Cost</span>
                    <span className="font-semibold">₹{(selectedHotel.price * rooms.length * nights).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Taxes & Fees</span>
                    <span className="font-semibold">₹{Math.round(selectedHotel.price * rooms.length * nights * 0.12).toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-6">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-2xl font-bold text-orange-600">
                    ₹{(selectedHotel.price * rooms.length * nights + Math.round(selectedHotel.price * rooms.length * nights * 0.12)).toLocaleString()}
                  </span>
                </div>

                <Button 
                  onClick={handleContinueToGuests}
                  className="w-full h-12 bg-[#000035] hover:bg-[#000055] text-lg text-white"
                >
                  Continue
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>

                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Info className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-green-700">
                      You're getting {selectedHotel.discount}% discount on this booking!
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

  // Guest Details View
  if (step === 'guests' && selectedHotel) {
    const isFormValid = rooms.every(room => 
      room.guests.every(guest => 
        guest.firstName.trim() !== '' && 
        guest.lastName.trim() !== '' && 
        guest.age.trim() !== ''
      )
    );

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <Button variant="ghost" onClick={() => setStep('details')} className="gap-2">
              <ChevronLeft className="w-5 h-5" />
              Back to Hotel Details
            </Button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-3 gap-8">
            <div className="col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Guest Details</h2>
                <Button onClick={addRoom} variant="outline" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Room
                </Button>
              </div>

              {rooms.map((room, roomIndex) => (
                <Card key={room.id} className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Room {roomIndex + 1}</h3>
                    {rooms.length > 1 && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => removeRoom(room.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Remove Room
                      </Button>
                    )}
                  </div>

                  {room.guests.map((guest, guestIndex) => (
                    <div key={guest.id} className="mb-6 pb-6 border-b last:border-b-0 last:mb-0 last:pb-0">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium text-gray-900">Guest {guestIndex + 1}</h4>
                        {room.guests.length > 1 && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => removeGuestFromRoom(room.id, guest.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Title
                          </label>
                          <select 
                            value={guest.title}
                            onChange={(e) => updateGuest(room.id, guest.id, 'title', e.target.value)}
                            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
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
                            value={guest.firstName}
                            onChange={(e) => updateGuest(room.id, guest.id, 'firstName', e.target.value)}
                            placeholder="Enter first name"
                            className="border-2"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Last Name <span className="text-red-500">*</span>
                          </label>
                          <Input 
                            value={guest.lastName}
                            onChange={(e) => updateGuest(room.id, guest.id, 'lastName', e.target.value)}
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
                            value={guest.age}
                            onChange={(e) => updateGuest(room.id, guest.id, 'age', e.target.value)}
                            placeholder="Enter age"
                            className="border-2"
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  {room.guests.length < selectedHotel.maxOccupancy && (
                    <Button 
                      onClick={() => addGuestToRoom(room.id)}
                      variant="outline"
                      className="w-full mt-4"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Guest to Room {roomIndex + 1}
                    </Button>
                  )}
                </Card>
              ))}

              <Card className="p-6 bg-blue-50 border-blue-200">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-900 mb-1">Important Note</p>
                    <p className="text-sm text-blue-700">
                      Primary guest must be 18+ years old. Valid government ID required at check-in.
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            <div className="col-span-1">
              <Card className="p-6 sticky top-24">
                <h3 className="text-xl font-semibold mb-4">Booking Summary</h3>
                
                <div className="space-y-3 mb-6 pb-6 border-b">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Check-in</span>
                    <span className="font-semibold">{searchData.checkIn}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Check-out</span>
                    <span className="font-semibold">{searchData.checkOut}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Nights</span>
                    <span className="font-semibold">{nights}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Rooms</span>
                    <span className="font-semibold">{rooms.length}</span>
                  </div>
                </div>

                <div className="space-y-3 mb-6 pb-6 border-b">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Room Cost</span>
                    <span className="font-semibold">₹{(selectedHotel.price * rooms.length * nights).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Taxes & Fees</span>
                    <span className="font-semibold">₹{Math.round(selectedHotel.price * rooms.length * nights * 0.12).toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-6">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-2xl font-bold text-orange-600">
                    ₹{(selectedHotel.price * rooms.length * nights + Math.round(selectedHotel.price * rooms.length * nights * 0.12)).toLocaleString()}
                  </span>
                </div>

                <Button 
                  onClick={handleContinueToAddons}
                  disabled={!isFormValid}
                  className="w-full h-12 bg-[#000035] hover:bg-[#000055] text-lg text-white disabled:opacity-50"
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

  // Add-ons View (Meal Plans & Extras)
  if (step === 'addons' && selectedHotel) {
    const costs = calculateTotalCost();

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <Button variant="ghost" onClick={() => setStep('guests')} className="gap-2">
              <ChevronLeft className="w-5 h-5" />
              Back to Guest Details
            </Button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-3 gap-8">
            <div className="col-span-2 space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Meal Plans & Add-ons</h2>

              {rooms.map((room, roomIndex) => (
                <Card key={room.id} className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Room {roomIndex + 1}</h3>

                  {/* Meal Plans */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Select Meal Plan</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {mealPlans.map((meal) => (
                        <button
                          key={meal.id}
                          onClick={() => updateRoomMealPlan(room.id, meal.id)}
                          className={`p-4 border-2 rounded-lg text-left transition-all ${
                            room.mealPlan === meal.id
                              ? 'border-orange-500 bg-orange-50'
                              : 'border-gray-200 hover:border-orange-300'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-gray-900">{meal.name}</span>
                            {room.mealPlan === meal.id && (
                              <Check className="w-5 h-5 text-orange-600" />
                            )}
                          </div>
                          <p className="text-xs text-gray-600 mb-2">{meal.description}</p>
                          <p className="text-sm font-semibold text-gray-900">
                            {meal.price === 0 ? 'Included' : `+₹${meal.price * nights}`}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Additional Options */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Additional Services</h4>
                    <div className="space-y-3">
                      <div 
                        onClick={() => toggleRoomOption(room.id, 'extraBed')}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          room.extraBed ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-orange-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                              room.extraBed ? 'border-orange-500 bg-orange-500' : 'border-gray-300'
                            }`}>
                              {room.extraBed && <Check className="w-4 h-4 text-white" />}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">Extra Bed</p>
                              <p className="text-sm text-gray-600">Comfortable rollaway bed</p>
                            </div>
                          </div>
                          <span className="text-sm font-semibold text-gray-900">₹{800 * nights}</span>
                        </div>
                      </div>

                      <div 
                        onClick={() => toggleRoomOption(room.id, 'earlyCheckIn')}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          room.earlyCheckIn ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-orange-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                              room.earlyCheckIn ? 'border-orange-500 bg-orange-500' : 'border-gray-300'
                            }`}>
                              {room.earlyCheckIn && <Check className="w-4 h-4 text-white" />}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">Early Check-in</p>
                              <p className="text-sm text-gray-600">Check-in from 10:00 AM</p>
                            </div>
                          </div>
                          <span className="text-sm font-semibold text-gray-900">₹1,000</span>
                        </div>
                      </div>

                      <div 
                        onClick={() => toggleRoomOption(room.id, 'lateCheckOut')}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          room.lateCheckOut ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-orange-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                              room.lateCheckOut ? 'border-orange-500 bg-orange-500' : 'border-gray-300'
                            }`}>
                              {room.lateCheckOut && <Check className="w-4 h-4 text-white" />}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">Late Check-out</p>
                              <p className="text-sm text-gray-600">Check-out till 3:00 PM</p>
                            </div>
                          </div>
                          <span className="text-sm font-semibold text-gray-900">₹1,000</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}

              {/* Special Requests */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-3">Special Requests</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Any specific requirements? (Subject to availability)
                </p>
                <textarea
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="E.g., High floor, Away from elevator, Extra pillows..."
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none min-h-[100px]"
                />
              </Card>
            </div>

            <div className="col-span-1">
              <Card className="p-6 sticky top-24 border-2 border-orange-200">
                <h3 className="text-xl font-semibold mb-4">Final Summary</h3>
                
                <div className="space-y-3 mb-6 pb-6 border-b">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Room Cost</span>
                    <span className="font-semibold">₹{costs.subtotal.toLocaleString()}</span>
                  </div>
                  
                  {costs.meals > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Meal Plans</span>
                      <span className="font-semibold">₹{costs.meals.toLocaleString()}</span>
                    </div>
                  )}
                  
                  {costs.extras > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Add-ons</span>
                      <span className="font-semibold">₹{costs.extras.toLocaleString()}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Taxes & Fees</span>
                    <span className="font-semibold">₹{costs.taxes.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-6">
                  <span className="text-lg font-semibold">Grand Total</span>
                  <span className="text-2xl font-bold text-orange-600">₹{costs.total.toLocaleString()}</span>
                </div>

                <Button 
                  onClick={handleBookNow}
                  className="w-full h-12 bg-[#000035] hover:bg-[#000055] text-lg text-white"
                >
                  Proceed to Payment
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>

                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Shield className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-green-700">
                      Free cancellation available up to 24 hours before check-in
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