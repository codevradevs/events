const mongoose = require('mongoose');
const Event = require('../models/Event');
const Ticket = require('../models/Ticket');
const User = require('../models/User');
const qrcode = require('qrcode');
const crypto = require('crypto');

require('dotenv').config();

const seedTickets = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    const events = await Event.find({ status: 'published' });
    const users = await User.find({ role: 'user' });
    
    for (const event of events) {
      console.log(`Processing ${event.title}...`);
      
      for (const tier of event.ticketTiers) {
        const soldCount = Math.floor(Math.random() * Math.min(tier.quantity * 0.3, 50)) + 1;
        
        for (let i = 0; i < soldCount; i++) {
          const randomUser = users[Math.floor(Math.random() * users.length)];
          
          const securityToken = crypto.randomBytes(32).toString('hex');
          const qrData = {
            ticketId: new mongoose.Types.ObjectId(),
            eventId: event._id,
            buyerId: randomUser._id,
            token: securityToken,
            timestamp: Date.now()
          };
          
          const ticket = new Ticket({
            _id: qrData.ticketId,
            event: event._id,
            buyer: randomUser._id,
            tier: tier.name,
            price: tier.price,
            paymentMethod: 'mpesa',
            paymentStatus: 'completed',
            qrCode: await qrcode.toDataURL(JSON.stringify(qrData)),
            securityToken,
            transactionId: `SEED_${Date.now()}_${i}`,
            purchasedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
          });
          
          await ticket.save();
        }
        
        tier.sold = soldCount;
      }
      
      await event.save();
      console.log(`Added tickets to ${event.title}`);
    }
    
    console.log('Ticket seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

seedTickets();