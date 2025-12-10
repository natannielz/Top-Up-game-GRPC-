import React, { useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import { newsData } from '../data/newsData';
import './NewsPage.css';

const NewsPage = () => {
  const [selectedArticle, setSelectedArticle] = useState(null);

  const handleReadMore = (article) => {
    setSelectedArticle(article);
    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    setSelectedArticle(null);
  };

  return (
    <MainLayout>
      <div className="news-page">
        <div className="news-header">
          <h1>{selectedArticle ? selectedArticle.category : 'Latest News'}</h1>
          <p>{selectedArticle ? 'Read the full story below' : 'Stay updated with the latest events, updates, and promotions.'}</p>
        </div>

        {selectedArticle ? (
          <article className="article-view glass-panel">
            <button onClick={handleBack} className="back-btn">← Back to News</button>
            <div className="article-hero" style={{ backgroundImage: `url(${selectedArticle.image})` }}></div>
            <div className="article-container">
              <span className="news-date">{selectedArticle.date}</span>
              <h2 className="article-title">{selectedArticle.title}</h2>
              <div
                className="article-content"
                dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
              />
            </div>
          </article>
        ) : (
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
                  <button onClick={() => handleReadMore(item)} className="read-more">Read More</button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default NewsPage;
