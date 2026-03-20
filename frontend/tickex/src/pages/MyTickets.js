import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get('http://localhost:5000/api/tickets/my-tickets', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTickets(data);
    } catch (error) {
      console.error('Failed to fetch tickets:', error);
    }
  };
  
  const refreshQR = async (ticketId) => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.post(`http://localhost:5000/api/tickets/refresh-qr/${ticketId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update the ticket in state with new QR code
      setTickets(tickets.map(ticket => 
        ticket._id === ticketId 
          ? { ...ticket, qrCode: data.qrCode }
          : ticket
      ));
    } catch (error) {
      console.error('Failed to refresh QR:', error);
    }
  };

  const downloadPDF = async (ticketId) => {
    const response = await axios.get(`http://localhost:5000/api/tickets/${ticketId}/pdf`, {
      responseType: 'blob'
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ticket-${ticketId}.pdf`);
    document.body.appendChild(link);
    link.click();
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return '#FF6A00';
      case 'pending': return '#C7C7C7';
      case 'failed': return '#FF4444';
      default: return '#C7C7C7';
    }
  };

  return (
    <div className="dashboard-container fade-in">
      <div className="dashboard-header">
        <h1>🎫 My Tickets</h1>
        <p style={{ color: '#C7C7C7' }}>Total: {tickets.length} tickets</p>
      </div>

      {tickets.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎫</div>
          <h2>No tickets yet</h2>
          <p style={{ color: '#C7C7C7', marginBottom: '2rem' }}>Start exploring events and book your first ticket!</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/" className="btn-primary">Discover Events</a>
            <a href="/features" className="btn-secondary">View Features</a>
          </div>
        </div>
      ) : (
        <div className="event-grid">
          {tickets.map(ticket => (
            <div key={ticket._id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: '1.5rem', borderBottom: '1px solid #1F1F1F' }}>
                <h3 style={{ marginBottom: '0.5rem' }}>{ticket.event?.title}</h3>
                <p style={{ color: '#C7C7C7', marginBottom: '1rem' }}>{ticket.event?.venue}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span className="text-orange" style={{ fontWeight: '600' }}>{ticket.tier}</span>
                  <span style={{ color: getStatusColor(ticket.paymentStatus), fontWeight: '600' }}>
                    {ticket.paymentStatus.toUpperCase()}
                  </span>
                </div>
                <p style={{ fontSize: '1.2rem', fontWeight: '600' }}>KES {ticket.price.toLocaleString()}</p>
              </div>
              
              {ticket.qrCode && (
                <div style={{ padding: '1.5rem', textAlign: 'center', background: '#0D0D0D' }}>
                  <img src={ticket.qrCode} alt="QR Code" style={{ width: '150px', height: '150px', marginBottom: '1rem' }} />
                  <p style={{ color: '#C7C7C7', fontSize: '0.8rem', marginBottom: '0.5rem' }}>Show this QR code at the venue</p>
                  <p style={{ color: '#888', fontSize: '0.7rem', marginBottom: '1rem' }}>
                    🔒 Secure QR • Expires in 24hrs
                  </p>
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button 
                      className="btn-secondary" 
                      onClick={() => refreshQR(ticket._id)}
                      style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}
                    >
                      🔄 Refresh
                    </button>
                    <button 
                      className="btn-secondary" 
                      onClick={() => downloadPDF(ticket._id)}
                      style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}
                    >
                      📄 PDF
                    </button>
                    <button 
                      className="btn-secondary" 
                      onClick={() => {
                        if (navigator.share) {
                          navigator.share({
                            title: `My ticket for ${ticket.event?.title}`,
                            text: `I'm going to ${ticket.event?.title}!`,
                            url: `${window.location.origin}/event/${ticket.event?._id}`
                          });
                        } else {
                          navigator.clipboard.writeText(`${window.location.origin}/event/${ticket.event?._id}`);
                          alert('Event link copied!');
                        }
                      }}
                      style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}
                    >
                      📤 Share
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTickets;