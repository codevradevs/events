import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Features = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const userFeatures = [
    {
      icon: '🔍',
      title: 'Event Discovery',
      description: 'Find trending, recommended, and nearby events with smart search',
      features: ['Trending events', 'Personalized recommendations', 'Location-based search', 'Category filtering'],
      action: () => navigate('/')
    },
    {
      icon: '🎫',
      title: 'QR E-Tickets',
      description: 'Secure digital tickets with QR codes for seamless venue entry',
      features: ['Digital QR tickets', 'PDF downloads', 'Secure validation', 'Auto-refresh codes'],
      action: () => navigate('/my-tickets')
    },
    {
      icon: '💳',
      title: 'Multiple Payment Options',
      description: 'Pay securely with M-Pesa, Airtel Money, or international cards',
      features: ['M-Pesa integration', 'Airtel Money', 'Stripe payments', 'Real-time processing'],
      action: () => navigate('/register')
    },
    {
      icon: '📍',
      title: 'Location Services',
      description: 'Find events near you with interactive maps and directions',
      features: ['GPS location', 'Interactive maps', 'Venue directions', 'Distance calculation'],
      action: () => navigate('/')
    },
    {
      icon: '💾',
      title: 'Save & Manage',
      description: 'Save favorite events and manage your ticket collection',
      features: ['Save events', 'Ticket history', 'Event reminders', 'Profile management'],
      action: () => navigate('/profile')
    },
    {
      icon: '🔔',
      title: 'Smart Notifications',
      description: 'Get notified about event updates, reminders, and recommendations',
      features: ['Event updates', 'Payment confirmations', 'Event reminders', 'Personalized alerts'],
      action: () => navigate('/notifications')
    }
  ];

  const organizerFeatures = [
    {
      icon: '🎪',
      title: 'Event Creation',
      description: 'Create and manage events with rich media and detailed information',
      features: ['Event builder', 'Image uploads', 'Ticket tiers', 'Venue mapping'],
      action: () => navigate('/create-event')
    },
    {
      icon: '📊',
      title: 'Analytics Dashboard',
      description: 'Real-time insights into ticket sales, revenue, and attendee data',
      features: ['Sales analytics', 'Revenue tracking', 'Attendee insights', 'Export reports'],
      action: () => navigate('/dashboard')
    },
    {
      icon: '📱',
      title: 'QR Scanner',
      description: 'Validate tickets at the venue with built-in QR code scanner',
      features: ['QR validation', 'Attendance tracking', 'Real-time updates', 'Offline support'],
      action: () => navigate('/scanner')
    },
    {
      icon: '📢',
      title: 'Attendee Communication',
      description: 'Send notifications and updates directly to ticket holders',
      features: ['Push notifications', 'Event updates', 'Emergency alerts', 'Targeted messaging'],
      action: () => navigate('/dashboard')
    },
    {
      icon: '💰',
      title: 'Revenue Management',
      description: 'Track earnings, manage payouts, and view financial analytics',
      features: ['Revenue tracking', 'Payout management', 'Financial reports', 'Tax documentation'],
      action: () => navigate('/payout')
    },
    {
      icon: '🎯',
      title: 'Event Promotion',
      description: 'Boost event visibility with featured listings and promotions',
      features: ['Featured events', 'Promotional tools', 'Social sharing', 'Marketing analytics'],
      action: () => navigate('/subscription')
    }
  ];

  const adminFeatures = [
    {
      icon: '⚙️',
      title: 'Platform Management',
      description: 'Comprehensive admin panel for platform oversight and control',
      features: ['User management', 'Event moderation', 'System settings', 'Content control'],
      action: () => navigate('/admin')
    },
    {
      icon: '📈',
      title: 'Platform Analytics',
      description: 'Deep insights into platform performance and user behavior',
      features: ['User analytics', 'Revenue insights', 'Performance metrics', 'Growth tracking'],
      action: () => navigate('/admin')
    },
    {
      icon: '🛡️',
      title: 'Security & Compliance',
      description: 'Advanced security features and compliance monitoring',
      features: ['Fraud detection', 'Security monitoring', 'Compliance tracking', 'Risk assessment'],
      action: () => navigate('/admin')
    }
  ];

  const FeatureCard = ({ feature, available = true }) => (
    <div 
      className="card" 
      style={{ 
        padding: '2rem',
        cursor: available ? 'pointer' : 'default',
        opacity: available ? 1 : 0.6,
        transition: 'all 0.3s ease'
      }}
      onClick={available ? feature.action : undefined}
      onMouseEnter={(e) => {
        if (available) {
          e.target.style.transform = 'translateY(-5px)';
          e.target.style.boxShadow = '0 10px 25px rgba(255, 106, 0, 0.2)';
        }
      }}
      onMouseLeave={(e) => {
        if (available) {
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = '0 8px 25px rgba(255, 106, 0, 0.1)';
        }
      }}
    >
      <div style={{ fontSize: '3rem', marginBottom: '1rem', textAlign: 'center' }}>
        {feature.icon}
      </div>
      <h3 style={{ textAlign: 'center', marginBottom: '1rem', color: '#FF6A00' }}>
        {feature.title}
      </h3>
      <p style={{ color: '#C7C7C7', marginBottom: '1.5rem', textAlign: 'center' }}>
        {feature.description}
      </p>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {feature.features.map((item, index) => (
          <li key={index} style={{ 
            color: '#C7C7C7', 
            marginBottom: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span style={{ color: '#FF6A00' }}>✓</span>
            {item}
          </li>
        ))}
      </ul>
      {available && (
        <div style={{ 
          marginTop: '1.5rem', 
          textAlign: 'center',
          padding: '0.8rem',
          background: 'linear-gradient(45deg, #FF6A00, #FF8A00)',
          borderRadius: '8px',
          color: '#000',
          fontWeight: 'bold'
        }}>
          Try Now →
        </div>
      )}
      {!available && (
        <div style={{ 
          marginTop: '1.5rem', 
          textAlign: 'center',
          padding: '0.8rem',
          background: '#333',
          borderRadius: '8px',
          color: '#C7C7C7'
        }}>
          Login Required
        </div>
      )}
    </div>
  );

  return (
    <div className="dashboard-container fade-in">
      <div className="dashboard-header" style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌟 TICKEX Features</h1>
        <p style={{ fontSize: '1.2rem', color: '#C7C7C7' }}>
          Discover all the powerful features that make TICKEX the ultimate event platform
        </p>
      </div>

      {/* User Features */}
      <section style={{ marginBottom: '4rem' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem', textAlign: 'center' }}>
          👥 For Event Attendees
        </h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
          gap: '2rem' 
        }}>
          {userFeatures.map((feature, index) => (
            <FeatureCard key={index} feature={feature} available={true} />
          ))}
        </div>
      </section>

      {/* Organizer Features */}
      <section style={{ marginBottom: '4rem' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem', textAlign: 'center' }}>
          🎪 For Event Organizers
        </h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
          gap: '2rem' 
        }}>
          {organizerFeatures.map((feature, index) => (
            <FeatureCard 
              key={index} 
              feature={feature} 
              available={user?.role === 'organizer' || user?.role === 'admin'} 
            />
          ))}
        </div>
        {(!user || user.role === 'user') && (
          <div className="card" style={{ 
            textAlign: 'center', 
            padding: '2rem', 
            marginTop: '2rem',
            background: 'linear-gradient(135deg, #1a1a1a, #0d0d0d)'
          }}>
            <h3 style={{ color: '#FF6A00', marginBottom: '1rem' }}>Become an Event Organizer</h3>
            <p style={{ color: '#C7C7C7', marginBottom: '1.5rem' }}>
              Unlock powerful organizer tools to create and manage your own events
            </p>
            <button 
              className="btn-primary"
              onClick={() => navigate('/register')}
              style={{ padding: '1rem 2rem' }}
            >
              🚀 Upgrade to Organizer
            </button>
          </div>
        )}
      </section>

      {/* Admin Features */}
      {user?.role === 'admin' && (
        <section style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem', textAlign: 'center' }}>
            ⚙️ Admin Features
          </h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
            gap: '2rem' 
          }}>
            {adminFeatures.map((feature, index) => (
              <FeatureCard key={index} feature={feature} available={true} />
            ))}
          </div>
        </section>
      )}

      {/* Call to Action */}
      <section className="card" style={{ 
        textAlign: 'center', 
        padding: '3rem',
        background: 'linear-gradient(135deg, #FF6A00, #FF8A00)',
        color: '#000'
      }}>
        <h2 style={{ color: '#000', marginBottom: '1rem' }}>Ready to Get Started?</h2>
        <p style={{ color: '#000', marginBottom: '2rem', fontSize: '1.1rem' }}>
          Join thousands of users who trust TICKEX for their event needs
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          {!user ? (
            <>
              <button 
                className="btn-secondary"
                onClick={() => navigate('/register')}
                style={{ 
                  background: '#000', 
                  color: '#FF6A00',
                  border: '2px solid #000',
                  padding: '1rem 2rem'
                }}
              >
                🚀 Join TICKEX
              </button>
              <button 
                className="btn-secondary"
                onClick={() => navigate('/')}
                style={{ 
                  background: 'transparent', 
                  color: '#000',
                  border: '2px solid #000',
                  padding: '1rem 2rem'
                }}
              >
                🔍 Explore Events
              </button>
            </>
          ) : (
            <button 
              className="btn-secondary"
              onClick={() => navigate('/')}
              style={{ 
                background: '#000', 
                color: '#FF6A00',
                border: '2px solid #000',
                padding: '1rem 2rem'
              }}
            >
              🎪 Discover Events
            </button>
          )}
        </div>
      </section>
    </div>
  );
};

export default Features;