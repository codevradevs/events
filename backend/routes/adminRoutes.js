const express = require('express');
const router = express.Router();
const isAdmin = require('../middleware/admin');
const Event = require('../models/Event');
const User = require('../models/User');
const Ticket = require('../models/Ticket');
const { protect } = require('../middleware/auth');

router.use(protect);
router.use(isAdmin);

router.get('/events', async (req, res) => {
  try {
    const { sortBy = 'createdAt', order = 'desc', filter } = req.query;
    
    let query = {};
    if (filter === 'verified') query.verified = true;
    if (filter === 'unverified') query.verified = false;
    if (filter === 'published') query.status = 'published';
    if (filter === 'draft') query.status = 'draft';
    if (filter === 'cancelled') query.status = 'cancelled';
    
    let sortOptions = {};
    if (sortBy === 'title') sortOptions.title = order === 'desc' ? -1 : 1;
    else if (sortBy === 'date') sortOptions.date = order === 'desc' ? -1 : 1;
    else sortOptions.createdAt = order === 'desc' ? -1 : 1;
    
    const events = await Event.find(query)
      .populate('organizer')
      .sort(sortOptions)
      .limit(200);
    res.json(events);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post('/event/:id/verify', async (req, res) => {
  const ev = await Event.findByIdAndUpdate(req.params.id, { 
    verified: true, 
    status: 'published' 
  }, { new: true });
  res.json(ev);
});

router.post('/user/:id/ban', async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, { banned: true });
  res.json({ ok: true });
});

router.post('/event/:id/ban', async (req, res) => {
  const ev = await Event.findByIdAndUpdate(req.params.id, { 
    verified: false, 
    status: 'cancelled' 
  }, { new: true });
  res.json(ev);
});

const { getTransactionAnalytics, getPlatformSettings, updatePlatformSettings } = require('../controllers/analyticsController');

router.get('/transaction-analytics', getTransactionAnalytics);
router.get('/platform-settings', getPlatformSettings);
router.put('/platform-settings', updatePlatformSettings);

router.get('/event-stats/:eventId', async (req, res) => {
  try {
    const { eventId } = req.params;
    const PlatformSettings = require('../models/PlatformSettings');
    
    const settings = await PlatformSettings.findOne() || { platformFeePercentage: 5 };
    const tickets = await Ticket.find({ event: eventId, paymentStatus: 'completed' });
    
    const totalRevenue = tickets.reduce((sum, ticket) => sum + ticket.price, 0);
    const platformEarnings = totalRevenue * (settings.platformFeePercentage / 100);
    const organizerEarnings = totalRevenue - platformEarnings;
    
    res.json({
      totalRevenue,
      platformEarnings,
      organizerEarnings,
      ticketsSold: tickets.length,
      platformFeePercentage: settings.platformFeePercentage
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/event/:id', async (req, res) => {
  await Event.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

module.exports = router;