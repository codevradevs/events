const Event = require('../models/Event');

exports.getRecommendations = async (user) => {
  const interests = user.preferences?.categories || [];
  const userLocation = user.location?.coordinates;

  const query = {
    status: 'published',
    date: { $gte: new Date() }
  };

  if (interests.length > 0) {
    query.category = { $in: interests };
  }

  let events = await Event.find(query)
    .populate('organizer', 'username verified')
    .sort({ trending: -1, date: 1 })
    .limit(20);

  if (userLocation) {
    events = await Event.find({
      ...query,
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates: userLocation },
          $maxDistance: 50000
        }
      }
    }).populate('organizer', 'username verified').limit(20);
  }

  return events;
};
