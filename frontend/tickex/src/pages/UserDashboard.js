import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const UserDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [savedEvents, setSavedEvents] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [recentEvents, setRecentEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchDashboardData();
  }, [user, navigate]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const [ticketsRes, savedRes, notificationsRes, eventsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/tickets/my-tickets', { headers }),
        axios.get('http://localhost:5000/api/users/saved-events', { headers }),
        axios.get('http://localhost:5000/api/notifications', { headers }),
        axios.get('http://localhost:5000/api/events/trending')
      ]);

      setTickets(ticketsRes.data);
      setSavedEvents(savedRes.data);
      setNotifications(notificationsRes.data.slice(0, 5));
      setRecentEvents(eventsRes.data.slice(0, 4));
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUpcomingEvents = () => {
    return tickets
      .filter(ticket => {
        const eventDate = new Date(ticket.event?.date);
        return eventDate > new Date() && ticket.paymentStatus === 'completed';
      })
      .sort((a, b) => new Date(a.event.date) - new Date(b.event.date))
      .slice(0, 3);
  };

  const getRecentActivity = () => {
    const activities = [];
    
    tickets.forEach(ticket => {
      activities.push({
        type: 'ticket',
        title: `Purchased ticket for ${ticket.event?.title}`,
        date: ticket.createdAt,
        icon: '🎫',
        action: () => navigate('/my-tickets')
      });
    });

    savedEvents.forEach(event => {
      activities.push({
        type: 'save',
        title: `Saved ${event.title}`,
        date: event.createdAt,
        icon: '💾',
        action: () => navigate(`/event/${event._id}`)
      });
    });

    return activities
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
  };

  if (loading) {
    return (
      <div className="dashboard-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="loading-spinner" style={{
          width: '50px',
          height: '50px',
          border: '4px solid #333',
          borderTop: '4px solid #FF6A00',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
      </div>
    );
  }

  const upcomingEvents = getUpcomingEvents();
  const recentActivity = getRecentActivity();
  const totalSpent = tickets.filter(t => t.paymentStatus === 'completed').reduce((sum, t) => sum + t.price, 0);
  const unreadNotifications = notifications.filter(n => !n.read).length;

  return (
    <div className="dashboard-container fade-in">
      <div className="dashboard-header">
        <div>
          <h1>👋 Welcome back, {user.username}!</h1>
          <p style={{ color: '#C7C7C7' }}>Here's what's happening with your events</p>
        </div>
        <div className="rank-badge" style={{ fontSize: '1rem' }}>
          {user.rank || 'Rookie'} • {user.xp || 0} XP
        </div>
      </div>

      {/* Quick Stats */}
      <div className="stats-grid" style={{ marginBottom: '2rem' }}>
        <div className="stat-card" onClick={() => navigate('/my-tickets')} style={{ cursor: 'pointer' }}>
          <div className="stat-number">{tickets.length}</div>
          <div className="stat-label">Total Tickets</div>
        </div>
        <div className="stat-card" onClick={() => navigate('/profile')} style={{ cursor: 'pointer' }}>
          <div className="stat-number">{savedEvents.length}</div>
          <div className="stat-label">Saved Events</div>
        </div>
        <div className="stat-card" onClick={() => navigate('/notifications')} style={{ cursor: 'pointer' }}>
          <div className="stat-number">{unreadNotifications}</div>
          <div className="stat-label">New Notifications</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">KES {totalSpent.toLocaleString()}</div>
          <div className="stat-label">Total Spent</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        {/* Main Content */}
        <div>
          {/* Upcoming Events */}
          {upcomingEvents.length > 0 && (
            <div className="card" style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2>🎪 Upcoming Events</h2>
                <button className="btn-secondary" onClick={() => navigate('/my-tickets')}>
                  View All
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {upcomingEvents.map(ticket => (
                  <div 
                    key={ticket._id} 
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '1rem',
                      padding: '1rem',
                      background: '#0d0d0d',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                    onClick={() => navigate(`/event/${ticket.event._id}`)}
                  >
                    <img 
                      src={ticket.event.posterUrl} 
                      alt={ticket.event.title}
                      style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }}
                    />
                    <div style={{ flex: 1 }}>
                      <h4 style={{ marginBottom: '0.3rem' }}>{ticket.event.title}</h4>
                      <p style={{ color: '#FF6A00', fontSize: '0.9rem', marginBottom: '0.2rem' }}>
                        {new Date(ticket.event.date).toLocaleDateString()} • {ticket.event.time}
                      </p>
                      <p style={{ color: '#C7C7C7', fontSize: '0.8rem' }}>
                        {ticket.tier} • {ticket.event.venue}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ 
                        background: '#FF6A00', 
                        color: '#000', 
                        padding: '0.3rem 0.8rem', 
                        borderRadius: '15px',
                        fontSize: '0.8rem',
                        fontWeight: 'bold'
                      }}>
                        {Math.ceil((new Date(ticket.event.date) - new Date()) / (1000 * 60 * 60 * 24))} days
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommended Events */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2>✨ Recommended for You</h2>
              <button className="btn-secondary" onClick={() => navigate('/')}>
                Explore More
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              {recentEvents.map(event => (
                <div 
                  key={event._id}
                  style={{ 
                    cursor: 'pointer',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    background: '#0d0d0d'
                  }}
                  onClick={() => navigate(`/event/${event._id}`)}
                >
                  <img 
                    src={event.posterUrl} 
                    alt={event.title}
                    style={{ width: '100%', height: '120px', objectFit: 'cover' }}
                  />
                  <div style={{ padding: '1rem' }}>
                    <h4 style={{ marginBottom: '0.5rem', fontSize: '0.9rem' }}>{event.title}</h4>
                    <p style={{ color: '#FF6A00', fontSize: '0.8rem' }}>
                      {new Date(event.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div>
          {/* Quick Actions */}
          <div className="card" style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>🚀 Quick Actions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <button 
                className="btn-primary" 
                onClick={() => navigate('/')}
                style={{ width: '100%', justifyContent: 'center' }}
              >
                🔍 Discover Events
              </button>
              <button 
                className="btn-secondary" 
                onClick={() => navigate('/my-tickets')}
                style={{ width: '100%', justifyContent: 'center' }}
              >
                🎫 My Tickets
              </button>
              <button 
                className="btn-secondary" 
                onClick={() => navigate('/profile')}
                style={{ width: '100%', justifyContent: 'center' }}
              >
                👤 Edit Profile
              </button>
              {user.role === 'organizer' && (
                <button 
                  className="btn-secondary" 
                  onClick={() => navigate('/create-event')}
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  ➕ Create Event
                </button>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          {recentActivity.length > 0 && (
            <div className="card" style={{ marginBottom: '2rem' }}>
              <h3 style={{ marginBottom: '1rem' }}>📈 Recent Activity</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {recentActivity.map((activity, index) => (
                  <div 
                    key={index}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.8rem',
                      padding: '0.8rem',
                      background: '#0d0d0d',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                    onClick={activity.action}
                  >
                    <div style={{ fontSize: '1.2rem' }}>{activity.icon}</div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '0.9rem', marginBottom: '0.2rem' }}>{activity.title}</p>
                      <p style={{ fontSize: '0.7rem', color: '#888' }}>
                        {new Date(activity.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Latest Notifications */}
          {notifications.length > 0 && (
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3>🔔 Notifications</h3>
                <button className="btn-secondary" onClick={() => navigate('/notifications')}>
                  View All
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {notifications.map(notif => (
                  <div 
                    key={notif._id}
                    style={{ 
                      padding: '0.8rem',
                      background: notif.read ? '#0d0d0d' : 'rgba(255, 106, 0, 0.1)',
                      borderRadius: '6px',
                      borderLeft: notif.read ? 'none' : '3px solid #FF6A00'
                    }}
                  >
                    <p style={{ fontSize: '0.9rem', marginBottom: '0.3rem' }}>{notif.title}</p>
                    <p style={{ fontSize: '0.7rem', color: '#888' }}>
                      {new Date(notif.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;