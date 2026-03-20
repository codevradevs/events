import React, { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/" style={{ color: '#FF6A00', fontSize: '1.5rem', fontWeight: '700', textDecoration: 'none' }}>
          TICKEX
        </Link>
      </div>
      
      {/* Desktop Navigation */}
      <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Link 
          to="/browse" 
          className={isActive('/browse') ? 'active' : ''}
          style={{ 
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            textDecoration: 'none',
            color: isActive('/browse') ? 'var(--primary-color)' : 'var(--text-secondary)',
            backgroundColor: isActive('/browse') ? 'rgba(255, 106, 0, 0.1)' : 'transparent'
          }}
        >
          Browse
        </Link>
        
        <Link 
          to="/blog" 
          className={isActive('/blog') ? 'active' : ''}
          style={{ 
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            textDecoration: 'none',
            color: isActive('/blog') ? 'var(--primary-color)' : 'var(--text-secondary)',
            backgroundColor: isActive('/blog') ? 'rgba(255, 106, 0, 0.1)' : 'transparent'
          }}
        >
          Blog
        </Link>
        
        <Link 
          to="/holidays" 
          className={isActive('/holidays') ? 'active' : ''}
          style={{ 
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            textDecoration: 'none',
            color: isActive('/holidays') ? 'var(--primary-color)' : 'var(--text-secondary)',
            backgroundColor: isActive('/holidays') ? 'rgba(255, 106, 0, 0.1)' : 'transparent'
          }}
        >
          Holidays
        </Link>
        
        {!user ? (
          <>
            <Link 
              to="/login"
              style={{ 
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                textDecoration: 'none',
                color: 'var(--text-secondary)'
              }}
            >
              Login
            </Link>
            <Link 
              to="/register" 
              className="btn-primary" 
              style={{ 
                padding: '0.5rem 1rem', 
                textDecoration: 'none',
                fontSize: '0.9rem'
              }}
            >
              Join TICKEX
            </Link>
          </>
        ) : (
          <button 
            className="btn-secondary" 
            onClick={logout}
            style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
          >
            Logout
          </button>
        )}
      </div>
      
      {/* Mobile Menu Button */}
      <button 
        className="mobile-menu-btn"
        onClick={() => setShowMobileMenu(!showMobileMenu)}
        style={{
          display: 'none',
          background: 'transparent',
          border: 'none',
          color: '#FF6A00',
          fontSize: '1.5rem',
          cursor: 'pointer'
        }}
      >
        ☰
      </button>
      
      {/* Mobile Menu */}
      {showMobileMenu && (
        <div 
          className="mobile-menu"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: '#000000',
            border: '1px solid #1A1A1A',
            borderTop: 'none',
            padding: '1rem',
            display: 'none',
            flexDirection: 'column',
            gap: '0.5rem'
          }}
        >
          <Link to="/browse" onClick={() => setShowMobileMenu(false)}>Browse</Link>
          <Link to="/blog" onClick={() => setShowMobileMenu(false)}>Blog</Link>
          <Link to="/holidays" onClick={() => setShowMobileMenu(false)}>Holidays</Link>
          {!user ? (
            <>
              <Link to="/login" onClick={() => setShowMobileMenu(false)}>Login</Link>
              <Link to="/register" onClick={() => setShowMobileMenu(false)}>Join TICKEX</Link>
            </>
          ) : (
            <button className="btn-secondary" onClick={() => { logout(); setShowMobileMenu(false); }}>Logout</button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;