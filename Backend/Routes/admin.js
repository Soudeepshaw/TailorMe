const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  suspendUser,
  reactivateUser,
  getOrderAnalytics
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.get('/users', protect, authorize('admin'), getAllUsers);
router.put('/users/:id/suspend', protect, authorize('admin'), suspendUser);
router.put('/users/:id/reactivate', protect, authorize('admin'), reactivateUser);
router.get('/analytics/orders', protect, authorize('admin'), getOrderAnalytics);

module.exports = router;