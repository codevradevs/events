import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Sidebar = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;
  
  const linkStyle = (path) => ({
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-sm)',
    padding: 'var(--spacing-sm) var(--spacing-md)',
    borderRadius: 'var(--radius-sm)',
    textDecoration: 'none',
    color: isActive(path) ? 'var(--primary-color)' : 'var(--text-secondary)',
    backgroundColor: isActive(path) ? 'rgba(255, 106, 0, 0.1)' : 'transparent',
    transition: 'all 0.3s ease'
  });

  if (!user) return null;

  return (
    <div className="sidebar" style={{
      width: '250px',
      background: 'var(--bg-card)',
      borderRight: '1px solid var(--border-color)',
      padding: 'var(--spacing-lg)',
      position: 'fixed',
      left: 0,
      top: '70px',
      bottom: 0,
      overflowY: 'auto',
      zIndex: 50
    }}>
      <div style={{ marginBottom: 'var(--spacing-xl)' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-md)',
          marginBottom: 'var(--spacing-lg)'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'var(--primary-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--bg-primary)',
            fontWeight: 'bold'
          }}>
            {user.username.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="font-medium">{user.username}</div>
            <div className="text-orange text-sm">({user.rank || 'Rookie'})</div>
          </div>
        </div>
      </div>

      <nav>
        <div style={{ marginBottom: 'var(--spacing-lg)' }}>
          <h4 className="text-muted text-sm mb-md">MAIN</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
            {user.role === 'admin' ? (
              <>
                <Link to="/admin" className={isActive('/admin') ? 'active' : ''} style={linkStyle('/admin')}>
                  ⚙️ Admin Panel
                </Link>
                <Link to="/features" className={isActive('/features') ? 'active' : ''} style={linkStyle('/features')}>
                  🌟 Platform Features
                </Link>
              </>
            ) : user.role === 'organizer' ? (
              <>
                <Link to="/dashboard" className={isActive('/dashboard') ? 'active' : ''} style={linkStyle('/dashboard')}>
                  📊 Dashboard
                </Link>
                <Link to="/create-event" className={isActive('/create-event') ? 'active' : ''} style={linkStyle('/create-event')}>
                  ➕ Create Event
                </Link>
                <Link to="/my-tickets" className={isActive('/my-tickets') ? 'active' : ''} style={linkStyle('/my-tickets')}>
                  🎫 My Tickets
                </Link>
              </>
            ) : (
              <>
                <Link to="/user-dashboard" className={isActive('/user-dashboard') ? 'active' : ''} style={linkStyle('/user-dashboard')}>
                  📊 Dashboard
                </Link>
                <Link to="/my-tickets" className={isActive('/my-tickets') ? 'active' : ''} style={linkStyle('/my-tickets')}>
                  🎫 My Tickets
                </Link>
                <Link to="/features" className={isActive('/features') ? 'active' : ''} style={linkStyle('/features')}>
                  🌟 Features
                </Link>
              </>
            )}
            <Link to="/profile" className={isActive('/profile') ? 'active' : ''} style={linkStyle('/profile')}>
              👤 Profile
            </Link>
          </div>
        </div>

        <div style={{ marginBottom: 'var(--spacing-lg)' }}>
          <h4 className="text-muted text-sm mb-md">{user.role === 'admin' ? 'MANAGEMENT' : user.role === 'organizer' ? 'ORGANIZER TOOLS' : 'ACTIVITY'}</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
            {user.role === 'admin' ? (
              <>
                <Link to="/transaction-analytics" className={isActive('/transaction-analytics') ? 'active' : ''} style={linkStyle('/transaction-analytics')}>
                  💰 Transaction Analytics
                </Link>
                <Link to="/notifications" className={isActive('/notifications') ? 'active' : ''} style={linkStyle('/notifications')}>
                  🔔 System Notifications
                </Link>
              </>
            ) : user.role === 'organizer' ? (
              <>
                <Link to="/scanner" className={isActive('/scanner') ? 'active' : ''} style={linkStyle('/scanner')}>
                  📱 QR Scanner
                </Link>
                <Link to="/payout" className={isActive('/payout') ? 'active' : ''} style={linkStyle('/payout')}>
                  💰 Payouts
                </Link>
                <Link to="/subscription" className={isActive('/subscription') ? 'active' : ''} style={linkStyle('/subscription')}>
                  ⭐ Upgrade
                </Link>
              </>
            ) : (
              <>
                <Link to="/notifications" className={isActive('/notifications') ? 'active' : ''} style={linkStyle('/notifications')}>
                  🔔 Notifications
                </Link>
                <Link to="/feed" className={isActive('/feed') ? 'active' : ''} style={linkStyle('/feed')}>
                  📱 Feed
                </Link>
                <Link to="/chat" className={isActive('/chat') ? 'active' : ''} style={linkStyle('/chat')}>
                  💬 Chat
                </Link>
              </>
            )}
          </div>
        </div>



        <div>
          <h4 className="text-muted text-sm mb-md">SETTINGS</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
            <Link to="/settings" className={isActive('/settings') ? 'active' : ''} style={linkStyle('/settings')}>
              ⚙️ Settings
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;