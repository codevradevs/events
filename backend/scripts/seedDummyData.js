const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Event = require('../models/Event');
const Ticket = require('../models/Ticket');
const Country = require('../models/Country');
const Admin1 = require('../models/Admin1');
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

// Dummy data arrays
const categories = ['Music', 'Sports', 'Technology', 'Business', 'Arts', 'Food', 'Comedy', 'Education', 'Health', 'Fashion'];
const venues = ['KICC', 'Carnivore', 'Uhuru Gardens', 'Kasarani Stadium', 'Nyayo Stadium', 'Safari Park Hotel', 'Villa Rosa Kempinski', 'Radisson Blu', 'Panari Hotel', 'Two Rivers Mall'];
const counties = ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika', 'Machakos', 'Meru', 'Nyeri', 'Kakamega'];
const firstNames = ['John', 'Mary', 'Peter', 'Grace', 'David', 'Sarah', 'Michael', 'Faith', 'James', 'Lucy', 'Daniel', 'Ruth', 'Samuel', 'Joy', 'Joseph'];
const lastNames = ['Kamau', 'Wanjiku', 'Mwangi', 'Njeri', 'Kiprotich', 'Achieng', 'Maina', 'Wambui', 'Ochieng', 'Nyong\'o', 'Kipchoge', 'Wairimu'];

const generatePhone = () => `+2547${Math.floor(10000000 + Math.random() * 90000000)}`;
const generateEmail = (name) => `${name.toLowerCase().replace(' ', '.')}${Math.floor(Math.random() * 10000)}@dummy.com`;
const randomDate = (start, end) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
const randomCoordinates = () => ({
  lat: -1.2921 + (Math.random() - 0.5) * 2,
  lon: 36.8219 + (Math.random() - 0.5) * 2
});

async function seedCountries() {
  console.log('Seeding countries...');
  const countries = [
    { name: 'Kenya', iso2: 'KE', iso3: 'KEN', geonameId: 192950 },
    { name: 'Uganda', iso2: 'UG', iso3: 'UGA', geonameId: 226074 },
    { name: 'Tanzania', iso2: 'TZ', iso3: 'TZA', geonameId: 149590 }
  ];
  
  for (const country of countries) {
    await Country.findOneAndUpdate(
      { iso2: country.iso2 },
      country,
      { upsert: true, new: true }
    );
  }
  return await Country.find();
}

async function seedAdmin1(countries) {
  console.log('Seeding admin1 (counties)...');
  const kenya = countries.find(c => c.iso2 === 'KE');
  const admin1Data = counties.map((county, index) => ({
    countryId: kenya._id,
    name: county,
    code: `KE-${index + 1}`,
    level: 1,
    geonameId: 184745 + index
  }));
  
  for (const admin of admin1Data) {
    await Admin1.findOneAndUpdate(
      { countryId: admin.countryId, name: admin.name },
      admin,
      { upsert: true, new: true }
    );
  }
  return await Admin1.find();
}

async function seedPlaces(countries, admin1s) {
  console.log('Seeding places...');
  const kenya = countries.find(c => c.iso2 === 'KE');
  const places = [];
  
  for (let i = 0; i < 100; i++) {
    const coords = randomCoordinates();
    const admin1 = admin1s[Math.floor(Math.random() * admin1s.length)];
    
    places.push({
      countryId: kenya._id,
      admin1Id: admin1._id,
      name: `Place ${i + 1}`,
      lat: coords.lat,
      lon: coords.lon,
      featureClass: 'P',
      population: Math.floor(Math.random() * 100000),
      source: 'Dummy',
      sourceId: `dummy_${i + 1}`
    });
  }
  
  await Place.insertMany(places);
  return await Place.find();
}

