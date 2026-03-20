const express = require('express');
const { register, login, getProfile, updateProfile, saveEvent, followOrganizer, getSavedEvents, getOrganizerProfile, getFollowing, updateSettings, changePassword, deleteAccount } = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/save-event/:eventId', protect, saveEvent);
router.get('/saved-events', protect, getSavedEvents);
router.post('/follow/:organizerId', protect, followOrganizer);
router.get('/organizer/:id', getOrganizerProfile);
router.get('/following', protect, getFollowing);
router.put('/settings', protect, updateSettings);
router.put('/password', protect, changePassword);
router.delete('/account', protect, deleteAccount);

module.exports = router;
