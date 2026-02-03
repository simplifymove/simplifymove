const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

const vehicleController = {
  createVehicle: (req, res) => res.json({ success: true, message: 'Vehicle created' }),
  getAllVehicles: (req, res) => res.json({ success: true, data: [] }),
  getVehicleById: (req, res) => res.json({ success: true, data: {} }),
  updateVehicle: (req, res) => res.json({ success: true, message: 'Vehicle updated' }),
  deleteVehicle: (req, res) => res.json({ success: true, message: 'Vehicle deleted' }),
  assignDriver: (req, res) => res.json({ success: true, message: 'Driver assigned' })
};

router.use(protect);
router.post('/', authorize('super_admin'), vehicleController.createVehicle);
router.get('/', vehicleController.getAllVehicles);
router.get('/:id', vehicleController.getVehicleById);
router.put('/:id', authorize('super_admin'), vehicleController.updateVehicle);
router.delete('/:id', authorize('super_admin'), vehicleController.deleteVehicle);
router.post('/:id/assign-driver', authorize('super_admin'), vehicleController.assignDriver);

module.exports = router;
