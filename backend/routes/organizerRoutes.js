const express = require('express');
const router = express.Router();
const Organizer = require('../models/Organizer');
const { protect } = require('../middleware/auth');

router.post('/start', protect, async (req, res) => {
  const org = await Organizer.create({ user: req.user._id, step: 1, data: {} });
  res.json(org);
});

router.post('/verify-kra', protect, async (req, res) => {
  const { kraPin } = req.body;
  if (!kraPin || kraPin.length < 10) return res.status(400).json({ error: 'Invalid KRA PIN' });
  
  const org = await Organizer.findOneAndUpdate(
    { user: req.user._id },
    { $set: { 'data.kraPin': kraPin, step: 2 } },
    { new: true }
  );
  res.json(org);
});

router.post('/phone-verify', protect, async (req, res) => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  res.json({ success: true, otp });
});

module.exports = router;
