const express = require('express');
const router = express.Router();
const {
  createPaymentIntent
} = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/auth');

router.post('/create-payment-intent', protect, authorize('user'), createPaymentIntent);

module.exports = router;