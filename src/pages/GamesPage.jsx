import React, { useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import GameCard from '../components/GameCard';
import { games } from '../data/games';
import { Search, Filter } from 'lucide-react';
import './GamesPage.css';

const GamesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'MOBA', 'FPS', 'RPG', 'Battle Royale', 'Strategy'];

  const filteredGames = games.filter(game => {
    const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || game.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <MainLayout>
      <div className="games-page">
        <div className="games-header">
          <h1>All Games</h1>
          <p>Explore our vast collection of games and top-up instantly.</p>
        </div>

        <div className="games-controls">
          <div className="search-bar">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder="Search for a game..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="category-filter">
            <Filter size={20} className="filter-icon" />
            <div className="categories">
              {categories.map(category => (
                <button
                  key={category}
                  className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="games-grid-container">
          {filteredGames.length > 0 ? (
            <div className="games-grid">
              {filteredGames.map(game => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          ) : (
            <div className="no-results">
              <h3>No games found</h3>
              <p>Try adjusting your search or category filter.</p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default GamesPage;
