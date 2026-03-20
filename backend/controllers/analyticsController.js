const Payment = require('../models/Payment');
const PlatformSettings = require('../models/PlatformSettings');
const Event = require('../models/Event');

exports.getTransactionAnalytics = async (req, res) => {
  try {
    const settings = await PlatformSettings.findOne() || { platformFeePercentage: 5 };
    
    const successfulPayments = await Payment.find({ status: 'success' })
      .populate('event', 'title')
      .populate('user', 'username');
    
    const totalRevenue = successfulPayments.reduce((sum, payment) => sum + payment.amount, 0);
    const platformEarnings = totalRevenue * (settings.platformFeePercentage / 100);
    const organizerEarnings = totalRevenue - platformEarnings;
    
    const recentTransactions = successfulPayments
      .slice(-20)
      .map(payment => ({
        _id: payment._id,
        event: payment.event,
        organizer: payment.user,
        amount: payment.amount,
        status: payment.status,
        createdAt: payment.createdAt
      }));

    res.json({
      totalRevenue,
      platformEarnings,
      organizerEarnings,
      totalTransactions: successfulPayments.length,
      recentTransactions
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getPlatformSettings = async (req, res) => {
  try {
    const settings = await PlatformSettings.findOne() || {
      platformFeePercentage: 5,
      fixedServiceFee: 50,
      gatewayFeePercentage: 2.5
    };
    res.json(settings);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updatePlatformSettings = async (req, res) => {
  try {
    const { platformFeePercentage, fixedServiceFee, gatewayFeePercentage } = req.body;
    
    let settings = await PlatformSettings.findOne();
    if (!settings) {
      settings = new PlatformSettings();
    }
    
    settings.platformFeePercentage = platformFeePercentage;
    settings.fixedServiceFee = fixedServiceFee;
    settings.gatewayFeePercentage = gatewayFeePercentage;
    settings.updatedBy = req.user._id;
    
    await settings.save();
    res.json(settings);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getOrganizerAnalytics = async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findById(eventId);
    
    if (!event || event.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const settings = await PlatformSettings.findOne() || { platformFeePercentage: 5 };
    const payments = await Payment.find({ event: eventId, status: 'success' });
    
    const grossRevenue = payments.reduce((sum, payment) => sum + payment.amount, 0);
    const platformFees = grossRevenue * (settings.platformFeePercentage / 100);
    const netRevenue = grossRevenue - platformFees;
    
    res.json({
      grossRevenue,
      platformFees,
      netRevenue,
      ticketsSold: payments.length,
      platformFeePercentage: settings.platformFeePercentage
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};