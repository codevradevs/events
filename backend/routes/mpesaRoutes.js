const express = require('express');
const { initiateMpesaPayment, mpesaCallback } = require('../controllers/mpesaController');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.post('/initiate', protect, initiateMpesaPayment);
router.post('/callback', mpesaCallback);

module.exports = router;
