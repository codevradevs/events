const express = require('express');
const { createEvent, getEvents, getTrending, getRecommended, getNearby, getEvent, updateEvent, deleteEvent, likeEvent, commentEvent, getOrganizerEvents, getEventAnalytics, getPublicOrganizerEvents, getEventComments } = require('../controllers/eventController');
const { protect, organizer } = require('../middleware/auth');
const router = express.Router();

router.post('/', protect, organizer, createEvent);
router.get('/', getEvents);
router.get('/trending', getTrending);
router.get('/recommended', (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (token) {
    const jwt = require('jsonwebtoken');
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const User = require('../models/User');
      User.findById(decoded.id).select('-password').then(user => {
        req.user = user;
        next();
      });
    } catch (err) {
      next();
    }
  } else {
    next();
  }
}, getRecommended);
router.get('/nearby', getNearby);
router.get('/organizer/my-events', protect, organizer, getOrganizerEvents);
router.get('/organizer/:organizerId/public', getPublicOrganizerEvents);
router.get('/:id', getEvent);
router.get('/:id/analytics', protect, organizer, getEventAnalytics);
router.get('/:id/comments', getEventComments);
router.put('/:id', protect, organizer, updateEvent);
router.delete('/:id', protect, organizer, deleteEvent);
router.post('/:id/like', protect, likeEvent);
router.post('/:id/comment', protect, commentEvent);
router.post('/:id/notify', protect, organizer, require('../controllers/eventController').notifyAttendees);
router.get('/:id/export', protect, organizer, require('../controllers/eventController').exportSalesReport);
router.post('/:id/boost', protect, organizer, require('../controllers/eventController').boostEvent);

module.exports = router;
