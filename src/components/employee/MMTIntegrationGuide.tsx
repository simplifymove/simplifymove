/**
 * MakeMyTrip Integration Guide
 * 
 * This guide explains how to integrate MakeMyTrip API with SimplifyMove employee portal
 * for flight, hotel, bus, and cab bookings.
 * 
 * ==================== SETUP INSTRUCTIONS ====================
 * 
 * 1. ENVIRONMENT VARIABLES
 * Add the following to your .env file in the backend:
 * 
 * MMT_API_BASE_URL=https://api.makemytrip.com/api/v1
 * MMT_API_KEY=your_api_key_here
 * MMT_PARTNER_ID=your_partner_id_here
 * MMT_ACCESS_TOKEN=your_access_token_here
 * 
 * 2. NPM PACKAGES
 * Install axios if not already installed:
 * npm install axios
 * 
 * ==================== INTEGRATION EXAMPLE ====================
 */

// Example: How to use in a React Component

import { useState, useEffect } from 'react';
import travelAPI from '../../lib/travelAPI';

interface Flight {
  id: string;
  airline: string;
  departure: string;
  arrival: string;
  duration: string;
  price: number;
  seatsAvailable: number;
}

export function FlightSearchExample() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Search parameters
  const [origin, setOrigin] = useState('DEL'); // Delhi
  const [destination, setDestination] = useState('BOM'); // Mumbai
  const [departDate, setDepartDate] = useState('2026-02-25');
  const [passengers, setPassengers] = useState(1);

  // Fetch flights from MakeMyTrip API
  const handleSearchFlights = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await travelAPI.searchFlights({
        origin,
        destination,
        departDate,
        passengers,
        cabinClass: 'economy',
        sortBy: 'price', // 'price', 'duration', 'departure'
      });

      if (result.success) {
        // Transform MMT response to component format if needed
        setFlights(result.data);
      } else {
        setError(result.error || 'Failed to search flights');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Book a flight
  const handleBookFlight = async (flightId: string) => {
    try {
      setLoading(true);
      
      const bookingData = {
        flightId,
        segment: 'OUTBOUND',
        passengers: [
          {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            phone: '+91-9876543210',
            dateOfBirth: '1990-01-15',
            gender: 'M',
            seatPreference: 'window',
          },
        ],
        contactDetails: {
          email: 'john@example.com',
          phone: '+91-9876543210',
        },
        paymentInfo: {
          method: 'wallet', // or 'card', 'upi', 'netbanking'
          paymentGateway: 'razorpay',
        },
        travelType: 'BUSINESS', // 'BUSINESS' or 'PERSONAL'
      };

      const result = await travelAPI.bookFlight(bookingData);
      
      if (result.success) {
        console.log('Booking successful:', result.confirmationNumber);
        alert(`Booking confirmed! PNR: ${result.confirmationNumber}`);
      } else {
        setError(result.error || 'Booking failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Booking error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Flight Search</h2>

      {/* Search Form */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-2">From</label>
          <input
            type="text"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            placeholder="DEL"
            className="w-full px-4 py-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">To</label>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="BOM"
            className="w-full px-4 py-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Depart Date</label>
          <input
            type="date"
            value={departDate}
            onChange={(e) => setDepartDate(e.target.value)}
            className="w-full px-4 py-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Passengers</label>
          <input
            type="number"
            value={passengers}
            onChange={(e) => setPassengers(parseInt(e.target.value))}
            className="w-full px-4 py-2 border rounded"
          />
        </div>
      </div>

      <button
        onClick={handleSearchFlights}
        disabled={loading}
        className="mb-6 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? 'Searching...' : 'Search Flights'}
      </button>

      {/* Error Message */}
      {error && <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">{error}</div>}

      {/* Flight Results */}
      <div className="space-y-4">
        {flights.map((flight) => (
          <div key={flight.id} className="p-4 border rounded-lg hover:bg-gray-50">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg">{flight.airline}</h3>
                <p className="text-gray-600">{flight.departure} → {flight.arrival}</p>
                <p className="text-sm text-gray-500">Duration: {flight.duration}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">₹{flight.price}</div>
                <p className="text-sm text-gray-600">{flight.seatsAvailable} seats available</p>
                <button
                  onClick={() => handleBookFlight(flight.id)}
                  className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * ==================== API RESPONSE FORMATS ====================
 * 
 * SEARCH FLIGHTS:
 * {
 *   "success": true,
 *   "data": [
 *     {
 *       "id": "flight_001",
 *       "airline": "IndiGo",
 *       "flightNo": "6E-234",
 *       "departure": "2026-02-25T06:00:00",
 *       "arrival": "2026-02-25T08:15:00",
 *       "duration": 135,
 *       "price": 4299,
 *       "currency": "INR",
 *       "seatsAvailable": 12,
 *       "cabinClass": "economy",
 *       "stops": 0
 *     }
 *   ],
 *   "count": 10,
 *   "filters": {
 *     "priceRange": { "min": 3500, "max": 8000 },
 *     "airlines": ["IndiGo", "Air India", "SpiceJet"]
 *   }
 * }
 * 
 * BOOK FLIGHT:
 * {
 *   "success": true,
 *   "bookingId": "booking_12345",
 *   "confirmationNumber": "6EABCD1234",
 *   "data": {
 *     "bookingStatus": "CONFIRMED",
 *     "itinerary": [...],
 *     "totalPrice": 4299,
 *     "passengers": [...]
 *   }
 * }
 * 
 * ==================== AVAILABLE FUNCTIONS ====================
 * 
 * FLIGHTS:
 * - travelAPI.searchFlights(params)
 * - travelAPI.getFlightDetails(flightId)
 * - travelAPI.bookFlight(bookingData)
 * 
 * HOTELS:
 * - travelAPI.searchHotels(params)
 * - travelAPI.getHotelDetails(hotelId, checkInDate, checkOutDate)
 * - travelAPI.bookHotel(bookingData)
 * 
 * BUSES:
 * - travelAPI.searchBuses(params)
 * - travelAPI.bookBus(bookingData)
 * 
 * CABS:
 * - travelAPI.searchCabs(params)
 * - travelAPI.bookCab(bookingData)
 * 
 * BOOKING MANAGEMENT:
 * - travelAPI.getBookingDetails(bookingId)
 * - travelAPI.cancelBooking(bookingId, reason)
 * - travelAPI.modifyBooking(bookingId, modifications)
 * - travelAPI.getTravelHistory(filters)
 * 
 * ==================== PARAMETER EXAMPLES ====================
 * 
 * FLIGHT SEARCH:
 * {
 *   "origin": "DEL",           // Airport code
 *   "destination": "BOM",      // Airport code
 *   "departDate": "2026-02-25", // YYYY-MM-DD
 *   "returnDate": "2026-02-28", // Optional for round trip
 *   "passengers": 1,
 *   "cabinClass": "economy",    // economy, business, first
 *   "sortBy": "price"           // price, duration, departure
 * }
 * 
 * HOTEL SEARCH:
 * {
 *   "destination": "Mumbai",
 *   "checkInDate": "2026-02-25",
 *   "checkOutDate": "2026-02-28",
 *   "rooms": 1,
 *   "guests": 2,
 *   "sortBy": "price"
 * }
 * 
 * BUS SEARCH:
 * {
 *   "origin": "Mumbai",
 *   "destination": "Bangalore",
 *   "departDate": "2026-02-25",
 *   "returnDate": null,
 *   "passengers": 1
 * }
 * 
 * CAB SEARCH:
 * {
 *   "origin": "Terminal 3, Delhi Airport",
 *   "destination": "Noida",
 *   "pickupDate": "2026-02-25",
 *   "pickupTime": "14:30",
 *   "passengers": 1
 * }
 */