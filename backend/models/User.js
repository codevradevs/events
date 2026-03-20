const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  role: { type: String, enum: ['user', 'organizer', 'admin'], default: 'user' },
  preferences: {
    categories: [String],
    location: { type: String }
  },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] }
  },
  purchasedTickets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ticket' }],
  savedEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  verified: { type: Boolean, default: false },
  xp: { type: Number, default: 0 },
  rank: { type: String, default: 'Rookie' },
  notificationPreferences: {
    email: { type: Boolean, default: true },
    push: { type: Boolean, default: true },
    sms: { type: Boolean, default: false }
  },
  subscription: {
    tier: { type: String, enum: ['free', 'pro', 'vip'], default: 'free' },
    expiresAt: Date
  },
  age: Number,
  gender: String
}, { timestamps: true });

userSchema.index({ location: '2dsphere' }, { sparse: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.updateRank = function() {
  if (this.xp >= 1000) this.rank = 'Legend';
  else if (this.xp >= 500) this.rank = 'Veteran';
  else if (this.xp >= 200) this.rank = 'Pro';
  else if (this.xp >= 50) this.rank = 'Explorer';
  else this.rank = 'Rookie';
};

userSchema.pre('save', function(next) {
  if (this.isModified('xp')) this.updateRank();
  next();
});

module.exports = mongoose.model('User', userSchema);
