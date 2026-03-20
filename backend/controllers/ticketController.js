const Ticket = require('../models/Ticket');
const Event = require('../models/Event');
const User = require('../models/User');
const { generateQR } = require('../utils/qr');
const { sendTicketEmail } = require('../utils/email');
const { createNotification } = require('./notificationController');
const { isFraudulentPurchase } = require('../utils/fraudService');
const axios = require('axios');
const qrcode = require('qrcode');
const crypto = require('crypto');

const getAccessToken = async () => {
  const consumer_key = process.env.MPESA_CONSUMER_KEY;
  const consumer_secret = process.env.MPESA_CONSUMER_SECRET;
  
  const auth = Buffer.from(`${consumer_key}:${consumer_secret}`).toString('base64');
  
  const response = await axios.get(
    "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
    { headers: { Authorization: `Basic ${auth}` } }
  );
  
  return response.data.access_token;
};

exports.purchaseTicket = async (req, res) => {
  let ticket;
  try {
    const { eventId, tier, phone } = req.body;
    
    // Validate required fields
    if (!eventId || !tier || !phone) {
      return res.status(400).json({ message: 'Event ID, tier, and phone number are required' });
    }
    
    // Validate phone number format
    if (!/^254\d{9}$/.test(phone)) {
      return res.status(400).json({ message: 'Phone number must be in format 254XXXXXXXXX' });
    }
    
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    const tierData = event.ticketTiers.find(t => t.name === tier);
    
    if (!tierData || tierData.quantity <= tierData.sold) {
      return res.status(400).json({ message: 'Tickets not available' });
    }
    
    // Create ticket with pending status (store actual ticket price)
    ticket = new Ticket({
      event: eventId,
      buyer: req.user._id,
      tier,
      price: tierData.price, // Store actual ticket price
      paymentMethod: 'mpesa',
      paymentStatus: 'pending',
      qrCode: 'pending', // Temporary placeholder
      buyerPhone: phone,
      buyerIp: req.ip
    });
    await ticket.save();
    
    // For testing: simulate successful payment
    console.log('Simulating payment for testing...');
    
    // Generate QR code immediately for testing
    const securityToken = crypto.randomBytes(32).toString('hex');
    const qrData = {
      ticketId: ticket._id,
      eventId: ticket.event,
      buyerId: ticket.buyer,
      token: securityToken,
      timestamp: Date.now()
    };
    
    const qr = await qrcode.toDataURL(JSON.stringify(qrData));
    ticket.qrCode = qr;
    ticket.securityToken = securityToken;
    ticket.paymentStatus = 'completed';
    ticket.transactionId = `TEST_${Date.now()}`;
    ticket.purchasedAt = new Date();
    
    // Update event ticket sales
    const tierIndex = event.ticketTiers.findIndex(t => t.name === ticket.tier);
    if (tierIndex !== -1) {
      event.ticketTiers[tierIndex].sold += 1;
      event.attendees.push(ticket.buyer);
      await event.save();
    }
    
    // Update user
    await User.findByIdAndUpdate(ticket.buyer, { 
      $push: { purchasedTickets: ticket._id }, 
      $inc: { xp: 20 } 
    });
    
    await ticket.save();
    
    res.json({ 
      ticketId: ticket._id,
      message: 'Payment completed successfully! (Test mode)'
    });
  } catch (error) {
    console.error('STK Push Error:', error.response?.data || error.message);
    
    // Clean up ticket if it was created
    if (ticket && ticket._id) {
      await Ticket.findByIdAndDelete(ticket._id);
    }
    
    const errorMessage = error.response?.data?.errorMessage || 
                        error.response?.data?.message || 
                        error.message || 
                        'Payment processing failed';
    
    res.status(400).json({ message: errorMessage });
  }
};

