import React from 'react';
import MainLayout from '../layouts/MainLayout';
import { newsData } from '../data/news';

const NewsPage = () => {
  return (
    <MainLayout>
      <div className="section-container" style={{ padding: '120px 20px 40px' }}>
        <h1 className="section-title">LATEST NEWS</h1>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', maxWidth: '1000px', margin: '0 auto' }}>
          {newsData.map(item => (
            <div key={item.id} className="glass-panel" style={{ borderRadius: '16px', overflow: 'hidden' }}>
              <img src={item.image} alt={item.title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
              <div style={{ padding: '24px' }}>
                <span style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 'bold' }}>{item.date}</span>
                <h3 style={{ margin: '10px 0', fontSize: '1.25rem' }}>{item.title}</h3>
                <p style={{ color: '#aaa', lineHeight: '1.6' }}>{item.excerpt}</p>
                <button style={{ marginTop: '15px', background: 'transparent', border: 'none', color: 'var(--primary)', cursor: 'pointer', padding: 0, fontWeight: 'bold' }}>READ MORE &rarr;</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default NewsPage;
