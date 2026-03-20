import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import EventCard from '../components/EventCard';
import './Home.css';

const Home = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [trending, setTrending] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [nearby, setNearby] = useState([]);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('trending');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllEvents();
  }, []);

  const fetchAllEvents = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchTrending(),
        fetchRecommended(),
        fetchNearby()
      ]);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrending = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/events/trending');
      setTrending(data);
    } catch (error) {
      console.error('Failed to fetch trending events:', error);
      setTrending([]);
    }
  };

  const fetchRecommended = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/events/recommended');
      setRecommended(data);
    } catch (error) {
      setRecommended([]);
    }
  };

  const fetchNearby = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/events/nearby');
      setNearby(data);
    } catch (error) {
      setNearby([]);
    }
  };

  const handleSearch = async () => {
    if (!search.trim()) {
      fetchTrending();
      return;
    }
    try {
      const { data } = await axios.get(`http://localhost:5000/api/events?search=${search}`);
      setTrending(data);
      setActiveTab('trending');
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const getCurrentEvents = () => {
    switch(activeTab) {
      case 'trending': return trending;
      case 'recommended': return recommended;
      case 'nearby': return nearby;
      default: return trending;
    }
  };

  const getTabTitle = () => {
    switch(activeTab) {
      case 'trending': return '🔥 Trending Now';
      case 'recommended': return '✨ Recommended For You';
      case 'nearby': return '📍 Events Near You';
      default: return '🔥 Trending Now';
    }
  };

  if (loading) {
    return (
      <div className="home-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
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

  return (
    <div className="home-container">
      <div className="hero-section" style={{ 
        background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
        padding: '4rem 2rem',
        textAlign: 'center',
        marginBottom: '3rem'
      }}>
        <h1 style={{ 
          fontSize: '4rem', 
          marginBottom: '1rem',
          background: 'linear-gradient(45deg, #FF6A00, #FF8A00)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 'bold'
        }}>TICKEX</h1>
        <p style={{ fontSize: '1.5rem', color: '#C7C7C7', marginBottom: '2rem' }}>
          Discover Amazing Events • Book Instantly • Experience More
        </p>
        
        <div className="search-container" style={{ 
          display: 'flex', 
          gap: '1rem', 
          maxWidth: '700px', 
          margin: '0 auto 2rem',
          background: '#1a1a1a',
          padding: '0.5rem',
          borderRadius: '50px',
          border: '2px solid #333'
        }}>
          <input
            type="text"
            placeholder="🔍 Search events, artists, venues..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyPress={handleKeyPress}
            style={{ 
              flex: 1,
              background: 'transparent',
              border: 'none',
              padding: '1rem 1.5rem',
              fontSize: '1.1rem',
              color: '#fff',
              outline: 'none'
            }}
          />
          <button 
            className="btn-primary" 
            onClick={handleSearch}
            style={{ 
              borderRadius: '50px',
              padding: '1rem 2rem',
              fontSize: '1.1rem'
            }}
          >
            Search
          </button>
        </div>

        {/* Quick Actions */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          {user ? (
            <>
              <button 
                className="btn-secondary" 
                onClick={() => navigate('/my-tickets')}
                style={{ borderRadius: '25px', padding: '0.8rem 1.5rem' }}
              >
                🎫 My Tickets
              </button>
              <button 
                className="btn-secondary" 
                onClick={() => navigate('/profile')}
                style={{ borderRadius: '25px', padding: '0.8rem 1.5rem' }}
              >
                👤 Profile ({user.rank || 'User'})
              </button>
              <button 
                className="btn-secondary" 
                onClick={() => navigate('/user-dashboard')}
                style={{ borderRadius: '25px', padding: '0.8rem 1.5rem' }}
              >
                📊 Dashboard
              </button>
              {user.role === 'organizer' && (
                <button 
                  className="btn-secondary" 
                  onClick={() => navigate('/create-event')}
                  style={{ borderRadius: '25px', padding: '0.8rem 1.5rem' }}
                >
                  ➕ Create Event
                </button>
              )}
            </>
          ) : (
            <>
              <button 
                className="btn-secondary" 
                onClick={() => navigate('/login')}
                style={{ borderRadius: '25px', padding: '0.8rem 1.5rem' }}
              >
                🔐 Login
              </button>
              <button 
                className="btn-primary" 
                onClick={() => navigate('/register')}
                style={{ borderRadius: '25px', padding: '0.8rem 1.5rem' }}
              >
                🚀 Join TICKEX
              </button>
              <button 
                className="btn-secondary" 
                onClick={() => navigate('/features')}
                style={{ borderRadius: '25px', padding: '0.8rem 1.5rem' }}
              >
                🌟 View Features
              </button>
            </>
          )}
        </div>
      </div>
      
      <div style={{ padding: '0 2rem' }}>
        {/* Feature Highlights */}
        <section className="fade-in" style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '2rem' }}>🌟 Platform Features</h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '1.5rem',
            marginBottom: '3rem'
          }}>
            <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎫</div>
              <h3>QR E-Tickets</h3>
              <p style={{ color: '#C7C7C7' }}>Secure digital tickets with QR codes for easy venue entry</p>
            </div>
            <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💳</div>
              <h3>M-Pesa Payments</h3>
              <p style={{ color: '#C7C7C7' }}>Pay instantly with M-Pesa, Airtel Money, or Card</p>
            </div>
            <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📍</div>
              <h3>Location-Based</h3>
              <p style={{ color: '#C7C7C7' }}>Find events near you with smart location search</p>
            </div>
            <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
              <h3>Analytics Dashboard</h3>
              <p style={{ color: '#C7C7C7' }}>Real-time sales tracking for event organizers</p>
            </div>
          </div>
        </section>

        {/* Event Tabs */}
        <section className="fade-in">
          <div style={{ 
            display: 'flex', 
            gap: '1rem', 
            marginBottom: '2rem',
            borderBottom: '1px solid #333',
            paddingBottom: '1rem'
          }}>
            <button 
              className={activeTab === 'trending' ? 'btn-primary' : 'btn-secondary'}
              onClick={() => setActiveTab('trending')}
              style={{ borderRadius: '25px', padding: '0.8rem 1.5rem' }}
            >
              🔥 Trending ({trending.length})
            </button>
            {user && recommended.length > 0 && (
              <button 
                className={activeTab === 'recommended' ? 'btn-primary' : 'btn-secondary'}
                onClick={() => setActiveTab('recommended')}
                style={{ borderRadius: '25px', padding: '0.8rem 1.5rem' }}
              >
                ✨ For You ({recommended.length})
              </button>
            )}
            {nearby.length > 0 && (
              <button 
                className={activeTab === 'nearby' ? 'btn-primary' : 'btn-secondary'}
                onClick={() => setActiveTab('nearby')}
                style={{ borderRadius: '25px', padding: '0.8rem 1.5rem' }}
              >
                📍 Nearby ({nearby.length})
              </button>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '2.5rem', margin: 0 }}>{getTabTitle()}</h2>
            {activeTab === 'trending' && (
              <div style={{ 
                background: 'linear-gradient(45deg, #FF6A00, #FF8A00)',
                padding: '0.3rem 1rem',
                borderRadius: '20px',
                fontSize: '0.9rem',
                fontWeight: 'bold'
              }}>
                HOT
              </div>
            )}
          </div>

          {getCurrentEvents().length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎪</div>
              <h3>No events found</h3>
              <p style={{ color: '#C7C7C7' }}>Check back later for new events!</p>
            </div>
          ) : (
            <div className="modern-event-grid">
              {getCurrentEvents().map(event => <EventCard key={event._id} event={event} />)}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Home;
