const cron = require('node-cron');
const Event = require('../models/Event');
const Ticket = require('../models/Ticket');
const { createNotification } = require('../controllers/notificationController');
const { sendEmail } = require('./email');

exports.startCronJobs = () => {
  cron.schedule('0 */6 * * *', async () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const upcomingEvents = await Event.find({
      date: { $gte: new Date(), $lte: tomorrow }
    });

    for (const event of upcomingEvents) {
      const tickets = await Ticket.find({ event: event._id }).populate('buyer');
      
      for (const ticket of tickets) {
        await createNotification(
          ticket.buyer._id,
          'reminder',
          'Event Reminder',
          `${event.title} is happening tomorrow!`,
          event._id
        );
      }
    }
  });

  cron.schedule('0 * * * *', async () => {
    const events = await Event.find({ status: 'published' });
    
    for (const event of events) {
      for (const tier of event.ticketTiers) {
        const remaining = tier.quantity - tier.sold;
        if (remaining > 0 && remaining <= tier.quantity * 0.1) {
          const followers = await User.find({ following: event.organizer });
          
          for (const follower of followers) {
            await createNotification(
              follower._id,
              'soldout',
              'Almost Sold Out!',
              `${tier.name} tickets for ${event.title} are almost sold out!`,
              event._id
            );
          }
        }
      }
    }
  });

  cron.schedule('0 0 * * *', async () => {
    await Event.updateMany(
      { 'featured.expiresAt': { $lt: new Date() } },
      { $set: { 'featured.isFeatured': false, 'featured.boostLevel': 0 } }
    );

    await User.updateMany(
      { 'subscription.expiresAt': { $lt: new Date() } },
      { $set: { 'subscription.tier': 'free' } }
    );
  });
};
