import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    phone: '',
    role: 'user',
    adminSecret: ''
  });
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      navigate('/');
    } catch (error) {
      alert('Registration failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card fade-in">
        <h1>Join <span className="text-orange">TICKEX</span></h1>
        <p style={{ color: '#C7C7C7', marginBottom: '2rem' }}>Create your account and start discovering events</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
          <input
            type="tel"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            required
          />
          <select
            value={formData.role || 'user'}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          >
            <option value="user">User</option>
            <option value="organizer">Organizer</option>
            <option value="admin">Admin</option>
          </select>
          {formData.role === 'admin' && (
            <input
              type="password"
              placeholder="Admin Secret Key"
              value={formData.adminSecret}
              onChange={(e) => setFormData({ ...formData, adminSecret: e.target.value })}
              required
            />
          )}
          <button type="submit" className="btn-primary">Create Account</button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1rem', color: '#C7C7C7' }}>
          Already have an account? <a href="/login" className="text-orange">Login</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
