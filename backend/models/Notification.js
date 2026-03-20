const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['payment', 'reminder', 'update', 'soldout', 'recommendation'], required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
  read: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
