/**
 * MakeMyTrip Integration Architecture
 * 
 * This document shows the overall architecture and data flow
 */

=============================================================
 SYSTEM ARCHITECTURE
=============================================================

┌─────────────────────────────────────────────────────────┐
│                   EMPLOYEE PORTAL (FRONTEND)             │
│                                                           │
│  ┌────────────────────────────────────────────────────┐  │
│  │         User Interface Components                  │  │
│  ├────────────────────────────────────────────────────┤  │
│  │ • FlightBookingMMT.tsx (React Component)           │  │
│  │ • HotelBookingEnhanced.tsx (Can be updated)        │  │
│  │ • BusBooking.tsx (Can be updated)                  │  │
│  │ • CabBooking.tsx (Can be updated)                  │  │
│  └────────────────────────────────────────────────────┘  │
│                        │                                  │
│                        ▼                                  │
│  ┌────────────────────────────────────────────────────┐  │
│  │         API Client (travelAPI.ts)                  │  │
│  ├────────────────────────────────────────────────────┤  │
│  │ • searchFlights(params)                            │  │
│  │ • bookFlight(bookingData)                          │  │
│  │ • searchHotels(params)                             │  │
│  │ • bookHotel(bookingData)                           │  │
│  │ • searchBuses(params)                              │  │
│  │ • bookBus(bookingData)                             │  │
│  │ • searchCabs(params)                               │  │
│  │ • bookCab(bookingData)                             │  │
│  │ • cancelBooking(bookingId)                         │  │
│  │ • getTravelHistory()                               │  │
│  └────────────────────────────────────────────────────┘  │
│                        │                                  │
│                        ▼                                  │
│  ┌────────────────────────────────────────────────────┐  │
│  │         HTTP Client (fetch API)                    │  │
│  │  Authorization: Bearer {token}                     │  │
│  └────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                        │
                        │ HTTP Requests
                        │ POST/GET/PUT
                        ▼
┌─────────────────────────────────────────────────────────┐
│                      BACKEND SERVER                      │
│                                                           │
│  ┌────────────────────────────────────────────────────┐  │
│  │         Express.js Routes (server.js)              │  │
│  │  /api/v1/travel/flights/search [POST]              │  │
│  │  /api/v1/travel/flights/book [POST]                │  │
│  │  /api/v1/travel/hotels/search [POST]               │  │
│  │  /api/v1/travel/hotels/book [POST]                 │  │
│  │  /api/v1/travel/buses/search [POST]                │  │
│  │  /api/v1/travel/buses/book [POST]                  │  │
│  │  /api/v1/travel/cabs/search [POST]                 │  │
│  │  /api/v1/travel/cabs/book [POST]                   │  │
│  │  /api/v1/travel/bookings/:id [GET]                 │  │
│  │  /api/v1/travel/bookings/:id/cancel [POST]         │  │
│  └────────────────────────────────────────────────────┘  │
│                        │                                  │
│                        ▼                                  │
│  ┌────────────────────────────────────────────────────┐  │
│  │       Travel Routes (travelRoutes.js)              │  │
│  │  • Auth Middleware                                 │  │
│  │  • Request Validation                              │  │
│  │  • Error Handling                                  │  │
│  └────────────────────────────────────────────────────┘  │
│                        │                                  │
│                        ▼                                  │
│  ┌────────────────────────────────────────────────────┐  │
│  │    MakeMyTrip Service (makemytripService.js)       │  │
│  ├────────────────────────────────────────────────────┤  │
│  │ • searchFlights()      ┐                           │  │
│  │ • getFlightDetails()   │                           │  │
│  │ • bookFlight()         │                           │  │
│  │                        ├─► Flights                 │  │
│  │ • searchHotels()       │                           │  │
│  │ • bookHotel()          │                           │  │
│  │ • getHotelDetails()    ┘                           │  │
│  │                                                    │  │
│  │ • searchBuses()        ┐                           │  │
│  │ • bookBus()            ├─► Buses                   │  │
│  │                        ┘                           │  │
│  │                                                    │  │
│  │ • searchCabs()         ┐                           │  │
│  │ • bookCab()            ├─► Cabs                    │  │
│  │                        ┘                           │  │
│  │                                                    │  │
│  │ • cancelBooking()      ┐                           │  │
│  │ • modifyBooking()      ├─► Booking Mgmt           │  │
│  │ • getTravelHistory()   ┘                           │  │
│  │                                                    │  │
│  │ Axios HTTP Client (configured with auth)          │  │
│  └────────────────────────────────────────────────────┘  │
│                        │                                  │
│                        ▼                                  │
│  ┌────────────────────────────────────────────────────┐  │
│  │        Database (Optional - for local caching)     │  │
│  │  • Bookings table                                  │  │
│  │  • Travel history                                  │  │
│  │  • Approvals                                       │  │
│  └────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                        │
                        │ HTTPS Requests
                        │ Credentials in .env
                        ▼
