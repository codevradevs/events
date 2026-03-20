const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Event = require('../models/Event');
const Ticket = require('../models/Ticket');
const Place = require('../models/Place');

// Connect to database with proper options
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

async function cleanupDummyData() {
  try {
    await connectDB();
    console.log('🧹 Starting dummy data cleanup...');
    
    // Delete dummy tickets
    const ticketsDeleted = await Ticket.deleteMany({ merchantRef: /^DUMMY_/ });
    console.log(`   - Deleted ${ticketsDeleted.deletedCount} dummy tickets`);
    
    // Delete dummy events
    const eventsDeleted = await Event.deleteMany({ title: /^Dummy Event/ });
    console.log(`   - Deleted ${eventsDeleted.deletedCount} dummy events`);
    
    // Delete dummy users
    const usersDeleted = await User.deleteMany({ username: /^dummy_/ });
    console.log(`   - Deleted ${usersDeleted.deletedCount} dummy users`);
    
    // Delete dummy places
    const placesDeleted = await Place.deleteMany({ source: 'Dummy' });
    console.log(`   - Deleted ${placesDeleted.deletedCount} dummy places`);
    
    console.log('✅ Dummy data cleanup completed!');
    console.log(`📊 Total records deleted: ${ticketsDeleted.deletedCount + eventsDeleted.deletedCount + usersDeleted.deletedCount + placesDeleted.deletedCount}`);
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error cleaning up dummy data:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

cleanupDummyData();