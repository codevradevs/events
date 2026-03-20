const { createPaymentIntent } = require('../utils/stripe');
const Payment = require('../models/Payment');
const axios = require('axios');

const getAccessToken = async () => {
  const auth = Buffer.from(
    `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
  ).toString('base64');

  const res = await axios.get(
    "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
    { headers: { Authorization: `Basic ${auth}` } }
  );

  return res.data.access_token;
};

exports.stkPush = async (req, res) => {
  try {
    const { phone, amount } = req.body;
    
    // Get access token
    const access_token = await getAccessToken();
    
    // Generate timestamp and password
    const timestamp = new Date().toISOString().replace(/[-:TZ.]/g, '').slice(0, 14);
    const passkey = process.env.MPESA_PASSKEY;
    const business_short_code = process.env.MPESA_SHORTCODE;
    
    const data = business_short_code + passkey + timestamp;
    const password = Buffer.from(data).toString('base64');
    
    // Payload
    const payload = {
      BusinessShortCode: business_short_code,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: "1", // Set to 1 for testing
      PartyA: phone,
      PartyB: business_short_code,
      PhoneNumber: phone,
      CallBackURL: `${process.env.FRONTEND_URL}/api/payments/callback`,
      AccountReference: "TICKEX",
      TransactionDesc: "Event Ticket Payment"
    };
    
    // Headers
    const headers = {
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json'
    };
    
    // Make STK Push request
    const response = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      payload,
      { headers }
    );
    
    console.log('STK Push Response:', response.data);
    
    // Save payment record
    const payment = new Payment({
      phone,
      amount: 1, // Save actual amount as 1
      merchantRequestId: response.data.MerchantRequestID,
      checkoutRequestId: response.data.CheckoutRequestID,
      user: req.user._id
    });
    await payment.save();

    res.json({
      success: true,
      message: "An MPESA Prompt has been sent to Your Phone, Please Check & Complete Payment",
      checkoutRequestId: response.data.CheckoutRequestID
    });
  } catch (error) {
    console.error('STK Push Error:', error.response?.data || error.message);
    res.status(400).json({ message: error.message });
  }
};

exports.mpesaCallback = async (req, res) => {
  try {
    const data = req.body;
    const callback = data.Body.stkCallback;
    const status = callback.ResultCode === 0 ? "success" : "failed";
    const checkoutId = callback.CheckoutRequestID;
    const receipt = callback.CallbackMetadata?.Item?.find(
      item => item.Name === "MpesaReceiptNumber"
    )?.Value;

    await Payment.findOneAndUpdate(
      { checkoutRequestId: checkoutId },
      { 
        status, 
        mpesaReceiptNumber: receipt,
        rawCallback: data 
      }
    );

    res.json({ received: true });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getPaymentStatus = async (req, res) => {
  try {
    const { checkoutId } = req.params;
    const payment = await Payment.findOne({ checkoutRequestId: checkoutId });
    
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.json({
      status: payment.status,
      receipt: payment.mpesaReceiptNumber
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.createStripePayment = async (req, res) => {
  try {
    const { amount } = req.body;
    const paymentIntent = await createPaymentIntent(amount);
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.initiateAirtelPayment = async (req, res) => {
  try {
    const { phone, amount, reference } = req.body;
    res.json({ message: 'Airtel Money integration pending', reference });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
