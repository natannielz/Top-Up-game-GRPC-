import React from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Hero3D from '../components/Hero3D';
import GameGrid from '../components/GameGrid';
import { newsData } from '../data/news';

const Home = () => {
  // Show only first 2 or 3 news items on Home
  const latestNews = newsData.slice(0, 3);

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
          {latestNews.map(item => (
            <div key={item.id} className="glass-panel" style={{ borderRadius: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <img src={item.image} alt={item.title} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
              <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <span style={{ color: 'var(--primary)', fontSize: '0.8rem', marginBottom: '5px' }}>{item.date}</span>
                <h3 style={{ marginTop: 0, marginBottom: '10px', fontSize: '1.2rem' }}>{item.title}</h3>
                <p style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '15px', flex: 1 }}>{item.excerpt}</p>
                <Link to="/news" style={{ color: '#fff', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.9rem', alignSelf: 'flex-start' }}>Read More &rarr;</Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </MainLayout>
  );
};

export default Home;