async function seedUsers() {
  console.log('Seeding users...');
  const existingCount = await User.countDocuments();
  const batchSize = 500;
  const totalUsers = 5000;
  const createdUsers = [];
  
  for (let batch = 0; batch < Math.ceil(totalUsers / batchSize); batch++) {
    const users = [];
    const start = batch * batchSize;
    const end = Math.min(start + batchSize, totalUsers);
    
    for (let i = start; i < end; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const fullName = `${firstName} ${lastName}`;
      const coords = randomCoordinates();
      
      users.push({
        username: `dummy_${fullName.replace(' ', '_').toLowerCase()}_${existingCount + i + 1}`,
        email: generateEmail(`${fullName}_${existingCount + i + 1}`),
        password: 'password123',
        phone: generatePhone(),
        role: Math.random() > 0.7 ? 'organizer' : 'user',
        preferences: {
          categories: categories.slice(0, Math.floor(Math.random() * 3) + 1),
          location: counties[Math.floor(Math.random() * counties.length)]
        },
        location: {
          type: 'Point',
          coordinates: [coords.lon, coords.lat]
        },
        verified: Math.random() > 0.3,
        xp: Math.floor(Math.random() * 1200),
        subscription: {
          tier: ['free', 'pro', 'vip'][Math.floor(Math.random() * 3)]
        },
        age: Math.floor(Math.random() * 50) + 18,
        gender: ['Male', 'Female'][Math.floor(Math.random() * 2)]
      });
    }
    
    const batchResult = await User.insertMany(users, { ordered: false });
    createdUsers.push(...batchResult);
    console.log(`   - Created batch ${batch + 1}/${Math.ceil(totalUsers / batchSize)} (${users.length} users)`);
  }
  
  return createdUsers;
}

async function seedEvents(users, countries, admin1s, places) {
  console.log('Seeding events...');
  const organizers = users.filter(u => u.role === 'organizer');
  const kenya = countries.find(c => c.iso2 === 'KE');
  const batchSize = 300;
  const totalEvents = 3000;
  const createdEvents = [];
  
  for (let batch = 0; batch < Math.ceil(totalEvents / batchSize); batch++) {
    const events = [];
    const start = batch * batchSize;
    const end = Math.min(start + batchSize, totalEvents);
    
    for (let i = start; i < end; i++) {
      const organizer = organizers[Math.floor(Math.random() * organizers.length)];
      const category = categories[Math.floor(Math.random() * categories.length)];
      const venue = venues[Math.floor(Math.random() * venues.length)];
      const county = counties[Math.floor(Math.random() * counties.length)];
      const admin1 = admin1s.find(a => a.name === county);
      const place = places[Math.floor(Math.random() * places.length)];
      const coords = randomCoordinates();
      const eventDate = randomDate(new Date(), new Date(Date.now() + 365 * 24 * 60 * 60 * 1000));
      
      const ticketTiers = [
        { name: 'Regular', price: Math.floor(Math.random() * 2000) + 500, quantity: Math.floor(Math.random() * 200) + 50 },
        { name: 'VIP', price: Math.floor(Math.random() * 5000) + 2000, quantity: Math.floor(Math.random() * 50) + 20 }
      ];
      
      events.push({
        title: `Dummy Event ${i + 1} - ${category} at ${venue}`,
        description: `This is a dummy ${category.toLowerCase()} event featuring amazing performances and experiences. Join us for an unforgettable time at ${venue}.`,
        category,
        organizer: organizer._id,
        date: eventDate,
        time: `${Math.floor(Math.random() * 12) + 6}:${Math.random() > 0.5 ? '00' : '30'} ${Math.random() > 0.5 ? 'PM' : 'AM'}`,
        venue,
        locationName: venue,
        county,
        country: 'Kenya',
        countryId: kenya._id,
        admin1Id: admin1._id,
        placeId: place._id,
        coordinates: coords,
        ticketTiers,
        posterUrl: `https://picsum.photos/400/600?random=${i}`,
        specialGuests: Math.random() > 0.5 ? 'Special Guest Artist' : '',
        status: ['draft', 'published'][Math.floor(Math.random() * 2)],
        verified: Math.random() > 0.2,
        trending: Math.floor(Math.random() * 1000),
        slug: `dummy-event-${i + 1}-${Date.now()}`,
        featured: {
          isFeatured: Math.random() > 0.8,
          boostLevel: Math.floor(Math.random() * 5),
          expiresAt: Math.random() > 0.5 ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : null
        }
      });
    }
    
    const batchResult = await Event.insertMany(events, { ordered: false });
    createdEvents.push(...batchResult);
    console.log(`   - Created batch ${batch + 1}/${Math.ceil(totalEvents / batchSize)} (${events.length} events)`);
  }
  
  return createdEvents;
}

