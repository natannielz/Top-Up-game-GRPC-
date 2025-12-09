import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, User, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="logo">
          GAMER<span className="logo-accent">ZONE</span>
        </Link>

        {/* Desktop Nav */}
        <div className={`nav-links ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          <Link to="/" className={`nav-item ${isActive('/')}`} onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
          <Link to="/games" className={`nav-item ${isActive('/games')}`} onClick={() => setIsMobileMenuOpen(false)}>Games</Link>
          <Link to="/news" className={`nav-item ${isActive('/news')}`} onClick={() => setIsMobileMenuOpen(false)}>News</Link>
          <Link to="/about" className={`nav-item ${isActive('/about')}`} onClick={() => setIsMobileMenuOpen(false)}>About</Link>
        </div>

        <div className="nav-actions">
          <div className="search-bar">
            <Search size={18} className="search-icon" />
            <input type="text" placeholder="Find your game..." />
          </div>

          <button
            className="icon-btn profile-btn"
            onClick={() => user ? window.location.href = '/dashboard' : window.location.href = '/login'}
          >
            {user ? <img src={user.avatar} className="nav-avatar" alt="User" /> : <User size={20} />}
          </button>

          <button className="icon-btn mobile-menu-btn" onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
