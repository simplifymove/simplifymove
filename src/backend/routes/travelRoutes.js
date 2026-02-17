/**
 * Travel Routes for MakeMyTrip Integration
 * Handles flight, hotel, bus, and cab bookings
 */

const express = require('express');
const router = express.Router();
const mmtService = require('../services/makemytripService');
const auth = require('../middleware/auth');

/**
 * ==================== FLIGHT ROUTES ====================
 */

// Search flights
router.post('/flights/search', auth, async (req, res) => {
  try {
    const { origin, destination, departDate, returnDate, passengers, cabinClass, sortBy } = req.body;

    if (!origin || !destination || !departDate) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const result = await mmtService.searchFlights({
      origin,
      destination,
      departDate,
      returnDate,
      passengers,
      cabinClass,
      sortBy,
    });

    res.json(result);
  } catch (error) {
    console.error('[TRAVEL] Flight search error:', error);
    res.status(500).json({ error: 'Flight search failed' });
  }
});

// Get flight details
router.get('/flights/:flightId', auth, async (req, res) => {
  try {
    const result = await mmtService.getFlightDetails(req.params.flightId);
    res.json(result);
  } catch (error) {
    console.error('[TRAVEL] Get flight error:', error);
    res.status(500).json({ error: 'Failed to fetch flight details' });
  }
});

// Book flight
router.post('/flights/book', auth, async (req, res) => {
  try {
    const bookingData = {
      ...req.body,
      userId: req.user.id,
      companyId: req.user.companyId,
    };

    const result = await mmtService.bookFlight(bookingData);
    res.json(result);
  } catch (error) {
    console.error('[TRAVEL] Flight booking error:', error);
    res.status(500).json({ error: 'Flight booking failed' });
  }
});

/**
 * ==================== HOTEL ROUTES ====================
 */

// Search hotels
router.post('/hotels/search', auth, async (req, res) => {
  try {
    const { destination, checkInDate, checkOutDate, rooms, guests, sortBy, filters } = req.body;

    if (!destination || !checkInDate || !checkOutDate) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const result = await mmtService.searchHotels({
      destination,
      checkInDate,
      checkOutDate,
      rooms,
      guests,
      sortBy,
      filters,
    });

    res.json(result);
  } catch (error) {
    console.error('[TRAVEL] Hotel search error:', error);
    res.status(500).json({ error: 'Hotel search failed' });
  }
});

// Get hotel details
router.get('/hotels/:hotelId', auth, async (req, res) => {
  try {
    const { checkInDate, checkOutDate } = req.query;
    const result = await mmtService.getHotelDetails(req.params.hotelId, checkInDate, checkOutDate);
    res.json(result);
  } catch (error) {
    console.error('[TRAVEL] Get hotel error:', error);
    res.status(500).json({ error: 'Failed to fetch hotel details' });
  }
});

// Book hotel
router.post('/hotels/book', auth, async (req, res) => {
  try {
    const bookingData = {
      ...req.body,
      userId: req.user.id,
      companyId: req.user.companyId,
    };

    const result = await mmtService.bookHotel(bookingData);
    res.json(result);
  } catch (error) {
    console.error('[TRAVEL] Hotel booking error:', error);
    res.status(500).json({ error: 'Hotel booking failed' });
  }
});

/**
 * ==================== BUS ROUTES ====================
 */

// Search buses
router.post('/buses/search', auth, async (req, res) => {
  try {
    const { origin, destination, departDate, returnDate, passengers, sortBy } = req.body;

    if (!origin || !destination || !departDate) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const result = await mmtService.searchBuses({
      origin,
      destination,
      departDate,
      returnDate,
      passengers,
      sortBy,
    });

    res.json(result);
  } catch (error) {
    console.error('[TRAVEL] Bus search error:', error);
    res.status(500).json({ error: 'Bus search failed' });
  }
});

// Book bus
router.post('/buses/book', auth, async (req, res) => {
  try {
    const bookingData = {
      ...req.body,
      userId: req.user.id,
      companyId: req.user.companyId,
    };

    const result = await mmtService.bookBus(bookingData);
    res.json(result);
  } catch (error) {
    console.error('[TRAVEL] Bus booking error:', error);
    res.status(500).json({ error: 'Bus booking failed' });
  }
});

/**
 * ==================== CAB ROUTES ====================
 */

// Search cabs
router.post('/cabs/search', auth, async (req, res) => {
  try {
    const { origin, destination, pickupDate, pickupTime, passengers } = req.body;

    if (!origin || !destination || !pickupDate || !pickupTime) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const result = await mmtService.searchCabs({
      origin,
      destination,
      pickupDate,
      pickupTime,
      passengers,
    });

    res.json(result);
  } catch (error) {
    console.error('[TRAVEL] Cab search error:', error);
    res.status(500).json({ error: 'Cab search failed' });
  }
});

// Book cab
router.post('/cabs/book', auth, async (req, res) => {
  try {
    const bookingData = {
      ...req.body,
      userId: req.user.id,
      companyId: req.user.companyId,
    };

    const result = await mmtService.bookCab(bookingData);
    res.json(result);
  } catch (error) {
    console.error('[TRAVEL] Cab booking error:', error);
    res.status(500).json({ error: 'Cab booking failed' });
  }
});

/**
 * ==================== BOOKING MANAGEMENT ROUTES ====================
 */

// Get booking details
router.get('/bookings/:bookingId', auth, async (req, res) => {
  try {
    const result = await mmtService.getBookingDetails(req.params.bookingId);
    res.json(result);
  } catch (error) {
    console.error('[TRAVEL] Get booking error:', error);
    res.status(500).json({ error: 'Failed to fetch booking details' });
  }
});

// Cancel booking
router.post('/bookings/:bookingId/cancel', auth, async (req, res) => {
  try {
    const { reason } = req.body;
    const result = await mmtService.cancelBooking(req.params.bookingId, reason);
    res.json(result);
  } catch (error) {
    console.error('[TRAVEL] Cancel booking error:', error);
    res.status(500).json({ error: 'Booking cancellation failed' });
  }
});

// Modify booking
router.put('/bookings/:bookingId/modify', auth, async (req, res) => {
  try {
    const result = await mmtService.modifyBooking(req.params.bookingId, req.body);
    res.json(result);
  } catch (error) {
    console.error('[TRAVEL] Modify booking error:', error);
    res.status(500).json({ error: 'Booking modification failed' });
  }
});

// Get travel request history
router.get('/history', auth, async (req, res) => {
  try {
    const { startDate, endDate, status } = req.query;
    const result = await mmtService.getTravelRequestHistory(req.user.id, {
      status,
      startDate,
      endDate,
    });
    res.json(result);
  } catch (error) {
    console.error('[TRAVEL] History fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch travel history' });
  }
});

module.exports = router;
