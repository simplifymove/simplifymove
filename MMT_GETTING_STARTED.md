/**
 * MakeMyTrip Integration - Getting Started Checklist
 * Follow these steps to get up and running
 */

=============================================================
 IMMEDIATE ACTIONS (TODAY)
=============================================================

□ 1. Read the main summary
      File: MMT_IMPLEMENTATION_SUMMARY.md
      (Understanding what was done)

□ 2. Check the files created
      Backend:
      - src/backend/services/makemytripService.js
      - src/backend/routes/travelRoutes.js
      
      Frontend:
      - src/lib/travelAPI.ts
      - src/components/employee/FlightBookingMMT.tsx
      - src/components/employee/MMTIntegrationGuide.tsx
      - src/components/employee/MMT_QUICK_REFERENCE.md
      
      Documentation:
      - MAKEMYTRIP_SETUP.md
      - MMT_IMPLEMENTATION_SUMMARY.md
      - MMT_GETTING_STARTED.md (this file)

□ 3. Read the Quick Reference
      File: src/components/employee/MMT_QUICK_REFERENCE.md

=============================================================
 WEEK 1 - SETUP
=============================================================

□ Day 1 - Request MakeMyTrip Credentials
   - Visit: https://mybiz.makemytrip.com/integrated-travel-solutions/travel-request-api
   - Sign to business account
   - Submit access request form
   - Email: b2b@makemytrip.com with your:
     * Company name
     * Use case (employee travel bookings)
     * Expected transaction volume
   - Expected time: 2-3 business days for approval

□ Day 2 - Review Documentation
   - Read: MAKEMYTRIP_SETUP.md
   - Understand: API endpoints
   - Review: Response formats
   - Check: Airport codes list

□ Day 3-5 - Local Testing Setup
   - After credentials received:
     * Open: src/backend/.env
     * Add the credentials:
       MMT_API_BASE_URL=https://api.makemytrip.com/api/v1
       MMT_API_KEY=your_key
       MMT_PARTNER_ID=your_id
       MMT_ACCESS_TOKEN=your_token
     
     * Start backend server
     * Test with curl (see MAKEMYTRIP_SETUP.md)

=============================================================
 WEEK 2 - INTEGRATION
=============================================================

□ Day 1 - Review Example Component
   - File: FlightBookingMMT.tsx
   - Understand the 3-step process:
     1. Search flights
     2. Select flight
     3. Confirm booking
   - Note the error handling patterns
   - Check how API calls are made

□ Day 2-3 - Update Existing Components (Choose one approach)
   
   OPTION A: Use new component as-is
   - Import FlightBookingMMT
   - Replace existing flight component
   - Test thoroughly
   
   OPTION B: Update existing components
   - FlightBookingEnhanced.tsx
   - HotelBookingEnhanced.tsx
   - BusBooking.tsx
   - CabBooking.tsx
   - Replace mock data with travelAPI calls

   OPTION C: Create hybrid
   - Keep mock fallback
   - Add real API option
   - Toggle between them

□ Day 4-5 - Test All Flows
   - Flight search and booking
   - Hotel search and booking
   - Bus search and booking
   - Cab search and booking
   - Test error scenarios
   - Test network failures

=============================================================
 WEEK 3 - REFINEMENT
=============================================================

□ Day 1-2 - Hook up Approval Workflow
   - When booking created, trigger approval request
   - Save booking details to database
   - Connect to approval workflow
   - Update booking status after approval

□ Day 3 - Payment Integration
   - Integrate with your payment gateway
   - Connect wallet deduction
   - Handle payment failures
   - Add refund logic

□ Day 4 - Notifications
   - Send booking confirmation emails
   - Send approval status updates
   - Setup SMS notifications (optional)
   - Add in-app notifications

□ Day 5 - Final Testing
   - Full user flow testing
   - E2E testing
   - Load testing
   - Edge case testing

=============================================================
 WEEK 4 - DEPLOYMENT
=============================================================

□ Day 1 - Production Setup
   - Get production MakeMyTrip credentials
   - Update production .env
   - Test with production credentials
   - Verify API works

□ Day 2 - Deploy Code
   - Deploy backend changes
   - Deploy frontend changes
   - Verify routes are working
   - Check error logs

□ Day 3-4 - Monitor
   - Watch API logs
   - Check for errors
   - Monitor API quota
   - Verify all bookings

□ Day 5 - Cleanup
   - Remove test data
   - Verify production data
   - Document any issues
   - Plan enhancements

=============================================================
 QUICK START COMMANDS
=============================================================

1. Check file structure:
   pwd
   ls -la src/backend/services/makemytripService.js
   ls -la src/lib/travelAPI.ts

2. View the backend service:
   cat src/backend/services/makemytripService.js | head -50

3. Start backend (from project root):
   cd src/backend
   npm start
   # or for development
   npm run dev

