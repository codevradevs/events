const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
  countryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Country', required: true },
  admin1Id: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin1' },
  name: { type: String, required: true },
  lat: { type: Number },
  lon: { type: Number },
  featureClass: { type: String },
  population: { type: Number },
  source: { type: String, default: 'GeoNames' },
  sourceId: { type: String },
  metadata: { type: Object, default: {} }
}, { timestamps: true });

placeSchema.index({ countryId: 1, admin1Id: 1 });
placeSchema.index({ name: 'text' });

module.exports = mongoose.model('Place', placeSchema);