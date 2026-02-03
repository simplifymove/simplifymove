import { useState } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { 
  Plane,
  Hotel,
  Bus,
  Car,
  Bike,
  Truck,
  Package,
  MapPin,
  Calendar,
  Clock,
  ArrowRight,
  TrendingUp,
  Star,
  ChevronRight,
  Search,
  Users,
  Briefcase,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface Props {
  onNavigate: (screen: any) => void;
}

const popularDestinations = [
  { 
    name: 'Mumbai', 
    subtitle: 'Financial Capital',
    price: '₹3,499',
    image: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=400&h=300&fit=crop',
  },
  { 
    name: 'Bangalore', 
    subtitle: 'IT Hub',
    price: '₹2,999',
    image: 'https://images.unsplash.com/photo-1596176530529-78163b4f7e27?w=400&h=300&fit=crop',
  },
  { 
    name: 'Delhi', 
    subtitle: 'Capital City',
    price: '₹4,299',
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400&h=300&fit=crop',
  },
  { 
    name: 'Goa', 
    subtitle: 'Beach Paradise',
    price: '₹5,999',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400&h=300&fit=crop',
  },
];

const services = [
  { 
    icon: Plane, 
    label: 'Flights', 
    description: 'Book domestic & international',
    color: 'text-[#000035]',
    bgColor: 'bg-gray-100',
    service: 'flight'
  },
  { 
    icon: Hotel, 
    label: 'Hotels', 
    description: 'Find the perfect stay',
    color: 'text-[#000035]',
    bgColor: 'bg-gray-100',
    service: 'hotel'
  },
  { 
    icon: Bus, 
    label: 'Bus', 
    description: 'Comfortable bus journeys',
    color: 'text-[#000035]',
    bgColor: 'bg-gray-100',
    service: 'bus'
  },
  { 
    icon: Car, 
    label: 'Cabs', 
    description: 'Ride at your convenience',
    color: 'text-[#000035]',
    bgColor: 'bg-gray-100',
    service: 'cab'
  },
  { 
    icon: Bike, 
    label: 'Bikes', 
    description: 'Quick two-wheeler rides',
    color: 'text-[#000035]',
    bgColor: 'bg-gray-100',
    service: 'bike'
  },
  { 
    icon: Truck, 
    label: 'Logistics', 
    description: 'Cargo & freight services',
    color: 'text-[#000035]',
    bgColor: 'bg-gray-100',
    service: 'logistics'
  },
];

const recentBookings = [
  {
    id: 1,
    type: 'Flight',
    from: 'Mumbai',
    to: 'Delhi',
    date: '2025-12-28',
    amount: 4850,
    status: 'confirmed',
    bookingId: 'FLT-2025-001'
  },
  {
    id: 2,
    type: 'Hotel',
    location: 'Bangalore',
    date: '2025-12-25',
    amount: 3200,
    status: 'confirmed',
    bookingId: 'HTL-2025-089'
  },
  {
    id: 3,
    type: 'Cab',
    from: 'Airport',
    to: 'Office',
    date: '2025-12-22',
    amount: 450,
    status: 'completed',
    bookingId: 'CAB-2025-234'
  },
];

export function EmployeeDashboardClean({ onNavigate }: Props) {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Clean with #000035 */}
      <div className="bg-[#000035] border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            Where to next, Rajesh?
          </h1>
          <p className="text-gray-300 text-lg">
            Plan and book your business travel seamlessly
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* Quick Stats - Airbnb Style Clean Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 bg-white border border-gray-200 rounded-xl hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-2">Personal Wallet</p>
                <p className="text-3xl font-semibold text-[#000035]">₹2,450</p>
                <p className="text-xs text-gray-600 mt-3 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  Available Balance
                </p>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-[#000035]" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white border border-gray-200 rounded-xl hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-2">Company Wallet</p>
                <p className="text-3xl font-semibold text-[#000035]">₹18,750</p>
                <p className="text-xs text-gray-600 mt-3 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Approved Limit
                </p>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                <Building className="w-6 h-6 text-[#000035]" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white border border-gray-200 rounded-xl hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-2">Active Trips</p>
                <p className="text-3xl font-semibold text-[#000035]">3</p>
                <p className="text-xs text-gray-600 mt-3 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  1 Upcoming
                </p>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-[#000035]" />
              </div>
            </div>
          </Card>
        </div>

        {/* Services Grid - Airbnb Style */}
        <div>
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-[#000035] mb-2">Book Your Travel</h2>
            <p className="text-gray-600">Choose from our range of services</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <button
                  key={service.label}
                  onClick={() => onNavigate('new-booking')}
                  className="group p-6 bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-200 text-center"
                >
                  <div className={`w-14 h-14 ${service.bgColor} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform duration-200`}>
                    <Icon className={`w-7 h-7 ${service.color}`} />
                  </div>
                  <h3 className="font-semibold text-[#000035] mb-1">{service.label}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{service.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Popular Destinations - True Airbnb Style */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-semibold text-[#000035] mb-2">Popular Destinations</h2>
              <p className="text-gray-600">Trending business travel destinations</p>
            </div>
            <Button variant="ghost" className="text-[#000035] hover:text-[#000035] hover:bg-gray-100">
              View all
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularDestinations.map((destination) => (
              <button
                key={destination.name}
                onClick={() => onNavigate('new-booking')}
                className="group text-left"
              >
                <div className="relative aspect-square rounded-xl overflow-hidden mb-3 bg-gray-100">
                  <img 
                    src={destination.image} 
                    alt={destination.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-[#000035]">{destination.name}</p>
                      <p className="text-sm text-gray-500">{destination.subtitle}</p>
                    </div>
                    <div className="flex items-center gap-1 text-[#000035]">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-medium">4.8</span>
                    </div>
                  </div>
                  <p className="text-sm">
                    <span className="font-semibold text-[#000035]">{destination.price}</span>
                    <span className="text-gray-500"> / trip</span>
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Bookings - Clean List */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-semibold text-[#000035] mb-2">Recent Bookings</h2>
              <p className="text-gray-600">Your latest travel bookings</p>
            </div>
            <Button 
              variant="ghost" 
              className="text-[#000035] hover:text-[#000035] hover:bg-gray-100"
              onClick={() => onNavigate('my-orders')}
            >
              View all
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          <div className="space-y-4">
            {recentBookings.map((booking) => (
              <Card key={booking.id} className="p-5 bg-white border border-gray-200 rounded-xl hover:shadow-lg transition-shadow duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      {booking.type === 'Flight' && <Plane className="w-6 h-6 text-[#000035]" />}
                      {booking.type === 'Hotel' && <Hotel className="w-6 h-6 text-[#000035]" />}
                      {booking.type === 'Cab' && <Car className="w-6 h-6 text-[#000035]" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-[#000035]">{booking.type}</p>
                        <Badge 
                          variant="outline" 
                          className={
                            booking.status === 'confirmed' 
                              ? 'bg-green-50 text-green-700 border-green-200'
                              : 'bg-gray-50 text-gray-700 border-gray-200'
                          }
                        >
                          {booking.status === 'confirmed' ? 'Confirmed' : 'Completed'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        {booking.from && booking.to 
                          ? `${booking.from} → ${booking.to}` 
                          : booking.location
                        }
                      </p>
                      <p className="text-xs text-gray-500">
                        {booking.bookingId} • {booking.date}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-[#000035] mb-2">₹{booking.amount.toLocaleString()}</p>
                    <Button variant="ghost" size="sm" className="text-[#000035] hover:text-[#000035] hover:bg-gray-100">
                      View Details
                      <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Banner - Clean #000035 Solid */}
        <Card className="p-8 bg-[#000035] border-0 rounded-xl shadow-lg">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-semibold text-white mb-2">Plan your next business trip</h3>
              <p className="text-gray-300">
                Book flights, hotels, and transportation with ease. Manage everything in one place.
              </p>
            </div>
            <Button 
              size="lg"
              className="bg-white text-[#000035] hover:bg-gray-50 flex-shrink-0 shadow-sm"
              onClick={() => onNavigate('new-booking')}
            >
              Start Booking
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

// Missing Building import
function Building({ className }: { className?: string }) {
  return (
    <svg 
      className={className}
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" 
      />
    </svg>
  );
}