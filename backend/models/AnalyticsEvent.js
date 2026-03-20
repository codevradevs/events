const mongoose = require('mongoose');

const analyticsEventSchema = new mongoose.Schema({
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  action: { type: String, enum: ['view', 'click', 'purchase'] },
  gender: String,
  age: Number,
  location: String,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AnalyticsEvent', analyticsEventSchema);
