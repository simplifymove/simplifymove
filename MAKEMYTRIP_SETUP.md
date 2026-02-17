/**
 * MakeMyTrip API Setup Instructions
 * Complete guide to integrate MakeMyTrip API with SimplifyMove
 */

=============================================================
1. ENVIRONMENT VARIABLES SETUP
=============================================================

Add the following variables to your .env file in the backend folder:

# MakeMyTrip API Configuration
MMT_API_BASE_URL=https://api.makemytrip.com/api/v1
MMT_API_KEY=your_api_key_from_mmt
MMT_PARTNER_ID=your_partner_id_from_mmt
MMT_ACCESS_TOKEN=your_access_token_from_mmt

# Optional: Fallback Mode (uses mock data if credentials are not set)
USE_MMT_FALLBACK=true

=============================================================
2. GET MAKEMYTRIP CREDENTIALS
=============================================================

To get MakeMyTrip API credentials:

1. Visit: https://mybiz.makemytrip.com/integrated-travel-solutions/travel-request-api
2. Sign in with your MakeMyTrip business account
3. Complete the API access form
4. Wait for approval (typically 2-3 business days)
5. Once approved, you'll receive:
   - API Key
   - Partner ID
   - Access Token
6. Add these to your .env file

Alternative: Contact MakeMyTrip B2B team:
Email: b2b@makemytrip.com
Phone: 1-800-102-2000

=============================================================
3. BACKEND SETUP
=============================================================

✅ Already Done (No additional setup needed):
- Created MakeMyTrip service in: src/backend/services/makemytripService.js
- Created travel routes in: src/backend/routes/travelRoutes.js
- Updated server.js to include travel routes
- All required npm packages are already installed (axios, express, etc.)

=============================================================
4. FRONTEND SETUP
=============================================================

✅ Already Done (No additional setup needed):
- Created travel API client in: src/lib/travelAPI.ts
- Created integration guide in: src/components/employee/MMTIntegrationGuide.tsx

Now you can use the travelAPI in your booking components:

EXAMPLE:
  import travelAPI from '../../lib/travelAPI';
  
  const searchFlights = async () => {
    const result = await travelAPI.searchFlights({
      origin: 'DEL',
      destination: 'BOM',
      departDate: '2026-02-25',
      passengers: 1,
      cabinClass: 'economy'
    });
  };

=============================================================
5. AVAILABLE API ENDPOINTS
=============================================================

FLIGHTS:
  POST   /api/v1/travel/flights/search          - Search for flights
  GET    /api/v1/travel/flights/:flightId       - Get flight details
  POST   /api/v1/travel/flights/book            - Book a flight

HOTELS:
  POST   /api/v1/travel/hotels/search           - Search for hotels
  GET    /api/v1/travel/hotels/:hotelId         - Get hotel details
  POST   /api/v1/travel/hotels/book             - Book a hotel

BUSES:
  POST   /api/v1/travel/buses/search            - Search for buses
  POST   /api/v1/travel/buses/book              - Book a bus

CABS:
  POST   /api/v1/travel/cabs/search             - Search for cabs
  POST   /api/v1/travel/cabs/book               - Book a cab

BOOKING MANAGEMENT:
  GET    /api/v1/travel/bookings/:bookingId     - Get booking details
  POST   /api/v1/travel/bookings/:bookingId/cancel   - Cancel booking
  PUT    /api/v1/travel/bookings/:bookingId/modify   - Modify booking
  GET    /api/v1/travel/history                - Get travel history

=============================================================
6. TESTING THE INTEGRATION
=============================================================

Using cURL:

# Search Flights
curl -X POST http://localhost:5000/api/v1/travel/flights/search \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "origin": "DEL",
    "destination": "BOM",
    "departDate": "2026-02-25",
    "passengers": 1,
    "cabinClass": "economy"
  }'

# Search Hotels
curl -X POST http://localhost:5000/api/v1/travel/hotels/search \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "destination": "Mumbai",
    "checkInDate": "2026-02-25",
    "checkOutDate": "2026-02-28",
    "rooms": 1,
    "guests": 2
  }'

