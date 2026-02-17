/**
 * MakeMyTrip Integration Service
 * Handles all MakeMyTrip API calls for flights, hotels, buses, and cabs
 */

const axios = require('axios');

class MakeMyTripService {
  constructor() {
    // MakeMyTrip API Configuration
    this.baseURL = process.env.MMT_API_BASE_URL || 'https://api.makemytrip.com/api/v1';
    this.apiKey = process.env.MMT_API_KEY || '';
    this.partnerID = process.env.MMT_PARTNER_ID || '';
    this.accessToken = process.env.MMT_ACCESS_TOKEN || '';
    
    // HTTP client with auth headers
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'X-API-Key': this.apiKey,
        'X-Partner-ID': this.partnerID,
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });
  }

  /**
   * Search Flights
   * @param {Object} params - Search parameters
   * @param {string} params.origin - Origin airport code (e.g., 'DEL')
   * @param {string} params.destination - Destination airport code (e.g., 'BOM')
   * @param {string} params.departDate - Departure date (YYYY-MM-DD)
   * @param {string} params.returnDate - Return date (YYYY-MM-DD) - optional
   * @param {number} params.passengers - Number of passengers
   * @param {string} params.cabinClass - 'economy', 'business', 'first'
   */
  async searchFlights(params) {
    try {
      console.log('[MMT] Searching flights:', params);
      
      const response = await this.client.get('/flights/search', {
        params: {
          originCode: params.origin,
          destinationCode: params.destination,
          departureDate: params.departDate,
          returnDate: params.returnDate || null,
          noOfAdults: params.passengers || 1,
          noOfChildren: params.children || 0,
          noOfInfants: params.infants || 0,
          cabinClass: params.cabinClass || 'economy',
          tripType: params.returnDate ? 'ROUND_TRIP' : 'ONE_WAY',
          sortBy: params.sortBy || 'price', // 'price', 'duration', 'departure'
        },
      });

      return {
        success: true,
        data: response.data.flights || [],
        count: response.data.count || 0,
        filters: response.data.filters || {},
      };
    } catch (error) {
      console.error('[MMT] Flight search error:', error.message);
      return {
        success: false,
        error: error.message || 'Failed to search flights',
        data: [],
      };
    }
  }

  /**
   * Get Flight Details
   */
  async getFlightDetails(flightId) {
    try {
      console.log('[MMT] Fetching flight details:', flightId);
      
      const response = await this.client.get(`/flights/${flightId}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('[MMT] Flight details error:', error.message);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Search Hotels
   * @param {Object} params - Search parameters
   * @param {string} params.destination - Hotel destination (city or hotel code)
   * @param {string} params.checkInDate - Check-in date (YYYY-MM-DD)
   * @param {string} params.checkOutDate - Check-out date (YYYY-MM-DD)
   * @param {number} params.rooms - Number of rooms
   * @param {number} params.guests - Number of guests
   */
  async searchHotels(params) {
    try {
      console.log('[MMT] Searching hotels:', params);
      
      const response = await this.client.get('/hotels/search', {
        params: {
          destination: params.destination,
          checkInDate: params.checkInDate,
          checkOutDate: params.checkOutDate,
          noOfRooms: params.rooms || 1,
          noOfGuests: params.guests || 1,
          sortBy: params.sortBy || 'price',
          filters: params.filters || {},
        },
      });

      return {
        success: true,
        data: response.data.hotels || [],
        count: response.data.count || 0,
        filters: response.data.filters || {},
      };
    } catch (error) {
      console.error('[MMT] Hotel search error:', error.message);
      return {
        success: false,
        error: error.message,
        data: [],
      };
    }
  }

  /**
   * Get Hotel Details
   */
  async getHotelDetails(hotelId, checkInDate = null, checkOutDate = null) {
    try {
      console.log('[MMT] Fetching hotel details:', hotelId);
      
      const response = await this.client.get(`/hotels/${hotelId}`, {
        params: {
          checkInDate,
          checkOutDate,
        },
      });

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('[MMT] Hotel details error:', error.message);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Search Buses
   * @param {Object} params - Search parameters
   * @param {string} params.origin - Origin city/station
   * @param {string} params.destination - Destination city/station
   * @param {string} params.departDate - Departure date (YYYY-MM-DD)
   * @param {number} params.passengers - Number of passengers
   */
  async searchBuses(params) {
    try {
      console.log('[MMT] Searching buses:', params);
      
      const response = await this.client.get('/buses/search', {
        params: {
          originCity: params.origin,
          destinationCity: params.destination,
          departureDate: params.departDate,
          returnDate: params.returnDate || null,
          noOfSeats: params.passengers || 1,
          sortBy: params.sortBy || 'price',
        },
      });

      return {
        success: true,
        data: response.data.buses || [],
        count: response.data.count || 0,
        filters: response.data.filters || {},
      };
    } catch (error) {
      console.error('[MMT] Bus search error:', error.message);
      return {
        success: false,
        error: error.message,
        data: [],
      };
    }
  }

  /**
   * Search Cabs
   * @param {Object} params - Search parameters
   * @param {string} params.origin - Pickup location
   * @param {string} params.destination - Drop location
   * @param {string} params.pickupDate - Pickup date (YYYY-MM-DD)
   * @param {string} params.pickupTime - Pickup time (HH:MM)
   */
  async searchCabs(params) {
    try {
      console.log('[MMT] Searching cabs:', params);
      
      const response = await this.client.get('/cabs/search', {
        params: {
          pickupLocation: params.origin,
          dropLocation: params.destination,
          pickupDate: params.pickupDate,
          pickupTime: params.pickupTime,
          passengers: params.passengers || 1,
        },
      });

      return {
        success: true,
        data: response.data.cabs || [],
        count: response.data.count || 0,
      };
    } catch (error) {
      console.error('[MMT] Cab search error:', error.message);
      return {
        success: false,
        error: error.message,
        data: [],
      };
    }
  }

  /**
   * Book Flight
   */
  async bookFlight(bookingData) {
    try {
      console.log('[MMT] Booking flight:', bookingData);
      
      const response = await this.client.post('/flights/book', {
        flightId: bookingData.flightId,
        segment: bookingData.segment, // 'OUTBOUND' or 'RETURN'
        passengers: bookingData.passengers,
        contactDetails: bookingData.contactDetails,
        paymentInfo: bookingData.paymentInfo,
        travelType: bookingData.travelType || 'BUSINESS',
      });

      return {
        success: true,
        bookingId: response.data.bookingId,
        confirmationNumber: response.data.pnr,
        data: response.data,
      };
    } catch (error) {
      console.error('[MMT] Flight booking error:', error.message);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Book Hotel
   */
  async bookHotel(bookingData) {
    try {
      console.log('[MMT] Booking hotel:', bookingData);
      
      const response = await this.client.post('/hotels/book', {
        hotelId: bookingData.hotelId,
        roomTypeId: bookingData.roomTypeId,
        checkInDate: bookingData.checkInDate,
        checkOutDate: bookingData.checkOutDate,
        numberOfRooms: bookingData.numberOfRooms,
        guests: bookingData.guests,
        contactDetails: bookingData.contactDetails,
        paymentInfo: bookingData.paymentInfo,
      });

      return {
        success: true,
        bookingId: response.data.bookingId,
        confirmationNumber: response.data.confirmationNumber,
        data: response.data,
      };
    } catch (error) {
      console.error('[MMT] Hotel booking error:', error.message);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Book Bus
   */
  async bookBus(bookingData) {
    try {
      console.log('[MMT] Booking bus:', bookingData);
      
      const response = await this.client.post('/buses/book', {
        busId: bookingData.busId,
        departureDate: bookingData.departureDate,
        seats: bookingData.seats,
        passengers: bookingData.passengers,
        contactDetails: bookingData.contactDetails,
        paymentInfo: bookingData.paymentInfo,
      });

      return {
        success: true,
        bookingId: response.data.bookingId,
        confirmationNumber: response.data.confirmationNumber,
        data: response.data,
      };
    } catch (error) {
      console.error('[MMT] Bus booking error:', error.message);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Book Cab
   */
  async bookCab(bookingData) {
    try {
      console.log('[MMT] Booking cab:', bookingData);
      
      const response = await this.client.post('/cabs/book', {
        cabId: bookingData.cabId,
        pickupLocation: bookingData.pickupLocation,
        dropLocation: bookingData.dropLocation,
        pickupDateTime: bookingData.pickupDateTime,
        passengers: bookingData.passengers,
        contactDetails: bookingData.contactDetails,
        paymentInfo: bookingData.paymentInfo,
      });

      return {
        success: true,
        bookingId: response.data.bookingId,
        confirmationNumber: response.data.confirmationNumber,
        data: response.data,
      };
    } catch (error) {
      console.error('[MMT] Cab booking error:', error.message);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Get Booking Details
   */
  async getBookingDetails(bookingId) {
    try {
      console.log('[MMT] Fetching booking details:', bookingId);
      
      const response = await this.client.get(`/bookings/${bookingId}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('[MMT] Get booking details error:', error.message);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Cancel Booking
   */
  async cancelBooking(bookingId, reason = '') {
    try {
      console.log('[MMT] Cancelling booking:', bookingId);
      
      const response = await this.client.post(`/bookings/${bookingId}/cancel`, {
        reason,
      });

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('[MMT] Cancel booking error:', error.message);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Modify Booking
   */
  async modifyBooking(bookingId, modificationData) {
    try {
      console.log('[MMT] Modifying booking:', bookingId);
      
      const response = await this.client.put(`/bookings/${bookingId}/modify`, modificationData);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('[MMT] Modify booking error:', error.message);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Get Travel Request History
   */
  async getTravelRequestHistory(userId, filters = {}) {
    try {
      console.log('[MMT] Fetching travel history:', userId);
      
      const response = await this.client.get('/travel-requests', {
        params: {
          userId,
          status: filters.status,
          startDate: filters.startDate,
          endDate: filters.endDate,
        },
      });

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('[MMT] Travel history error:', error.message);
      return {
        success: false,
        error: error.message,
      };
    }
  }
}

module.exports = new MakeMyTripService();
