import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const AdminEventStats = () => {
  const { eventId } = useParams();
  const [stats, setStats] = useState(null);
  const [event, setEvent] = useState(null);

  useEffect(() => {
    fetchEventStats();
  }, [eventId]);

  const fetchEventStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const [statsResponse, eventResponse] = await Promise.all([
        axios.get(`http://localhost:5000/api/admin/event-stats/${eventId}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`http://localhost:5000/api/events/${eventId}`)
      ]);
      
      setStats(statsResponse.data);
      setEvent(eventResponse.data);
    } catch (error) {
      console.error('Failed to fetch event stats:', error);
      try {
        const token = localStorage.getItem('token');
        const eventResponse = await axios.get(`http://localhost:5000/api/events/${eventId}`);
        if (eventResponse?.data) {
          const event = eventResponse.data;
          const totalRevenue = event.ticketTiers?.reduce((sum, tier) => sum + ((tier.sold || 0) * tier.price), 0) || 0;
          const platformEarnings = totalRevenue * 0.05;
          const organizerEarnings = totalRevenue - platformEarnings;
          
          setStats({
            totalRevenue,
            platformEarnings,
            organizerEarnings,
            ticketsSold: event.ticketTiers?.reduce((sum, tier) => sum + (tier.sold || 0), 0) || 0,
            platformFeePercentage: 5
          });
          setEvent(event);
        }
      } catch (fallbackError) {
        console.error('Fallback fetch also failed:', fallbackError);
      }
    }
  };

  if (!stats || !event) return <div className="dashboard-container">Loading...</div>;

  return (
    <div className="dashboard-container fade-in">
      <div className="dashboard-header">
        <h1>📊 Event Statistics</h1>
        <h2 style={{ color: '#C7C7C7', fontSize: '1.2rem' }}>{event.title}</h2>
      </div>

      <div className="stats-grid" style={{ marginBottom: '2rem' }}>
        <div className="stat-card">
          <div className="stat-number">KES {stats.totalRevenue?.toLocaleString()}</div>
          <div className="stat-label">Total Revenue</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">KES {stats.platformEarnings?.toLocaleString()}</div>
          <div className="stat-label">Platform Earnings</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">KES {stats.organizerEarnings?.toLocaleString()}</div>
          <div className="stat-label">Organizer Earnings</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.ticketsSold}</div>
          <div className="stat-label">Tickets Sold</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div className="card">
          <h2>🎫 Ticket Breakdown</h2>
          {event.ticketTiers.map(tier => (
            <div key={tier.name} style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              padding: '0.5rem 0',
              borderBottom: '1px solid #333'
            }}>
              <span>{tier.name}</span>
              <span style={{ color: '#FF6A00' }}>
                {tier.sold}/{tier.quantity} sold
              </span>
            </div>
          ))}
        </div>

        <div className="card">
          <h2>📈 Event Metrics</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Likes:</span>
              <span style={{ color: '#FF6A00' }}>{event.likes?.length || 0}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Comments:</span>
              <span style={{ color: '#FF6A00' }}>{event.comments?.length || 0}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Attendees:</span>
              <span style={{ color: '#FF6A00' }}>{event.attendees?.length || 0}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Status:</span>
              <span style={{ color: event.verified ? '#4CAF50' : '#f44336' }}>
                {event.verified ? 'Verified' : 'Pending'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: '2rem' }}>
        <h2>💰 Revenue Analysis</h2>
        <div style={{ padding: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span>Gross Revenue:</span>
            <span style={{ color: '#4CAF50', fontWeight: 'bold' }}>
              KES {stats.totalRevenue?.toLocaleString()}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span>Platform Fee ({stats.platformFeePercentage}%):</span>
            <span style={{ color: '#f44336', fontWeight: 'bold' }}>
              - KES {stats.platformEarnings?.toLocaleString()}
            </span>
          </div>
          <hr style={{ border: '1px solid #333', margin: '1rem 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Organizer Payout:</span>
            <span style={{ color: '#FF6A00', fontSize: '1.2rem', fontWeight: 'bold' }}>
              KES {stats.organizerEarnings?.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminEventStats;