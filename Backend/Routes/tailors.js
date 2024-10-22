const express = require('express');
const router = express.Router();
const tailorController = require('../controllers/tailorController');
const {protect} = require('../middleware/auth');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

// Create tailor profile
console.log(typeof protect); // Should output 'function'
console.log(typeof tailorController.createProfile); // Should output 'function'

router.post('/profile', protect, tailorController.createProfile);

// Get tailor profile
router.get('/profile', protect, tailorController.getProfile);

// Update tailor profile
router.put('/profile', protect, upload.single('profilePicture'), tailorController.updateProfile);

// Get all tailors
router.get('/', tailorController.getAllTailors);
router.get('/profile-picture-url', protect, tailorController.getProfilePictureUrl);

// Get tailor by ID
router.get('/:id', tailorController.getTailorById);

// Add portfolio item
router.post('/portfolio', protect, upload.single('image'), tailorController.addPortfolioItem);

// Update portfolio item
router.put('/portfolio/:itemId', protect, upload.single('image'), tailorController.updatePortfolioItem);

// Delete portfolio item
router.delete('/portfolio/:itemId', protect, tailorController.deletePortfolioItem);

module.exports = router;