import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import EventCard from '../components/EventCard';

const Browse = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    location: '',
    minPrice: '',
    maxPrice: '',
    date: '',
    search: ''
  });
  const [categories] = useState([
    'Music', 'Sports', 'Arts', 'Food', 'Business', 'Technology', 'Education', 'Other'
  ]);

  useEffect(() => {
    fetchEvents();
  }, [filters]);

  const fetchEvents = async () => {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      
      const { data } = await axios.get(`http://localhost:5000/api/events?${params}`);
      setEvents(data);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      location: '',
      minPrice: '',
      maxPrice: '',
      date: '',
      search: ''
    });
  };

  return (
    <div className="dashboard-container fade-in">
      <div className="dashboard-header">
        <h1>🔍 Browse Events</h1>
        <button className="btn-secondary" onClick={clearFilters}>Clear Filters</button>
      </div>

      {/* Filters */}
      <div className="card mb-xl">
        <h3 className="mb-md">🎯 Filters</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-md)' }}>
          <div>
            <label className="text-muted text-sm">Search</label>
            <input
              type="text"
              placeholder="Search events..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>
          <div>
            <label className="text-muted text-sm">Category</label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-muted text-sm">Location</label>
            <input
              type="text"
              placeholder="City or venue..."
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
            />
          </div>
          <div>
            <label className="text-muted text-sm">Date From</label>
            <input
              type="date"
              value={filters.date}
              onChange={(e) => handleFilterChange('date', e.target.value)}
            />
          </div>
          <div>
            <label className="text-muted text-sm">Min Price (KES)</label>
            <input
              type="number"
              placeholder="0"
              value={filters.minPrice}
              onChange={(e) => handleFilterChange('minPrice', e.target.value)}
            />
          </div>
          <div>
            <label className="text-muted text-sm">Max Price (KES)</label>
            <input
              type="number"
              placeholder="10000"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Category Quick Filters */}
      <div className="mb-xl">
        <div style={{ display: 'flex', gap: 'var(--spacing-sm)', flexWrap: 'wrap' }}>
          {categories.map(category => (
            <button
              key={category}
              className={filters.category === category ? 'btn-primary' : 'btn-secondary'}
              onClick={() => handleFilterChange('category', filters.category === category ? '' : category)}
              style={{ fontSize: 'var(--font-sm)', padding: 'var(--spacing-xs) var(--spacing-md)' }}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div>
        <h3 className="mb-md">📅 Events ({events.length})</h3>
        {events.length === 0 ? (
          <div className="card text-center p-2xl">
            <div className="text-4xl mb-md">🔍</div>
            <h3>No events found</h3>
            <p className="text-muted">Try adjusting your filters or search terms</p>
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

export default Browse;