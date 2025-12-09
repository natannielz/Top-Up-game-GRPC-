import React from 'react';
import { Link } from 'react-router-dom';
import { Search, User, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user } = useAuth();
  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="logo">
          GAMER<span className="logo-accent">ZONE</span>
        </Link>

        {/* Desktop Nav */}
        <div className="nav-links">
          <Link to="/" className="nav-item active">Home</Link>
          <Link to="/games" className="nav-item">Games</Link>
          <Link to="/news" className="nav-item">News</Link>
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

          <button className="icon-btn mobile-menu-btn">
            <Menu size={24} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
