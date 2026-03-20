const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { username, email, password, phone, role, adminSecret } = req.body;
    console.log('Registration attempt:', { username, email, phone, role });
    
    if (!username || !email || !password || !phone) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    if (role === 'admin') {
      if (!adminSecret || adminSecret !== process.env.ADMIN_SECRET_KEY) {
        return res.status(403).json({ message: 'Invalid admin secret key' });
      }
    }
    
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    const user = await User.create({ username, email, password, phone, role: role || 'user' });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    res.status(201).json({ token, user: { id: user._id, username, email, role: user.role, rank: user.rank, xp: user.xp } });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    res.json({ token, user: { id: user._id, username: user.username, email, role: user.role, rank: user.rank, xp: user.xp } });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getProfile = async (req, res) => {
  res.json(req.user);
};

exports.updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select('-password');
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.saveEvent = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user.savedEvents.includes(req.params.eventId)) {
      user.savedEvents.push(req.params.eventId);
      await user.save();
    }
    res.json({ message: 'Event saved' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.followOrganizer = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user.following.includes(req.params.organizerId)) {
      user.following = user.following.filter(id => id.toString() !== req.params.organizerId);
    } else {
      user.following.push(req.params.organizerId);
    }
    await user.save();
    res.json({ message: 'Updated' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getSavedEvents = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('savedEvents');
    res.json(user.savedEvents);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getOrganizerProfile = async (req, res) => {
  try {
    const organizer = await User.findById(req.params.id).select('-password');
    res.json(organizer);
  } catch (error) {
    res.status(404).json({ message: 'Organizer not found' });
  }
};

exports.getFollowing = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('following', 'username verified');
    res.json(user.following);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { settings: req.body },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);
    
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }
    
    user.password = newPassword;
    await user.save();
    
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
