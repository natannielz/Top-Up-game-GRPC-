import React from 'react';
import MainLayout from '../layouts/MainLayout';
import { Shield, Zap, Globe, Users } from 'lucide-react';

const AboutPage = () => {
  return (
    <MainLayout>
      <div className="section-container" style={{ padding: '120px 20px 40px', maxWidth: '800px', margin: '0 auto' }}>
        <h1 className="section-title">ABOUT US</h1>

        <div className="glass-panel" style={{ padding: '40px', borderRadius: '20px' }}>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#ddd', marginBottom: '40px', textAlign: 'center' }}>
            GamerZone is the leading platform for digital game top-ups. We provide a seamless, secure, and instant way for gamers to purchase in-game currencies for their favorite titles.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '30px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '60px', height: '60px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px', color: 'var(--primary)' }}>
                <Shield size={32} />
              </div>
              <h3>Secure</h3>
              <p style={{ color: '#aaa', fontSize: '0.9rem' }}>Bank-grade encryption for all transactions.</p>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '60px', height: '60px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px', color: 'var(--primary)' }}>
                <Zap size={32} />
              </div>
              <h3>Instant</h3>
              <p style={{ color: '#aaa', fontSize: '0.9rem' }}>Delivery within seconds of payment.</p>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '60px', height: '60px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px', color: 'var(--primary)' }}>
                <Globe size={32} />
              </div>
              <h3>Global</h3>
              <p style={{ color: '#aaa', fontSize: '0.9rem' }}>Supporting games and currencies worldwide.</p>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '60px', height: '60px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px', color: 'var(--primary)' }}>
                <Users size={32} />
              </div>
              <h3>Community</h3>
              <p style={{ color: '#aaa', fontSize: '0.9rem' }}>Trusted by over 1 million gamers.</p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AboutPage;
