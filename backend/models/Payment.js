const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  phone: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['initiated', 'success', 'failed'], 
    default: 'initiated' 
  },
  merchantRequestId: String,
  checkoutRequestId: String,
  mpesaReceiptNumber: String,
  rawCallback: Object,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
  tier: String
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);