const mongoose = require('mongoose');

const organizerVerificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  phone: { type: String, required: true },
  phoneVerified: { type: Boolean, default: false },
  kraPin: { type: String },
  idDocument: { type: String },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  verifiedAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('OrganizerVerification', organizerVerificationSchema);
