import React, { useState } from 'react';
import { Search } from 'lucide-react';
import GameCard from './GameCard';
import { games } from '../data/games';
import './GameGrid.css';

const GameGrid = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('All');

  const categories = ['All', ...new Set(games.map(g => g.category))];

  const filteredGames = games.filter(game => {
    const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filter === 'All' || game.category === filter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      <div className="game-filters">
        <div className="search-wrapper">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            placeholder="Search games..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="category-filters">
          {categories.map(cat => (
            <button
              key={cat}
              className={`filter-btn ${filter === cat ? 'active' : ''}`}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="game-grid">
        {filteredGames.length > 0 ? (
          filteredGames.map((game) => (
            <GameCard key={game.id} game={game} />
          ))
        ) : (
          <div className="no-results">No games found matching your criteria.</div>
        )}
      </div>
    </div>
  );
};

export default GameGrid;
