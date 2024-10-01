// routes/tailors.js
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  createProfile,
  getProfile,
  updateProfile,
  createPortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem
} = require('../controllers/tailorController');

router.post('/profile', protect, authorize('tailor'), createProfile);
router.get('/profile', protect, authorize('tailor'), getProfile);
router.put('/profile', protect, authorize('tailor'), updateProfile);


router.post('/portfolio', protect, authorize('tailor'), createPortfolioItem);
router.put('/portfolio/:id', protect, authorize('tailor'), updatePortfolioItem);
router.delete('/portfolio/:id', protect, authorize('tailor'), deletePortfolioItem);


module.exports = router;