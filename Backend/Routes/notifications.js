const express = require('express');
const router = express.Router();
const {
  getNotifications,
  markNotificationAsRead
} = require('../controllers/notificationController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getNotifications);
router.put('/:id', protect, markNotificationAsRead);

module.exports = router;