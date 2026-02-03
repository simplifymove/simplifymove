const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

const notificationController = {
  getNotifications: (req, res) => res.json({ success: true, data: [] }),
  markAsRead: (req, res) => res.json({ success: true, message: 'Marked as read' }),
  markAllAsRead: (req, res) => res.json({ success: true, message: 'All marked as read' }),
  deleteNotification: (req, res) => res.json({ success: true, message: 'Notification deleted' })
};

router.use(protect);
router.get('/', notificationController.getNotifications);
router.patch('/:id/read', notificationController.markAsRead);
router.patch('/read-all', notificationController.markAllAsRead);
router.delete('/:id', notificationController.deleteNotification);

module.exports = router;