4. Test API with curl:
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

5. Check if routes are registered:
   grep -r "travelRoutes" src/backend/server.js

=============================================================
 COMMON QUESTIONS
=============================================================

Q: How long does MakeMyTrip approval take?
A: Usually 2-3 business days. Keep email handy for next steps.

Q: Can I test without credentials?
A: Currently no mock/fallback implemented. You'll need real credentials.
   (Could be added if needed for testing)

Q: Do I need to update all booking components?
A: No. You can use just FlightBookingMMT.tsx or update them gradually.

Q: What if API fails?
A: Check error handling in travelAPI.ts. Error details are logged
   and returned to user. Add retry logic if needed.

Q: How do I handle pilot bookings?
A: Request small API quota from MakeMyTrip initially. Scale up after testing.

Q: Can I modify the API client?
A: Yes! travelAPI.ts is simple and can be customized. Add your own methods
   or modify existing ones as needed.

Q: How do I cancel a booking?
A: Use travelAPI.cancelBooking(bookingId, reason)
   Ensure user has permission first.

Q: What about refunds?
A: MakeMyTrip API handles refunds. Check cancelBooking response
   for refund status and amount.

=============================================================
 TROUBLESHOOTING
=============================================================

Issue: "API Key missing or invalid"
Fix: Check .env file has correct MMT_API_KEY

Issue: "Authorization failed"
Fix: Verify user token is valid and hasauth middleware

Issue: "Route not found"
Fix: Check server.js has travel routes registered
     Restart backend server

Issue: "No flights found"
Fix: Check airport codes are valid IATA codes (DEL, BOM, etc)
     Check dates are today or future

Issue: "Booking failed"
Fix: Check passenger details are complete
     Verify flight is still available
     Check API response for specific error

Issue: "Slow API responses"
Fix: Check network connection
     Verify MakeMyTrip API status
     Add request timeout handling

=============================================================
 RESOURCES
=============================================================

Documentation Files:
1. MAKEMYTRIP_SETUP.md
   - Detailed setup instructions
   - All API endpoints
   - Testing examples
   - Error handling guide

2. MMT_QUICK_REFERENCE.md
   - Quick lookup for methods
   - Common airport codes
   - Example usage
   - Integration checklist

3. MMTIntegrationGuide.tsx
   - Code examples
   - Integration patterns
   - Response formats

4. FlightBookingMMT.tsx
   - Complete working example
   - Can be used as template
   - Shows best practices
   - Has error handling

Code Files:
1. makemytripService.js (backend)
   - Where API calls are made
   - Modify here for custom logic

2. travelRoutes.js (backend routes)
   - REST endpoints
   - Auth and validation

3. travelAPI.ts (frontend client)
   - Use in React components
   - Centralized API calls

=============================================================
 SUCCESS METRICS
=============================================================

You'll know it's working when:

✅ Backend:
   - Travel routes are registered
   - Health check passes
   - Curl requests return data
   - Errors are properly logged

✅ Frontend:
   - travelAPI methods work
   - Components render correctly
   - API responses are handled
   - Error messages show properly

✅ User Experience:
   - Can search flights/hotels/buses/cabs
   - Can select travel option
   - Can enter passenger details
   - Can complete booking
   - Receives confirmation

✅ Data:
   - Bookings are saved
   - Confirmations are generated
   - Approval requests are created
   - Wallet deductions happen

=============================================================
 NEXT ACTIONS
=============================================================

TODAY:
1. ☐ Read MMT_IMPLEMENTATION_SUMMARY.md
2. ☐ Check the files that were created
3. ☐ Review the code structure

THIS WEEK:
1. ☐ RequestMakeMyTrip API credentials
2. ☐ Read MAKEMYTRIP_SETUP.md thoroughly
3. ☐ Test backend with curl commands

NEXT WEEK:
1. ☐ Integrate with existing components OR use new ones
2. ☐ Test all booking flows
3. ☐ Hook up approval workflow

FOLLOWING WEEK:
1. ☐ Add payment integration
2. ☐ Setup notifications
3. ☐ Final testing
4. ☐ Deploy to production

=============================================================
 SUPPORT
=============================================================

For Technical Issues:
- Check error messages in console
- Review MAKEMYTRIP_SETUP.md troubleshooting section
- Check API logs in browser console

For MakeMyTrip Issues:
- Email: b2b@makemytrip.com
- Phone: 1-800-102-2000
- Website: https://mybiz.makemytrip.com/

For Code Issues:
- Review the example components
- Check existing error handling patterns
- Add console.log() for debugging

=============================================================

You're all set! Follow the checklist and you'll have a fully
functional travel booking system integrated with MakeMyTrip API.

Start by requesting credentials (Week 1), then gradually integrate
the components (Week 2-3), and finally deploy (Week 4).

Good luck! 🚀

=============================================================