async function seedTickets(users, events) {
  console.log('Seeding tickets...');
  const regularUsers = users.filter(u => u.role === 'user');
  const batchSize = 800;
  const totalTickets = 8000;
  
  for (let batch = 0; batch < Math.ceil(totalTickets / batchSize); batch++) {
    const tickets = [];
    const start = batch * batchSize;
    const end = Math.min(start + batchSize, totalTickets);
    
    for (let i = start; i < end; i++) {
      const user = regularUsers[Math.floor(Math.random() * regularUsers.length)];
      const event = events[Math.floor(Math.random() * events.length)];
      const tier = event.ticketTiers[Math.floor(Math.random() * event.ticketTiers.length)];
      const paymentMethods = ['mpesa', 'card', 'airtel'];
      const paymentStatuses = ['pending', 'completed', 'failed'];
      const paymentStatus = paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)];
      
      tickets.push({
        event: event._id,
        buyer: user._id,
        tier: tier.name,
        price: tier.price,
        qrCode: `data:image/png;base64,dummy_qr_${i + 1}`,
        paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
        paymentStatus,
        transactionId: paymentStatus === 'completed' ? `TXN${Date.now()}${i}` : null,
        checkoutRequestId: `ws_CO_${Date.now()}${i}`,
        merchantRef: `DUMMY_${i + 1}`,
        securityToken: `SEC_${Math.random().toString(36).substring(7)}`,
        lastAccessed: Math.random() > 0.5 ? new Date() : null,
        accessCount: Math.floor(Math.random() * 10),
        buyerIp: `192.168.1.${Math.floor(Math.random() * 255)}`,
        buyerPhone: user.phone,
        scanned: Math.random() > 0.7,
        scannedAt: Math.random() > 0.7 ? randomDate(event.date, new Date()) : null,
        purchasedAt: randomDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), new Date())
      });
    }
    
    await Ticket.insertMany(tickets, { ordered: false });
    console.log(`   - Created batch ${batch + 1}/${Math.ceil(totalTickets / batchSize)} (${tickets.length} tickets)`);
  }
}

async function updateUserRelations(users, events, tickets) {
  console.log('Updating user relations...');
  
  for (const user of users) {
    // Add purchased tickets
    const userTickets = tickets.filter(t => t.buyer.toString() === user._id.toString());
    user.purchasedTickets = userTickets.map(t => t._id);
    
    // Add saved events (random selection)
    const savedEvents = events.slice(0, Math.floor(Math.random() * 10)).map(e => e._id);
    user.savedEvents = savedEvents;
    
    // Add following (random users)
    const following = users.slice(0, Math.floor(Math.random() * 20)).map(u => u._id);
    user.following = following;
    
    await user.save();
  }
}

async function updateEventRelations(events, users, tickets) {
  console.log('Updating event relations...');
  
  for (const event of events) {
    // Add attendees from tickets
    const eventTickets = tickets.filter(t => t.event.toString() === event._id.toString());
    event.attendees = eventTickets.map(t => t.buyer);
    
    // Add likes (random users)
    const likes = users.slice(0, Math.floor(Math.random() * 100)).map(u => u._id);
    event.likes = likes;
    
    // Add comments
    const comments = [];
    for (let i = 0; i < Math.floor(Math.random() * 20); i++) {
      const user = users[Math.floor(Math.random() * users.length)];
      comments.push({
        user: user._id,
        text: `This is a dummy comment ${i + 1} for this event!`,
        createdAt: randomDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), new Date())
      });
    }
    event.comments = comments;
    
    // Update ticket sales
    event.ticketTiers.forEach(tier => {
      const tierTickets = eventTickets.filter(t => t.tier === tier.name);
      tier.sold = tierTickets.length;
    });
    
    await event.save();
  }
}

async function main() {
  try {
    await connectDB();
    console.log('🚀 Starting dummy data seeding...');
    
    const countries = await seedCountries();
    const admin1s = await seedAdmin1(countries);
    const places = await seedPlaces(countries, admin1s);
    const users = await seedUsers();
    const events = await seedEvents(users, countries, admin1s, places);
    
    await seedTickets(users, events);
    const allTickets = await Ticket.find({ merchantRef: /^DUMMY_/ });
    
    console.log('Updating relationships...');
    await updateUserRelations(users, events, allTickets);
    await updateEventRelations(events, users, allTickets);
    
    console.log('✅ Dummy data seeding completed!');
    console.log(`📊 Summary:`);
    console.log(`   - Users: ${users.length}`);
    console.log(`   - Events: ${events.length}`);
    console.log(`   - Tickets: ${allTickets.length}`);
    console.log(`   - Countries: ${countries.length}`);
    console.log(`   - Admin1s: ${admin1s.length}`);
    console.log(`   - Places: ${places.length}`);
    console.log(`   - Total records: ${users.length + events.length + allTickets.length + countries.length + admin1s.length + places.length}`);
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

main();