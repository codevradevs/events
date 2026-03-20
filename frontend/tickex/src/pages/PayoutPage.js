import React, { useState } from 'react';
import axios from 'axios';

const PayoutPage = () => {
  const [formData, setFormData] = useState({
    phone: '',
    amount: ''
  });
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/payments/stk', {
        phone: formData.phone,
        amount: parseInt(formData.amount)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setPaymentStatus({
        type: 'success',
        message: 'STK Push sent to your phone. Enter your M-Pesa PIN to complete payment.'
      });
      
      // Poll for payment status
      setTimeout(() => checkPaymentStatus(response.data.checkoutRequestId), 5000);
      
    } catch (error) {
      setPaymentStatus({
        type: 'error',
        message: 'Payment failed. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const checkPaymentStatus = async (checkoutId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/payments/status/${checkoutId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.status === 'success') {
        setPaymentStatus({
          type: 'success',
          message: `Payment successful! Receipt: ${response.data.receipt}`
        });
      } else if (response.data.status === 'failed') {
        setPaymentStatus({
          type: 'error',
          message: 'Payment failed. Please try again.'
        });
      } else {
        // Still pending, check again
        setTimeout(() => checkPaymentStatus(checkoutId), 3000);
      }
    } catch (error) {
      console.error('Status check failed:', error);
    }
  };

  return (
    <div className="dashboard-container fade-in">
      <div className="dashboard-header">
        <h1>💳 M-Pesa Payment</h1>
      </div>

      <div className="card" style={{ maxWidth: '500px', margin: '0 auto' }}>
        <h2>🚀 Quick Payment</h2>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ color: '#C7C7C7', marginBottom: '0.5rem', display: 'block' }}>
              Phone Number *
            </label>
            <input
              type="tel"
              placeholder="254712345678"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
              style={{ width: '100%' }}
            />
            <p style={{ color: '#888', fontSize: '0.8rem', marginTop: '0.3rem' }}>
              Enter your M-Pesa registered phone number
            </p>
          </div>

          <div>
            <label style={{ color: '#C7C7C7', marginBottom: '0.5rem', display: 'block' }}>
              Amount (KES) *
            </label>
            <input
              type="number"
              placeholder="1000"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
              min="1"
              style={{ width: '100%' }}
            />
          </div>

          <button 
            type="submit" 
            className="btn-primary"
            disabled={loading}
            style={{ 
              padding: '1rem',
              fontSize: '1.1rem',
              opacity: loading ? 0.6 : 1
            }}
          >
            {loading ? '⏳ Processing...' : '📱 Pay with M-Pesa'}
          </button>
        </form>

        {paymentStatus && (
          <div 
            className="card"
            style={{ 
              marginTop: '2rem',
              backgroundColor: paymentStatus.type === 'success' ? '#1a4d1a' : '#4d1a1a',
              border: `1px solid ${paymentStatus.type === 'success' ? '#4CAF50' : '#f44336'}`
            }}
          >
            <p style={{ 
              color: paymentStatus.type === 'success' ? '#4CAF50' : '#f44336',
              textAlign: 'center',
              margin: 0
            }}>
              {paymentStatus.message}
            </p>
          </div>
        )}

        <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#1a1a1a', borderRadius: '8px' }}>
          <h3 style={{ color: '#FF6A00', marginBottom: '1rem' }}>📋 How it works:</h3>
          <ol style={{ color: '#C7C7C7', paddingLeft: '1.5rem' }}>
            <li>Enter your M-Pesa phone number and amount</li>
            <li>Click "Pay with M-Pesa"</li>
            <li>Check your phone for STK Push prompt</li>
            <li>Enter your M-Pesa PIN</li>
            <li>Payment confirmation will appear here</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default PayoutPage;