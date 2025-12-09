import React from 'react';
import MainLayout from '../layouts/MainLayout';
import GameGrid from '../components/GameGrid';

const GamesPage = () => {
  return (
    <MainLayout>
      <div className="section-container" style={{ padding: '120px 20px 40px' }}>
        <h1 className="section-title">ALL GAMES</h1>
        <p style={{ textAlign: 'center', color: '#aaa', marginBottom: '40px' }}>
          Explore our vast collection of games and top-up your favorites instantly.
        </p>
        <GameGrid />
      </div>
    </MainLayout>
  );
};

export default GamesPage;
