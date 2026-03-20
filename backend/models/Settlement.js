const mongoose = require('mongoose');

const settlementSchema = new mongoose.Schema({
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  grossAmount: { type: Number, required: true },
  platformFees: { type: Number, required: true },
  gatewayFees: { type: Number, required: true },
  netAmount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  paidAt: Date,
  paymentMethod: String,
  transactionId: String
}, { timestamps: true });

module.exports = mongoose.model('Settlement', settlementSchema);