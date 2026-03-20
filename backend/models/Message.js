const mongoose = require('mongoose');

const msgSchema = new mongoose.Schema({
  room: { type: String, required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', msgSchema);
