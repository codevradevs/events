import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Holidays = () => {
  const [packages, setPackages] = useState([]);
  const [filters, setFilters] = useState({
    type: '',
    destination: '',
    budget: ''
  });

  useEffect(() => {
    fetchHolidayPackages();
  }, [filters]);

  const fetchHolidayPackages = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/holidays');
      setPackages(data);
    } catch (error) {
      // Mock data for demo
      setPackages([
        {
          _id: '1',
          title: 'Mombasa Beach Getaway',
          type: 'Beach',
          destination: 'Mombasa',
          price: 25000,
          duration: '3 Days 2 Nights',
          image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400',
          includes: ['Accommodation', 'Breakfast', 'Airport Transfer'],
          description: 'Relax on pristine white sand beaches with crystal clear waters'
        },
        {
          _id: '2',
          title: 'Maasai Mara Safari Adventure',
          type: 'Safari',
          destination: 'Maasai Mara',
          price: 45000,
          duration: '4 Days 3 Nights',
          image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=400',
          includes: ['Game Drives', 'All Meals', 'Park Fees', 'Transport'],
          description: 'Experience the Great Migration and Big Five wildlife'
        },
        {
          _id: '3',
          title: 'Nairobi City Experience',
          type: 'City',
          destination: 'Nairobi',
          price: 15000,
          duration: '2 Days 1 Night',
          image: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=400',
          includes: ['Hotel Stay', 'City Tour', 'Museum Visits'],
          description: 'Discover Kenya\'s vibrant capital city and cultural attractions'
        },
        {
          _id: '4',
          title: 'Romantic Honeymoon Package',
          type: 'Honeymoon',
          destination: 'Diani Beach',
          price: 65000,
          duration: '5 Days 4 Nights',
          image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400',
          includes: ['Luxury Resort', 'Spa Treatment', 'Romantic Dinner', 'Activities'],
          description: 'Perfect romantic escape with luxury amenities and stunning views'
        }
      ]);
    }
  };

  const packageTypes = ['Beach', 'Safari', 'City', 'Honeymoon', 'Family', 'Adventure'];
  const destinations = ['Mombasa', 'Maasai Mara', 'Nairobi', 'Diani Beach', 'Nakuru', 'Amboseli'];

  return (
    <div className="dashboard-container fade-in">
      <div className="dashboard-header">
        <h1>✈️ Holiday Packages</h1>
        <p className="text-muted">Discover amazing travel deals and book your perfect getaway</p>
      </div>

      {/* Filters */}
      <div className="card mb-xl">
        <h3 className="mb-md">🎯 Find Your Perfect Holiday</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-md)' }}>
          <div>
            <label className="text-muted text-sm">Package Type</label>
            <select
              value={filters.type}
              onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
            >
              <option value="">All Types</option>
              {packageTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-muted text-sm">Destination</label>
            <select
              value={filters.destination}
              onChange={(e) => setFilters(prev => ({ ...prev, destination: e.target.value }))}
            >
              <option value="">All Destinations</option>
              {destinations.map(dest => (
                <option key={dest} value={dest}>{dest}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-muted text-sm">Budget Range</label>
            <select
              value={filters.budget}
              onChange={(e) => setFilters(prev => ({ ...prev, budget: e.target.value }))}
            >
              <option value="">Any Budget</option>
              <option value="0-20000">Under KES 20,000</option>
              <option value="20000-40000">KES 20,000 - 40,000</option>
              <option value="40000-60000">KES 40,000 - 60,000</option>
              <option value="60000+">Above KES 60,000</option>
            </select>
          </div>
        </div>
      </div>

      {/* Holiday Packages */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: 'var(--spacing-xl)' }}>
        {packages.map(pkg => (
          <div key={pkg._id} className="card p-0" style={{ overflow: 'hidden', cursor: 'pointer' }}>
            <div style={{ position: 'relative' }}>
              <img 
                src={pkg.image} 
                alt={pkg.title}
                style={{ width: '100%', height: '200px', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                top: 'var(--spacing-md)',
                right: 'var(--spacing-md)',
                background: 'var(--primary-color)',
                color: 'var(--bg-primary)',
                padding: 'var(--spacing-xs) var(--spacing-sm)',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--font-xs)',
                fontWeight: '600'
              }}>
                {pkg.type}
              </div>
            </div>
            
            <div className="p-xl">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-sm)' }}>
                <h3 className="mb-0">{pkg.title}</h3>
                <span className="text-orange font-bold text-lg">KES {pkg.price.toLocaleString()}</span>
              </div>
              
              <div style={{ display: 'flex', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-md)' }}>
                <span className="text-muted text-sm">📍 {pkg.destination}</span>
                <span className="text-muted text-sm">⏰ {pkg.duration}</span>
              </div>
              
              <p className="text-muted mb-md text-sm">{pkg.description}</p>
              
              <div className="mb-lg">
                <h4 className="text-sm mb-sm">Includes:</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-xs)' }}>
                  {pkg.includes.map((item, index) => (
                    <span 
                      key={index}
                      style={{
                        background: 'var(--bg-tertiary)',
                        padding: 'var(--spacing-xs) var(--spacing-sm)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: 'var(--font-xs)',
                        color: 'var(--text-muted)'
                      }}
                    >
                      ✓ {item}
                    </span>
                  ))}
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                <button className="btn-primary" style={{ flex: 1 }}>
                  Book Now
                </button>
                <button className="btn-secondary">
                  Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Holidays;