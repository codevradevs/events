import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [selectedTier, setSelectedTier] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    const { data } = await axios.get(`http://localhost:5000/api/events/${id}`);
    setEvent(data);
    setComments(data.comments || []);
  };

  const handlePurchase = () => {
    if (!selectedTier) return;
    setShowPaymentModal(true);
  };
  
  const processPayment = async () => {
    if (!phoneNumber.trim()) return;
    
    setIsProcessing(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/tickets/purchase', {
        eventId: id,
        tier: selectedTier,
        phone: phoneNumber
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setShowPaymentModal(false);
      setPhoneNumber('');
      
      // Poll for payment status
      const checkPaymentStatus = async () => {
        try {
          const statusResponse = await axios.get(`http://localhost:5000/api/tickets/status/${response.data.ticketId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          if (statusResponse.data.paymentStatus === 'completed') {
            navigate('/my-tickets');
          } else if (statusResponse.data.paymentStatus === 'failed') {
            setIsProcessing(false);
          } else {
            setTimeout(checkPaymentStatus, 3000);
          }
        } catch (error) {
          console.error('Status check failed:', error);
          setIsProcessing(false);
        }
      };
      
      setTimeout(checkPaymentStatus, 5000);
      
    } catch (error) {
      setIsProcessing(false);
    }
  };

  const handleLike = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/events/${id}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchEvent();
    } catch (error) {
      console.error('Failed to like event:', error);
    }
  };

  const handleComment = async () => {
    if (!newComment.trim()) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/events/${id}/comment`, 
        { text: newComment }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewComment('');
      fetchEvent();
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  const handleSave = async () => {
    if (!localStorage.getItem('token')) {
      alert('Please login to save events');
      navigate('/login');
      return;
    }
    
    setIsSaving(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/users/save-event/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    } catch (error) {
      console.error('Failed to save event:', error);
      alert('Failed to save event. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const getBoundingBox = (event) => {
    // Create bounding box based on location
    const coords = getCoordinates(event);
    const [lat, lng] = coords.split(',').map(Number);
    const offset = 0.01;
    return `${lng-offset},${lat-offset},${lng+offset},${lat+offset}`;
  };

  const getCoordinates = (event) => {
    // Simple coordinate mapping for major Kenyan locations
    const locationMap = {
      'nairobi': '-1.2921,36.8219',
      'mombasa': '-4.0435,39.6682',
      'kisumu': '-0.0917,34.7680',
      'nakuru': '-0.3031,36.0800',
      'eldoret': '0.5143,35.2698',
      'thika': '-1.0332,37.0692'
    };
    
    const key = event.county?.toLowerCase() || event.locationName?.toLowerCase() || 'nairobi';
    return locationMap[key] || locationMap['nairobi'];
  };

  if (!event) return <div>Loading...</div>;

  return (
    <div className="dashboard-container fade-in">
      <div className="event-hero" style={{ position: 'relative', marginBottom: '2rem' }}>
        <img 
          src={event.posterUrl} 
          alt={event.title} 
          style={{ 
            width: '100%', 
            height: 'auto', 
            borderRadius: '12px'
          }} 
        />
        <div style={{ 
          marginTop: '1rem'
        }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{event.title}</h1>
          <p style={{ fontSize: '1.2rem', color: '#FF6A00' }}>
            📅 {new Date(event.date).toLocaleDateString()} • 🕰️ {event.time}
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        <div>
          <div className="card" style={{ marginBottom: '2rem' }}>
            <h2>📝 Event Details</h2>
            <p style={{ color: '#C7C7C7', lineHeight: '1.6', fontSize: '1.1rem' }}>{event.description}</p>
            
            {event.specialGuests && (
              <div style={{ marginTop: '1.5rem' }}>
                <h3 style={{ color: '#FF6A00', marginBottom: '0.5rem' }}>✨ Special Guests</h3>
                <p style={{ color: '#C7C7C7' }}>{event.specialGuests}</p>
              </div>
            )}
          </div>

          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2>📍 Location</h2>
              <button 
                className="btn-primary" 
                onClick={() => navigate(`/map/${id}`)}
                style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
              >
                🌍 View on Map
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <p style={{ color: '#888', fontSize: '0.9rem' }}>Venue</p>
                <p style={{ color: '#C7C7C7', fontWeight: 'bold' }}>{event.venue}</p>
              </div>
              <div>
                <p style={{ color: '#888', fontSize: '0.9rem' }}>Area</p>
                <p style={{ color: '#C7C7C7', fontWeight: 'bold' }}>{event.locationName}</p>
              </div>
              <div>
                <p style={{ color: '#888', fontSize: '0.9rem' }}>County</p>
                <p style={{ color: '#C7C7C7', fontWeight: 'bold' }}>{event.county}</p>
              </div>
              <div>
                <p style={{ color: '#888', fontSize: '0.9rem' }}>Country</p>
                <p style={{ color: '#C7C7C7', fontWeight: 'bold' }}>{event.country}</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="card" style={{ position: 'sticky', top: '2rem' }}>
            <h2>🎫 Get Tickets</h2>
            <div style={{ marginBottom: '1.5rem' }}>
              {event.ticketTiers.map(tier => (
                <div 
                  key={tier.name} 
                  className={`tier-option ${selectedTier === tier.name ? 'selected' : ''}`}
                  style={{
                    border: selectedTier === tier.name ? '2px solid #FF6A00' : '1px solid #333',
                    borderRadius: '8px',
                    padding: '1rem',
                    marginBottom: '1rem',
                    cursor: 'pointer',
                    backgroundColor: selectedTier === tier.name ? '#1a1a1a' : 'transparent'
                  }}
                  onClick={() => setSelectedTier(tier.name)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ color: '#FF6A00', marginBottom: '0.3rem' }}>{tier.name}</h4>
                      <p style={{ color: '#C7C7C7', fontSize: '0.9rem' }}>
                        {tier.quantity - tier.sold} tickets left
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#FF6A00' }}>
                        KES {tier.price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <button 
              className="btn-primary" 
              onClick={handlePurchase} 
              disabled={!selectedTier || isProcessing}
              style={{ 
                width: '100%', 
                padding: '1rem', 
                fontSize: '1.1rem',
                opacity: (!selectedTier || isProcessing) ? 0.5 : 1
              }}
            >
              {isProcessing ? '⏳ Processing...' : '💳 Buy Ticket'}
            </button>
            
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
              <button 
                className="btn-secondary" 
                onClick={handleSave} 
                disabled={isSaving}
                style={{ 
                  flex: 1,
                  backgroundColor: isSaved ? '#28a745' : undefined,
                  opacity: isSaving ? 0.7 : 1
                }}
              >
                {isSaving ? '⏳ Saving...' : isSaved ? '✅ Saved!' : '💾 Save'}
              </button>
              <button className="btn-secondary" onClick={handleLike} style={{ flex: 1 }}>
                ❤️ {event.likes?.length || 0}
              </button>
            </div>
            
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
              <button 
                className="btn-secondary" 
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: event.title,
                      text: `Check out this event: ${event.title}`,
                      url: window.location.href
                    });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Event link copied to clipboard!');
                  }
                }}
                style={{ flex: 1 }}
              >
                📤 Share
              </button>
              <button 
                className="btn-secondary" 
                onClick={() => {
                  const eventDate = new Date(event.date);
                  const eventDetails = `${event.title}\n${eventDate.toLocaleDateString()} at ${event.time}\n${event.venue}, ${event.locationName}`;
                  const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${eventDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z/${eventDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z&details=${encodeURIComponent(eventDetails)}&location=${encodeURIComponent(event.venue)}`;
                  window.open(calendarUrl, '_blank');
                }}
                style={{ flex: 1 }}
              >
                📅 Add to Calendar
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Comments Section */}
      <div className="card" style={{ marginTop: '2rem' }}>
        <h2 style={{ marginBottom: '1.5rem' }}>💬 Comments ({comments.length})</h2>
        
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <textarea
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={3}
              style={{ flex: 1 }}
            />
            <button 
              className="btn-primary" 
              onClick={handleComment}
              disabled={!newComment.trim()}
              style={{ alignSelf: 'flex-start' }}
            >
              Post
            </button>
          </div>
        </div>
        
        <div>
          {comments.length === 0 ? (
            <p style={{ color: '#C7C7C7', textAlign: 'center', padding: '2rem' }}>No comments yet. Be the first to comment!</p>
          ) : (
            comments.map(comment => (
              <div key={comment._id} style={{ 
                padding: '1rem', 
                borderBottom: '1px solid #1F1F1F',
                marginBottom: '1rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: '600' }}>{comment.user?.username}</span>
                  <span style={{ color: '#888', fontSize: '0.8rem' }}>
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p style={{ color: '#C7C7C7' }}>{comment.text}</p>
              </div>
            ))
          )}
        </div>
      </div>
      
      {/* Payment Modal */}
      {showPaymentModal && (
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
          zIndex: 1000
        }}>
          <div className="card" style={{ 
            width: '400px',
            maxWidth: '90vw',
            margin: 0
          }}>
            <h2 style={{ marginBottom: '1rem' }}>📱 M-Pesa Payment</h2>
            <p style={{ color: '#C7C7C7', marginBottom: '1rem' }}>
              Tier: <span style={{ color: '#FF6A00' }}>{selectedTier}</span>
            </p>
            <p style={{ color: '#C7C7C7', marginBottom: '1.5rem' }}>
              Amount: <span style={{ color: '#FF6A00' }}>KES {event.ticketTiers.find(t => t.name === selectedTier)?.price.toLocaleString()}</span>
            </p>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ color: '#C7C7C7', marginBottom: '0.5rem', display: 'block' }}>
                M-Pesa Phone Number *
              </label>
              <input
                type="tel"
                placeholder="254712345678"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                style={{ width: '100%' }}
                autoFocus
              />
            </div>
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button 
                className="btn-secondary" 
                onClick={() => {
                  setShowPaymentModal(false);
                  setPhoneNumber('');
                }}
                style={{ flex: 1 }}
              >
                Cancel
              </button>
              <button 
                className="btn-primary" 
                onClick={processPayment}
                disabled={!phoneNumber.trim()}
                style={{ 
                  flex: 1,
                  opacity: !phoneNumber.trim() ? 0.5 : 1
                }}
              >
                Pay Now
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Processing Modal */}
      {isProcessing && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1001
        }}>
          <div className="card" style={{ 
            width: '350px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📱</div>
            <h2 style={{ marginBottom: '1rem' }}>Payment Processing</h2>
            <p style={{ color: '#C7C7C7', marginBottom: '1rem' }}>
              STK Push sent to your phone
            </p>
            <p style={{ color: '#FF6A00', fontSize: '0.9rem' }}>
              Enter your M-Pesa PIN to complete the purchase
            </p>
            <div style={{ 
              marginTop: '2rem',
              padding: '1rem',
              backgroundColor: '#1a1a1a',
              borderRadius: '8px'
            }}>
              <div className="loading-spinner" style={{
                width: '30px',
                height: '30px',
                border: '3px solid #333',
                borderTop: '3px solid #FF6A00',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto'
              }}></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetails;
