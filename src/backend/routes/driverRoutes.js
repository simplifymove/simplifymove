const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

const driverController = {
  createDriver: (req, res) => res.json({ success: true, message: 'Driver created' }),
  getAllDrivers: (req, res) => res.json({ success: true, data: [] }),
  getDriverById: (req, res) => res.json({ success: true, data: {} }),
  updateDriver: (req, res) => res.json({ success: true, message: 'Driver updated' }),
  deleteDriver: (req, res) => res.json({ success: true, message: 'Driver deleted' }),
  getDriverBookings: (req, res) => res.json({ success: true, data: [] })
};

router.use(protect);
router.post('/', authorize('super_admin'), driverController.createDriver);
router.get('/', driverController.getAllDrivers);
router.get('/:id', driverController.getDriverById);
router.put('/:id', authorize('super_admin'), driverController.updateDriver);
router.delete('/:id', authorize('super_admin'), driverController.deleteDriver);
router.get('/:id/bookings', driverController.getDriverBookings);

module.exports = router;
