const express = require('express');
const router = express.Router();
const {
  createOrder,
  updateOrderStatus,
  getOrderDetails
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('user'), createOrder);
router.put('/:id/status', protect, authorize('tailor'), updateOrderStatus);
router.get('/:id', protect, getOrderDetails);

module.exports = router;