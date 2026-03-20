import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

export default function PaymentConfirm() {
  const { ticketId } = useParams();
  const [ticket, setTicket] = useState(null);
  
  useEffect(() => {
    axios.get(`http://localhost:5000/api/tickets/${ticketId}`).then(r => setTicket(r.data));
  }, [ticketId]);

  if (!ticket) return <div>Loading...</div>;
  
  return (
    <div>
      <h1>{ticket.paymentStatus === 'completed' ? 'Payment successful' : 'Payment pending'}</h1>
      {ticket.qrCode && <img src={ticket.qrCode} alt="ticket qr" />}
      <p>Event: {ticket.event?.title}</p>
      <p>Amount: KES {ticket.price}</p>
    </div>
  );
}
