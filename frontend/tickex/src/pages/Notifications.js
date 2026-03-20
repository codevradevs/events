import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    const { data } = await axios.get('http://localhost:5000/api/notifications');
    setNotifications(data);
  };

  const markAsRead = async (id) => {
    await axios.put(`http://localhost:5000/api/notifications/${id}/read`);
    fetchNotifications();
  };

  const getNotificationIcon = (type) => {
    switch(type) {
      case 'payment': return '💳';
      case 'reminder': return '⏰';
      case 'update': return '📢';
      case 'soldout': return '🔥';
      case 'recommendation': return '✨';
      default: return '📱';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="dashboard-container fade-in">
      <div className="dashboard-header">
        <h1>🔔 Notifications</h1>
        <div className="text-orange">{unreadCount} unread</div>
      </div>

      {notifications.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔔</div>
          <h2>No notifications yet</h2>
          <p style={{ color: '#C7C7C7' }}>We'll notify you about important updates</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {notifications.map(notif => (
            <div key={notif._id} className={`notification ${notif.read ? '' : 'unread'}`}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ fontSize: '1.5rem' }}>{getNotificationIcon(notif.type)}</div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ marginBottom: '0.5rem', color: notif.read ? '#C7C7C7' : '#FFFFFF' }}>{notif.title}</h3>
                  <p style={{ color: '#C7C7C7', marginBottom: '0.5rem' }}>{notif.message}</p>
                  <p style={{ fontSize: '0.8rem', color: '#666' }}>
                    {new Date(notif.createdAt).toLocaleDateString()} at {new Date(notif.createdAt).toLocaleTimeString()}
                  </p>
                </div>
                {!notif.read && (
                  <button className="btn-secondary" onClick={() => markAsRead(notif._id)}>Mark Read</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