┌─────────────────────────────────────────────────────────┐
│              MAKEMYTRIP API (External)                   │
│                                                           │
│  https://api.makemytrip.com/api/v1                       │
│                                                           │
│  • Flights Database                                      │
│  • Hotels Database                                       │
│  • Buses Database                                        │
│  • Cabs Database                                         │
│  • Booking Management                                    │
│  • Real-time Availability                                │
│  • Price Updates                                         │
│  • Confirmations & PNRs                                  │
│                                                           │
│  Authentication:                                         │
│  • X-API-Key                                             │
│  • X-Partner-ID                                          │
│  • Authorization: Bearer {token}                         │
└─────────────────────────────────────────────────────────┘

=============================================================
 DATA FLOW
=============================================================

1. USER SEARCHES FLIGHTS
   
   User Input
        │
        ▼
   Component State
        │
        ▼
   travelAPI.searchFlights({
     origin: 'DEL',
     destination: 'BOM',
     departDate: '2026-02-25',
     passengers: 1
   })
        │
        ▼
   HTTP POST /api/v1/travel/flights/search
        │
        ▼
   Backend travelRoutes
        │
        ▼
   makemytripService.searchFlights()
        │
        ▼
   HTTP POST to MakeMyTrip API
        │
        ▼
   MakeMyTrip Response
        │
        ▼
   Format & Return to Frontend
        │
        ▼
   Component receives {
     success: true,
     data: [flight1, flight2, ...],
     count: 10
   }
        │
        ▼
   Update Component State
        │
        ▼
   Render Flight List

2. USER BOOKS A FLIGHT

   User Input (Passenger Details)
        │
        ▼
   Validation
        │
        ▼
   travelAPI.bookFlight({
     flightId: 'flight_123',
     passengers: [...],
     contactDetails: {...},
     paymentInfo: {...}
   })
        │
        ▼
   HTTP POST /api/v1/travel/flights/book
        │
        ▼
   Backend travelRoutes
        │
        ▼
   makemytripService.bookFlight()
        │
        ▼
   HTTP POST to MakeMyTrip API
        │
        ▼
   MakeMyTrip Response
        │
        ▼
   Extract Booking ID & PNR
        │
        ▼
   Save to Local Database (optional)
        │
        ▼
   Return Response
        │
        ▼
   Component receives {
     success: true,
     bookingId: 'booking_123',
     confirmationNumber: '6EABCD1234',
     data: {...}
   }
        │
        ▼
   Show Success Message
        │
        ▼
   Trigger Approval Workflow
        │
        ▼
   Send Confirmation Email

=============================================================
 AUTHENTICATION FLOW
=============================================================

1. User Login
        │
        ▼
   Receive JWT Token
        │
        ▼
   Store in localStorage
        │
        ▼
   User Makes Travel Request
        │
        ▼
   Component calls travelAPI
        │
        ▼
   travelAPI reads token from localStorage
        │
        ▼
   Adds header: Authorization: Bearer {token}
        │
        ▼
   Sends HTTP request
        │
        ▼
   Backend Auth Middleware
        │
        ├─ Validates token
        │  │
        │  ├─ Valid: Extract user info, continue
        │  │
        │  └─ Invalid: Return 401 Unauthorized
        │
        ▼
   Route Handler (travelRoutes)
        │
        ▼
   makemytripService
        │
        ▼
   Return Response with auth context

=============================================================
 ERROR HANDLING FLOW
=============================================================

User Action
        │
        ▼
API Call in try-catch block
        │
        ├─ Success Response
        │  │
        │  ├─ Check result.success
        │  │  │
        │  │  ├─ true → Process data
        │  │  │
        │  │  └─ false → Show error (result.error)
        │  │
        │  └─ Update UI
        │
        └─ Network Error / Exception
           │
           ├─ catch(error) block
           │
           └─ Show error message to user

Error Messages Shown:
┌──────────────────────────────────────────┐
│ Network Error    │ "Connection failed"    │
│ Auth Error       │ "Unauthorized"         │
│ Validation Error │ "Missing fields"       │
│ API Error        │ Error from API         │
│ Unknown Error    │ "An error occurred"    │
└──────────────────────────────────────────┘

=============================================================
 COMPONENT HIERARCHY
=============================================================

EmployeePortal (Main Component)
│
├─ NewBookingComplete
│  │
│  ├─ FlightBookingMMT          [✨ New - Uses Real API]
│  │  ├─ Search Form
│  │  ├─ Results List
│  │  └─ Booking Form
│  │
│  ├─ HotelBookingEnhanced      [Can be updated]
│  │  └─ Currently uses mock data
│  │
│  ├─ BusBooking                [Can be updated]
│  │  └─ Currently uses mock data
│  │
│  └─ CabBooking                [Can be updated]
│     └─ Currently uses mock data
│
├─ ApprovalWorkflow
│  └─ Handles booking approvals
│
├─ PaymentGateway
│  └─ Processes payments
│
└─ NotificationSystem
   └─ Sends confirmations

=============================================================
 STATE MANAGEMENT
=============================================================

Component State:

