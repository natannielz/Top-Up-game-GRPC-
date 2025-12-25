import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MainLayout from '../layouts/MainLayout';
import { useData } from '../context/DataContext';
import { fetchGameNews, fetchGameMedia } from '../services/NewsService';
import {
  ArrowLeft, Calendar, ChevronRight, Sparkles, Hash, Zap, Newspaper,
  Search, Filter, X, Check, ChevronDown, Cpu, Globe, Trophy, BookOpen, Activity
} from 'lucide-react';

const NewsPage = () => {
  const [newsItems, setNewsItems] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [loading, setLoading] = useState(true);



  // High-Fidelity Filter State
  const [filterConfig, setFilterConfig] = useState({
    category: 'ALL SIGNALS',
    selectedGames: [], // Empty means ALL
    searchQuery: ''
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch Logic (Updated with Classification)
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [newsData, mediaData] = await Promise.all([
          fetchGameNews(),
          fetchGameMedia()
        ]);

        if (newsData && Array.isArray(newsData)) {
          // Data from GameSpot already comes properly formatted from NewsService
          // Just use it directly with minimal transformation
          const mappedNews = newsData.map((item, index) => ({
            id: item.id || `news-${index}`,
            title: item.title || item.news_title || 'Gaming News Update',
            summary: item.summary || item.description || 'No description available',
            content: item.content || `<p>${item.summary || item.description || ''}</p>`,
            date: item.date ? new Date(item.date * 1000).toLocaleDateString() : new Date().toLocaleDateString(),
            category: item.category || 'LORE & NARRATIVE',
            gameName: item.gameName || 'Gaming News',
            tier: item.tier || 'News',
            image: item.image, // Use the image URL directly from GameSpot API
            isExternal: true
          }));
          setNewsItems(mappedNews);
        } else {
          setNewsItems([]);
        }
      } catch (err) {
        console.error("Failed to load data", err);
        setNewsItems([]);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const mappedLocalNews = [];

  // Combined List (Local First)
  const combinedNews = useMemo(() => {
    return [...mappedLocalNews, ...newsItems].sort((a, b) => {
      // Sort by Date Descending
      return new Date(b.date) - new Date(a.date);
    });
  }, [mappedLocalNews, newsItems]);

  // Derived Lists
  const allGames = useMemo(() => Array.from(new Set(combinedNews.map(i => i.gameName).filter(Boolean))), [combinedNews]);

  // Filter Logic
  const filteredNews = useMemo(() => {
    return combinedNews.filter(item => {
      // 1. Category Filter
      const matchCategory = filterConfig.category === 'ALL SIGNALS' || item.category === filterConfig.category;

      // 2. Game Origin Filter (Multi-select)
      const matchGame = filterConfig.selectedGames.length === 0 || filterConfig.selectedGames.includes(item.gameName);

      // 3. Search Query
      const searchLower = filterConfig.searchQuery.toLowerCase();
      const matchSearch = !filterConfig.searchQuery ||
        item.title.toLowerCase().includes(searchLower) ||
        item.gameName.toLowerCase().includes(searchLower) ||
        item.summary.toLowerCase().includes(searchLower);

      return matchCategory && matchGame && matchSearch;
    });
  }, [combinedNews, filterConfig]);

  const toggleGameSelection = (game) => {
    setFilterConfig(prev => {
      const isSelected = prev.selectedGames.includes(game);
      return {
        ...prev,
        selectedGames: isSelected
          ? prev.selectedGames.filter(g => g !== game)
          : [...prev.selectedGames, game]
      };
    });
  };

  const clearFilters = () => {
    setFilterConfig({ category: 'ALL SIGNALS', selectedGames: [], searchQuery: '' });
  };

  const [visibleCount, setVisibleCount] = useState(12);
  const handleLoadMore = () => setVisibleCount(prev => prev + 12);

  const handleReadMore = (article) => {
    setIsAnimating(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      setSelectedArticle(article);
      setIsAnimating(false);
    }, 300);
  };

  const handleBack = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setSelectedArticle(null);
      setIsAnimating(false);
    }, 300);
  };

  // Icon Map for Signal Categories
  const CATEGORY_ICONS = {
    'ALL SIGNALS': Globe,
    'PATCH NOTES': Cpu,
    'LORE & NARRATIVE': BookOpen,
    'ESPORTS': Trophy
  };

  const getCategoryColor = (cat) => {
    if (cat === 'PATCH NOTES') return 'border-cyber-cyan text-cyber-cyan';
    if (cat === 'ESPORTS') return 'border-cyber-gold text-cyber-gold';
    return 'border-cyber-purple text-cyber-purple';
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-black to-black text-gray-100 font-sans selection:bg-cyber-cyan/30 relative overflow-hidden">

        {/* DECORATIVE ELEMENTS */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyber-cyan/30 to-transparent" />
          <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyber-purple/30 to-transparent" />
          <div className="absolute top-1/4 left-10 w-64 h-64 bg-cyber-cyan/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-cyber-purple/5 rounded-full blur-3xl animate-pulse delay-700" />
        </div>

        {/* VIEW MODE: ARTICLE READER */}
        <AnimatePresence>
          {selectedArticle ? (
            <motion.article
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="relative min-h-screen z-50 bg-black/95"
            >
              {/* Sticky Nav for Article */}
              <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10 px-6 py-4 flex items-center justify-between">
                <button
                  onClick={handleBack}
                  className="group flex items-center gap-2 text-cyber-cyan hover:text-white transition-colors"
                >
                  <ArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                  <span className="font-orbitron tracking-widest text-sm font-bold">RETURN TO FEED</span>
                </button>
                <div className="flex items-center gap-2 text-xs font-mono text-gray-500">
                  <Activity size={14} className="text-cyber-cyan animate-pulse" />
                  READING STREAM
                </div>
              </div>

              <div className="relative h-[50vh] xl:h-[60vh]">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black" />
                <img src={selectedArticle.image} className="w-full h-full object-cover" alt="Hero" />
                <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 max-w-5xl mx-auto">
                  <div className="flex items-center gap-3 text-cyber-cyan/90 font-mono text-xs mb-6">
                    <span className="px-2 py-1 border border-cyber-cyan/30 bg-cyber-cyan/10 rounded backdrop-blur-sm">{selectedArticle.gameName}</span>
                    <span className="text-gray-500">//</span>
                    <span className={`px-2 py-1 rounded backdrop-blur-sm border ${getCategoryColor(selectedArticle.category)}`}>{selectedArticle.category}</span>
                    <span className="text-gray-500">//</span>
                    <span className="text-gray-300">{selectedArticle.date}</span>
                  </div>
                  <h1 className="text-4xl md:text-6xl font-black text-white font-orbitron leading-tight drop-shadow-[0_0_20px_rgba(0,0,0,0.8)] max-w-4xl">
                    {selectedArticle.title}
                  </h1>
                </div>
              </div>

              <div className="max-w-4xl mx-auto px-6 py-12 relative z-10">
                <div
                  className="prose prose-invert prose-lg max-w-none prose-headings:font-orbitron prose-headings:text-cyber-cyan prose-p:text-gray-300 prose-img:rounded-xl prose-img:border prose-img:border-white/10 prose-a:text-cyber-purple hover:prose-a:text-cyber-cyan transition-colors"
                  dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
                />
              </div>
            </motion.article>
          ) : (
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

              {/* PAGE HEADER */}
              <div className="mb-16 text-center relative z-10">
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="inline-flex items-center justify-center p-3 mb-6 rounded-full bg-white/5 border border-white/10 backdrop-blur-md ring-1 ring-white/5 shadow-[0_0_30px_rgba(0,0,0,0.3)]"
                >
                  <Newspaper className="w-5 h-5 text-cyber-cyan mr-3" />
                  <span className="text-cyber-cyan font-mono text-sm tracking-[0.2em] font-bold">G.I.H. NETWORK uplink_active</span>
                </motion.div>

                <h1 className="text-6xl md:text-8xl font-black text-white font-orbitron tracking-tighter mb-4 leading-none relative">
                  <span className="absolute -inset-1 blur-2xl bg-gradient-to-r from-cyber-cyan/20 via-cyber-purple/20 to-cyber-cyan/20 opacity-50"></span>
                  <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-white via-cyber-cyan to-cyber-purple drop-shadow-sm">
                    INTELLIGENCE
                  </span>
                </h1>

                <p className="text-gray-400 max-w-2xl mx-auto font-mono text-sm tracking-wide flex items-center justify-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  Real-time data stream from validated gaming sectors.
                </p>
              </div>

              {/* COMMAND CENTER: FILTER MODULE */}
              <div className="mb-20 sticky top-6 z-40">
                <div className="bg-black/60 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />

                  {/* TOP LAYER: SIGNAL TYPE (Radio Tabs) */}
                  <div className="flex flex-wrap border-b border-white/10 bg-black/40">
                    {['ALL SIGNALS', 'PATCH NOTES', 'LORE & NARRATIVE', 'ESPORTS'].map((cat) => {
                      const Icon = CATEGORY_ICONS[cat];
                      const isActive = filterConfig.category === cat;
                      return (
                        <button
                          key={cat}
                          onClick={() => setFilterConfig(prev => ({ ...prev, category: cat }))}
                          className={`flex-1 min-w-[140px] relative overflow-hidden flex items-center justify-center gap-3 py-5 text-xs font-bold font-orbitron tracking-widest transition-all
                            ${isActive
                              ? 'text-black bg-gradient-to-r from-cyber-cyan to-blue-500 shadow-[0_0_30px_rgba(0,255,255,0.4)]'
                              : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                        >
                          <Icon size={16} className={isActive ? 'animate-bounce' : ''} />
                          {cat}
                          {isActive && (
                            <>
                              <div className="absolute bottom-0 left-0 right-0 h-1 bg-white animate-pulse" />
                              <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" />
                            </>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* BOTTOM LAYER: CONTROLS */}
                  <div className="p-6 flex flex-col md:flex-row gap-6 items-center justify-between bg-black/40">

                    {/* LEFT: SEARCH & DROPDOWN */}
                    <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto flex-1">

                      {/* SEARCH INPUT */}
                      <div className="relative group w-full md:max-w-md">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <div className="w-1.5 h-1.5 bg-cyber-cyan rounded-full animate-ping" />
                        </div>
                        <input
                          type="text"
                          value={filterConfig.searchQuery}
                          onChange={(e) => setFilterConfig(prev => ({ ...prev, searchQuery: e.target.value }))}
                          placeholder="SEARCH DATABASE..."
                          className="w-full bg-black/60 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm font-mono text-cyber-cyan placeholder-gray-600 focus:outline-none focus:border-cyber-cyan focus:shadow-[0_0_20px_rgba(0,255,255,0.2)] transition-all uppercase tracking-wider"
                        />
                      </div>

                      {/* ORIGIN DROPDOWN */}
                      <div className="relative w-full md:w-72" ref={dropdownRef}>
                        <button
                          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                          className={`w-full flex items-center justify-between bg-black/60 border border-white/10 rounded-xl px-5 py-3 text-sm font-mono transition-all hover:border-cyber-purple/50
                              ${filterConfig.selectedGames.length > 0 ? 'text-cyber-purple border-cyber-purple shadow-[0_0_15px_rgba(168,85,247,0.3)]' : 'text-gray-400'}`}
                        >
                          <div className="flex items-center gap-3 truncate uppercase tracking-widest text-xs font-bold">
                            <Filter size={14} />
                            <span>
                              {filterConfig.selectedGames.length > 0
                                ? `ORIGIN (${filterConfig.selectedGames.length})`
                                : 'SELECT ORIGIN'}
                            </span>
                          </div>
                          <ChevronDown size={14} className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Dropdown Menu */}
                        <AnimatePresence>
                          {isDropdownOpen && (
                            <motion.div
                              initial={{ opacity: 0, y: 10, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 10, scale: 0.95 }}
                              transition={{ duration: 0.15 }}
                              className="absolute top-full left-0 right-0 mt-3 bg-[#0a0a0a] border border-white/10 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.9)] p-2 max-h-80 overflow-y-auto z-50 custom-scrollbar ring-1 ring-white/5"
                            >
                              {allGames.map(game => {
                                const isSelected = filterConfig.selectedGames.includes(game);
                                return (
                                  <div
                                    key={game}
                                    onClick={() => toggleGameSelection(game)}
                                    className={`flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer text-xs font-mono transition-all mb-1 border
                                         ${isSelected
                                        ? 'bg-cyber-purple/20 text-cyber-purple border-cyber-purple/30 shadow-[inset_0_0_10px_rgba(168,85,247,0.2)]'
                                        : 'text-gray-400 border-transparent hover:bg-white/5 hover:text-white hover:border-white/10'}`}
                                  >
                                    <span className="uppercase tracking-wide">{game}</span>
                                    {isSelected && <div className="w-1.5 h-1.5 bg-cyber-purple rounded-full shadow-[0_0_5px_currentColor]" />}
                                  </div>
                                );
                              })}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                    </div>

                    {/* RIGHT: STATUS & RESET */}
                    <div className="flex items-center gap-6 w-full md:w-auto justify-end border-l border-white/10 pl-6">
                      <div className="flex flex-col items-end">
                        <div className="flex items-center gap-2 text-cyber-cyan font-bold font-orbitron text-lg leading-none">
                          <Activity size={16} className={loading ? 'animate-spin' : ''} />
                          {filteredNews.length}
                        </div>
                        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Active Signals</span>
                      </div>

                      {(filterConfig.searchQuery || filterConfig.selectedGames.length > 0 || filterConfig.category !== 'ALL SIGNALS') && (
                        <button
                          onClick={clearFilters}
                          className="group flex items-center justify-center w-8 h-8 rounded-full bg-red-500/10 border border-red-500/30 text-red-500 hover:bg-red-500 hover:text-black transition-all"
                          title="Clear Buffer"
                        >
                          <X size={14} className="group-hover:rotate-90 transition-transform" />
                        </button>
                      )}
                    </div>

                  </div>
                </div>
              </div>

              {/* NEWS GRID */}
              <AnimatePresence mode="wait">
                {loading ? (
                  <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-4">
                    <div className="relative w-16 h-16">
                      <div className="absolute inset-0 rounded-full border-t-2 border-r-2 border-cyber-cyan animate-spin" />
                      <div className="absolute inset-2 rounded-full border-b-2 border-l-2 border-cyber-purple animate-spin-reverse" />
                    </div>
                    <p className="font-mono text-cyber-cyan text-xs animate-pulse tracking-[0.3em]">INITIALIZING UPLINK...</p>
                  </div>
                ) : filteredNews.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-24 text-gray-500 border border-dashed border-white/10 rounded-3xl bg-white/5"
                  >
                    <div className="w-20 h-20 rounded-full bg-black border border-white/10 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                      <Search size={32} className="text-gray-600" />
                    </div>
                    <h3 className="font-orbitron text-xl text-white mb-2">NO SIGNALS DETECTED</h3>
                    <p className="font-mono text-xs text-gray-500 uppercase tracking-widest">Adjust frequency parameters to resume stream.</p>
                  </motion.div>
                ) : (
                  <>
                    <motion.div
                      layout
                      initial="hidden"
                      animate="show"
                      variants={{
                        hidden: { opacity: 0 },
                        show: {
                          opacity: 1,
                          transition: {
                            staggerChildren: 0.05
                          }
                        }
                      }}
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                      <AnimatePresence>
                        {filteredNews.slice(0, visibleCount).map((item) => (
                          <motion.div
                            layout
                            variants={{
                              hidden: { opacity: 0, y: 30, scale: 0.95 },
                              show: { opacity: 1, y: 0, scale: 1 }
                            }}
                            exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                            transition={{ duration: 0.4, type: "spring", stiffness: 100 }}
                            key={item.id}
                            onClick={() => handleReadMore(item)}
                            className="group relative cursor-pointer flex flex-col h-full bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden hover:border-cyber-cyan/50 hover:shadow-[0_0_50px_rgba(0,255,255,0.15)] transition-all duration-500"
                          >
                            {/* Hover Glow Effect */}
                            <div className="absolute inset-0 bg-gradient-to-t from-cyber-cyan/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                            {/* Card Image */}
                            <div className="relative h-56 overflow-hidden">
                              <img src={item.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:filter group-hover:brightness-110" loading="lazy" />
                              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/40 to-transparent opacity-90" />

                              {/* Badges */}
                              <div className="absolute top-4 left-4 flex gap-2 z-10">
                                <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider backdrop-blur-xl border border-white/10 bg-black/50 text-white shadow-lg group-hover:border-white/30 transition-colors`}>
                                  {item.gameName}
                                </span>
                              </div>

                              {/* Category Badge (Floating) */}
                              <div className="absolute bottom-0 right-4 translate-y-1/2 z-20">
                                <span className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black border shadow-[0_4px_20px_rgba(0,0,0,0.5)] ${getCategoryColor(item.category)} group-hover:scale-110 transition-transform`}>
                                  {item.category === 'PATCH NOTES' && <Cpu size={12} />}
                                  {item.category === 'ESPORTS' && <Trophy size={12} />}
                                  {item.category === 'LORE & NARRATIVE' && <BookOpen size={12} />}
                                  {item.category}
                                </span>
                              </div>
                            </div>

                            {/* Card Body */}
                            <div className="p-6 pt-8 flex flex-col flex-grow relative z-10">
                              <div className="flex items-center gap-2 text-gray-500 text-xs font-mono mb-4 group-hover:text-cyber-cyan/70 transition-colors">
                                <Calendar size={12} />
                                {item.date}
                              </div>

                              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyber-cyan transition-colors line-clamp-2 font-orbitron leading-tight">
                                {item.title}
                              </h3>

                              <p className="text-gray-400 text-sm line-clamp-3 mb-6 flex-grow font-sans leading-relaxed group-hover:text-gray-300 transition-colors">
                                {item.summary}
                              </p>

                              {/* Footer */}
                              <div className="flex items-center justify-between pt-5 border-t border-white/5 group-hover:border-cyber-cyan/20 transition-colors">
                                <span className="text-[10px] font-bold text-gray-500 group-hover:text-white transition-colors tracking-[0.2em] uppercase">Read Protocol</span>
                                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-cyber-cyan group-hover:text-black transition-all duration-300 group-hover:rotate-45">
                                  <Sparkles size={14} />
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </motion.div>

                    {!loading && filteredNews.length > visibleCount && (
                      <div className="flex justify-center mt-20 mb-20">
                        <button onClick={handleLoadMore} className="group relative px-10 py-4 bg-black border border-white/10 rounded-full text-white font-orbitron text-xs tracking-[0.3em] overflow-hidden hover:border-cyber-cyan/50 hover:shadow-[0_0_40px_rgba(0,255,255,0.2)] transition-all">
                          <span className="relative z-10 group-hover:text-cyber-cyan transition-colors">INITIATE_MORE_DATA</span>
                          <div className="absolute inset-0 bg-white/5 transform -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                        </button>
                      </div>
                    )}
                  </>
                )}
              </AnimatePresence>
            </div>
          )}
        </AnimatePresence>
      </div>
    </MainLayout>
  );
};

export default NewsPage;
