const mongoose = require('mongoose');

const admin1Schema = new mongoose.Schema({
  countryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Country', required: true },
  name: { type: String, required: true },
  code: { type: String },
  level: { type: Number, default: 1 },
  geonameId: { type: Number },
  metadata: { type: Object, default: {} }
}, { timestamps: true });

admin1Schema.index({ countryId: 1, name: 1 });

module.exports = mongoose.model('Admin1', admin1Schema);