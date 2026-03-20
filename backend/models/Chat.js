const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
  lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
  type: { type: String, enum: ['direct', 'group'], default: 'direct' }
}, { timestamps: true });

module.exports = mongoose.model('Chat', chatSchema);