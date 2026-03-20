import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const LocationSelector = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    // Initialize map
    const map = L.map('map').setView([-1.2921, 36.8219], 10);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    
    // Click handler
    map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      
      if (markerRef.current) {
        map.removeLayer(markerRef.current);
      }
      
      markerRef.current = L.marker([lat, lng]).addTo(map);
      
      setSelectedLocation({
        lat,
        lng,
        address: `${lat.toFixed(4)}, ${lng.toFixed(4)}`
      });
    });
    
    mapRef.current = map;
    
    return () => {
      map.remove();
    };
  }, []);
  
  const searchLocation = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`);
      const data = await response.json();
      
      if (data.length > 0) {
        const result = data[0];
        const lat = parseFloat(result.lat);
        const lng = parseFloat(result.lon);
        
        if (markerRef.current) {
          mapRef.current.removeLayer(markerRef.current);
        }
        
        markerRef.current = L.marker([lat, lng]).addTo(mapRef.current);
        mapRef.current.setView([lat, lng], 15);
        
        setSelectedLocation({
          lat,
          lng,
          address: result.display_name
        });
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      alert('Failed to find location. Please check your internet connection.');
    }
  };

  const confirmLocation = () => {
    if (selectedLocation) {
      navigate('/create-event', { 
        state: { 
          selectedLocation,
          returnTo: location.state?.returnTo 
        }
      });
    }
  };

  return (
    <div className="dashboard-container fade-in">
      <div className="dashboard-header">
        <h1>📍 Select Event Location</h1>
        <button className="btn-secondary" onClick={() => navigate('/create-event')}>
          ← Back
        </button>
      </div>

      <div className="card">
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            <input
              type="text"
              placeholder="Search for any location worldwide"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchLocation()}
              style={{ flex: 1 }}
            />
            <button className="btn-primary" onClick={searchLocation}>
              🔍 Search
            </button>
          </div>
          
          {selectedLocation && (
            <div className="card" style={{ padding: '1rem', marginBottom: '1rem', backgroundColor: '#1a1a1a' }}>
              <h4>Selected Location:</h4>
              <p style={{ color: '#C7C7C7', margin: '0.5rem 0' }}>{selectedLocation.address}</p>
              <p style={{ color: '#FF6A00', fontSize: '0.9rem' }}>
                Coordinates: {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
              </p>
              <button className="btn-primary" onClick={confirmLocation} style={{ marginTop: '1rem' }}>
                ✅ Confirm This Location
              </button>
            </div>
          )}
        </div>

        <div 
          id="map" 
          style={{ 
            height: '400px', 
            width: '100%', 
            borderRadius: '8px',
            border: '1px solid #333'
          }}
        />
      </div>
    </div>
  );
};

export default LocationSelector;