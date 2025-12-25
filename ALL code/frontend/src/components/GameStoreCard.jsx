import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Gamepad2 } from 'lucide-react';

const GameStoreCard = ({ game }) => {
  const discount = game.originalPrice ? Math.round(((game.originalPrice - game.price) / game.originalPrice) * 100) : 0;

  return (
    <Link to={`/game/${game._id || game.id}`} className="block group relative">
      <div className="relative h-[25rem] rounded-2xl overflow-hidden transition-all duration-500 transform group-hover:-translate-y-2 group-hover:shadow-[0_20px_50px_rgba(188,19,254,0.15)] bg-cyber-dark border border-white/5 group-hover:border-cyber-purple/50">

        {/* Full Bleed Image */}
        <div className="absolute inset-0 h-full w-full">
          <img
            src={game.image}
            alt={game.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale-[0.2] group-hover:grayscale-0"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-cyber-black via-cyber-black/40 to-transparent opacity-90 group-hover:opacity-60 transition-opacity duration-300" />
        </div>

        {/* Hover Glow Effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-tr from-cyber-purple/20 to-cyber-magenta/20 pointer-events-none" />

        {/* Floating Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          <span translate="no" className="backdrop-blur-md bg-black/40 border border-white/10 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
            <Gamepad2 size={12} className="text-cyber-purple" />
            Full Game
          </span>
        </div>

        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-4 right-4 animate-bounce-slow">
            <span translate="no" className="backdrop-blur-md bg-gradient-to-r from-red-600 to-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-[0_0_15px_rgba(255,0,0,0.5)]">
              -{discount}%
            </span>
          </div>
        )}

        {/* Content Section */}
        <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
          <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <div className="flex justify-between items-start mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 absolute -top-8 w-full">
              {game.score ? (
                <div translate="no" className="flex items-center gap-1 bg-green-900/60 backdrop-blur rounded px-2 py-0.5 border border-green-500/30 shadow-[0_0_8px_rgba(34,197,94,0.3)]">
                  <Star size={12} className="text-green-400 fill-green-400" />
                  <span className="text-[10px] font-bold text-green-100">{game.score}/10</span>
                </div>
              ) : (
                <div translate="no" className="flex items-center gap-1 bg-black/60 backdrop-blur rounded px-2 py-0.5 border border-white/10">
                  <Star size={12} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-[10px] font-bold text-white">{game.rating || '4.9'}</span>
                </div>
              )}
            </div>

            <h3 className="font-orbitron font-bold text-xl text-white group-hover:text-cyber-magenta transition-colors truncate shadow-black drop-shadow-lg mb-1">
              {game.title}
            </h3>

            <p className="text-gray-400 text-xs mb-4 line-clamp-2 h-10 group-hover:text-gray-200 transition-colors">
              Experience the ultimate adventure with {game.title}. Instant key delivery.
            </p>

            {/* Price & Action */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <div className="flex flex-col">
                {game.originalPrice && (
                  <span className="text-[10px] text-gray-500 line-through">
                    Rp {game.originalPrice.toLocaleString()}
                  </span>
                )}
                <span className="text-white font-orbitron font-bold text-lg drop-shadow-md group-hover:text-cyber-cyan transition-colors">
                  Rp {game.price.toLocaleString()}
                </span>
              </div>

              <button className="h-10 px-4 rounded-xl bg-white/10 flex items-center gap-2 justify-center group-hover:bg-cyber-purple group-hover:text-white transition-all duration-300 shadow-lg group-hover:shadow-[0_0_20px_rgba(188,19,254,0.4)]">
                <span className="text-xs font-bold hidden group-hover:block">BUY</span>
                <ShoppingCart size={18} />
              </button>
            </div>
          </div>
        </div>

      </div>
    </Link>
  );
};

export default GameStoreCard;
