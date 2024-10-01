const express = require('express');
const router = express.Router();
const {
  addFabric,
  updateFabric,
  deleteFabric,
  getFabrics
} = require('../controllers/fabricController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/', protect, authorize('tailor'), upload.array('images', 5), addFabric);
router.put('/:id', protect, authorize('tailor'), upload.array('images', 5), updateFabric);
router.delete('/:id', protect, authorize('tailor'), deleteFabric);
router.get('/:tailorId', getFabrics);

module.exports = router;