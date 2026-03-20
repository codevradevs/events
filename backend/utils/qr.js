const QRCode = require('qrcode');

exports.generateQR = async (data) => {
  try {
    return await QRCode.toDataURL(JSON.stringify(data));
  } catch (error) {
    throw new Error('QR generation failed');
  }
};

exports.validateQR = (qrData, ticketData) => {
  try {
    const parsed = JSON.parse(qrData);
    return parsed.ticketId === ticketData._id.toString();
  } catch (error) {
    return false;
  }
};
