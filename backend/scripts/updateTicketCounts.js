const mongoose = require('mongoose');
require('dotenv').config();

const Event = require('../models/Event');
const Ticket = require('../models/Ticket');

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/tickex', {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000
    });
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
}

async function updateTicketCounts() {
  try {
    await connectDB();
    console.log('🔄 Updating ticket counts for all events...');
    
    const events = await Event.find();
    let updatedCount = 0;
    
    for (const event of events) {
      // Get all completed tickets for this event
      const tickets = await Ticket.find({ 
        event: event._id, 
        paymentStatus: 'completed' 
      });
      
      // Count tickets by tier
      const tierCounts = {};
      tickets.forEach(ticket => {
        tierCounts[ticket.tier] = (tierCounts[ticket.tier] || 0) + 1;
      });
      
      // Update event ticket tiers with sold counts
      let hasChanges = false;
      event.ticketTiers.forEach(tier => {
        const soldCount = tierCounts[tier.name] || 0;
        if (tier.sold !== soldCount) {
          tier.sold = soldCount;
          hasChanges = true;
        }
      });
      
      if (hasChanges) {
        await event.save();
        updatedCount++;
        console.log(`   - Updated ${event.title}: ${Object.values(tierCounts).reduce((a, b) => a + b, 0)} tickets sold`);
      }
    }
    
    console.log('✅ Ticket count update completed!');
    console.log(`📊 Updated ${updatedCount} events`);
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating ticket counts:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

updateTicketCounts();