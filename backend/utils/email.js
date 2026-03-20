const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.sendTicketEmail = async (to, ticket, event) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: `Your ticket for ${event.title}`,
    html: `
      <h1>Ticket Confirmation</h1>
      <p>Event: ${event.title}</p>
      <p>Date: ${new Date(event.date).toLocaleDateString()}</p>
      <p>Venue: ${event.venue}</p>
      <p>Tier: ${ticket.tier}</p>
      <img src="${ticket.qrCode}" alt="QR Code" />
    `
  });
};

exports.sendPaymentConfirmation = async (to, amount, transactionId) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: 'Payment Confirmation',
    html: `
      <h1>Payment Successful</h1>
      <p>Amount: KES ${amount}</p>
      <p>Transaction ID: ${transactionId}</p>
    `
  });
};
