import React from 'react';
import GameCard from './GameCard';
import { games } from '../data/games';
import './GameGrid.css';

const GameGrid = () => {
  return (
    <div className="game-grid">
      {games.map((game) => (
        <GameCard key={game.id} game={game} />
      ))}
    </div>
  );
};

export default GameGrid;
