const Ticket = require('../models/Ticket');
const User = require('../models/User');

async function isFraudulentPurchase({ userId, phone, ip, amount, eventId }) {
  const usersWithPhone = await User.countDocuments({ phone });
  if (usersWithPhone > 3) return { fraud: true, reason: 'phone-linked-multiple-accounts' };

  const recent = await Ticket.countDocuments({
    createdAt: { $gt: new Date(Date.now() - 1000 * 60 * 10) },
    buyerIp: ip,
    event: eventId
  });
  if (recent > 5) return { fraud: true, reason: 'high-velocity-ip' };

  const user = await User.findById(userId);
  const accountAgeMs = Date.now() - new Date(user.createdAt).getTime();
  if (accountAgeMs < 1000 * 60 * 60 * 24 * 7 && amount > 30000) {
    return { fraud: true, reason: 'new-account-large-amount' };
  }

  return { fraud: false };
}

module.exports = { isFraudulentPurchase };
