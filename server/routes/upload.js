const express = require('express');
const multer = require('multer');
const Upload = require('../models/Upload');

const router = express.Router();

// File upload config
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// Middleware to check if user is logged in
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  return res.status(401).json({ error: 'Unauthorized' });
};

// POST: Upload an image
router.post('/', isAuthenticated, upload.single('image'), async (req, res) => {
  try {
    const newUpload = new Upload({
      filename: req.file.filename,
      url: `/uploads/${req.file.filename}`,
      uploadedBy: req.user.email,
    });

    await newUpload.save();
    res.json({ message: 'Upload successful', data: newUpload });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Upload failed' });
  }
});


// GET: Fetch uploads for logged-in user
router.get('/my-uploads', isAuthenticated, async (req, res) => {
  try {
    const images = await Upload.find({ uploadedBy: req.user.email }); // match what you saved
    res.json(images);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch uploads' });
  }
});


module.exports = router;
