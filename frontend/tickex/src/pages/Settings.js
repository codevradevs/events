import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const Settings = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    eventReminders: true,
    priceDropAlerts: true,
    organizerUpdates: true,
    marketingEmails: false,
    locationServices: true,
    darkMode: true
  });
  const [profile, setProfile] = useState({
    username: user?.username || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || ''
  });
  const [password, setPassword] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSettingsChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleProfileChange = (key, value) => {
    setProfile(prev => ({ ...prev, [key]: value }));
  };

  const handlePasswordChange = (key, value) => {
    setPassword(prev => ({ ...prev, [key]: value }));
  };

  const saveSettings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:5000/api/users/settings', settings, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Settings saved successfully!');
    } catch (error) {
      alert('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.put('http://localhost:5000/api/users/profile', profile, {
        headers: { Authorization: `Bearer ${token}` }
      });
      updateUser(data);
      alert('Profile updated successfully!');
    } catch (error) {
      alert('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async () => {
    if (password.new !== password.confirm) {
      alert('New passwords do not match');
      return;
    }
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:5000/api/users/password', {
        currentPassword: password.current,
        newPassword: password.new
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPassword({ current: '', new: '', confirm: '' });
      alert('Password changed successfully!');
    } catch (error) {
      alert('Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const deleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete('http://localhost:5000/api/users/account', {
        headers: { Authorization: `Bearer ${token}` }
      });
      localStorage.removeItem('token');
      window.location.href = '/';
    } catch (error) {
      alert('Failed to delete account');
    }
  };

  return (
    <div className="dashboard-container fade-in">
      <div className="dashboard-header">
        <h1>⚙️ Settings</h1>
      </div>

      {/* Profile Settings */}
      <div className="card mb-xl">
        <h2 className="mb-lg">👤 Profile Information</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--spacing-md)' }}>
          <div>
            <label className="text-muted text-sm">Username</label>
            <input
              type="text"
              value={profile.username}
              onChange={(e) => handleProfileChange('username', e.target.value)}
            />
          </div>
          <div>
            <label className="text-muted text-sm">Email</label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => handleProfileChange('email', e.target.value)}
            />
          </div>
          <div>
            <label className="text-muted text-sm">Phone</label>
            <input
              type="tel"
              value={profile.phone}
              onChange={(e) => handleProfileChange('phone', e.target.value)}
            />
          </div>
          <div>
            <label className="text-muted text-sm">Location</label>
            <input
              type="text"
              value={profile.location}
              onChange={(e) => handleProfileChange('location', e.target.value)}
            />
          </div>
        </div>
        <button className="btn-primary mt-lg" onClick={saveProfile} disabled={loading}>
          {loading ? 'Saving...' : 'Save Profile'}
        </button>
      </div>

      {/* Notification Settings */}
      <div className="card mb-xl">
        <h2 className="mb-lg">🔔 Notifications</h2>
        <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
          {Object.entries({
            emailNotifications: 'Email Notifications',
            pushNotifications: 'Push Notifications',
            eventReminders: 'Event Reminders',
            priceDropAlerts: 'Price Drop Alerts',
            organizerUpdates: 'Organizer Updates',
            marketingEmails: 'Marketing Emails'
          }).map(([key, label]) => (
            <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{label}</span>
              <label style={{ position: 'relative', display: 'inline-block', width: '60px', height: '34px' }}>
                <input
                  type="checkbox"
                  checked={settings[key]}
                  onChange={(e) => handleSettingsChange(key, e.target.checked)}
                  style={{ opacity: 0, width: 0, height: 0 }}
                />
                <span style={{
                  position: 'absolute',
                  cursor: 'pointer',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: settings[key] ? 'var(--primary-color)' : '#ccc',
                  transition: '0.4s',
                  borderRadius: '34px'
                }}>
                  <span style={{
                    position: 'absolute',
                    content: '',
                    height: '26px',
                    width: '26px',
                    left: settings[key] ? '30px' : '4px',
                    bottom: '4px',
                    backgroundColor: 'white',
                    transition: '0.4s',
                    borderRadius: '50%'
                  }}></span>
                </span>
              </label>
            </div>
          ))}
        </div>
        <button className="btn-primary mt-lg" onClick={saveSettings} disabled={loading}>
          {loading ? 'Saving...' : 'Save Notifications'}
        </button>
      </div>

      {/* Password Change */}
      <div className="card mb-xl">
        <h2 className="mb-lg">🔒 Change Password</h2>
        <div style={{ display: 'grid', gap: 'var(--spacing-md)', maxWidth: '400px' }}>
          <div>
            <label className="text-muted text-sm">Current Password</label>
            <input
              type="password"
              value={password.current}
              onChange={(e) => handlePasswordChange('current', e.target.value)}
            />
          </div>
          <div>
            <label className="text-muted text-sm">New Password</label>
            <input
              type="password"
              value={password.new}
              onChange={(e) => handlePasswordChange('new', e.target.value)}
            />
          </div>
          <div>
            <label className="text-muted text-sm">Confirm New Password</label>
            <input
              type="password"
              value={password.confirm}
              onChange={(e) => handlePasswordChange('confirm', e.target.value)}
            />
          </div>
        </div>
        <button className="btn-primary mt-lg" onClick={changePassword} disabled={loading}>
          {loading ? 'Changing...' : 'Change Password'}
        </button>
      </div>

      {/* Danger Zone */}
      <div className="card" style={{ borderColor: '#ef4444' }}>
        <h2 className="mb-lg" style={{ color: '#ef4444' }}>⚠️ Danger Zone</h2>
        <p className="text-muted mb-lg">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <button 
          className="btn-secondary" 
          onClick={deleteAccount}
          style={{ 
            borderColor: '#ef4444', 
            color: '#ef4444',
            ':hover': { backgroundColor: 'rgba(239, 68, 68, 0.1)' }
          }}
        >
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default Settings;