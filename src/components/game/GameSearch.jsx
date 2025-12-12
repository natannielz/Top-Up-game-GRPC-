import { useState, useEffect, useRef } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { useGameSearch } from '../../hooks/useGameData';
import { useNavigate } from 'react-router-dom';

// Simple debounce hook
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

const GameSearch = () => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef(null);

  const debouncedQuery = useDebounce(query, 500);
  const { data: results = [], isLoading } = useGameSearch(debouncedQuery);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (results.length > 0 && query.length > 2) {
      setIsOpen(true);
    } else {
      // Only close if empty, keep open if loading? no.
      // logic: if query is short, close. if results empty, close.
      if (query.length <= 2 || results.length === 0) setIsOpen(false);
    }
  }, [results, query]);

  const handleSelect = (game) => {
    // Attempt to resolve ID from various common API response patterns
    // Some APIs return strings, some objects with gameid, appid, or id
    let gameId = null;
    let gameName = '';

    if (typeof game === 'string') {
      // If just a string, we can't get ID easily. 
      // User might need a full search page, but for now log warning or try name as ID (won't work for int IDs)
      console.warn("API returned string, cannot navigate to ID:", game);
      gameName = game;
    } else {
      gameId = game.gameid || game.appId || game.id || game.steam_appid;
      gameName = game.name || game.title || 'Unknown Game';
    }

    if (gameId) {
      navigate(`/game-intel/${gameId}`);
      setIsOpen(false);
      setQuery(''); // Clear search on navigation
    } else {
      // Fallback: Just log or maybe search by name if we had that route
      console.error("No ID found for game:", game);
      // Optional: navigate to a generic search page? 
      // navigate(`/search?q=${encodeURIComponent(gameName)}`);
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto" ref={searchRef}>
      <div className="relative group">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="SEARCH TARGET ACQUISITION..."
          className="w-full pl-10 pr-4 py-3 bg-black/60 border border-white/20 rounded-none text-white placeholder-gray-500 font-mono text-sm focus:outline-none focus:border-cyber-cyan/80 focus:ring-1 focus:ring-cyber-cyan/50 backdrop-blur-md transition-all clip-path-polygon"
          style={{ clipPath: 'polygon(0 0, 100% 0, 100% 85%, 95% 100%, 0 100%)' }}
        />
        <Search className="absolute left-3 top-3.5 text-cyber-cyan" size={16} />
        {isLoading && <Loader2 className="absolute right-3 top-3.5 text-cyber-cyan animate-spin" size={16} />}

        {/* Decorative corner */}
        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyber-cyan opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-cyber-cyan opacity-50"></div>
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-black/90 border border-white/10 rounded-none overflow-hidden backdrop-blur-xl shadow-2xl z-50">
          {results.slice(0, 10).map((item, index) => (
            <div
              key={index}
              onClick={() => handleSelect(item)}
              className="px-4 py-3 border-b border-white/5 hover:bg-cyber-cyan/20 cursor-pointer text-gray-300 hover:text-white transition-colors flex items-center justify-between group"
            >
              <span className="truncate font-mono text-sm group-hover:tracking-wider transition-all">
                {typeof item === 'string' ? item : (item.name || item.title || 'Unknown')}
              </span>
              {(typeof item !== 'string') && (item.gameid || item.id) && (
                <span className="text-xs text-cyber-cyan/50 font-mono">{item.gameid || item.id}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GameSearch;
