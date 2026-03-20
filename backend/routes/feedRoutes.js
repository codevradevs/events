const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

router.get('/', async (req, res) => {
  const limit = Math.min(50, parseInt(req.query.limit) || 20);
  const cursor = req.query.cursor ? new Date(req.query.cursor) : new Date();
  
  const feed = await Event.find({ date: { $gte: new Date() }, status: 'published' })
    .sort({ trending: -1, date: 1 })
    .limit(limit)
    .populate('organizer', 'username verified')
    .exec();
  
  res.json({ data: feed, nextCursor: feed.length ? feed[feed.length - 1].date : null });
});

module.exports = router;
