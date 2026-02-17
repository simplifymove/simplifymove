/**
 * Enhanced Flight Booking Component with MakeMyTrip API Integration
 * This is an example component showing how to integrate the MakeMyTrip API
 * with the existing FlightBookingEnhanced component
 */

import { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import travelAPI from '../../lib/travelAPI';
import { Plane, Clock, Star, Loader, AlertCircle } from 'lucide-react';

interface Flight {
  id: string;
  airline: string;
  flightNo: string;
  departure: string;
  arrival: string;
  duration: number;
  price: number;
  currency: string;
  seatsAvailable: number;
  cabinClass: string;
  stops: number;
  rating?: number;
  reviews?: number;
}

interface FlightBookingMMTProps {
  onBookingComplete?: (bookingData: any) => void;
  companyId?: string;
  employeeId?: string;
}

export function FlightBookingMMT({ onBookingComplete, companyId, employeeId }: FlightBookingMMTProps) {
  // Search parameters
  const [from, setFrom] = useState('DEL');
  const [to, setTo] = useState('BOM');
  const [departDate, setDepartDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [passengers, setPassengers] = useState(1);
  const [cabinClass, setCabinClass] = useState('economy');
  const [tripType, setTripType] = useState<'one-way' | 'round-trip'>('round-trip');

  // Results
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [step, setStep] = useState<'search' | 'selection' | 'confirmation'>('search');

  // Booking details
  const [passengerDetails, setPassengerDetails] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: 'M',
  });

  const [bookingLoading, setBookingLoading] = useState(false);

  // Set today's date as minimum
  const today = new Date().toISOString().split('T')[0];

  // Search flights
  const handleSearchFlights = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate inputs
      if (!from || !to || !departDate) {
        throw new Error('Please fill all required fields');
      }

      if (new Date(departDate) < new Date(today)) {
        throw new Error('Departure date cannot be in the past');
      }

      if (tripType === 'round-trip' && returnDate && new Date(returnDate) <= new Date(departDate)) {
        throw new Error('Return date must be after departure date');
      }

      console.log('Searching flights with:', {
        origin: from,
        destination: to,
        departDate,
        returnDate: tripType === 'round-trip' ? returnDate : null,
        passengers,
        cabinClass,
      });

      const result = await travelAPI.searchFlights({
        origin: from.toUpperCase(),
        destination: to.toUpperCase(),
        departDate,
        returnDate: tripType === 'round-trip' ? returnDate : null,
        passengers,
        cabinClass,
        sortBy: 'price',
      });

      if (result.success) {
        setFlights(result.data);
        setStep('selection');
      } else {
        throw new Error(result.error || 'Failed to search flights');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      console.error('Flight search error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle flight selection
  const handleSelectFlight = (flight: Flight) => {
    setSelectedFlight(flight);
    setStep('confirmation');
  };

  // Handle passenger details change
  const handlePassengerChange = (field: string, value: string) => {
    setPassengerDetails(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle booking
  const handleBookFlight = async () => {
    setBookingLoading(true);
    setError(null);

    try {
      if (!selectedFlight) {
        throw new Error('No flight selected');
      }

      if (!passengerDetails.firstName || !passengerDetails.email || !passengerDetails.phone) {
        throw new Error('Please fill all passenger details');
      }

      const bookingData = {
        flightId: selectedFlight.id,
        segment: 'OUTBOUND',
        passengers: [
          {
            firstName: passengerDetails.firstName,
            lastName: passengerDetails.lastName,
            email: passengerDetails.email,
            phone: passengerDetails.phone,
            dateOfBirth: passengerDetails.dateOfBirth,
            gender: passengerDetails.gender,
            seatPreference: 'window',
          },
        ],
        contactDetails: {
          email: passengerDetails.email,
          phone: passengerDetails.phone,
        },
        paymentInfo: {
          method: 'wallet',
          paymentGateway: 'razorpay',
        },
        travelType: 'BUSINESS',
        companyId,
        employeeId,
      };

      console.log('Booking flight with:', bookingData);

      const result = await travelAPI.bookFlight(bookingData);

      if (result.success) {
        alert(`✅ Booking confirmed!\nConfirmation Number: ${result.confirmationNumber}`);
        
        if (onBookingComplete) {
          onBookingComplete({
            bookingId: result.bookingId,
            confirmationNumber: result.confirmationNumber,
            flight: selectedFlight,
            passenger: passengerDetails,
          });
        }

        // Reset form
        setStep('search');
        setFlights([]);
        setSelectedFlight(null);
        setPassengerDetails({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          dateOfBirth: '',
          gender: 'M',
        });
      } else {
        throw new Error(result.error || 'Booking failed');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      console.error('Booking error:', err);
    } finally {
      setBookingLoading(false);
    }
  };

  // Format duration in minutes to hours and minutes
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  // Format date and time
  const formatDateTime = (dateTimeString: string) => {
    try {
      const date = new Date(dateTimeString);
      return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false });
    } catch {
      return dateTimeString;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Plane className="w-8 h-8 text-blue-600" />
          Book Flights
        </h1>
        <p className="text-gray-600 mt-2">Search and book flights with MakeMyTrip integration</p>
      </div>

      {/* Error Message */}
      {error && (
        <Card className="mb-6 p-4 bg-red-50 border-red-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-red-900">Error</h3>
              <p className="text-sm text-red-800 mt-1">{error}</p>
            </div>
          </div>
        </Card>
      )}

      {/* STEP 1: SEARCH */}
      {step === 'search' && (
        <Card className="p-6">
          <form onSubmit={handleSearchFlights} className="space-y-6">
            {/* Trip Type */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-3 block">Trip Type</label>
              <div className="flex gap-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    value="one-way"
                    checked={tripType === 'one-way'}
                    onChange={(e) => setTripType(e.target.value as 'one-way' | 'round-trip')}
                    className="mr-2"
                  />
                  <span className="text-gray-700">One-way</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    value="round-trip"
                    checked={tripType === 'round-trip'}
                    onChange={(e) => setTripType(e.target.value as 'one-way' | 'round-trip')}
                    className="mr-2"
                  />
                  <span className="text-gray-700">Round-trip</span>
                </label>
              </div>
            </div>

            {/* Location and Date Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label htmlFor="from" className="block text-sm font-medium text-gray-700 mb-2">
                  From (Airport Code)
                </label>
                <Input
                  id="from"
                  placeholder="DEL"
                  value={from}
                  onChange={(e) => setFrom(e.target.value.toUpperCase())}
                  maxLength={3}
                  required
                />
              </div>

              <div>
                <label htmlFor="to" className="block text-sm font-medium text-gray-700 mb-2">
                  To (Airport Code)
                </label>
                <Input
                  id="to"
                  placeholder="BOM"
                  value={to}
                  onChange={(e) => setTo(e.target.value.toUpperCase())}
                  maxLength={3}
                  required
                />
              </div>

              <div>
                <label htmlFor="departDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Depart Date
                </label>
                <Input
                  id="departDate"
                  type="date"
                  value={departDate}
                  onChange={(e) => setDepartDate(e.target.value)}
                  min={today}
                  required
                />
              </div>

              {tripType === 'round-trip' && (
                <div>
                  <label htmlFor="returnDate" className="block text-sm font-medium text-gray-700 mb-2">
                    Return Date
                  </label>
                  <Input
                    id="returnDate"
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    min={departDate || today}
                  />
                </div>
              )}
            </div>

            {/* Passengers and Cabin Class */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="passengers" className="block text-sm font-medium text-gray-700 mb-2">
                  Passengers
                </label>
                <Input
                  id="passengers"
                  type="number"
                  min="1"
                  max="9"
                  value={passengers}
                  onChange={(e) => setPassengers(parseInt(e.target.value))}
                />
              </div>

              <div>
                <label htmlFor="cabinClass" className="block text-sm font-medium text-gray-700 mb-2">
                  Cabin Class
                </label>
                <select
                  id="cabinClass"
                  value={cabinClass}
                  onChange={(e) => setCabinClass(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="economy">Economy</option>
                  <option value="business">Business</option>
                  <option value="first">First Class</option>
                </select>
              </div>
            </div>

            {/* Search Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3"
            >
              {loading ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Searching flights...
                </>
              ) : (
                'Search Flights'
              )}
            </Button>
          </form>
        </Card>
      )}

      {/* STEP 2: FLIGHT SELECTION */}
      {step === 'selection' && flights.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Available Flights ({flights.length})</h2>
            <Button variant="outline" onClick={() => setStep('search')}>
              Modify Search
            </Button>
          </div>

          {flights.map((flight) => (
            <Card
              key={flight.id}
              className="p-4 cursor-pointer hover:shadow-lg transition-all border-2 hover:border-blue-400"
              onClick={() => handleSelectFlight(flight)}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{flight.airline}</h3>
                  <p className="text-sm text-gray-600">{flight.flightNo}</p>
                </div>

                <div className="text-center">
                  <p className="font-bold text-lg">{formatDateTime(flight.departure)}</p>
                  <div className="flex items-center justify-center gap-2 my-1">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <p className="text-sm text-gray-600">{formatDuration(flight.duration)}</p>
                  </div>
                  <p className="font-bold text-lg">{formatDateTime(flight.arrival)}</p>
                </div>

                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">₹{flight.price}</p>
                  <Badge className="bg-green-100 text-green-800">{flight.seatsAvailable} seats</Badge>
                </div>

                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectFlight(flight);
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Select
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* STEP 3: BOOKING CONFIRMATION */}
      {step === 'confirmation' && selectedFlight && (
        <div className="space-y-6">
          {/* Flight Summary */}
          <Card className="p-6 bg-blue-50">
            <h2 className="text-xl font-bold mb-4">Selected Flight</h2>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm text-gray-600">Airline</p>
                <p className="font-bold">{selectedFlight.airline}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Departure</p>
                <p className="font-bold">{formatDateTime(selectedFlight.departure)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Price</p>
                <p className="text-2xl font-bold text-blue-600">₹{selectedFlight.price}</p>
              </div>
            </div>
          </Card>

          {/* Passenger Details */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Passenger Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                <Input
                  value={passengerDetails.firstName}
                  onChange={(e) => handlePassengerChange('firstName', e.target.value)}
                  placeholder="John"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                <Input
                  value={passengerDetails.lastName}
                  onChange={(e) => handlePassengerChange('lastName', e.target.value)}
                  placeholder="Doe"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <Input
                  type="email"
                  value={passengerDetails.email}
                  onChange={(e) => handlePassengerChange('email', e.target.value)}
                  placeholder="john@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <Input
                  value={passengerDetails.phone}
                  onChange={(e) => handlePassengerChange('phone', e.target.value)}
                  placeholder="+91-9876543210"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                <Input
                  type="date"
                  value={passengerDetails.dateOfBirth}
                  onChange={(e) => handlePassengerChange('dateOfBirth', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                <select
                  value={passengerDetails.gender}
                  onChange={(e) => handlePassengerChange('gender', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                  <option value="O">Other</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Actions */}
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => setStep('selection')} className="flex-1">
              Back
            </Button>
            <Button
              onClick={handleBookFlight}
              disabled={bookingLoading}
              className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400"
            >
              {bookingLoading ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Booking...
                </>
              ) : (
                'Confirm Booking'
              )}
            </Button>
          </div>
        </div>
      )}

      {/* No Results Message */}
      {step === 'selection' && flights.length === 0 && !loading && (
        <Card className="p-12 text-center">
          <Plane className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-600 text-lg">No flights found. Please modify your search.</p>
        </Card>
      )}
    </div>
  );
}

export default FlightBookingMMT;
