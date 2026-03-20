import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DynamicLocationSelector from '../components/DynamicLocationSelector';

const CreateEvent = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    customCategory: '',
    date: '',
    time: '',
    venue: '',
    locationName: '',
    county: '',
    country: '',
    countryId: '',
    admin1Id: '',
    admin2Id: '',
    placeId: '',
    coordinates: null,
    posterUrl: '',
    specialGuests: '',
    ticketTiers: [{ name: 'General', price: 0, quantity: 0 }]
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleLocationSelect = (locationData) => {
    setFormData({
      ...formData,
      countryId: locationData.countryId,
      country: locationData.countryName,
      admin1Id: locationData.admin1Id,
      county: locationData.admin1Name,
      admin2Id: locationData.admin2Id || '',
      locationName: locationData.locationName,
      placeId: locationData.place?._id || '',
      coordinates: locationData.place ? {
        lat: locationData.place.lat,
        lon: locationData.place.lon
      } : null
    });
  };
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    // Validate custom category
    if (formData.category === 'Other' && !formData.customCategory.trim()) {
      alert('Please specify the custom category');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      
      // Clean up form data - remove empty fields and set defaults
      const cleanFormData = { ...formData };
      if (!cleanFormData.countryId) delete cleanFormData.countryId;
      if (!cleanFormData.admin1Id) delete cleanFormData.admin1Id;
      if (!cleanFormData.admin2Id) delete cleanFormData.admin2Id;
      if (!cleanFormData.placeId) delete cleanFormData.placeId;
      if (!cleanFormData.coordinates?.lat) delete cleanFormData.coordinates;
      if (!cleanFormData.locationName) cleanFormData.locationName = 'TBD';
      if (!cleanFormData.county) cleanFormData.county = 'TBD';
      if (!cleanFormData.country) cleanFormData.country = 'TBD';
      
      console.log('Submitting form data:', cleanFormData);
      
      await axios.post('http://localhost:5000/api/events', cleanFormData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to create event:', error);
      const errorMsg = error.response?.data?.message || 'Failed to create event';
      alert(`Error: ${errorMsg}`);
      console.error('Full error:', error.response?.data);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePosterUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formDataUpload = new FormData();
      formDataUpload.append('poster', file);
      
      try {
        const token = localStorage.getItem('token');
        const response = await axios.post('http://localhost:5000/api/upload/poster', formDataUpload, {
          headers: { 
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        });
        setFormData({ ...formData, posterUrl: response.data.url });
      } catch (error) {
        console.error('Failed to upload poster:', error);
      }
    }
  };



  const addTier = () => {
    setFormData({
      ...formData,
      ticketTiers: [...formData.ticketTiers, { name: '', price: 0, quantity: 0 }]
    });
  };

  const removeTier = (index) => {
    const tiers = formData.ticketTiers.filter((_, i) => i !== index);
    setFormData({ ...formData, ticketTiers: tiers });
  };

  const categories = ['Music', 'Sports', 'Comedy', 'Conference', 'Workshop', 'Festival', 'Theater', 'Other'];

  return (
    <div className="dashboard-container fade-in">
      <div className="dashboard-header">
        <h1>🎪 Create New Event</h1>
        <button className="btn-secondary" onClick={() => navigate('/dashboard')}>← Back to Dashboard</button>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ color: '#C7C7C7', marginBottom: '0.5rem', display: 'block' }}>Event Title *</label>
              <input
                type="text"
                placeholder="Amazing Concert 2024"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div>
              <label style={{ color: '#C7C7C7', marginBottom: '0.5rem', display: 'block' }}>Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value, customCategory: '' })}
                required
              >
                <option value="">Select Category</option>
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              {formData.category === 'Other' && (
                <input
                  type="text"
                  placeholder="Specify your category (e.g., Art Exhibition, Food Festival)"
                  value={formData.customCategory}
                  onChange={(e) => setFormData({ ...formData, customCategory: e.target.value })}
                  required
                  style={{ marginTop: '0.5rem' }}
                />
              )}
            </div>
          </div>

          <div>
            <label style={{ color: '#C7C7C7', marginBottom: '0.5rem', display: 'block' }}>Description *</label>
            <textarea
              placeholder="Describe your event..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              required
            />
          </div>

          <div>
            <label style={{ color: '#C7C7C7', marginBottom: '0.5rem', display: 'block' }}>Special Guests & Performers</label>
            <textarea
              placeholder="List celebrities, artists, guest speakers, performers, etc. (e.g., DJ Khaled, Sauti Sol, Governor John Doe)"
              value={formData.specialGuests}
              onChange={(e) => setFormData({ ...formData, specialGuests: e.target.value })}
              rows={3}
            />
            <p style={{ color: '#888', fontSize: '0.8rem', marginTop: '0.3rem' }}>💡 Tip: Mention notable attendees to attract more participants</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ color: '#C7C7C7', marginBottom: '0.5rem', display: 'block' }}>Date *</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
            <div>
              <label style={{ color: '#C7C7C7', marginBottom: '0.5rem', display: 'block' }}>Time *</label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                required
              />
            </div>
            <div>
              <label style={{ color: '#C7C7C7', marginBottom: '0.5rem', display: 'block' }}>Venue Name *</label>
              <input
                type="text"
                placeholder="e.g., KICC, Uhuru Park, Carnivore Restaurant"
                value={formData.venue}
                onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <h3 style={{ color: '#C7C7C7', marginBottom: '1rem' }}>📍 Event Location</h3>
            <DynamicLocationSelector 
              onLocationSelect={handleLocationSelect}
              showMap={true}
              initialValues={{
                countryId: formData.countryId,
                admin1Id: formData.admin1Id,
                locationName: formData.locationName
              }}
            />
          </div>

          <div>
            <label style={{ color: '#C7C7C7', marginBottom: '0.5rem', display: 'block' }}>Event Poster</label>
            <input
              type="file"
              accept="image/*"
              onChange={handlePosterUpload}
              style={{ marginBottom: '0.5rem' }}
            />
            <input
              type="url"
              placeholder="Or paste image URL"
              value={formData.posterUrl}
              onChange={(e) => setFormData({ ...formData, posterUrl: e.target.value })}
            />
            {formData.posterUrl && (
              <img src={formData.posterUrl} alt="Preview" style={{ width: '100px', height: '100px', objectFit: 'cover', marginTop: '0.5rem', borderRadius: '8px' }} />
            )}
          </div>
        
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <h3>🎫 Ticket Tiers</h3>
                <p style={{ color: '#C7C7C7', fontSize: '0.9rem', margin: '0.5rem 0' }}>Create different ticket types with varying prices and quantities</p>
              </div>
              <button type="button" className="btn-secondary" onClick={addTier}>+ Add Tier</button>
            </div>
            {formData.ticketTiers.map((tier, index) => (
              <div key={index} className="card" style={{ marginBottom: '1rem', padding: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h4>Tier {index + 1}</h4>
                  {formData.ticketTiers.length > 1 && (
                    <button type="button" className="btn-secondary" onClick={() => removeTier(index)}>Remove</button>
                  )}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ color: '#C7C7C7', fontSize: '0.8rem', marginBottom: '0.3rem', display: 'block' }}>Tier Name</label>
                    <input
                      type="text"
                      placeholder={index === 0 ? "General Admission" : index === 1 ? "VIP" : index === 2 ? "VVIP" : "Premium"}
                      value={tier.name}
                      onChange={(e) => {
                        const tiers = [...formData.ticketTiers];
                        tiers[index].name = e.target.value;
                        setFormData({ ...formData, ticketTiers: tiers });
                      }}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ color: '#C7C7C7', fontSize: '0.8rem', marginBottom: '0.3rem', display: 'block' }}>Price (KES)</label>
                    <input
                      type="number"
                      placeholder={index === 0 ? "1000" : index === 1 ? "2500" : index === 2 ? "5000" : "3000"}
                      value={tier.price}
                      onChange={(e) => {
                        const tiers = [...formData.ticketTiers];
                        tiers[index].price = parseFloat(e.target.value) || 0;
                        setFormData({ ...formData, ticketTiers: tiers });
                      }}
                      required
                      min="0"
                    />
                  </div>
                  <div>
                    <label style={{ color: '#C7C7C7', fontSize: '0.8rem', marginBottom: '0.3rem', display: 'block' }}>Available Tickets</label>
                    <input
                      type="number"
                      placeholder={index === 0 ? "500" : index === 1 ? "100" : index === 2 ? "50" : "200"}
                      value={tier.quantity}
                      onChange={(e) => {
                        const tiers = [...formData.ticketTiers];
                        tiers[index].quantity = parseInt(e.target.value) || 0;
                        setFormData({ ...formData, ticketTiers: tiers });
                      }}
                      required
                      min="1"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        
          <button 
            type="submit" 
            className="btn-primary" 
            disabled={isSubmitting}
            style={{ 
              padding: '1rem', 
              fontSize: '1.1rem',
              opacity: isSubmitting ? 0.6 : 1,
              cursor: isSubmitting ? 'not-allowed' : 'pointer'
            }}
          >
            {isSubmitting ? '⏳ Creating...' : '🚀 Create Event'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
