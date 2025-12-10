import React from 'react';
import MainLayout from '../layouts/MainLayout';
import './NewsPage.css';

const newsData = [
  {
    id: 1,
    title: "Winter Event Live!",
    date: "Oct 24, 2023",
    category: "Events",
    summary: "Get 50% extra bonus on all Ice Packs during the winter season. Don't miss out on exclusive skins and rewards available only for a limited time.",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=2070"
  },
  {
    id: 2,
    title: "New Game Added: Cyber Battle",
    date: "Oct 20, 2023",
    category: "New Release",
    summary: "Experience the future of combat today. Top up now for exclusive starter packs. Join the battle in a neon-soaked metropolis.",
    image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&q=80&w=2070"
  },
  {
    id: 3,
    title: "Maintenance Schedule Update",
    date: "Oct 15, 2023",
    category: "System",
    summary: "We will be performing scheduled maintenance on Oct 28th to improve server stability and payment processing speed.",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=2070"
  },
  {
    id: 4,
    title: "Mobile Legends Tournament",
    date: "Oct 10, 2023",
    category: "Esports",
    summary: "Watch the grand finals this weekend and earn free diamonds by predicting the winner. The prize pool has reached $100,000!",
    image: "https://images.unsplash.com/photo-1542751110-97427bbecf20?auto=format&fit=crop&q=80&w=2084"
  }
];

const NewsPage = () => {
  return (
    <MainLayout>
      <div className="news-page">
        <div className="news-header">
          <h1>Latest News</h1>
          <p>Stay updated with the latest events, updates, and promotions.</p>
        </div>

        <div className="news-grid">
          {newsData.map(item => (
            <article key={item.id} className="news-card glass-panel">
              <div className="news-image" style={{ backgroundImage: `url(${item.image})` }}>
                <span className="news-category">{item.category}</span>
              </div>
              <div className="news-content">
                <span className="news-date">{item.date}</span>
                <h3>{item.title}</h3>
                <p>{item.summary}</p>
                <button className="read-more">Read More</button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default NewsPage;
