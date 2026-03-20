const mongoose = require('mongoose');

const adSchema = new mongoose.Schema({
  advertiser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  mediaUrl: String,
  link: String,
  placement: { type: String, enum: ['feed', 'sidebar', 'eventPage'] },
  impressions: { type: Number, default: 0 },
  clicks: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
  startDate: Date,
  endDate: Date
}, { timestamps: true });

module.exports = mongoose.model('Ad', adSchema);
