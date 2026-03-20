import React, { useEffect, useState } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import axios from 'axios';

export default function MapVenue({ eventId }) {
  const [loc, setLoc] = useState(null);
  
  useEffect(() => {
    axios.get(`http://localhost:5000/api/venues/${eventId}/venue`).then(r => setLoc(r.data));
  }, [eventId]);

  const { isLoaded } = useJsApiLoader({ googleMapsApiKey: process.env.REACT_APP_GMAPS_KEY });
  
  if (!isLoaded || !loc) return <div>Loading map...</div>;

  const center = { lat: loc.coordinates[1], lng: loc.coordinates[0] };

  return (
    <div style={{ height: 400 }}>
      <GoogleMap mapContainerStyle={{ height: '100%' }} center={center} zoom={15}>
        <Marker position={center} />
      </GoogleMap>
      <a
        href={`https://www.google.com/maps/dir/?api=1&destination=${center.lat},${center.lng}`}
        target="_blank" rel="noreferrer"
      >
        Get directions
      </a>
    </div>
  );
}
