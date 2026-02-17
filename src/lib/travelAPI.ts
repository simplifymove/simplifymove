/**
 * Frontend MakeMyTrip API Client
 * Simplified API client for booking components
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

const travelAPI = {
  /**
   * ==================== FLIGHT APIs ====================
   */
  
  // Search flights
  searchFlights: async (params) => {
    try {
      const response = await fetch(`${API_BASE_URL}/travel/flights/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error('Flight search failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Flight search error:', error);
      throw error;
    }
  },

  // Get flight details
  getFlightDetails: async (flightId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/travel/flights/${flightId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch flight details');
      }

      return await response.json();
    } catch (error) {
      console.error('Get flight details error:', error);
      throw error;
    }
  },

  // Book flight
  bookFlight: async (bookingData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/travel/flights/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        throw new Error('Flight booking failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Flight booking error:', error);
      throw error;
    }
  },

  /**
   * ==================== HOTEL APIs ====================
   */

  // Search hotels
  searchHotels: async (params) => {
    try {
      const response = await fetch(`${API_BASE_URL}/travel/hotels/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error('Hotel search failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Hotel search error:', error);
      throw error;
    }
  },

  // Get hotel details
  getHotelDetails: async (hotelId, checkInDate = null, checkOutDate = null) => {
    try {
      const params = new URLSearchParams();
      if (checkInDate) params.append('checkInDate', checkInDate);
      if (checkOutDate) params.append('checkOutDate', checkOutDate);

      const response = await fetch(`${API_BASE_URL}/travel/hotels/${hotelId}?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch hotel details');
      }

      return await response.json();
    } catch (error) {
      console.error('Get hotel details error:', error);
      throw error;
    }
  },

  // Book hotel
  bookHotel: async (bookingData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/travel/hotels/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        throw new Error('Hotel booking failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Hotel booking error:', error);
      throw error;
    }
  },

  /**
   * ==================== BUS APIs ====================
   */

  // Search buses
  searchBuses: async (params) => {
    try {
      const response = await fetch(`${API_BASE_URL}/travel/buses/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error('Bus search failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Bus search error:', error);
      throw error;
    }
  },

  // Book bus
  bookBus: async (bookingData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/travel/buses/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        throw new Error('Bus booking failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Bus booking error:', error);
      throw error;
    }
  },

  /**
   * ==================== CAB APIs ====================
   */

  // Search cabs
  searchCabs: async (params) => {
    try {
      const response = await fetch(`${API_BASE_URL}/travel/cabs/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error('Cab search failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Cab search error:', error);
      throw error;
    }
  },

  // Book cab
  bookCab: async (bookingData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/travel/cabs/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        throw new Error('Cab booking failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Cab booking error:', error);
      throw error;
    }
  },

  /**
   * ==================== BOOKING MANAGEMENT APIs ====================
   */

  // Get booking details
  getBookingDetails: async (bookingId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/travel/bookings/${bookingId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch booking details');
      }

      return await response.json();
    } catch (error) {
      console.error('Get booking details error:', error);
      throw error;
    }
  },

  // Cancel booking
  cancelBooking: async (bookingId, reason = '') => {
    try {
      const response = await fetch(`${API_BASE_URL}/travel/bookings/${bookingId}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify({ reason }),
      });

      if (!response.ok) {
        throw new Error('Booking cancellation failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Cancel booking error:', error);
      throw error;
    }
  },

  // Modify booking
  modifyBooking: async (bookingId, modifications) => {
    try {
      const response = await fetch(`${API_BASE_URL}/travel/bookings/${bookingId}/modify`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify(modifications),
      });

      if (!response.ok) {
        throw new Error('Booking modification failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Modify booking error:', error);
      throw error;
    }
  },

  // Get travel history
  getTravelHistory: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.status) params.append('status', filters.status);

      const response = await fetch(`${API_BASE_URL}/travel/history?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch travel history');
      }

      return await response.json();
    } catch (error) {
      console.error('Travel history error:', error);
      throw error;
    }
  },
};

export default travelAPI;
