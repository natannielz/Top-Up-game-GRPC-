import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './GameCard.css';

const GameCard = ({ game }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05, rotateY: 5, rotateX: 5 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className="game-card-wrapper"
    >
      <Link to={`/topup/${game.id}`} className="game-card">
        <div className="card-image-container">
          <img src={game.image} alt={game.title} className="card-image" />
          <div className="card-overlay">
            <span className="play-button">TOP UP</span>
          </div>
        </div>
        <div className="card-info">
          <h3>{game.title}</h3>
          <p className="publisher">{game.publisher}</p>
          <div className="price-tag">
            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(game.price)}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default GameCard;
