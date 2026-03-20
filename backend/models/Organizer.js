const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true },
  step: { type: Number, default: 0 },
  data: mongoose.Schema.Types.Mixed,
  verified: { type: Boolean, default: false }
});

module.exports = mongoose.model('Organizer', Schema);
