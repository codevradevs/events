import React, { useState, useRef } from 'react';
import axios from 'axios';
import QrScanner from 'qr-scanner';

const QRScanner = () => {
  const [qrData, setQrData] = useState('');
  const [result, setResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);

  const validateTicket = async () => {
    if (!qrData.trim()) {
      setResult({ error: 'Please enter QR code data' });
      return;
    }

    setIsScanning(true);
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.post('http://localhost:5000/api/tickets/validate/scan', {
        qrData: qrData
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResult({ success: true, data });
    } catch (error) {
      setResult({ error: error.response?.data?.message || 'Validation failed' });
    } finally {
      setIsScanning(false);
    }
  };

  const clearResult = () => {
    setResult(null);
    setQrData('');
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setSelectedImage(file);
    setIsScanning(true);
    
    try {
      const result = await QrScanner.scanImage(file);
      setQrData(result);
      setResult(null); // Clear previous results
    } catch (error) {
      setResult({ error: 'Could not read QR code from image. Please try a clearer image.' });
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="dashboard-container fade-in">
      <div className="card">
        <h1 style={{ marginBottom: '2rem', textAlign: 'center' }}>🎫 Ticket Scanner</h1>
        
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#C7C7C7' }}>
                📷 Upload QR Code Image
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ 
                  width: '100%',
                  padding: '0.75rem',
                  backgroundColor: '#2a2a2a',
                  border: '1px solid #444',
                  borderRadius: '8px',
                  color: '#C7C7C7'
                }}
              />
              {selectedImage && (
                <p style={{ color: '#FF6A00', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                  📁 {selectedImage.name}
                </p>
              )}
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#C7C7C7' }}>
                📝 Or Paste QR Code Data
              </label>
              <textarea
                placeholder="Paste QR code data here..."
                value={qrData}
                onChange={(e) => setQrData(e.target.value)}
                rows={3}
                style={{ 
                  width: '100%',
                  resize: 'vertical'
                }}
              />
            </div>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <button 
            className="btn-primary" 
            onClick={validateTicket}
            disabled={isScanning || !qrData.trim()}
            style={{ 
              flex: 1,
              opacity: (isScanning || !qrData.trim()) ? 0.5 : 1
            }}
          >
            {isScanning ? '⏳ Validating...' : '✅ Validate Ticket'}
          </button>
          <button 
            className="btn-secondary" 
            onClick={clearResult}
            style={{ flex: 1 }}
          >
            🔄 Clear
          </button>
        </div>
        
        {result && (
          <div className="card" style={{
            backgroundColor: result.error ? '#2d1b1b' : '#1b2d1b',
            border: result.error ? '1px solid #ff4444' : '1px solid #44ff44',
            marginTop: '1rem'
          }}>
            {result.error ? (
              <div>
                <h3 style={{ color: '#ff4444', marginBottom: '1rem' }}>❌ Validation Failed</h3>
                <p style={{ color: '#ffaaaa' }}>{result.error}</p>
              </div>
            ) : (
              <div>
                <h3 style={{ color: '#44ff44', marginBottom: '1rem' }}>✅ Ticket Valid!</h3>
                <div style={{ color: '#C7C7C7' }}>
                  <p><strong>Ticket ID:</strong> {result.data.ticket._id}</p>
                  <p><strong>Buyer:</strong> {result.data.ticket.buyer}</p>
                  <p><strong>Event:</strong> {result.data.ticket.event}</p>
                  <p><strong>Tier:</strong> {result.data.ticket.tier}</p>
                  <p><strong>Scanned At:</strong> {new Date(result.data.ticket.scannedAt).toLocaleString()}</p>
                </div>
              </div>
            )}
          </div>
        )}
        
        <div className="card" style={{ 
          marginTop: '2rem', 
          backgroundColor: '#1a1a1a',
          border: '1px solid #333'
        }}>
          <h3 style={{ color: '#FF6A00', marginBottom: '1rem' }}>📱 How to Use</h3>
          <ol style={{ color: '#C7C7C7', lineHeight: '1.6' }}>
            <li><strong>Method 1:</strong> Upload an image of the QR code using the file input</li>
            <li><strong>Method 2:</strong> Copy and paste the QR code data manually</li>
            <li>Click "Validate Ticket" to verify the ticket</li>
            <li>Green = Valid ticket, Red = Invalid/Used ticket</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default QRScanner;
