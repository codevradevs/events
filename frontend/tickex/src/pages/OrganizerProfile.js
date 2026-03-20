import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import EventCard from '../components/EventCard';

const OrganizerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [organizer, setOrganizer] = useState(null);
  const [events, setEvents] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrganizerProfile();
  }, [id]);

  const fetchOrganizerProfile = async () => {
    try {
      const [profileRes, eventsRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/users/organizer/${id}`),
        axios.get(`http://localhost:5000/api/events/organizer/${id}/public`)
      ]);
      
      setOrganizer(profileRes.data);
      setEvents(eventsRes.data);
      
      if (user) {
        setIsFollowing(user.following?.includes(id) || false);
      }
    } catch (error) {
      console.error('Failed to fetch organizer profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/users/follow/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error('Failed to follow/unfollow:', error);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!organizer) {
    return (
      <div className="dashboard-container">
        <div className="card text-center p-2xl">
          <h2>Organizer not found</h2>
          <button className="btn-primary mt-md" onClick={() => navigate('/')}>
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container fade-in">
      {/* Profile Header */}
      <div className="card mb-xl">
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-lg)' }}>
          <div style={{ 
            width: '100px', 
            height: '100px', 
            borderRadius: '50%', 
            background: 'var(--primary-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 'var(--font-3xl)',
            color: 'var(--bg-primary)'
          }}>
            {organizer.username.charAt(0).toUpperCase()}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-sm)' }}>
              <h1 className="mb-0">{organizer.username}</h1>
              {organizer.verified && (
                <div style={{
                  background: 'var(--primary-color)',
                  color: 'var(--bg-primary)',
                  padding: 'var(--spacing-xs) var(--spacing-sm)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--font-xs)',
                  fontWeight: '600'
                }}>
                  ✓ VERIFIED
                </div>
              )}
            </div>
            <p className="text-muted mb-md">{organizer.email}</p>
            <div style={{ display: 'flex', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-md)' }}>
              <div>
                <div className="font-bold text-lg">{events.length}</div>
                <div className="text-muted text-sm">Events</div>
              </div>
              <div>
                <div className="font-bold text-lg">{organizer.followers?.length || 0}</div>
                <div className="text-muted text-sm">Followers</div>
              </div>
              <div>
                <div className="font-bold text-lg">{organizer.totalTicketsSold || 0}</div>
                <div className="text-muted text-sm">Tickets Sold</div>
              </div>
            </div>
            {user && user._id !== id && (
              <button
                className={isFollowing ? 'btn-secondary' : 'btn-primary'}
                onClick={handleFollow}
              >
                {isFollowing ? '✓ Following' : '+ Follow'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Events */}
      <div>
        <h2 className="mb-lg">🎪 Events by {organizer.username}</h2>
        {events.length === 0 ? (
          <div className="card text-center p-2xl">
            <div className="text-4xl mb-md">🎪</div>
            <h3>No events yet</h3>
            <p className="text-muted">This organizer hasn't created any events yet</p>
          </div>
        ) : (
          <div className="modern-event-grid">
            {events.map(event => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizerProfile;