const express = require('express');
const router = express.Router();
const {
  addCatalogItem,
  updateCatalogItem,
  deleteCatalogItem,
  getCatalogItems
} = require('../controllers/catalogController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/', protect, authorize('tailor'), upload.array('images', 5), addCatalogItem);
router.put('/:id', protect, authorize('tailor'), upload.array('images', 5), updateCatalogItem);
router.delete('/:id', protect, authorize('tailor'), deleteCatalogItem);
router.get('/:tailorId', getCatalogItems);

module.exports = router;