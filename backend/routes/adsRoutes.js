const express = require('express');
const router = express.Router();
const Ad = require('../models/Ad');

router.get('/', async (req, res) => {
  const { placement } = req.query;
  const ads = await Ad.find({ placement, active: true, startDate: { $lte: new Date() }, endDate: { $gte: new Date() } });
  res.json(ads);
});

router.post('/:id/impression', async (req, res) => {
  await Ad.findByIdAndUpdate(req.params.id, { $inc: { impressions: 1 } });
  res.json({ ok: true });
});

router.post('/:id/click', async (req, res) => {
  await Ad.findByIdAndUpdate(req.params.id, { $inc: { clicks: 1 } });
  res.json({ ok: true });
});

module.exports = router;
