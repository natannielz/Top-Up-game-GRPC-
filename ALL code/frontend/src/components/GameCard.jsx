import { Link } from 'react-router-dom';
import { Zap, Gamepad2 } from 'lucide-react';

const GameCard = ({ game }) => {
  return (
    <Link to={`/game/${game._id || game.id}`} className="block group relative">
      <div className="relative h-[25rem] rounded-2xl overflow-hidden transition-all duration-500 transform group-hover:-translate-y-2 group-hover:shadow-[0_20px_50px_rgba(0,255,255,0.15)] bg-cyber-dark border border-white/5 group-hover:border-cyber-cyan/50">

        {/* Full Bleed Image */}
        <div className="absolute inset-0 h-full w-full">
          <img
            src={game.image}
            alt={game.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-cyber-black via-cyber-black/50 to-transparent opacity-90 group-hover:opacity-80 transition-opacity duration-300" />
        </div>

        {/* Hover Glow Effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-tr from-cyber-cyan/10 to-cyber-purple/10 pointer-events-none" />

        {/* Floating Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          {/* Game Type Badge */}
          {game.gameType === 'GAME' ? (
            <span translate="no" className="backdrop-blur-md bg-emerald-500/80 border border-emerald-400/30 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-[0_0_15px_rgba(16,185,129,0.4)]">
              🎮 Purchase
            </span>
          ) : (
            <span translate="no" className="backdrop-blur-md bg-amber-500/80 border border-amber-400/30 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-[0_0_15px_rgba(245,158,11,0.4)]">
              💰 Top-Up
            </span>
          )}
          {/* Genre Badge */}
          <span translate="no" className="backdrop-blur-md bg-black/40 border border-white/10 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
            <Gamepad2 size={12} className="text-cyber-cyan" />
            {game.category || 'Game'}
          </span>
        </div>

        {/* Discount Badge */}
        {game.discount && (
          <div className="absolute top-4 right-4">
            <span translate="no" className="backdrop-blur-md bg-cyber-purple/80 text-white text-xs font-bold px-3 py-1 rounded-full shadow-[0_0_15px_rgba(188,19,254,0.5)]">
              -{game.discount}%
            </span>
          </div>
        )}

        {/* Score Badge (GameSpot Data) */}
        {game.score && (
          <div className={`absolute ${game.discount ? 'top-12' : 'top-4'} right-4 animate-in fade-in zoom-in duration-500`}>
            <div className="relative group/score">
              <div className="absolute inset-0 bg-green-500 blur-lg opacity-40 group-hover/score:opacity-70 transition-opacity"></div>
              <div className="relative backdrop-blur-xl bg-black/60 border border-green-500/50 text-white font-orbitron font-bold px-3 py-1.5 rounded-lg flex flex-col items-center justify-center shadow-[0_0_10px_rgba(34,197,94,0.3)]">
                <span className="text-sm text-green-400">{game.score}</span>
                <span className="text-[8px] text-gray-400 -mt-1">/10</span>
              </div>
            </div>
          </div>
        )}

        {/* Content Section */}
        <div className="absolute bottom-0 left-0 right-0 p-6 z-10 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
          <div className="flex flex-col gap-1">
            <h3 className="font-orbitron font-bold text-xl text-white group-hover:text-cyber-cyan transition-colors truncate shadow-black drop-shadow-lg">
              {game.title}
            </h3>
            <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyber-cyan"></span>
              {game.publisher}
            </p>
          </div>

          {/* Action Area - Smart Pricing */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10 mt-2">
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">
                {game.gameType === 'GAME' ? 'Price' : 'Starts From'}
              </span>
              <span className="text-cyber-gold font-orbitron font-bold text-lg drop-shadow-md">
                {new Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                  maximumFractionDigits: 0
                }).format(game.price)}
              </span>
            </div>

            <button className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-cyber-cyan group-hover:text-black transition-all duration-300 shadow-lg group-hover:shadow-[0_0_15px_rgba(0,255,255,0.6)]">
              <Zap size={18} className="fill-current" />
            </button>
          </div>
        </div>

      </div>
    </Link>
  );
};

export default GameCard;
