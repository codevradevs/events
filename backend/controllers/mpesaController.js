const { initiateSTKPush } = require('../utils/mpesa');
const Ticket = require('../models/Ticket');

exports.initiateMpesaPayment = async (req, res) => {
  try {
    const { phone, amount, ticketId } = req.body;
    const result = await initiateSTKPush(phone, amount, ticketId);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.mpesaCallback = async (req, res) => {
  try {
    const { Body } = req.body;
    const { stkCallback } = Body;
    
    if (stkCallback.ResultCode === 0) {
      const ticketId = stkCallback.CallbackMetadata.Item.find(i => i.Name === 'AccountReference').Value;
      const transactionId = stkCallback.CallbackMetadata.Item.find(i => i.Name === 'MpesaReceiptNumber').Value;
      
      await Ticket.findByIdAndUpdate(ticketId, {
        paymentStatus: 'completed',
        transactionId
      });
    } else {
      const ticketId = stkCallback.CheckoutRequestID;
      await Ticket.findByIdAndUpdate(ticketId, { paymentStatus: 'failed' });
    }

    res.json({ ResultCode: 0, ResultDesc: 'Success' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
