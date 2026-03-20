const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tier: { type: String, required: true },
  price: { type: Number, required: true },
  qrCode: { type: String, required: true },
  paymentMethod: { type: String, enum: ['mpesa', 'card', 'airtel'], required: true },
  paymentStatus: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  transactionId: { type: String },
  checkoutRequestId: { type: String },
  merchantRef: { type: String },
  securityToken: { type: String },
  lastAccessed: { type: Date },
  accessCount: { type: Number, default: 0 },
  buyerIp: { type: String },
  buyerPhone: { type: String },
  scanned: { type: Boolean, default: false },
  scannedAt: { type: Date },
  purchasedAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Ticket', ticketSchema);
