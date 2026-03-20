import React, { useState, useCallback } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

const LocationPicker = ({ onLocationSelect }) => {
  const [selectedLocation, setSelectedLocation] = useState({ lat: -1.286389, lng: 36.817223 }); // Nairobi center
  const [address, setAddress] = useState('');

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GMAPS_KEY
  });

  const onMapClick = useCallback((event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setSelectedLocation({ lat, lng });
    
    // Reverse geocoding to get address
    if (window.google) {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === 'OK' && results[0]) {
          setAddress(results[0].formatted_address);
        }
      });
    }
  }, []);

  const handleConfirm = () => {
    onLocationSelect({
      lat: selectedLocation.lat,
      lng: selectedLocation.lng,
      address
    });
  };

  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <div style={{ marginTop: '1rem', border: '1px solid #1F1F1F', borderRadius: '12px', overflow: 'hidden' }}>
      <GoogleMap
        mapContainerStyle={{ height: '300px', width: '100%' }}
        center={selectedLocation}
        zoom={13}
        onClick={onMapClick}
      >
        <Marker position={selectedLocation} />
      </GoogleMap>
      <div style={{ padding: '1rem', background: '#121212' }}>
        <p style={{ color: '#C7C7C7', marginBottom: '0.5rem' }}>Selected Location:</p>
        <p style={{ color: '#FFFFFF', marginBottom: '1rem' }}>{address || 'Click on map to select location'}</p>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn-primary" onClick={handleConfirm} disabled={!address}>
            Confirm Location
          </button>
          <button className="btn-secondary" onClick={() => onLocationSelect(null)}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationPicker;