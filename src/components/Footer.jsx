import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <Link to="/" className="footer-logo">
            GAMER<span className="logo-accent">ZONE</span>
          </Link>
          <p className="footer-desc">
            Your ultimate destination for game top-ups and digital vouchers.
            Secure, fast, and reliable service for gamers worldwide.
          </p>
          <div className="social-links">
            <a href="#" className="social-icon"><Facebook size={20} /></a>
            <a href="#" className="social-icon"><Twitter size={20} /></a>
            <a href="#" className="social-icon"><Instagram size={20} /></a>
          </div>
        </div>

        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/games">Games</Link></li>
            <li><Link to="/news">News</Link></li>
            <li><Link to="/about">About Us</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Support</h3>
          <ul className="footer-links">
            <li><Link to="/contact">Contact Us</Link></li>
            <li><Link to="/faq">FAQ</Link></li>
            <li><Link to="/terms">Terms of Service</Link></li>
            <li><Link to="/privacy">Privacy Policy</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Contact</h3>
          <div className="contact-info">
            <div className="contact-item">
              <Mail size={16} />
              <span>support@gamerzone.com</span>
            </div>
            <div className="contact-item">
              <Phone size={16} />
              <span>+1 (555) 123-4567</span>
            </div>
            <div className="contact-item">
              <MapPin size={16} />
              <span>123 Gaming St, Tech City</span>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} GamerZone. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
