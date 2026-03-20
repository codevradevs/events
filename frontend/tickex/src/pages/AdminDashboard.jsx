import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../App.css';

export default function AdminDashboard() {
  const [events, setEvents] = useState([]);
  const [sortBy, setSortBy] = useState('createdAt');
  const [order, setOrder] = useState('desc');
  const [filter, setFilter] = useState('');
  
  useEffect(() => {
    fetchEvents();
  }, [sortBy, order, filter]);
  
  const fetchEvents = () => {
    const token = localStorage.getItem('token');
    if (token) {
      const params = new URLSearchParams();
      if (sortBy) params.append('sortBy', sortBy);
      if (order) params.append('order', order);
      if (filter) params.append('filter', filter);
      
      axios.get(`http://localhost:5000/api/admin/events?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(r => setEvents(r.data)).catch(console.error);
    }
  };
  
  const verifyEvent = async (id) => {
    const token = localStorage.getItem('token');
    await axios.post(`http://localhost:5000/api/admin/event/${id}/verify`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    window.location.reload();
  };
  
  const banEvent = async (id) => {
    const token = localStorage.getItem('token');
    await axios.post(`http://localhost:5000/api/admin/event/${id}/ban`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    window.location.reload();
  };
  
  const banOrganizer = async (id) => {
    const token = localStorage.getItem('token');
    await axios.post(`http://localhost:5000/api/admin/user/${id}/ban`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Organizer banned');
  };
  
  const deleteEvent = async (id) => {
    const token = localStorage.getItem('token');
    await axios.delete(`http://localhost:5000/api/admin/event/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    window.location.reload();
  };
  
  return (
    <div className="dashboard-container fade-in">
      <div className="dashboard-header">
        <h1>🛡️ Admin Panel</h1>
      </div>
      
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2>📋 Event Management</h2>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              style={{ padding: '0.5rem', background: '#1F1F1F', color: 'white', border: '1px solid #333', borderRadius: '4px' }}
            >
              <option value="">All Events</option>
              <option value="verified">✅ Verified</option>
              <option value="unverified">⏳ Unverified</option>
              <option value="published">📢 Published</option>
              <option value="draft">📝 Draft</option>
              <option value="cancelled">🚫 Cancelled</option>
            </select>
            
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              style={{ padding: '0.5rem', background: '#1F1F1F', color: 'white', border: '1px solid #333', borderRadius: '4px' }}
            >
              <option value="createdAt">📅 Date Created</option>
              <option value="title">📝 Title</option>
              <option value="date">🗓️ Event Date</option>
            </select>
            
            <button 
              onClick={() => setOrder(order === 'desc' ? 'asc' : 'desc')}
              style={{ padding: '0.5rem 1rem', background: '#FF6A00', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              {order === 'desc' ? '⬇️ Desc' : '⬆️ Asc'}
            </button>
          </div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #333' }}>
                <th style={{ padding: '1rem', textAlign: 'left', color: '#FF6A00' }}>Event Details</th>
                <th style={{ padding: '1rem', textAlign: 'left', color: '#FF6A00' }}>Organizer Details</th>
                <th style={{ padding: '1rem', textAlign: 'left', color: '#FF6A00' }}>Event Info</th>
                <th style={{ padding: '1rem', textAlign: 'left', color: '#FF6A00' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map(e => (
                <tr key={e._id} style={{ borderBottom: '1px solid #333' }}>
                  <td style={{ padding: '1rem' }}>
                    <div>
                      <h4>{e.title}</h4>
                      <p style={{ color: '#888', fontSize: '0.8rem', margin: '0.2rem 0' }}>Status: {e.status}</p>
                      <p style={{ color: e.verified ? '#4CAF50' : '#FF6A00', fontSize: '0.8rem' }}>
                        {e.verified ? '✅ Verified' : '⏳ Pending Approval'}
                      </p>
                      <p style={{ color: '#888', fontSize: '0.8rem' }}>Tickets: {e.ticketTiers?.reduce((sum, tier) => sum + (tier.sold || 0), 0) || 0}</p>
                    </div>
                  </td>
                  <td style={{ padding: '1rem', color: '#C7C7C7' }}>
                    <div>
                      <p><strong>{e.organizer?.username}</strong></p>
                      <p style={{ fontSize: '0.8rem', color: '#888' }}>📧 {e.organizer?.email}</p>
                      <p style={{ fontSize: '0.8rem', color: '#888' }}>📱 {e.organizer?.phone}</p>
                      <p style={{ fontSize: '0.8rem', color: '#FF6A00' }}>👤 {e.organizer?.role}</p>
                    </div>
                  </td>
                  <td style={{ padding: '1rem', color: '#C7C7C7' }}>
                    <div>
                      <p>📅 {new Date(e.date).toLocaleDateString()}</p>
                      <p style={{ fontSize: '0.8rem', color: '#888' }}>📍 {e.venue}</p>
                      <p style={{ fontSize: '0.8rem', color: '#888' }}>🌍 {e.locationName}, {e.county}</p>
                    </div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {!e.verified && (
                        <button 
                          className="btn-primary" 
                          onClick={() => verifyEvent(e._id)}
                          style={{ fontSize: '0.8rem', padding: '0.3rem 0.8rem' }}
                        >
                          ✅ Verify
                        </button>
                      )}
                      <button 
                        className="btn-secondary" 
                        onClick={() => banEvent(e._id)}
                        style={{ fontSize: '0.8rem', padding: '0.3rem 0.8rem', backgroundColor: '#ff4444' }}
                      >
                        🚫 Ban Event
                      </button>
                      <button 
                        className="btn-secondary" 
                        onClick={() => window.open(`/admin-event-stats/${e._id}`, '_blank')}
                        style={{ fontSize: '0.8rem', padding: '0.3rem 0.8rem', backgroundColor: '#0066cc' }}
                      >
                        📊 Stats
                      </button>
                      <button 
                        className="btn-secondary" 
                        onClick={() => deleteEvent(e._id)}
                        style={{ fontSize: '0.8rem', padding: '0.3rem 0.8rem', backgroundColor: '#cc0000' }}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
