const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const { initiateSTKPush } = require('../utils/mpesa');

const subscriptionPrices = { pro: 500, vip: 1000 };

router.post('/upgrade', protect, async (req, res) => {
  const { tier } = req.body;
  const amount = subscriptionPrices[tier];
  
  try {
    const result = await initiateSTKPush(req.user.phone, amount, `SUB-${req.user._id}`);
    res.json({ message: 'STK sent', result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/confirm', async (req, res) => {
  const { userId, tier } = req.body;
  await User.findByIdAndUpdate(userId, {
    subscription: {
      tier,
      expiresAt: new Date(Date.now() + 30 * 86400000)
    }
  });
  res.json({ ok: true });
});

module.exports = router;
