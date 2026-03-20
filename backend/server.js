require('dotenv').config();
console.log('Environment loaded. MONGO_URI exists:', !!process.env.MONGO_URI);
const express = require('express');
const cors = require('cors');
const http = require('http');
const connectDB = require('./config/db');
const setupSocket = require('./socket');

const userRoutes = require('./routes/userRoutes');
const eventRoutes = require('./routes/eventRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const mpesaRoutes = require('./routes/mpesaRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const venueRoutes = require('./routes/venueRoutes');
const adminRoutes = require('./routes/adminRoutes');
const feedRoutes = require('./routes/feedRoutes');
const organizerRoutes = require('./routes/organizerRoutes');
const locationRoutes = require('./routes/locationRoutes');
const { startCronJobs } = require('./utils/cron');

const app = express();
const server = http.createServer(app);
const io = setupSocket(server);

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/mpesa', mpesaRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/venues', venueRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/feed', feedRoutes);
app.use('/api/organizer', organizerRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/ads', require('./routes/adsRoutes'));
app.use('/api/subscriptions', require('./routes/subscriptionRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));
app.use('/uploads', express.static('uploads'));

startCronJobs();

app.set('io', io);

app.post('/api/payments/mpesa/callback', express.raw({ type: 'application/json' }), async (req, res) => {
  const Ticket = require('./models/Ticket');
  const qrcode = require('qrcode');
  const { Body } = req.body;
  const merchantRef = Body?.stkCallback?.CheckoutRequestID;
  const resultCode = Body?.stkCallback?.ResultCode;
  const ticket = await Ticket.findOne({ merchantRef });
  if (!ticket) return res.status(404).end();

  if (resultCode === 0) {
    ticket.paymentStatus = 'completed';
    ticket.purchasedAt = new Date();
    const qr = await qrcode.toDataURL(`${ticket._id}:${ticket.event}`);
    ticket.qrCode = qr;
    await ticket.save();
    io.to(`user_${ticket.buyer}`).emit('ticket_confirmed', { ticketId: ticket._id });
    res.json({ status: 'ok' });
  } else {
    ticket.paymentStatus = 'failed';
    await ticket.save();
    res.json({ status: 'failed' });
  }
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Socket.IO server ready for real-time features`);
});
