import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OrganizerDashboard = () => {
  const [events, setEvents] = useState([]);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const fetchMyEvents = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const { data } = await axios.get('http://localhost:5000/api/events/organizer/my-events', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEvents(data);
      
      // Auto-refresh analytics for the first event if available
      if (data.length > 0) {
        fetchAnalytics(data[0]._id);
      }
    } catch (error) {
      console.error('Failed to fetch events:', error);
      setEvents([]);
    }
  };

  const fetchAnalytics = async (eventId) => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get(`http://localhost:5000/api/events/${eventId}/analytics`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAnalytics(data.analytics);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    }
  };

  const exportReport = async (eventId) => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get(`http://localhost:5000/api/events/${eventId}/export`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const csv = data.map(row => Object.values(row).join(',')).join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `sales-report-${eventId}.csv`;
      link.click();
    } catch (error) {
      console.error('Failed to export report:', error);
    }
  };

  const [showNotifyModal, setShowNotifyModal] = useState(false);
  const [notificationData, setNotificationData] = useState({ title: '', message: '', eventId: '' });
  
  const openNotifyModal = (eventId) => {
    setNotificationData({ title: '', message: '', eventId });
    setShowNotifyModal(true);
  };
  
  const sendNotification = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/events/${notificationData.eventId}/notify`, {
        title: notificationData.title,
        message: notificationData.message
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowNotifyModal(false);
      setNotificationData({ title: '', message: '', eventId: '' });
    } catch (error) {
      console.error('Failed to send notifications:', error);
    }
  };

  const totalRevenue = events.reduce((sum, event) => {
    return sum + (event.calculatedRevenue || 0);
  }, 0);

  const totalTickets = events.reduce((sum, event) => {
    return sum + event.ticketTiers.reduce((tierSum, tier) => tierSum + tier.sold, 0);
  }, 0);

  return (
    <div className="dashboard-container fade-in">
      <div className="dashboard-header">
        <h1>📊 Organizer Dashboard</h1>
        <a href="/create-event" className="btn-primary">+ Create Event</a>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{events.length}</div>
          <div className="stat-label">Total Events</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{totalTickets}</div>
          <div className="stat-label">Tickets Sold</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">KES {totalRevenue.toLocaleString()}</div>
          <div className="stat-label">Total Revenue</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">KES {(totalRevenue * 0.95).toLocaleString()}</div>
          <div className="stat-label">Your Earnings</div>
        </div>
      </div>

      <div className="card">
        <h2>🎪 My Events</h2>
        {events.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#C7C7C7', padding: '2rem' }}>No events yet. Create your first event!</p>
        ) : (
          <div className="event-grid">
            {events.map(event => (
              <div key={event._id} className="event-card">
                <img src={event.posterUrl} alt={event.title} />
                <div style={{ padding: '1rem' }}>
                  <h3>{event.title}</h3>
                  <p className="text-orange">Status: {event.status}</p>
                  <p>{new Date(event.date).toLocaleDateString()}</p>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                    <button className="btn-secondary" onClick={() => fetchAnalytics(event._id)}>📈 Analytics</button>
                    <button className="btn-secondary" onClick={() => window.open(`/event-analytics/${event._id}`, '_blank')}>💰 Revenue</button>
                    <button className="btn-secondary" onClick={() => exportReport(event._id)}>📊 Export</button>
                    <button className="btn-secondary" onClick={() => openNotifyModal(event._id)}>📢 Notify</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {analytics && (
        <div className="card">
          <h2>📊 Event Analytics</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">KES {analytics.totalRevenue?.toLocaleString()}</div>
              <div className="stat-label">Total Revenue</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">KES {analytics.organizerEarnings?.toLocaleString()}</div>
              <div className="stat-label">Your Earnings</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{analytics.totalSold}</div>
              <div className="stat-label">Tickets Sold</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{analytics.attendeeCount}</div>
              <div className="stat-label">Attendees</div>
            </div>
          </div>
        </div>
      )}
      
      {/* Notification Modal */}
      {showNotifyModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="card" style={{ 
            width: '500px',
            maxWidth: '90vw',
            margin: 0
          }}>
            <h2 style={{ marginBottom: '1rem' }}>📢 Notify Attendees</h2>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ color: '#C7C7C7', marginBottom: '0.5rem', display: 'block' }}>
                Notification Title *
              </label>
              <input
                type="text"
                placeholder="Event Update"
                value={notificationData.title}
                onChange={(e) => setNotificationData({ ...notificationData, title: e.target.value })}
                style={{ width: '100%' }}
              />
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ color: '#C7C7C7', marginBottom: '0.5rem', display: 'block' }}>
                Message *
              </label>
              <textarea
                placeholder="Enter your message to attendees..."
                value={notificationData.message}
                onChange={(e) => setNotificationData({ ...notificationData, message: e.target.value })}
                rows={4}
                style={{ width: '100%' }}
              />
            </div>
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button 
                className="btn-secondary" 
                onClick={() => {
                  setShowNotifyModal(false);
                  setNotificationData({ title: '', message: '', eventId: '' });
                }}
                style={{ flex: 1 }}
              >
                Cancel
              </button>
              <button 
                className="btn-primary" 
                onClick={sendNotification}
                disabled={!notificationData.title.trim() || !notificationData.message.trim()}
                style={{ 
                  flex: 1,
                  opacity: (!notificationData.title.trim() || !notificationData.message.trim()) ? 0.5 : 1
                }}
              >
                Send Notification
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizerDashboard;