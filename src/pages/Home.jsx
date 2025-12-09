import React from 'react';
import MainLayout from '../layouts/MainLayout';
import Hero3D from '../components/Hero3D';
import GameGrid from '../components/GameGrid';

const Home = () => {
  return (
    <MainLayout>
      <Hero3D />

      <section className="section-container" style={{ padding: '40px 20px' }}>
        <h2 className="section-title">TRENDING GAMES</h2>
        <GameGrid />
      </section>

      <section className="section-container" style={{ padding: '40px 20px', background: 'var(--bg-slate)' }}>
        <h2 className="section-title">LATEST NEWS</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          <div className="glass-panel" style={{ padding: '20px', borderRadius: '12px', background: 'rgba(0,0,0,0.2)' }}>
            <h3 style={{ marginTop: 0 }}>Winter Event Live!</h3>
            <p style={{ color: '#aaa' }}>Get 50% extra bonus on all Ice Packs.</p>
          </div>
          <div className="glass-panel" style={{ padding: '20px', borderRadius: '12px', background: 'rgba(0,0,0,0.2)' }}>
            <h3 style={{ marginTop: 0 }}>New Game Added: Cyber Battle</h3>
            <p style={{ color: '#aaa' }}>Experience the future of combat today.</p>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Home;
