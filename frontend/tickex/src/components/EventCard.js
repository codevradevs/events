import React from 'react';
import { useNavigate } from 'react-router-dom';

const EventCard = ({ event }) => {
  const navigate = useNavigate();
  
  const getMinPrice = () => {
    if (!event.ticketTiers || event.ticketTiers.length === 0) return 'Free';
    const minPrice = Math.min(...event.ticketTiers.map(tier => tier.price));
    return minPrice === 0 ? 'Free' : `From KES ${minPrice.toLocaleString()}`;
  };

  return (
    <div 
      className="modern-event-card fade-in" 
      onClick={() => navigate(`/event/${event._id}`)}
      style={{
        background: 'linear-gradient(145deg, #1a1a1a, #0d0d0d)',
        borderRadius: '20px',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        border: '1px solid #333',
        position: 'relative',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
      }}
      onMouseEnter={(e) => {
        e.target.style.transform = 'translateY(-10px)';
        e.target.style.boxShadow = '0 20px 40px rgba(255,106,0,0.2)';
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = 'translateY(0)';
        e.target.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)';
      }}
    >
      {event.featured?.isFeatured && (
        <div style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          background: 'linear-gradient(45deg, #FF6A00, #FF8A00)',
          padding: '0.3rem 0.8rem',
          borderRadius: '20px',
          fontSize: '0.8rem',
          fontWeight: 'bold',
          zIndex: 2
        }}>
          🔥 FEATURED
        </div>
      )}
      
      <div style={{ position: 'relative' }}>
        <img 
          src={event.posterUrl} 
          alt={event.title}
          style={{
            width: '100%',
            height: '200px',
            objectFit: 'cover'
          }}
        />
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
          padding: '2rem 1rem 1rem'
        }}>
          <div style={{
            background: '#FF6A00',
            color: '#000',
            padding: '0.3rem 0.8rem',
            borderRadius: '15px',
            fontSize: '0.9rem',
            fontWeight: 'bold',
            display: 'inline-block',
            marginBottom: '0.5rem'
          }}>
            {getMinPrice()}
          </div>
        </div>
      </div>
      
      <div style={{ padding: '1.5rem' }}>
        <h3 style={{ 
          fontSize: '1.3rem', 
          marginBottom: '0.8rem',
          color: '#fff',
          fontWeight: 'bold'
        }}>
          {event.title}
        </h3>
        
        <div style={{ marginBottom: '1rem' }}>
          <p style={{ color: '#FF6A00', fontSize: '0.9rem', marginBottom: '0.3rem' }}>
            📅 {new Date(event.date).toLocaleDateString()} • 📍 {event.venue}
          </p>
          <p style={{ color: '#C7C7C7', fontSize: '0.8rem' }}>
            {event.locationName}, {event.county}
          </p>
        </div>
        
        {event.specialGuests && (
          <div style={{ 
            background: '#0d0d0d',
            padding: '0.8rem',
            borderRadius: '10px',
            marginBottom: '1rem',
            border: '1px solid #333'
          }}>
            <p style={{ color: '#FF6A00', fontSize: '0.8rem', marginBottom: '0.3rem', fontWeight: 'bold' }}>
              ✨ SPECIAL GUESTS
            </p>
            <p style={{ color: '#C7C7C7', fontSize: '0.8rem', lineHeight: '1.4' }}>
              {event.specialGuests.length > 80 ? 
                event.specialGuests.substring(0, 80) + '...' : 
                event.specialGuests
              }
            </p>
          </div>
        )}
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: '#888' }}>
            <span>❤️ {event.likes?.length || 0}</span>
            <span>🎫 {event.ticketTiers?.reduce((sum, tier) => sum + tier.sold, 0) || 0} sold</span>
          </div>
          <div style={{
            background: 'linear-gradient(45deg, #FF6A00, #FF8A00)',
            padding: '0.5rem 1rem',
            borderRadius: '20px',
            fontSize: '0.8rem',
            fontWeight: 'bold',
            color: '#000'
          }}>
            VIEW DETAILS
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
