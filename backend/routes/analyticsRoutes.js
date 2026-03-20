const express = require('express');
const { getOrganizerAnalytics } = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.get('/organizer/:eventId', protect, getOrganizerAnalytics);

module.exports = router;