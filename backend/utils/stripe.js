const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.createPaymentIntent = async (amount, currency = 'kes') => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100,
    currency
  });
  return paymentIntent;
};

exports.confirmPayment = async (paymentIntentId) => {
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
  return paymentIntent.status === 'succeeded';
};
