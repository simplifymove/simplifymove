const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { getModels } = require('../models');

// Get all users (super_admin or company_admin only)
const getAllUsers = async (req, res) => {
  try {
    const { User } = getModels();
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      limit: 100
    });
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const { User } = getModels();
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update user
const updateUser = async (req, res) => {
  try {
    const { User } = getModels();
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    
    await user.update(req.body);
    res.json({ success: true, message: 'User updated', data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const { User } = getModels();
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    
    await user.destroy();
    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update user status
const updateUserStatus = async (req, res) => {
  try {
    const { User } = getModels();
    const { status } = req.body;
    
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    
    await user.update({ status });
    res.json({ success: true, message: 'Status updated', data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const userController = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateUserStatus
};

router.use(protect);
router.get('/', authorize('super_admin', 'company_admin'), userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.delete('/:id', authorize('super_admin'), userController.deleteUser);
router.patch('/:id/status', authorize('super_admin', 'company_admin'), userController.updateUserStatus);

module.exports = router;
