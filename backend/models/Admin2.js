const mongoose = require('mongoose');

const admin2Schema = new mongoose.Schema({
  countryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Country', required: true },
  admin1Id: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin1', required: true },
  name: { type: String, required: true },
  code: { type: String },
  geonameId: { type: Number },
  metadata: { type: Object, default: {} }
}, { timestamps: true });

admin2Schema.index({ admin1Id: 1, name: 1 });

module.exports = mongoose.model('Admin2', admin2Schema);