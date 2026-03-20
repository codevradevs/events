const PDFDocument = require('pdfkit');

exports.generateTicketPDF = (ticket, event) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const chunks = [];

    doc.on('data', chunk => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    doc.fontSize(20).text('TICKEX - Event Ticket', { align: 'center' });
    doc.moveDown();
    doc.fontSize(16).text(event.title);
    doc.fontSize(12).text(`Date: ${new Date(event.date).toLocaleDateString()}`);
    doc.text(`Venue: ${event.venue}`);
    doc.text(`Tier: ${ticket.tier}`);
    doc.text(`Price: KES ${ticket.price}`);
    doc.moveDown();
    doc.image(ticket.qrCode, { fit: [200, 200], align: 'center' });
    doc.text(`Ticket ID: ${ticket._id}`, { align: 'center' });

    doc.end();
  });
};
