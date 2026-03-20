const express = require('express');
const { purchaseTicket, mpesaCallback, getTicketStatus, getMyTickets, validateTicket, refreshTicketQR } = require('../controllers/ticketController');
const { protect, organizer } = require('../middleware/auth');
const router = express.Router();

router.post('/purchase', protect, purchaseTicket);
router.post('/mpesa-callback', mpesaCallback);
router.get('/status/:ticketId', protect, getTicketStatus);
router.post('/refresh-qr/:ticketId', protect, require('../controllers/ticketController').refreshTicketQR);
router.get('/my-tickets', protect, getMyTickets);
router.post('/validate/:id', protect, organizer, validateTicket);
router.post('/validate/scan', protect, organizer, validateTicket);
router.get('/:id/pdf', protect, require('../controllers/ticketController').downloadTicketPDF);

module.exports = router;
