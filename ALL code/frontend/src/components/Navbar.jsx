import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, User, Menu, X, ChevronDown, Gamepad2, Trophy, Swords, Cpu, Zap, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import Avatar from './common/Avatar';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { games } = useData();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Search Logic
  useEffect(() => {
    if (searchQuery.length > 1) {
      const filtered = games.filter(g => g.title.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5);
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery, games]);

  // Click Outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/games?q=${searchQuery}`);
      setIsMobileMenuOpen(false);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (gameId) => {
    navigate(`/topup/${gameId}`);
    setShowSuggestions(false);
    setSearchQuery('');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${isScrolled
          ? 'bg-cyber-black/90 backdrop-blur-xl border-b border-white/5 shadow-[0_10px_40px_rgba(0,0,0,0.5)]'
          : 'bg-transparent backdrop-blur-sm'}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center gap-3 group">
            <div className="relative">
              <div className="w-11 h-11 bg-gradient-to-br from-cyber-cyan via-cyber-blue to-cyber-purple rounded-xl flex items-center justify-center transform group-hover:rotate-12 transition-all duration-300 shadow-[0_0_20px_rgba(0,255,255,0.3)]">
                <span className="text-white font-orbitron font-black text-xl">G</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-cyber-cyan to-cyber-purple rounded-xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity" />
            </div>
            <span className="font-orbitron font-bold text-2xl tracking-wider">
              <span className="text-white">GAMER</span>
              <span className="text-cyber-cyan neon-text-cyan">ZONE</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`relative text-sm font-semibold tracking-wide transition-colors hover:text-cyber-cyan
                ${isActive('/') ? 'text-cyber-cyan' : 'text-gray-300'}`}
            >
              HOME
              {isActive('/') && (
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-cyber-cyan to-cyber-blue rounded-full" />
              )}
            </Link>

            {/* Games Mega Menu */}
            <div
              className="relative group"
              onMouseEnter={() => setIsMegaMenuOpen(true)}
              onMouseLeave={() => setIsMegaMenuOpen(false)}
            >
              <button className={`flex items-center gap-1.5 text-sm font-semibold tracking-wide transition-colors hover:text-cyber-cyan
                ${location.pathname.includes('/games') || location.pathname.includes('/topup') ? 'text-cyber-cyan' : 'text-gray-300'}`}>
                GAMES
                <ChevronDown size={14} className={`transition-transform duration-300 ${isMegaMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Mega Menu Dropdown */}
              <div
                className={`mega-menu w-[550px] transition-all duration-300
                  ${isMegaMenuOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-4'}`}
              >
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-cyber-cyan font-orbitron text-xs font-bold tracking-widest mb-4 flex items-center gap-2">
                      <span className="w-1 h-4 bg-cyber-cyan rounded-full" />
                      CATEGORIES
                    </h4>
                    <div className="space-y-1">
                      {[
                        { to: '/games?category=moba', icon: Swords, name: 'MOBA', sub: 'Mobile Legends, LoL', color: 'blue' },
                        { to: '/games?category=fps', icon: Cpu, name: 'FPS', sub: 'Valorant, PUBG', color: 'purple' },
                      ].map((item) => (
                        <Link
                          key={item.name}
                          to={item.to}
                          className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all group/item"
                          onClick={() => setIsMegaMenuOpen(false)}
                        >
                          <div className={`w-10 h-10 rounded-lg bg-${item.color}-500/20 flex items-center justify-center text-${item.color}-400 group-hover/item:bg-${item.color}-500/30 transition-colors`}>
                            <item.icon size={18} />
                          </div>
                          <div>
                            <p className="text-white font-semibold group-hover/item:text-cyber-cyan transition-colors">{item.name}</p>
                            <p className="text-xs text-gray-500">{item.sub}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-cyber-gold font-orbitron text-xs font-bold tracking-widest mb-4 flex items-center gap-2">
                      <span className="w-1 h-4 bg-cyber-gold rounded-full" />
                      POPULAR
                    </h4>
                    <div className="space-y-1">
                      {[
                        { to: '/games?category=rpg', icon: Trophy, name: 'RPG', sub: 'Genshin, Honkai', color: 'yellow' },
                        { to: '/games', icon: Gamepad2, name: 'All Games', sub: 'Browse collection', color: 'green' },
                      ].map((item) => (
                        <Link
                          key={item.name}
                          to={item.to}
                          className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all group/item"
                          onClick={() => setIsMegaMenuOpen(false)}
                        >
                          <div className={`w-10 h-10 rounded-lg bg-${item.color}-500/20 flex items-center justify-center text-${item.color}-400 group-hover/item:bg-${item.color}-500/30 transition-colors`}>
                            <item.icon size={18} />
                          </div>
                          <div>
                            <p className="text-white font-semibold group-hover/item:text-cyber-cyan transition-colors">{item.name}</p>
                            <p className="text-xs text-gray-500">{item.sub}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Link
              to="/news"
              className={`relative text-sm font-semibold tracking-wide transition-colors hover:text-cyber-cyan
                ${isActive('/news') ? 'text-cyber-cyan' : 'text-gray-300'}`}
            >
              NEWS
              {isActive('/news') && (
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-cyber-cyan to-cyber-blue rounded-full" />
              )}
            </Link>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">

            {/* Quick Search with Suggestions */}
            <div className="hidden md:block relative group z-50" ref={searchRef}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search games..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearch}
                  onFocus={() => { if (searchQuery.length > 1) setShowSuggestions(true) }}
                  className="w-44 bg-white/5 border border-white/10 rounded-xl py-2.5 pl-4 pr-10 text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:border-cyber-cyan focus:w-64 focus:bg-cyber-dark/80 transition-all duration-300"
                />
                <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-cyber-cyan transition-colors" />
              </div>

              {/* Suggestion Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full right-0 w-64 mt-2 bg-cyber-gray border border-white/10 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                  <div className="p-2">
                    <p className="text-[10px] text-gray-500 uppercase font-bold px-2 py-1 mb-1">Suggestions</p>
                    {suggestions.map(game => (
                      <button
                        key={game._id || game.id}
                        onClick={() => handleSuggestionClick(game._id || game.id)}
                        className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 text-left transition-colors group/item"
                      >
                        <img src={game.image} alt={game.title} className="w-8 h-8 rounded object-cover" />
                        <div className="min-w-0">
                          <p className="text-white text-sm font-semibold truncate group-hover/item:text-cyber-cyan">{game.title}</p>
                          <p className="text-xs text-gray-500 truncate">{game.publisher}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User Avatar / Login */}
            {user ? (
              <div className="relative group">
                <Link to="/dashboard" className="relative p-0.5 rounded-full hover:shadow-glow-cyan transition-all block">
                  <Avatar
                    src={user.avatar}
                    seed={user.username}
                    alt={user.username}
                    className="border-2 border-cyber-cyan"
                  />
                </Link>
                {/* Mini Dropdown */}
                <div className="absolute top-full right-0 mt-2 w-48 bg-cyber-gray border border-white/10 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <div className="p-1">
                    <Link to="/dashboard" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg">
                      <User size={16} /> Dashboard
                    </Link>
                    <button onClick={logout} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-white/5 rounded-lg text-left">
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyber-cyan/10 to-cyber-blue/10 border border-cyber-cyan/30 text-cyber-cyan text-sm font-semibold hover:bg-cyber-cyan hover:text-cyber-black hover:shadow-glow-cyan transition-all duration-300"
              >
                <User size={16} />
                <span>Login</span>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-gray-300 hover:text-cyber-cyan transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`md:hidden absolute top-20 left-0 right-0 bg-cyber-black/98 backdrop-blur-xl border-b border-white/10 transition-all duration-300 overflow-hidden ${isMobileMenuOpen ? 'max-h-screen py-4' : 'max-h-0'}`}>
        <div className="px-4 space-y-2">
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="block p-4 rounded-xl hover:bg-white/5 text-white font-semibold">Home</Link>
          <Link to="/games" onClick={() => setIsMobileMenuOpen(false)} className="block p-4 rounded-xl hover:bg-white/5 text-white font-semibold">Games</Link>
          <Link to="/news" onClick={() => setIsMobileMenuOpen(false)} className="block p-4 rounded-xl hover:bg-white/5 text-white font-semibold">News</Link>

          {/* Mobile Search */}
          <div className="relative mt-4">
            <input
              type="text"
              placeholder="Search games..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              className="w-full bg-cyber-dark border border-white/10 rounded-xl py-3 pl-4 pr-10 text-white placeholder-gray-500 focus:outline-none focus:border-cyber-cyan"
            />
            <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
            {/* Simple Mobile Suggestions */}
            {searchQuery.length > 1 && (
              <div className="mt-2 space-y-2">
                {games.filter(g => g.title.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 3).map(g => (
                  <div key={g._id || g.id} onClick={() => { navigate(`/topup/${g._id || g.id}`); setIsMobileMenuOpen(false); }} className="flex items-center gap-3 p-2 bg-white/5 rounded-lg active:bg-white/10">
                    <img src={g.image} className="w-8 h-8 rounded" alt="" />
                    <span className="text-white text-sm">{g.title}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {!user && (
            <Link
              to="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block p-4 mt-4 rounded-xl bg-gradient-to-r from-cyber-cyan to-cyber-blue text-cyber-black font-bold text-center"
            >
              Login / Register
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
