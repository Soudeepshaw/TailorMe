const express = require('express');
const {
    createProfile,
    getProfile,
    updateProfile,
    getOrderHistory,
    getLoyaltyPoints
  } = require('../controllers/customerController');
  
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();



router.post('/profile', protect, authorize('customer'), createProfile);
router.get('/profile', protect, authorize('customer'), getProfile);
router.put('/profile', protect, authorize('customer'), updateProfile);
router.get('/orders', protect, authorize('customer'), getOrderHistory);
router.get('/loyalty-points', protect, authorize('customer'), getLoyaltyPoints);

module.exports = router;
