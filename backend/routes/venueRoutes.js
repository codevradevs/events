const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const { protect } = require('../middleware/auth');

router.get('/:eventId/venue', protect, async (req, res) => {
  try {
    const ev = await Event.findById(req.params.eventId).select('location');
    if (!ev) return res.status(404).json({ error: 'Event not found' });
    res.json(ev.location);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
