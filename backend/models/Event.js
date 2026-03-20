const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  customCategory: { type: String, required: false },
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  venue: { type: String, required: true },
  locationName: { type: String, required: false },
  county: { type: String, required: false },
  country: { type: String, required: false, default: 'Kenya' },
  countryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Country', required: false },
  admin1Id: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin1', required: false },
  admin2Id: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin2', required: false },
  placeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Place', required: false },
  coordinates: {
    lat: { type: Number, required: false },
    lon: { type: Number, required: false }
  },
  ticketTiers: [{
    name: String,
    price: Number,
    quantity: Number,
    sold: { type: Number, default: 0 }
  }],
  posterUrl: { type: String },
  specialGuests: { type: String },
  mediaUrls: [String],
  status: { type: String, enum: ['draft', 'published', 'cancelled'], default: 'draft' },
  verified: { type: Boolean, default: false },
  attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    text: String,
    createdAt: { type: Date, default: Date.now }
  }],
  trending: { type: Number, default: 0 },
  slug: { type: String, unique: true },
  featured: {
    isFeatured: { type: Boolean, default: false },
    boostLevel: { type: Number, default: 0 },
    expiresAt: Date
  }
}, { timestamps: true });

eventSchema.index({ 'coordinates.lat': 1, 'coordinates.lon': 1 });
eventSchema.index({ countryId: 1, admin1Id: 1 });
eventSchema.index({ date: 1, category: 1 });
eventSchema.index({ title: 'text', description: 'text' });

// Virtual to get display category
eventSchema.virtual('displayCategory').get(function() {
  return this.category === 'Other' ? this.customCategory : this.category;
});

module.exports = mongoose.model('Event', eventSchema);
