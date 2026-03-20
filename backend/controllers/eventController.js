const Event = require('../models/Event');
const { getRecommendations } = require('../utils/recommend');

exports.createEvent = async (req, res) => {
  try {
    const eventData = { ...req.body, organizer: req.user._id };
    eventData.slug = req.body.title.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();
    
    // Handle custom category validation
    if (eventData.category === 'Other' && !eventData.customCategory) {
      return res.status(400).json({ message: 'Custom category is required when selecting "Other"' });
    }
    
    // Handle empty location fields
    if (eventData.locationName === '') eventData.locationName = 'TBD';
    if (eventData.county === '') eventData.county = 'TBD';
    if (eventData.country === '') eventData.country = 'Kenya';
    
    console.log('Creating event with cleaned data:', eventData);
    const event = await Event.create(eventData);
    res.status(201).json(event);
  } catch (error) {
    console.error('Event creation error:', error);
    res.status(400).json({ message: error.message });
  }
};

exports.getEvents = async (req, res) => {
  try {
    const { category, location, minPrice, maxPrice, date, search, page = 1, limit = 12 } = req.query;
    const query = { status: 'published' };
    
    if (category) query.category = category;
    if (date) query.date = { $gte: new Date(date) };
    if (search) query.$text = { $search: search };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [events, total] = await Promise.all([
      Event.find(query)
        .sort({ 'featured.boostLevel': -1, trending: -1, date: 1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate('organizer', 'username verified'),
      Event.countDocuments(query)
    ]);

    res.json({ events, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.boostEvent = async (req, res) => {
  try {
    const { level, days } = req.body;
    await Event.findByIdAndUpdate(req.params.id, {
      featured: {
        isFeatured: true,
        boostLevel: level,
        expiresAt: new Date(Date.now() + days * 86400000)
      }
    });
    res.json({ message: 'Event boosted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getTrending = async (req, res) => {
  try {
    const { page = 1, limit = 8 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [events, total] = await Promise.all([
      Event.find({ status: 'published', date: { $gte: new Date() } })
        .sort({ trending: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate('organizer', 'username verified'),
      Event.countDocuments({ status: 'published', date: { $gte: new Date() } })
    ]);
    res.json({ events, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getRecommended = async (req, res) => {
  try {
    if (!req.user) {
      return res.json([]);
    }
    const events = await getRecommendations(req.user);
    res.json(events);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getNearby = async (req, res) => {
  try {
    const { lng, lat, maxDistance = 50000, page = 1, limit = 8 } = req.query;
    const events = await Event.find({
      status: 'published',
      'coordinates.lat': { $exists: true },
      'coordinates.lon': { $exists: true }
    }).populate('organizer', 'username verified');
    
    const filtered = lat && lng ? events.filter(event => {
      if (!event.coordinates?.lat || !event.coordinates?.lon) return false;
      return getDistance(parseFloat(lat), parseFloat(lng), event.coordinates.lat, event.coordinates.lon) <= parseInt(maxDistance);
    }) : events;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const paginated = filtered.slice(skip, skip + parseInt(limit));
    res.json({ events: paginated, total: filtered.length, page: parseInt(page), pages: Math.ceil(filtered.length / parseInt(limit)) });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Helper function to calculate distance between two points
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000; // Earth's radius in meters
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

exports.getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer', 'username verified')
      .populate('comments.user', 'username');
    res.json(event);
  } catch (error) {
    res.status(404).json({ message: 'Event not found' });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    const oldPrices = event.ticketTiers.map(t => ({ name: t.name, price: t.price }));
    
    const updatedEvent = await Event.findOneAndUpdate(
      { _id: req.params.id, organizer: req.user._id },
      req.body,
      { new: true }
    );

    const User = require('../models/User');
    const { createNotification } = require('./notificationController');
    
    for (let i = 0; i < updatedEvent.ticketTiers.length; i++) {
      const oldPrice = oldPrices.find(p => p.name === updatedEvent.ticketTiers[i].name)?.price;
      if (oldPrice && updatedEvent.ticketTiers[i].price < oldPrice) {
        const followers = await User.find({ following: req.user._id });
        for (const follower of followers) {
          await createNotification(
            follower._id,
            'update',
            'Price Drop!',
            `${updatedEvent.title} - ${updatedEvent.ticketTiers[i].name} price reduced to KES ${updatedEvent.ticketTiers[i].price}`,
            updatedEvent._id
          );
        }
      }
    }

    res.json(updatedEvent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    await Event.findOneAndDelete({ _id: req.params.id, organizer: req.user._id });
    res.json({ message: 'Event deleted' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.likeEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (event.likes.includes(req.user._id)) {
      event.likes = event.likes.filter(id => id.toString() !== req.user._id.toString());
    } else {
      event.likes.push(req.user._id);
    }
    await event.save();
    res.json(event);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.commentEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    event.comments.push({ user: req.user._id, text: req.body.text });
    await event.save();
    res.json(event);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getOrganizerEvents = async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.user._id });
    
    // Sync ticket counts and calculate actual revenue
    const Ticket = require('../models/Ticket');
    for (const event of events) {
      const tickets = await Ticket.find({ event: event._id, paymentStatus: 'completed' });
      
      // Count tickets by tier and calculate revenue
      const tierCounts = {};
      const tierRevenue = {};
      tickets.forEach(ticket => {
        tierCounts[ticket.tier] = (tierCounts[ticket.tier] || 0) + 1;
        tierRevenue[ticket.tier] = (tierRevenue[ticket.tier] || 0) + ticket.price;
      });
      
      // Update event ticket tiers with actual sold counts
      let updated = false;
      event.ticketTiers.forEach(tier => {
        const actualSold = tierCounts[tier.name] || 0;
        if (tier.sold !== actualSold) {
          tier.sold = actualSold;
          updated = true;
        }
      });
      
      if (updated) {
        await event.save();
      }
      
      // Add calculated revenue to event object for frontend
      event._doc.calculatedRevenue = Object.values(tierRevenue).reduce((sum, rev) => sum + rev, 0);
    }
    
    res.json(events);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getEventAnalytics = async (req, res) => {
  try {
    const event = await Event.findOne({ _id: req.params.id, organizer: req.user._id });
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const Ticket = require('../models/Ticket');
    const tickets = await Ticket.find({ event: req.params.id, paymentStatus: 'completed' });
    
    // Calculate actual revenue from completed tickets
    const totalRevenue = tickets.reduce((sum, ticket) => sum + ticket.price, 0);
    const totalSold = tickets.length;
    const commission = totalRevenue * 0.05;
    const organizerEarnings = totalRevenue - commission;
    
    // Update event ticket tiers with actual sold counts
    const tierCounts = {};
    tickets.forEach(ticket => {
      tierCounts[ticket.tier] = (tierCounts[ticket.tier] || 0) + 1;
    });
    
    // Update the event's ticketTiers sold counts
    event.ticketTiers.forEach(tier => {
      tier.sold = tierCounts[tier.name] || 0;
    });
    await event.save();
    
    res.json({
      event,
      analytics: {
        totalRevenue,
        totalSold,
        attendeeCount: totalSold,
        tierBreakdown: event.ticketTiers,
        commission,
        organizerEarnings
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.notifyAttendees = async (req, res) => {
  try {
    const event = await Event.findOne({ _id: req.params.id, organizer: req.user._id }).populate('attendees');
    const { title, message } = req.body;
    const { createNotification } = require('./notificationController');
    
    for (const attendee of event.attendees) {
      await createNotification(attendee._id, 'update', title, message, event._id);
    }
    
    res.json({ message: 'Notifications sent' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.exportSalesReport = async (req, res) => {
  try {
    const event = await Event.findOne({ _id: req.params.id, organizer: req.user._id });
    const Ticket = require('../models/Ticket');
    const tickets = await Ticket.find({ event: event._id }).populate('buyer', 'username email');
    
    const csvData = tickets.map(t => ({
      buyer: t.buyer.username,
      email: t.buyer.email,
      tier: t.tier,
      price: t.price,
      date: t.createdAt,
      scanned: t.scanned
    }));
    
    res.json(csvData);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getPublicOrganizerEvents = async (req, res) => {
  try {
    const events = await Event.find({ 
      organizer: req.params.organizerId, 
      status: 'published' 
    }).populate('organizer', 'username verified');
    res.json(events);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getEventComments = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('comments.user', 'username');
    res.json(event.comments);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
