import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [savedEvents, setSavedEvents] = useState([]);

  useEffect(() => {
    fetchSavedEvents();
  }, []);

  const fetchSavedEvents = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found');
        return;
      }
      const { data } = await axios.get('http://localhost:5000/api/users/saved-events', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSavedEvents(data);
    } catch (error) {
      console.error('Failed to fetch saved events:', error);
      setSavedEvents([]);
    }
  };

  const getRankProgress = (xp) => {
    const ranks = { Rookie: 50, Explorer: 200, Pro: 500, Veteran: 1000, Legend: 2000 };
    const currentRank = user?.rank || 'Rookie';
    const nextRankXP = ranks[currentRank] || 2000;
    return Math.min((xp / nextRankXP) * 100, 100);
  };

  return (
    <div className="profile-container fade-in">
      <div className="profile-header">
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>👤</div>
        <h1>{user?.username}</h1>
        <p style={{ color: '#C7C7C7', marginBottom: '1rem' }}>{user?.email}</p>
        <div className="rank-badge">{user?.rank || 'Rookie'}</div>
        <div style={{ margin: '1rem 0' }}>
          <p style={{ color: '#C7C7C7', marginBottom: '0.5rem' }}>XP: {user?.xp || 0}</p>
          <div className="xp-bar">
            <div className="xp-progress" style={{ width: `${getRankProgress(user?.xp || 0)}%` }}></div>
          </div>
        </div>
        <p style={{ color: '#C7C7C7' }}>Role: <span className="text-orange">{user?.role}</span></p>
      </div>

      <div className="card">
        <h2>💾 Saved Events ({savedEvents.length})</h2>
        {savedEvents.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#C7C7C7', padding: '2rem' }}>No saved events yet</p>
        ) : (
          <div className="event-grid">
            {savedEvents.map(event => (
              <div key={event._id} className="event-card">
                <img src={event.posterUrl} alt={event.title} />
                <div style={{ padding: '1rem' }}>
                  <h3>{event.title}</h3>
                  <p>{new Date(event.date).toLocaleDateString()}</p>
                  <p style={{ color: '#C7C7C7' }}>{event.venue}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card">
        <h2>🎯 Account Stats</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">{user?.purchasedTickets?.length || 0}</div>
            <div className="stat-label">Tickets Purchased</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{savedEvents.length}</div>
            <div className="stat-label">Events Saved</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{user?.following?.length || 0}</div>
            <div className="stat-label">Following</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{user?.xp || 0}</div>
            <div className="stat-label">Total XP</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;