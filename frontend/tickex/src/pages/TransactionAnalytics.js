import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TransactionAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [settings, setSettings] = useState({ platformFeePercentage: 5 });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchAnalytics();
    fetchSettings();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get('http://localhost:5000/api/admin/transaction-analytics', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    }
  };

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get('http://localhost:5000/api/admin/platform-settings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSettings(data);
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    }
  };

  const updateSettings = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:5000/api/admin/platform-settings', settings, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsEditing(false);
      fetchAnalytics();
      fetchAnalytics();
    } catch (error) {
      console.error('Failed to update settings:', error);
    }
  };

  if (!analytics) return <div className="dashboard-container">Loading...</div>;

  return (
    <div className="dashboard-container fade-in">
      <div className="dashboard-header">
        <h1>💰 Transaction Analytics</h1>
      </div>

      <div className="stats-grid" style={{ marginBottom: '2rem' }}>
        <div className="stat-card">
          <div className="stat-number">KES {analytics.totalRevenue?.toLocaleString()}</div>
          <div className="stat-label">Total Revenue</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">KES {analytics.platformEarnings?.toLocaleString()}</div>
          <div className="stat-label">Platform Earnings</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">KES {analytics.organizerEarnings?.toLocaleString()}</div>
          <div className="stat-label">Organizer Earnings</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{analytics.totalTransactions}</div>
          <div className="stat-label">Total Transactions</div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2>⚙️ Platform Settings</h2>
          <button 
            className="btn-primary" 
            onClick={() => isEditing ? updateSettings() : setIsEditing(true)}
          >
            {isEditing ? '💾 Save' : '✏️ Edit'}
          </button>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ color: '#C7C7C7', marginBottom: '0.5rem', display: 'block' }}>
              Platform Fee (%)
            </label>
            <input
              type="number"
              value={settings.platformFeePercentage}
              onChange={(e) => setSettings({ ...settings, platformFeePercentage: parseFloat(e.target.value) })}
              disabled={!isEditing}
              style={{ width: '100%' }}
            />
          </div>
          <div>
            <label style={{ color: '#C7C7C7', marginBottom: '0.5rem', display: 'block' }}>
              Fixed Service Fee (KES)
            </label>
            <input
              type="number"
              value={settings.fixedServiceFee}
              onChange={(e) => setSettings({ ...settings, fixedServiceFee: parseFloat(e.target.value) })}
              disabled={!isEditing}
              style={{ width: '100%' }}
            />
          </div>
          <div>
            <label style={{ color: '#C7C7C7', marginBottom: '0.5rem', display: 'block' }}>
              Gateway Fee (%)
            </label>
            <input
              type="number"
              value={settings.gatewayFeePercentage}
              onChange={(e) => setSettings({ ...settings, gatewayFeePercentage: parseFloat(e.target.value) })}
              disabled={!isEditing}
              style={{ width: '100%' }}
            />
          </div>
        </div>
      </div>

      <div className="card">
        <h2>📊 Recent Transactions</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #333' }}>
                <th style={{ padding: '1rem', textAlign: 'left', color: '#FF6A00' }}>Event</th>
                <th style={{ padding: '1rem', textAlign: 'left', color: '#FF6A00' }}>Organizer</th>
                <th style={{ padding: '1rem', textAlign: 'left', color: '#FF6A00' }}>Amount</th>
                <th style={{ padding: '1rem', textAlign: 'left', color: '#FF6A00' }}>Platform Fee</th>
                <th style={{ padding: '1rem', textAlign: 'left', color: '#FF6A00' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {analytics.recentTransactions?.map(transaction => (
                <tr key={transaction._id} style={{ borderBottom: '1px solid #333' }}>
                  <td style={{ padding: '1rem' }}>{transaction.event?.title}</td>
                  <td style={{ padding: '1rem', color: '#C7C7C7' }}>{transaction.organizer?.username}</td>
                  <td style={{ padding: '1rem', color: '#C7C7C7' }}>KES {transaction.amount?.toLocaleString()}</td>
                  <td style={{ padding: '1rem', color: '#FF6A00' }}>
                    KES {(transaction.amount * settings.platformFeePercentage / 100)?.toLocaleString()}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ 
                      color: transaction.status === 'success' ? '#4CAF50' : '#f44336',
                      fontWeight: 'bold'
                    }}>
                      {transaction.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TransactionAnalytics;