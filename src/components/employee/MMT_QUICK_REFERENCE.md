/**
 * MakeMyTrip Integration - Quick Reference Guide
 * Complete implementation for SimplifyMove Employee Portal
 */

=============================================================
 INTEGRATION SUMMARY
=============================================================

✅ COMPLETED:
1. Backend MakeMyTrip Service (makemytripService.js)
   - Flight search & booking
   - Hotel search & booking
   - Bus search & booking
   - Cab search & booking
   - Booking management (cancel, modify, history)

2. Backend API Routes (travelRoutes.js)
   - All travel endpoints configured
   - Authentication middleware applied
   - Error handling implemented

3. Frontend API Client (travelAPI.ts)
   - Simplified function-based API
   - Error handling & logging
   - Authorization headers included

4. Example Components
   - MMTIntegrationGuide.tsx - Complete integration guide
   - FlightBookingMMT.tsx - Full example implementation

5. Server Configuration
   - Travel routes registered in server.js
   - CORS and authentication enabled

=============================================================
 QUICK START (5 STEPS)
=============================================================

1. ADD ENVIRONMENT VARIABLES
   File: src/backend/.env
   
   Add:
   MMT_API_BASE_URL=https://api.makemytrip.com/api/v1
   MMT_API_KEY=your_api_key
   MMT_PARTNER_ID=your_partner_id
   MMT_ACCESS_TOKEN=your_access_token

2. TEST BACKEND
   curl -X POST http://localhost:5000/api/v1/travel/flights/search \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"origin":"DEL","destination":"BOM","departDate":"2026-02-25","passengers":1}'

3. USE IN REACT COMPONENT
   import travelAPI from '../../lib/travelAPI';
   
   const result = await travelAPI.searchFlights({
     origin: 'DEL',
     destination: 'BOM',
     departDate: '2026-02-25',
     passengers: 1,
     cabinClass: 'economy'
   });

4. INTEGRATE WITH BOOKING COMPONENTS
   - Update FlightBookingEnhanced.tsx
   - Update HotelBookingEnhanced.tsx
   - Update BusBooking.tsx
   - Update CabBooking.tsx

5. HANDLE RESPONSES
   Each API call returns:
   {
     success: boolean,
     data: Array | Object,
     error?: string
   }

=============================================================
 FILE STRUCTURE
=============================================================

Backend:
├── src/backend/
│   ├── services/
│   │   └── makemytripService.js          [NEW] Core service
│   ├── routes/
│   │   └── travelRoutes.js               [NEW] API endpoints
│   ├── server.js                         [MODIFIED] Added travel routes

Frontend:
├── src/lib/
│   └── travelAPI.ts                      [NEW] Frontend API client
├── src/components/employee/
│   ├── MMTIntegrationGuide.tsx            [NEW] Integration guide
│   ├── FlightBookingMMT.tsx               [NEW] Example component
│   ├── FlightBookingEnhanced.tsx          [Can be updated]
│   ├── HotelBookingEnhanced.tsx           [Can be updated]
│   ├── BusBooking.tsx                     [Can be updated]
│   └── CabBooking.tsx                     [Can be updated]

Documentation:
└── MAKEMYTRIP_SETUP.md                   [NEW] Detailed setup guide

=============================================================
 AVAILABLE METHODS
=============================================================

FLIGHTS:
  travelAPI.searchFlights({
    origin: string,           // 'DEL'
    destination: string,      // 'BOM'
    departDate: string,       // '2026-02-25'
    returnDate?: string,      // optional
    passengers: number,
    cabinClass: string,       // 'economy' | 'business' | 'first'
    sortBy?: string           // 'price' | 'duration' | 'departure'
  })

  travelAPI.bookFlight(bookingData)

HOTELS:
  travelAPI.searchHotels({
    destination: string,
    checkInDate: string,      // '2026-02-25'
    checkOutDate: string,
    rooms: number,
    guests: number,
    sortBy?: string
  })

  travelAPI.bookHotel(bookingData)

BUSES:
  travelAPI.searchBuses({
    origin: string,
    destination: string,
    departDate: string,
    returnDate?: string,
    passengers: number
  })

  travelAPI.bookBus(bookingData)

CABS:
  travelAPI.searchCabs({
    origin: string,          // 'Terminal 3, Delhi Airport'
    destination: string,     // 'Noida'
    pickupDate: string,
    pickupTime: string,      // 'HH:MM'
    passengers: number
  })

  travelAPI.bookCab(bookingData)

BOOKING MANAGEMENT:
  travelAPI.getBookingDetails(bookingId)
  travelAPI.cancelBooking(bookingId, reason)
  travelAPI.modifyBooking(bookingId, modifications)
  travelAPI.getTravelHistory(filters)