exports.mpesaCallback = async (req, res) => {
  try {
    const data = req.body;
    const callback = data.Body.stkCallback;
    const status = callback.ResultCode === 0 ? "completed" : "failed";
    const accountRef = callback.AccountReference;
    const receipt = callback.CallbackMetadata?.Item?.find(
      item => item.Name === "MpesaReceiptNumber"
    )?.Value;

    // Extract ticket ID from account reference (format: ticketId:actualPrice)
    const ticketId = accountRef.split(':')[0];
    const ticket = await Ticket.findById(ticketId).populate('event');
    
    if (ticket) {
      ticket.paymentStatus = status;
      ticket.transactionId = receipt;
      
      if (status === 'completed') {
        // Generate secure QR code with user verification
        const crypto = require('crypto');
        const securityToken = crypto.randomBytes(32).toString('hex');
        const qrData = {
          ticketId: ticket._id,
          eventId: ticket.event._id,
          buyerId: ticket.buyer,
          token: securityToken,
          timestamp: Date.now()
        };
        
        const qr = await qrcode.toDataURL(JSON.stringify(qrData));
        ticket.qrCode = qr;
        ticket.securityToken = securityToken;
        ticket.purchasedAt = new Date();
        
        // Update event ticket sales
        const event = await Event.findById(ticket.event._id);
        const tierIndex = event.ticketTiers.findIndex(t => t.name === ticket.tier);
        if (tierIndex !== -1) {
          event.ticketTiers[tierIndex].sold += 1;
          event.attendees.push(ticket.buyer);
          await event.save();
        }
        
        // Update user with XP
        await User.findByIdAndUpdate(ticket.buyer, { 
          $push: { purchasedTickets: ticket._id }, 
          $inc: { xp: 20 } 
        });
        
        // Create payment record with actual ticket price for analytics
        const Payment = require('../models/Payment');
        await Payment.create({
          phone: '254000000000', // Placeholder
          amount: ticket.price, // Use actual ticket price for revenue calculations
          status: 'success',
          mpesaReceiptNumber: receipt,
          user: ticket.buyer,
          event: ticket.event._id,
          tier: ticket.tier
        });
      }
      
      await ticket.save();
    }

    res.json({ received: true });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getTicketStatus = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const ticket = await Ticket.findById(ticketId);
    
    if (!ticket || ticket.buyer.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    res.json({
      paymentStatus: ticket.paymentStatus,
      transactionId: ticket.transactionId
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.refreshTicketQR = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const ticket = await Ticket.findById(ticketId);
    
    if (!ticket || ticket.buyer.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    
    if (ticket.paymentStatus !== 'completed') {
      return res.status(400).json({ message: 'Ticket not paid' });
    }
    
    // Generate new QR code with fresh timestamp
    const crypto = require('crypto');
    const securityToken = crypto.randomBytes(32).toString('hex');
    const qrData = {
      ticketId: ticket._id,
      eventId: ticket.event,
      buyerId: ticket.buyer,
      token: securityToken,
      timestamp: Date.now()
    };
    
    const qr = await qrcode.toDataURL(JSON.stringify(qrData));
    ticket.qrCode = qr;
    ticket.securityToken = securityToken;
    ticket.lastAccessed = new Date();
    await ticket.save();
    
    res.json({ qrCode: qr });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getMyTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ 
      buyer: req.user._id,
      paymentStatus: 'completed'
    }).populate('event');
    
    // Update access tracking
    await Ticket.updateMany(
      { buyer: req.user._id, paymentStatus: 'completed' },
      { 
        $inc: { accessCount: 1 },
        $set: { lastAccessed: new Date() }
      }
    );
    
    res.json(tickets);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.validateTicket = async (req, res) => {
  try {
    const { qrData } = req.body;
    let ticketData;
    
    // Handle both direct ticket ID and QR data formats
    if (req.params.id && req.params.id !== 'scan') {
      // Old format: direct ticket ID
      ticketData = { ticketId: req.params.id };
    } else {
      // New format: QR code data
      if (!qrData) {
        return res.status(400).json({ message: 'QR code data is required' });
      }
      
      try {
        ticketData = JSON.parse(qrData);
      } catch (e) {
        return res.status(400).json({ message: 'Invalid QR code format' });
      }
    }
    
    const ticket = await Ticket.findById(ticketData.ticketId).populate('event').populate('buyer');
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
    if (ticket.scanned) return res.status(400).json({ message: 'Ticket already scanned' });
    
    // Security validations (only if we have the security data)
    if (ticketData.token && ticket.securityToken !== ticketData.token) {
      return res.status(403).json({ message: 'Invalid security token' });
    }
    
    if (ticketData.buyerId && ticket.buyer._id.toString() !== ticketData.buyerId) {
      return res.status(403).json({ message: 'Ticket ownership mismatch' });
    }
    
    if (ticketData.eventId && ticket.event._id.toString() !== ticketData.eventId) {
      return res.status(403).json({ message: 'Event mismatch' });
    }
    
    // Check if QR code is too old (24 hours) - only if timestamp exists
    if (ticketData.timestamp) {
      const qrAge = Date.now() - ticketData.timestamp;
      if (qrAge > 24 * 60 * 60 * 1000) {
        return res.status(403).json({ message: 'QR code expired. Please refresh your ticket.' });
      }
    }
    
    // Update ticket
    ticket.scanned = true;
    ticket.scannedAt = new Date();
    ticket.accessCount += 1;
    ticket.lastAccessed = new Date();
    await ticket.save();

    await User.findByIdAndUpdate(ticket.buyer, { $inc: { xp: 30 } });

    res.json({ 
      message: 'Ticket validated successfully', 
      ticket: {
        _id: ticket._id,
        buyer: ticket.buyer.username,
        tier: ticket.tier,
        event: ticket.event.title,
        scannedAt: ticket.scannedAt
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.downloadTicketPDF = async (req, res) => {
  try {
    const { generateTicketPDF } = require('../utils/pdf');
    const ticket = await Ticket.findById(req.params.id).populate('event');
    if (!ticket || ticket.buyer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const pdfBuffer = await generateTicketPDF(ticket, ticket.event);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=ticket-${ticket._id}.pdf`);
    res.send(pdfBuffer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