# Search Buses
curl -X POST http://localhost:5000/api/v1/travel/buses/search \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "origin": "Mumbai",
    "destination": "Bangalore",
    "departDate": "2026-02-25",
    "passengers": 1
  }'

# Search Cabs
curl -X POST http://localhost:5000/api/v1/travel/cabs/search \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "origin": "Terminal 3, Delhi Airport",
    "destination": "Noida",
    "pickupDate": "2026-02-25",
    "pickupTime": "14:30",
    "passengers": 1
  }'

=============================================================
7. EXAMPLE RESPONSES
=============================================================

FLIGHT SEARCH RESPONSE:
{
  "success": true,
  "data": [
    {
      "id": "flight_001",
      "airline": "IndiGo",
      "flightNo": "6E-234",
      "departure": "2026-02-25T06:00:00Z",
      "arrival": "2026-02-25T08:15:00Z",
      "duration": 135,
      "price": 4299,
      "currency": "INR",
      "seatsAvailable": 12,
      "cabinClass": "economy",
      "stops": 0
    }
  ],
  "count": 10,
  "filters": {
    "priceRange": {
      "min": 3500,
      "max": 8000
    },
    "airlines": ["IndiGo", "Air India", "SpiceJet"]
  }
}

FLIGHT BOOKING RESPONSE:
{
  "success": true,
  "bookingId": "booking_12345",
  "confirmationNumber": "6EABCD1234",
  "data": {
    "bookingStatus": "CONFIRMED",
    "totalPrice": 4299,
    "passengers": [
      {
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com",
        "seatNumber": "12A"
      }
    ],
    "itinerary": {
      "flights": [...]
    }
  }
}

=============================================================
8. FALLBACK / MOCK MODE
=============================================================

If MakeMyTrip credentials are not set or the API is unavailable,
the system can optionally use mock data for testing.

To enable fallback mode:
1. Set USE_MMT_FALLBACK=true in .env
2. The services will return mock booking data

Note: This is for development/testing only.
For production, proper credentials are required.

=============================================================
9. ERROR HANDLING
=============================================================

Common errors and solutions:

ERROR: "API Key missing or invalid"
SOLUTION: Check MMT_API_KEY in .env file

ERROR: "Partner ID not found"
SOLUTION: Verify MMT_PARTNER_ID in .env file

ERROR: "Invalid token"
SOLUTION: Check MMT_ACCESS_TOKEN is current and valid

ERROR: "Destination airport code not supported"
SOLUTION: Use valid IATA airport codes (DEL, BOM, BLR, etc.)

ERROR: "Dates in the past"
SOLUTION: Check departure date is not before today

=============================================================
10. INTEGRATION WITH EMPLOYEE PORTAL
=============================================================

The MakeMyTrip integration is already hooked into:

1. NewBookingComplete.tsx - Main booking interface
   - Flight, Hotel, Bus, Cab selection
   
2. FlightBookingEnhanced.tsx - Flight booking
   - Can be updated to use travelAPI.searchFlights()
   
3. HotelBookingEnhanced.tsx - Hotel booking
   - Can be updated to use travelAPI.searchHotels()
   
4. BusBooking.tsx - Bus booking
   - Can be updated to use travelAPI.searchBuses()
   
5. CabBooking.tsx - Cab/Taxi booking
   - Can be updated to use travelAPI.searchCabs()

=============================================================
11. NEXT STEPS
=============================================================

1. ✅ Get MakeMyTrip API credentials
2. ✅ Add credentials to .env file
3. ✅ Update booking components to use travelAPI
4. ✅ Test with real API credentials
5. ✅ Monitor API logs and error handling
6. ✅ Configure approval workflow for bookings
7. ✅ Set up payment gateway integration

=============================================================
12. SUPPORT
=============================================================

For issues or questions:
- MakeMyTrip Support: b2b@makemytrip.com
- SimplifyMove Documentation: See MMTIntegrationGuide.tsx
- API Logs: Check backend console for detailed error messages

=============================================================
