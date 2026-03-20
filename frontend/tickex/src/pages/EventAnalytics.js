import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const EventAnalytics = () => {
  const { eventId } = useParams();
  const [analytics, setAnalytics] = useState(null);
  const [event, setEvent] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, [eventId]);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get(`http://localhost:5000/api/events/${eventId}/analytics`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAnalytics(data.analytics);
      setEvent(data.event);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    }
  };

  const fetchEvent = async () => {
    // Event data is now fetched in fetchAnalytics
  };

  if (!analytics || !event) return <div className="dashboard-container">Loading...</div>;

  return (
    <div className="dashboard-container fade-in">
      <div className="dashboard-header">
        <h1>📊 Event Statistics</h1>
        <h2 style={{ color: '#C7C7C7', fontSize: '1.2rem' }}>{event?.title} - {event?.category} at {event?.locationName}</h2>
      </div>

      <div className="stats-grid" style={{ marginBottom: '2rem' }}>
        <div className="stat-card">
          <div className="stat-number">KES {analytics.totalRevenue?.toLocaleString()}</div>
          <div className="stat-label">Total Revenue</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">KES {analytics.commission?.toLocaleString()}</div>
          <div className="stat-label">Platform Fees (5%)</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">KES {analytics.organizerEarnings?.toLocaleString()}</div>
          <div className="stat-label">Your Earnings</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{analytics.totalSold}</div>
          <div className="stat-label">Tickets Sold</div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <h2>🎫 Ticket Breakdown</h2>
        <div style={{ padding: '1rem' }}>
          {event?.ticketTiers?.map((tier, index) => (
            <div key={index} style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              padding: '1rem',
              marginBottom: '0.5rem',
              background: '#1a1a1a',
              borderRadius: '8px',
              border: '1px solid #333'
            }}>
              <div>
                <h3 style={{ color: '#FF6A00', margin: 0 }}>{tier.name}</h3>
                <p style={{ color: '#C7C7C7', margin: '0.25rem 0 0 0', fontSize: '0.9rem' }}>
                  KES {tier.price?.toLocaleString()} each
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: '#4CAF50', fontWeight: 'bold', fontSize: '1.1rem' }}>
                  {tier.sold}/{tier.quantity} sold
                </div>
                <div style={{ color: '#C7C7C7', fontSize: '0.9rem' }}>
                  KES {(tier.sold * tier.price)?.toLocaleString()} revenue
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h2>📊 Revenue Breakdown</h2>
        <div style={{ padding: '2rem' }}>
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span style={{ color: '#C7C7C7' }}>Total Revenue:</span>
              <span style={{ color: '#4CAF50', fontWeight: 'bold' }}>
                KES {analytics.totalRevenue?.toLocaleString()}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span style={{ color: '#C7C7C7' }}>Platform Fees (5%):</span>
              <span style={{ color: '#f44336', fontWeight: 'bold' }}>
                - KES {analytics.commission?.toLocaleString()}
              </span>
            </div>
            <hr style={{ border: '1px solid #333', margin: '1rem 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#FF6A00', fontSize: '1.2rem', fontWeight: 'bold' }}>Your Earnings:</span>
              <span style={{ color: '#FF6A00', fontSize: '1.2rem', fontWeight: 'bold' }}>
                KES {analytics.organizerEarnings?.toLocaleString()}
              </span>
            </div>
          </div>
          
          <div style={{ 
            background: '#1a1a1a', 
            padding: '1rem', 
            borderRadius: '8px',
            border: '1px solid #333'
          }}>
            <h3 style={{ color: '#FF6A00', marginBottom: '0.5rem' }}>💡 Payout Information</h3>
            <p style={{ color: '#C7C7C7', fontSize: '0.9rem', lineHeight: '1.5' }}>
              Your earnings will be processed for payout after the event concludes. 
              Platform fees help maintain the service, payment processing, and customer support.
            </p>
          </div>
        </div>
      </div>

      <div className="card">
        <h2>📈 Event Metrics</h2>
        <div style={{ padding: '1rem' }}>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">{event?.likes?.length || 0}</div>
              <div className="stat-label">Likes</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{event?.comments?.length || 0}</div>
              <div className="stat-label">Comments</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{analytics?.attendeeCount || 0}</div>
              <div className="stat-label">Attendees</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{event?.verified ? 'Verified' : 'Pending'}</div>
              <div className="stat-label">Status</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventAnalytics;