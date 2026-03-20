const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { uploadImage } = require('../utils/cloudinary');
const { protect } = require('../middleware/auth');

router.post('/poster', protect, upload.single('poster'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    const imageUrl = await uploadImage(req.file);
    res.json({ url: imageUrl });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post('/media', protect, upload.array('media', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }
    
    const uploadPromises = req.files.map(file => uploadImage(file));
    const imageUrls = await Promise.all(uploadPromises);
    res.json({ urls: imageUrls });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;