import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, User, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleProfileClick = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      navigate(`/games?q=${searchQuery}`);
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="logo" onClick={closeMenu}>
          GAMER<span className="logo-accent">ZONE</span>
        </Link>

        {/* Desktop Nav */}
        <div className="nav-links">
          <Link to="/" className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>Home</Link>
          <Link to="/games" className={`nav-item ${location.pathname === '/games' ? 'active' : ''}`}>Games</Link>
          <Link to="/news" className={`nav-item ${location.pathname === '/news' ? 'active' : ''}`}>News</Link>
        </div>

        <div className="nav-actions">
          <div className="search-bar">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Find your game..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
            />
          </div>

          <button
            className="icon-btn profile-btn"
            onClick={handleProfileClick}
          >
            {user ? <img src={user.avatar} className="nav-avatar" alt="User" /> : <User size={20} />}
          </button>

          <button className="icon-btn mobile-menu-btn" onClick={toggleMenu}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        <Link to="/" className={`mobile-nav-item ${location.pathname === '/' ? 'active' : ''}`} onClick={closeMenu}>Home</Link>
        <Link to="/games" className={`mobile-nav-item ${location.pathname === '/games' ? 'active' : ''}`} onClick={closeMenu}>Games</Link>
        <Link to="/news" className={`mobile-nav-item ${location.pathname === '/news' ? 'active' : ''}`} onClick={closeMenu}>News</Link>
        {user ? (
          <Link to="/dashboard" className="mobile-nav-item" onClick={closeMenu}>My Dashboard</Link>
        ) : (
          <Link to="/login" className="mobile-nav-item" onClick={closeMenu}>Login / Register</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