=============================================================
 EXAMPLE USAGE IN COMPONENT
=============================================================

import travelAPI from '../../lib/travelAPI';
import { useState } from 'react';

function FlightSearch() {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const result = await travelAPI.searchFlights({
        origin: 'DEL',
        destination: 'BOM',
        departDate: '2026-02-25',
        passengers: 1,
        cabinClass: 'economy'
      });
      
      if (result.success) {
        setFlights(result.data);
      } else {
        alert('Error: ' + result.error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async (flightId) => {
    try {
      const result = await travelAPI.bookFlight({
        flightId,
        segment: 'OUTBOUND',
        passengers: [{
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          phone: '+91-9876543210'
        }],
        travelType: 'BUSINESS'
      });
      
      if (result.success) {
        alert('Booked! PNR: ' + result.confirmationNumber);
      }
    } catch (error) {
      alert('Booking failed: ' + error.message);
    }
  };

  return (
    // UI code here
  );
}

=============================================================
 RESPONSE FORMAT
=============================================================

SUCCESS:
{
  "success": true,
  "data": [...],
  "count": 10,
  "filters": {...}
}

BOOKING SUCCESS:
{
  "success": true,
  "bookingId": "booking_12345",
  "confirmationNumber": "6EABCD1234",
  "data": {...}
}

ERROR:
{
  "success": false,
  "error": "Error message here",
  "data": []
}

=============================================================
 AIRPORT CODES (INDIA)
=============================================================

Delhi          -> DEL
Mumbai         -> BOM
Bangalore      -> BLR
Hyderabad      -> HYD
Kolkata        -> CCU
Chennai        -> MAA
Pune           -> PNQ
Goa            -> GOI
Jaipur         -> JAI
Ahmedabad      -> AMD
Indore         -> IDR
Kochi          -> COK
Lucknow        -> LKO
Patna          -> PAT
Srinagar       -> SXR
Thiruvananthapuram -> TRV

=============================================================
 ERROR HANDLING
=============================================================

try {
  const result = await travelAPI.searchFlights(params);
  
  if (result.success) {
    // Handle success
    processFlights(result.data);
  } else {
    // Handle API error
    console.error('API Error:', result.error);
    setErrorMessage(result.error);
  }
} catch (error) {
  // Handle network/parsing error
  console.error('Error:', error.message);
  setErrorMessage('Failed to search flights');
}

Common errors:
- "Missing required parameters" - Check all required fields
- "Invalid airport code" - Use valid IATA codes
- "Dates in the past" - Check dates are today or future
- "Invalid token" - Check authentication

=============================================================
 INTEGRATION CHECKLIST
=============================================================

Backend Setup:
  ☐ Add MakeMyTrip credentials to .env
  ☐ Install axios if not present
  ☐ Test travel routes with curl
  ☐ Verify auth middleware works
  ☐ Check error handling

Frontend Setup:
  ☐ Import travelAPI in components
  ☐ Add try-catch for API calls
  ☐ Display loading state
  ☐ Show error messages
  ☐ Handle success responses

Component Updates:
  ☐ Update FlightBookingEnhanced.tsx
  ☐ Update HotelBookingEnhanced.tsx
  ☐ Update BusBooking.tsx
  ☐ Update CabBooking.tsx
  ☐ Test all booking flows

Testing:
  ☐ Test flight search
  ☐ Test flight booking
  ☐ Test hotel search
  ☐ Test bus search
  ☐ Test cab search
  ☐ Test error scenarios
  ☐ Test with real credentials

Deployment:
  ☐ Update production .env
  ☐ Test with live API
  ☐ Monitor error logs
  ☐ Setup rate limiting if needed
  ☐ Configure payment gateway

=============================================================
 SUPPORT & DOCUMENTATION
=============================================================

MakeMyTrip Documentation:
  https://mybiz.makemytrip.com/integrated-travel-solutions/travel-request-api

Code Examples:
  See: MMTIntegrationGuide.tsx
  See: FlightBookingMMT.tsx

Setup Instructions:
  See: MAKEMYTRIP_SETUP.md

API Reference:
  Service: makemytripService.js
  Routes: travelRoutes.js
  Client: travelAPI.ts

For Issues:
  Email: b2b@makemytrip.com
  Phone: 1-800-102-2000

=============================================================
 NEXT STEPS
=============================================================

1. Get MakeMyTrip API credentials
2. Add to .env file
3. Test with curl
4. Update booking components
5. Test in browser
6. Monitor logs
7. Deploy to production

=============================================================
