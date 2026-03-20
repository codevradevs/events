const express = require('express');
const { createStripePayment, initiateAirtelPayment, stkPush, mpesaCallback, getPaymentStatus } = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.post('/stk', protect, stkPush);
router.post('/callback', mpesaCallback);
router.get('/status/:checkoutId', protect, getPaymentStatus);
router.post('/stripe/create-intent', protect, createStripePayment);
router.post('/airtel/initiate', protect, initiateAirtelPayment);

module.exports = router;
