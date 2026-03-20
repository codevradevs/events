import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

// Cache utilities
const CACHE_KEYS = {
  countries: 'tickex_countries',
  admin1: 'tickex_admin1_',
  places: 'tickex_places_'
};

const getFromCache = (key) => {
  try {
    const cached = localStorage.getItem(key);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < 24 * 60 * 60 * 1000) return data; // 24h cache
    }
  } catch (e) {}
  return null;
};

const setToCache = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
  } catch (e) {}
};

const DynamicLocationSelector = ({ onLocationSelect, initialValues = {}, showMap = false }) => {
  const [countries, setCountries] = useState([]);
  const [admin1, setAdmin1] = useState([]);
  const [admin2, setAdmin2] = useState([]);
  const [places, setPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  
  const [selectedCountry, setSelectedCountry] = useState(initialValues.countryId || '');
  const [selectedAdmin1, setSelectedAdmin1] = useState(initialValues.admin1Id || '');
  const [selectedAdmin2, setSelectedAdmin2] = useState(initialValues.admin2Id || '');
  const [placeQuery, setPlaceQuery] = useState(initialValues.locationName || '');
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  
  const [loading, setLoading] = useState({
    countries: false,
    admin1: false,
    admin2: false,
    places: false
  });

  // Load countries with caching
  useEffect(() => {
    const loadCountries = async () => {
      const cached = getFromCache(CACHE_KEYS.countries);
      if (cached) {
        setCountries(cached);
        return;
      }
      
      setLoading(prev => ({ ...prev, countries: true }));
      try {
        const response = await axios.get('http://localhost:5000/api/locations/countries');
        setCountries(response.data);
        setToCache(CACHE_KEYS.countries, response.data);
      } catch (error) {
        console.error('Error loading countries:', error);
      } finally {
        setLoading(prev => ({ ...prev, countries: false }));
      }
    };
    loadCountries();
  }, []);

  // Load admin1 with caching
  useEffect(() => {
    if (!selectedCountry) {
      setAdmin1([]);
      setSelectedAdmin1('');
      return;
    }
    
    const loadAdmin1 = async () => {
      const cacheKey = CACHE_KEYS.admin1 + selectedCountry;
      const cached = getFromCache(cacheKey);
      if (cached) {
        setAdmin1(cached);
        return;
      }
      
      setLoading(prev => ({ ...prev, admin1: true }));
      try {
        const response = await axios.get(`http://localhost:5000/api/locations/countries/${selectedCountry}/admin1`);
        setAdmin1(response.data);
        setToCache(cacheKey, response.data);
      } catch (error) {
        console.error('Error loading admin1:', error);
      } finally {
        setLoading(prev => ({ ...prev, admin1: false }));
      }
    };
    loadAdmin1();
  }, [selectedCountry]);

  // Load admin2 when admin1 changes
  useEffect(() => {
    if (!selectedAdmin1) {
      setAdmin2([]);
      setSelectedAdmin2('');
      return;
    }
    
    const loadAdmin2 = async () => {
      setLoading(prev => ({ ...prev, admin2: true }));
      try {
        const response = await axios.get(`http://localhost:5000/api/locations/admin1/${selectedAdmin1}/admin2`);
        setAdmin2(response.data);
      } catch (error) {
        console.error('Error loading admin2:', error);
      } finally {
        setLoading(prev => ({ ...prev, admin2: false }));
      }
    };
    loadAdmin2();
  }, [selectedAdmin1]);

  // Load places with caching and autocomplete
  useEffect(() => {
    if (!selectedCountry) {
      setPlaces([]);
      setFilteredPlaces([]);
      return;
    }

    const searchPlaces = async () => {
      const cacheKey = CACHE_KEYS.places + selectedCountry + (selectedAdmin1 || '') + (selectedAdmin2 || '');
      const cached = getFromCache(cacheKey);
      
      if (cached && !placeQuery) {
        setPlaces(cached);
        setFilteredPlaces(cached);
        return;
      }
      
      setLoading(prev => ({ ...prev, places: true }));
      try {
        const params = new URLSearchParams({
          countryId: selectedCountry,
          ...(selectedAdmin1 && { admin1Id: selectedAdmin1 }),
          ...(selectedAdmin2 && { admin2Id: selectedAdmin2 }),
          limit: 100
        });
        
        const response = await axios.get(`http://localhost:5000/api/locations/places?${params}`);
        setPlaces(response.data);
        if (!placeQuery) setToCache(cacheKey, response.data);
      } catch (error) {
        console.error('Error searching places:', error);
      } finally {
        setLoading(prev => ({ ...prev, places: false }));
      }
    };

    const timeout = setTimeout(searchPlaces, 200);
    return () => clearTimeout(timeout);
  }, [selectedCountry, selectedAdmin1, selectedAdmin2]);

  // Filter places based on query
  useEffect(() => {
    if (!placeQuery) {
      setFilteredPlaces(places.slice(0, 10));
    } else {
      const filtered = places.filter(place => 
        place.name.toLowerCase().includes(placeQuery.toLowerCase())
      ).slice(0, 10);
      setFilteredPlaces(filtered);
    }
  }, [placeQuery, places]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
          inputRef.current && !inputRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCountryChange = (countryId) => {
    setSelectedCountry(countryId);
    setSelectedAdmin1('');
    setPlaceQuery('');
    setSelectedPlace(null);
    
    const country = countries.find(c => c._id === countryId);
    onLocationSelect({
      countryId,
      countryName: country?.name || '',
      admin1Id: '',
      admin1Name: '',
      locationName: '',
      place: null
    });
  };

  const handleAdmin1Change = (admin1Id) => {
    setSelectedAdmin1(admin1Id);
    setSelectedAdmin2('');
    setPlaceQuery('');
    setSelectedPlace(null);
    
    const country = countries.find(c => c._id === selectedCountry);
    const admin1Item = admin1.find(a => a._id === admin1Id);
    
    onLocationSelect({
      countryId: selectedCountry,
      countryName: country?.name || '',
      admin1Id,
      admin1Name: admin1Item?.name || '',
      admin2Id: '',
      admin2Name: '',
      locationName: '',
      place: null
    });
  };

  const handleAdmin2Change = (admin2Id) => {
    setSelectedAdmin2(admin2Id);
    setPlaceQuery('');
    setSelectedPlace(null);
    
    const country = countries.find(c => c._id === selectedCountry);
    const admin1Item = admin1.find(a => a._id === selectedAdmin1);
    const admin2Item = admin2.find(a => a._id === admin2Id);
    
    onLocationSelect({
      countryId: selectedCountry,
      countryName: country?.name || '',
      admin1Id: selectedAdmin1,
      admin1Name: admin1Item?.name || '',
      admin2Id,
      admin2Name: admin2Item?.name || '',
      locationName: '',
      place: null
    });
  };

  const handlePlaceSelect = (place) => {
    setSelectedPlace(place);
    setPlaceQuery(place.name);
    setShowDropdown(false);
    
    const country = countries.find(c => c._id === selectedCountry);
    const admin1Item = admin1.find(a => a._id === selectedAdmin1);
    const admin2Item = admin2.find(a => a._id === selectedAdmin2);
    
    onLocationSelect({
      countryId: selectedCountry,
      countryName: country?.name || '',
      admin1Id: selectedAdmin1,
      admin1Name: admin1Item?.name || '',
      admin2Id: selectedAdmin2,
      admin2Name: admin2Item?.name || '',
      locationName: place.name,
      place: place
    });
  };

  const MapModal = () => {
    if (!showMapModal || !selectedPlace) return null;
    
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000
      }}>
        <div style={{
          backgroundColor: '#1a1a1a',
          padding: '2rem',
          borderRadius: '12px',
          maxWidth: '600px',
          width: '90%'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ color: '#FF6A00', margin: 0 }}>{selectedPlace.name}</h3>
            <button 
              onClick={() => setShowMapModal(false)}
              style={{ background: 'none', border: 'none', color: '#C7C7C7', fontSize: '1.5rem', cursor: 'pointer' }}
            >
              ×
            </button>
          </div>
          <div style={{ color: '#C7C7C7', marginBottom: '1rem' }}>
            <p>Coordinates: {selectedPlace.lat}, {selectedPlace.lon}</p>
            {selectedPlace.population && <p>Population: {selectedPlace.population.toLocaleString()}</p>}
          </div>
          <iframe
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${selectedPlace.lon-0.01},${selectedPlace.lat-0.01},${selectedPlace.lon+0.01},${selectedPlace.lat+0.01}&layer=mapnik&marker=${selectedPlace.lat},${selectedPlace.lon}`}
            width="100%"
            height="300"
            style={{ border: 'none', borderRadius: '8px' }}
          />
        </div>
      </div>
    );
  };

  return (
    <>
    <div style={{ display: 'grid', gridTemplateColumns: admin2.length > 0 ? '1fr 1fr 1fr 1fr' : '1fr 1fr 1fr', gap: '1rem' }}>
      <div>
        <label style={{ color: '#C7C7C7', marginBottom: '0.5rem', display: 'block' }}>
          Country *
        </label>
        <select
          value={selectedCountry}
          onChange={(e) => handleCountryChange(e.target.value)}
          required
          disabled={loading.countries}
        >
          <option value="">
            {loading.countries ? 'Loading...' : 'Select Country'}
          </option>
          {countries.map(country => (
            <option key={country._id} value={country._id}>
              {country.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label style={{ color: '#C7C7C7', marginBottom: '0.5rem', display: 'block' }}>
          State/Province
        </label>
        <select
          value={selectedAdmin1}
          onChange={(e) => handleAdmin1Change(e.target.value)}
          disabled={!selectedCountry || loading.admin1}
        >
          <option value="">
            {loading.admin1 ? 'Loading...' : 'Select State/Province'}
          </option>
          {admin1.map(item => (
            <option key={item._id} value={item._id}>
              {item.name}
            </option>
          ))}
        </select>
      </div>

      {admin2.length > 0 && (
        <div>
          <label style={{ color: '#C7C7C7', marginBottom: '0.5rem', display: 'block' }}>
            County/District
          </label>
          <select
            value={selectedAdmin2}
            onChange={(e) => handleAdmin2Change(e.target.value)}
            disabled={!selectedAdmin1 || loading.admin2}
          >
            <option value="">
              {loading.admin2 ? 'Loading...' : 'Select County/District'}
            </option>
            {admin2.map(item => (
              <option key={item._id} value={item._id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div style={{ position: 'relative' }}>
        <label style={{ color: '#C7C7C7', marginBottom: '0.5rem', display: 'block' }}>
          City/Town *
        </label>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            ref={inputRef}
            type="text"
            placeholder={selectedCountry ? "Search city/town..." : "Select country first"}
            value={placeQuery}
            onChange={(e) => {
              setPlaceQuery(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            disabled={!selectedCountry}
            required
            style={{ flex: 1 }}
          />
          {selectedPlace && showMap && (
            <button
              type="button"
              onClick={() => setShowMapModal(true)}
              style={{
                background: '#FF6A00',
                border: 'none',
                borderRadius: '6px',
                padding: '0.5rem',
                color: 'white',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              🗺️
            </button>
          )}
        </div>
        
        {showDropdown && filteredPlaces.length > 0 && (
          <div 
            ref={dropdownRef}
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: showMap && selectedPlace ? 'calc(3rem + 0.5rem)' : 0,
              backgroundColor: '#1a1a1a',
              border: '1px solid #333',
              borderRadius: '8px',
              maxHeight: '250px',
              overflowY: 'auto',
              zIndex: 1000,
              marginTop: '4px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
            }}
          >
            {filteredPlaces.map(place => (
              <div
                key={place._id}
                onClick={() => handlePlaceSelect(place)}
                style={{
                  padding: '0.75rem',
                  cursor: 'pointer',
                  borderBottom: '1px solid #333',
                  color: '#C7C7C7',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#333'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                <div style={{ fontWeight: 'bold', color: '#FF6A00' }}>{place.name}</div>
                {place.population && (
                  <div style={{ fontSize: '0.8rem', color: '#888' }}>
                    👥 {place.population.toLocaleString()}
                  </div>
                )}
                {place.lat && place.lon && (
                  <div style={{ fontSize: '0.7rem', color: '#666' }}>
                    📍 {place.lat.toFixed(4)}, {place.lon.toFixed(4)}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        {loading.places && (
          <div style={{ 
            position: 'absolute', 
            top: '100%', 
            left: 0, 
            right: 0, 
            padding: '0.75rem',
            backgroundColor: '#1a1a1a',
            border: '1px solid #333',
            borderRadius: '8px',
            marginTop: '4px',
            color: '#C7C7C7'
          }}>
            Searching...
          </div>
        )}
      </div>
    </div>
    <MapModal />
    </>
  );
};

export default DynamicLocationSelector;