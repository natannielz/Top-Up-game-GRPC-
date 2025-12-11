import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useData } from '../context/DataContext';
import MainLayout from '../layouts/MainLayout';
import GameCard from '../components/GameCard';
import GameStoreCard from '../components/GameStoreCard';
import { Search, Gamepad2, SlidersHorizontal, X, Swords, Crosshair, Trophy, Zap, Globe, Cpu, Target } from 'lucide-react';

const GamesPage = () => {
  const [searchParams] = useSearchParams();
  const { games } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const query = searchParams.get('q');
    const category = searchParams.get('category');
    if (query) setSearchTerm(query);
    if (category) setSelectedCategory(category.toUpperCase());
  }, [searchParams]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const categories = [
    { name: 'All', icon: Gamepad2, color: 'gray' },
    { name: 'MOBA', icon: Swords, color: 'blue' },
    { name: 'FPS', icon: Target, color: 'red' }, // Using Target as Crosshair fallback
    { name: 'RPG', icon: Globe, color: 'emerald' },
    { name: 'Battle Royale', icon: Trophy, color: 'yellow' },
    { name: 'Strategy', icon: Cpu, color: 'purple' },
    { name: 'Action', icon: Zap, color: 'cyan' },
  ];

  const filteredGames = useMemo(() => {
    return games.filter(game => {
      const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || game.category?.toUpperCase() === selectedCategory.toUpperCase();
      return matchesSearch && matchesCategory;
    });
  }, [games, searchTerm, selectedCategory]);

  const activeFilters = (searchTerm || selectedCategory !== 'All');

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
  };

  return (
    <MainLayout>
      <div className="min-h-screen relative">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-bl from-cyber-blue/10 to-transparent rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-1/4 left-0 w-1/3 h-1/3 bg-gradient-to-tr from-cyber-purple/10 to-transparent rounded-full blur-[150px] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

          {/* Header */}
          <div className="text-center mb-12 space-y-4">
            <h1 className="text-4xl md:text-6xl font-orbitron font-bold text-white tracking-tight">
              THE <span className="gradient-text neon-text-cyan">ARSENAL</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
              Browse our elite collection. Filter by genre, search your favorites, and secure your loot.
            </p>
          </div>

          {/* Controls (Sticky) */}
          <div className={`sticky top-20 z-40 transition-all duration-300 ${isScrolled ? 'bg-cyber-black/95 backdrop-blur-xl border-b border-white/5 py-4 -mx-4 px-4 shadow-[0_10px_50px_rgba(0,0,0,0.5)]' : 'mb-12'}`}>
            <div className={`flex flex-col lg:flex-row gap-4 items-center justify-between ${isScrolled ? 'max-w-7xl mx-auto' : ''}`}>

              {/* Search Input */}
              <div className="relative w-full lg:w-96 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-cyber-cyan transition-colors" size={20} />
                <input
                  type="text"
                  placeholder="Search for a game..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-futuristic w-full pl-12 pr-4 bg-cyber-dark/80"
                />
              </div>

              {/* Category Filters (Icons) */}
              <div className="flex items-center gap-3 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 scrollbar-hide py-2">
                <div className="hidden md:flex items-center gap-2 text-gray-500 text-xs font-bold uppercase tracking-widest mr-2">
                  <SlidersHorizontal size={14} /> Filters
                </div>
                <div className="flex gap-2">
                  {categories.map(cat => (
                    <button
                      key={cat.name}
                      onClick={() => setSelectedCategory(cat.name)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-300 group
                        ${selectedCategory === cat.name
                          ? 'bg-gradient-to-r from-cyber-cyan to-cyber-blue text-cyber-black shadow-glow-cyan'
                          : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/5 hover:border-white/10'}`}
                    >
                      <cat.icon size={16} className={`${selectedCategory === cat.name ? 'text-cyber-black' : `text-${cat.color}-400 group-hover:text-white`}`} />
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Active Filters Bar */}
            {activeFilters && (
              <div className="flex items-center gap-3 mt-4 text-sm animate-in fade-in slide-in-from-top-2">
                <span className="text-gray-500">Active:</span>
                {searchTerm && (
                  <span className="badge-neon flex items-center gap-1">
                    "{searchTerm}"
                    <button onClick={() => setSearchTerm('')} className="ml-1 hover:text-white"><X size={12} /></button>
                  </span>
                )}
                {selectedCategory !== 'All' && (
                  <span className="badge-neon flex items-center gap-1">
                    {selectedCategory}
                    <button onClick={() => setSelectedCategory('All')} className="ml-1 hover:text-white"><X size={12} /></button>
                  </span>
                )}
                <button onClick={clearFilters} className="text-red-400 hover:text-red-300 font-medium ml-2 text-xs uppercase tracking-wide">
                  Clear All
                </button>
              </div>
            )}
          </div>

          {/* Results Count */}
          <div className="mb-6 text-sm text-gray-500 flex justify-between items-center">
            <span>Showing <span className="text-white font-medium">{filteredGames.length}</span> titles</span>
          </div>

          {/* Game Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6">
            {filteredGames.length > 0 ? (
              filteredGames.map(game => (
                game.type === 'GAME'
                  ? <GameStoreCard key={game.id} game={game} />
                  : <GameCard key={game.id} game={game} />
              ))
            ) : (
              <div className="col-span-full py-24 text-center space-y-6">
                <div className="w-24 h-24 bg-cyber-dark rounded-2xl flex items-center justify-center mx-auto border border-white/5 shadow-glow-purple">
                  <Gamepad2 size={48} className="text-gray-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">No games found</h3>
                  <p className="text-gray-400">Try adjusting your search criteria or explore other genres.</p>
                </div>
                <button
                  onClick={clearFilters}
                  className="btn-ghost inline-flex items-center gap-2"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>

          {/* Load More Trigger (Mock) */}
          {filteredGames.length > 0 && (
            <div className="mt-16 text-center">
              <button className="btn-ghost px-8 py-4 text-xs font-bold tracking-widest border border-white/10 hover:border-cyber-cyan/50">
                LOAD MORE DATA
              </button>
            </div>
          )}

        </div>
      </div>
    </MainLayout>
  );
};

export default GamesPage;
