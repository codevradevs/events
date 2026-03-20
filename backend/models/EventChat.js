const mongoose = require('mongoose');

const eventChatSchema = new mongoose.Schema({
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  title: { type: String, required: true },
  participantCount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('EventChat', eventChatSchema);