import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import './ContactPage.css';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate API call
    setTimeout(() => {
      setSubmitted(true);
    }, 1000);
  };

  return (
    <MainLayout>
      <div className="section-container contact-page">
        <h1 className="section-title">CONTACT US</h1>
        <p className="page-subtitle">We&apos;re here to help! Reach out to us for any questions or support.</p>

        <div className="contact-grid">
          {/* Contact Info */}
          <div className="contact-info-card glass-panel">
            <h2>Get in Touch</h2>
            <p>Our support team is available 24/7 to assist you with your top-up needs.</p>

            <div className="info-item">
              <div className="icon-box"><Mail size={20} /></div>
              <div>
                <h3>Email</h3>
                <p>support@gamerzone.com</p>
              </div>
            </div>

            <div className="info-item">
              <div className="icon-box"><Phone size={20} /></div>
              <div>
                <h3>Phone</h3>
                <p>+1 (555) 123-4567</p>
              </div>
            </div>

            <div className="info-item">
              <div className="icon-box"><MapPin size={20} /></div>
              <div>
                <h3>Office</h3>
                <p>123 Gaming St, Tech City, USA</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="contact-form-card glass-panel">
            {submitted ? (
              <div className="success-message">
                <div className="success-icon"><Send size={40} /></div>
                <h3>Message Sent!</h3>
                <p>Thanks for contacting us. We&apos;ll get back to you shortly.</p>
                <button onClick={() => setSubmitted(false)} className="secondary-btn">Send Another</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Your Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Subject</label>
                  <select name="subject" value={formData.subject} onChange={handleChange}>
                    <option value="General">General Inquiry</option>
                    <option value="Support">Payment Support</option>
                    <option value="Partnership">Partnership</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Message</label>
                  <textarea
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>

                <button type="submit" className="primary-btn submit-btn">
                  Send Message <Send size={18} />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ContactPage;
