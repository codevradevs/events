const mongoose = require('mongoose');

const platformSettingsSchema = new mongoose.Schema({
  platformFeePercentage: { type: Number, default: 5 }, // 5% default
  fixedServiceFee: { type: Number, default: 50 }, // KES 50 fixed fee
  gatewayFeePercentage: { type: Number, default: 2.5 }, // 2.5% gateway fee
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('PlatformSettings', platformSettingsSchema);