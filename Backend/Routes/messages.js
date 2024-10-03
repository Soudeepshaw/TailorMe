const express = require('express');
const router = express.Router();
const {
  sendMessage,
  getMessages
} = require('../controllers/messageController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/', protect, upload.single('image'), sendMessage);
router.get('/:orderId', protect, getMessages);

module.exports = router;