{
  // Search Parameters
  from: string,                 // 'DEL'
  to: string,                   // 'BOM'
  departDate: string,           // '2026-02-25'
  returnDate?: string,
  passengers: number,
  cabinClass: string,           // 'economy'
  
  // Results
  flights: Flight[],
  loading: boolean,
  error: string | null,
  
  // Selection
  selectedFlight: Flight | null,
  
  // Booking
  passengerDetails: {
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    dateOfBirth: string,
    gender: string
  },
  
  // UI State
  step: 'search' | 'selection' | 'confirmation',
  bookingLoading: boolean
}

=============================================================
 API ENDPOINTS MAP
=============================================================

FLIGHTS
├─ POST   /travel/flights/search          ───→ Search
├─ GET    /travel/flights/:flightId       ───→ Details
└─ POST   /travel/flights/book            ───→ Book

HOTELS
├─ POST   /travel/hotels/search           ───→ Search
├─ GET    /travel/hotels/:hotelId         ───→ Details
└─ POST   /travel/hotels/book             ───→ Book

BUSES
├─ POST   /travel/buses/search            ───→ Search
└─ POST   /travel/buses/book              ───→ Book

CABS
├─ POST   /travel/cabs/search             ───→ Search
└─ POST   /travel/cabs/book               ───→ Book

BOOKINGS
├─ GET    /travel/bookings/:bookingId     ───→ Details
├─ POST   /travel/bookings/:bookingId/cancel  ───→ Cancel
├─ PUT    /travel/bookings/:bookingId/modify  ───→ Modify
└─ GET    /travel/history                 ───→ History

=============================================================
 ENVIRONMENT VARIABLES
=============================================================

.env File Structure:

# MakeMyTrip API Credentials
MMT_API_BASE_URL=https://api.makemytrip.com/api/v1
MMT_API_KEY=abc123xyz
MMT_PARTNER_ID=partner_123
MMT_ACCESS_TOKEN=token_xyz

# Optional Settings
USE_MMT_FALLBACK=true
LOG_LEVEL=info

# Other SimplifyMove Settings
NODE_ENV=development
PORT=5000
DATABASE_URL=...
CORS_ORIGIN=http://localhost:3000

=============================================================
 REQUEST/RESPONSE CYCLE
=============================================================

Client Side:
1. User enters search criteria
2. Calls travelAPI.searchFlights()
3. travelAPI reads auth token
4. Creates HTTP request with auth headers
5. Sends POST to backend
6. Waits for response
7. Processes response
8. Updates component state
9. Re-renders UI

Server Side:
1. Receives HTTP request
2. Auth middleware validates token
3. travelRoutes handler processes request
4. Validates input parameters
5. Calls makemytripService.searchFlights()
6. Service creates axios request
7. Adds MakeMyTrip credentials
8. Sends request to MakeMyTrip API
9. Waits for response
10. Formats response
11. Sends back to client
12. Client receives and processes

=============================================================
 SECURITY LAYERS
=============================================================

1. Frontend
   ├─ Input validation
   ├─ XSS prevention
   └─ Auth token in headers

2. Backend
   ├─ CORS validation
   ├─ Auth middleware
   ├─ Input sanitization
   ├─ Rate limiting
   └─ XSS prevention

3. API Communication
   ├─ HTTPS only
   ├─ API key in .env (not in code)
   ├─ Bearer token auth
   └─ Credentials not exposed

4. Database
   ├─ SQL injection prevention (if using DB)
   ├─ Access control
   └─ Encryption for sensitive data

=============================================================
 DEPLOYMENT ARCHITECTURE
=============================================================

Development:
localhost:3000 (Frontend)
        ↓
localhost:5000/api/v1 (Backend)
        ↓
MakeMyTrip API

Production:
yourdomain.com (Frontend - CDN)
        ↓
api.yourdomain.com (Backend - Load Balanced)
        ↓
MakeMyTrip API

Docker Setup (Future):
┌──────────────────┐
│ Frontend Container│
└────────┬─────────┘
         │
    nginx:reverse proxy
         │
┌────────▼──────────┐
│Backend Container  │
└────────┬──────────┘
         │
┌────────▼──────────┐
│MySQL Container    │
└───────────────────┘

=============================================================
 SCALING CONSIDERATIONS
=============================================================

1. Caching Layer
   - Cache flight results (short TTL)
   - Cache hotel listings
   - Cache availability

2. Queue System
   - Queue booking requests during high load
   - Process asynchronously
   - Send notifications when complete

3. Rate Limiting
   - Limit per user
   - Limit per company
   - API quota management

4. Monitoring
   - Track API response times
   - Monitor API failures
   - Alert on quota usage
   - Track user behavior

5. Database
   - Index frequently searched columns
   - Archive old bookings
   - Optimize query performance

=============================================================

This architecture is designed to be:
✅ Scalable - Can handle growth
✅ Secure - Multiple security layers
✅ Maintainable - Clear separation of concerns
✅ Flexible - Easy to extend with new features
✅ Reliable - Error handling throughout

=============================================================
