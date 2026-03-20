import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EventMap = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      const { data } = await axios.get(`http://localhost:5000/api/events/${id}`);
      setEvent(data);
    } catch (error) {
      console.error('Failed to fetch event:', error);
    }
  };

  const getBoundingBox = (event) => {
    const coords = getCoordinates(event);
    const [lat, lng] = coords.split(',').map(Number);
    const offset = 0.01;
    return `${lng-offset},${lat-offset},${lng+offset},${lat+offset}`;
  };

  const getCoordinates = (event) => {
    const locationMap = {
      'nairobi': '-1.2921,36.8219',
      'mombasa': '-4.0435,39.6682',
      'kisumu': '-0.0917,34.7680',
      'nakuru': '-0.3031,36.0800',
      'eldoret': '0.5143,35.2698',
      'thika': '-1.0332,37.0692',
      'los angeles': '34.0522,-118.2437',
      'new york': '40.7128,-74.0060',
      'london': '51.5074,-0.1278',
      'lagos': '6.5244,3.3792'
    };
    
    const key = event.county?.toLowerCase() || event.locationName?.toLowerCase() || 'nairobi';
    return locationMap[key] || locationMap['nairobi'];
  };

  if (!event) return <div className="dashboard-container">Loading...</div>;

  return (
    <div className="dashboard-container fade-in">
      <div className="dashboard-header">
        <h1>🗺️ Event Location</h1>
        <button className="btn-secondary" onClick={() => navigate(`/event/${id}`)}>
          ← Back to Event
        </button>
      </div>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2rem' }}>
          <img 
            src={event.posterUrl} 
            alt={event.title}
            style={{ 
              width: '120px', 
              height: '120px', 
              objectFit: 'cover', 
              borderRadius: '12px' 
            }}
          />
          <div>
            <h2>{event.title}</h2>
            <p style={{ color: '#FF6A00', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
              📅 {new Date(event.date).toLocaleDateString()} • 🕰️ {event.time}
            </p>
            <p style={{ color: '#C7C7C7' }}>
              📍 {event.venue}, {event.locationName}, {event.county}, {event.country}
            </p>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 style={{ marginBottom: '1rem' }}>🌍 Interactive Map</h2>
        <iframe
          src={`https://www.openstreetmap.org/export/embed.html?bbox=${getBoundingBox(event)}&layer=mapnik&marker=${getCoordinates(event)}`}
          style={{
            width: '100%',
            height: '500px',
            border: '1px solid #333',
            borderRadius: '12px'
          }}
          title="Event Location Map"
        />
        
        <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#1a1a1a', borderRadius: '8px' }}>
          <h3 style={{ color: '#FF6A00', marginBottom: '0.5rem' }}>📍 Directions</h3>
          <p style={{ color: '#C7C7C7', marginBottom: '1rem' }}>
            Navigate to {event.venue} in {event.locationName}, {event.county}
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <a 
              href={`https://www.google.com/maps/search/${encodeURIComponent(`${event.venue}, ${event.locationName}, ${event.county}, ${event.country}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{ textDecoration: 'none' }}
            >
              🗺️ Google Maps
            </a>
            <a 
              href={`https://www.openstreetmap.org/search?query=${encodeURIComponent(`${event.venue}, ${event.locationName}, ${event.county}, ${event.country}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
              style={{ textDecoration: 'none' }}
            >
              🌐 OpenStreetMap
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventMap;