import React from 'react';
import MainLayout from '../layouts/MainLayout';

const NewsPage = () => {
  const newsItems = [
    {
      id: 1,
      title: "Winter Event Live!",
      date: "Oct 25, 2023",
      excerpt: "Get 50% extra bonus on all Ice Packs during our special winter event.",
      image: "https://placehold.co/600x400/1e293b/fff?text=Winter+Event"
    },
    {
      id: 2,
      title: "New Game Added: Cyber Battle",
      date: "Oct 20, 2023",
      excerpt: "Experience the future of combat today. Cyber Battle is now available for top-up.",
      image: "https://placehold.co/600x400/1e293b/fff?text=Cyber+Battle"
    },
    {
      id: 3,
      title: "Server Maintenance Scheduled",
      date: "Oct 15, 2023",
      excerpt: "We will be performing scheduled maintenance on Oct 30th from 2:00 AM to 4:00 AM UTC.",
      image: "https://placehold.co/600x400/1e293b/fff?text=Maintenance"
    }
  ];

  return (
    <MainLayout>
      <div className="section-container" style={{ padding: '120px 20px 40px' }}>
        <h1 className="section-title">LATEST NEWS</h1>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', maxWidth: '1000px', margin: '0 auto' }}>
          {newsItems.map(item => (
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
