const mongoose = require('mongoose');

const countrySchema = new mongoose.Schema({
  name: { type: String, required: true },
  iso2: { type: String, required: true, unique: true },
  iso3: { type: String },
  geonameId: { type: Number },
  metadata: { type: Object, default: {} }
}, { timestamps: true });

countrySchema.index({ name: 1 });

module.exports = mongoose.model('Country', countrySchema);