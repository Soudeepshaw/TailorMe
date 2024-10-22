const express = require('express');
const router = express.Router();
const { generateSignedUrl } = require('../utils/s3Utils');
const { protect } = require('../middleware/auth');

router.get('/signedUrl', protect, async (req, res) => {
  try {
    const fileType = req.query.fileType;
    const key = `${req.user.id}/${Date.now()}.${fileType}`;
    const uploadUrl = await generateSignedUrl(key, `image/${fileType}`, 'putObject');
    const getUrl = await generateSignedUrl(key, `image/${fileType}`, 'getObject');
    res.json({ uploadUrl, getUrl, key });
  } catch (error) {
    console.error('Error generating signed URLs:', error);
    res.status(500).json({ message: 'Error generating signed URLs' });
  }
});

module.exports = router;
