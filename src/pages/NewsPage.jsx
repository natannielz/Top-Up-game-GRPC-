import { useState, useMemo, useEffect } from 'react';
import MainLayout from '../layouts/MainLayout';
import { newsData } from '../data/newsData';
import { ArrowLeft, Calendar, Clock, ChevronRight, Sparkles, Hash, TrendingUp, Zap, Newspaper, Share2, Eye, ArrowRight } from 'lucide-react';

const NewsPage = () => {
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isAnimating, setIsAnimating] = useState(false);

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = new Set(newsData.map(item => item.category));
    return ['All', ...Array.from(cats)];
  }, []);

  // Filter logic
  const filteredNews = useMemo(() => {
    return selectedCategory === 'All'
      ? newsData
      : newsData.filter(item => item.category === selectedCategory);
  }, [selectedCategory]);

  const featuredArticle = filteredNews[0];
  const remainingArticles = filteredNews.slice(1);

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

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Breaking News': return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'Review': return 'text-cyber-cyan bg-cyber-cyan/10 border-cyber-cyan/20';
      case 'Tech': return 'text-cyber-blue bg-cyber-blue/10 border-cyber-blue/20';
      case 'Events': return 'text-cyber-purple bg-cyber-purple/10 border-cyber-purple/20';
      default: return 'text-cyber-gold bg-cyber-gold/10 border-cyber-gold/20';
    }
  };

  return (
    <MainLayout>
      <div className="relative min-h-screen pb-20">
        {/* Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />

        {/* Header Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-96 bg-cyber-purple/10 blur-[120px] rounded-full pointer-events-none" />

        <div className={`relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>

          {/* Main Title */}
          {!selectedArticle && (
            <div className="text-center mb-16 relative">
              <div className="inline-flex items-center gap-2 mb-4 px-4 py-1 rounded-full border border-cyber-cyan/30 bg-cyber-cyan/5 text-cyber-cyan text-xs font-mono tracking-widest uppercase">
                <Newspaper size={14} /> Intel Feed v3.0
              </div>
              <h1 className="text-5xl md:text-7xl font-orbitron font-bold text-white tracking-tighter mb-4">
                GAME <span className="gradient-text neon-text-purple">NEWS</span>
              </h1>
              <p className="text-gray-400 max-w-xl mx-auto text-lg leading-relaxed">
                Stay ahead of the curve with the latest updates, patch notes, and industry insights.
              </p>
            </div>
          )}

          {selectedArticle ? (
            /* --- ARTICLE READING MODE --- */
            <article className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-500">
              {/* Back Nav */}
              <button
                onClick={handleBack}
                className="group flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
              >
                <div className="p-2 rounded-lg bg-white/5 border border-white/10 group-hover:border-cyber-cyan group-hover:shadow-glow-cyan transition-all">
                  <ArrowLeft size={20} />
                </div>
                <span className="font-orbitron font-bold tracking-wide">RETURN TO FEED</span>
              </button>

              {/* Huge Header Image */}
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] mb-10 group">
                <div className="absolute inset-0 bg-gradient-to-t from-cyber-black via-transparent to-transparent opacity-80" />
                <img src={selectedArticle.image} alt={selectedArticle.title} className="w-full h-full object-cover" />

                {/* Overlay Text */}
                <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full">
                  <div className="flex flex-wrap items-center gap-4 mb-6">
                    <span className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border ${getCategoryColor(selectedArticle.category)}`}>
                      {selectedArticle.category}
                    </span>
                    <span className="flex items-center gap-2 text-gray-300 text-sm font-mono bg-black/50 backdrop-blur px-3 py-1 rounded-lg border border-white/10">
                      <Clock size={14} className="text-cyber-cyan" /> {selectedArticle.date}
                    </span>
                  </div>
                  <h1 className="text-3xl md:text-5xl lg:text-6xl font-orbitron font-bold text-white leading-tight mb-4 drop-shadow-2xl">
                    {selectedArticle.title}
                  </h1>
                </div>
              </div>

              {/* Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-8">
                  <div
                    className="prose prose-invert prose-lg max-w-none text-gray-300 leading-8 prose-headings:font-orbitron prose-headings:text-cyber-cyan prose-a:text-cyber-purple hover:prose-a:text-cyber-magenta prose-strong:text-white prose-blockquote:border-l-cyber-cyan prose-blockquote:bg-white/5 prose-blockquote:p-4 prose-blockquote:rounded-r-lg"
                    dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
                  />

                  {/* Share Footer */}
                  <div className="mt-12 pt-8 border-t border-white/10 flex items-center justify-between">
                    <span className="text-gray-500 text-sm font-mono">END OF TRANSMISSION</span>
                    <div className="flex gap-4">
                      <button className="p-3 rounded-xl bg-white/5 hover:bg-cyber-blue/20 hover:text-cyber-blue transition-colors">
                        <Share2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-4 space-y-8">
                  <div className="glass-card p-6 border border-white/10 sticky top-24">
                    <h4 className="font-orbitron font-bold text-white mb-6 flex items-center gap-2">
                      <TrendingUp size={18} className="text-cyber-gold" /> TRENDING
                    </h4>
                    <div className="space-y-4">
                      {newsData.slice(0, 4).map(item => (
                        item.id !== selectedArticle.id && (
                          <div
                            key={item.id}
                            onClick={() => handleReadMore(item)}
                            className="group cursor-pointer flex gap-3 pb-4 border-b border-white/5 last:border-0 last:pb-0"
                          >
                            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                              <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                            </div>
                            <div>
                              <h5 className="text-sm font-bold text-white group-hover:text-cyber-cyan transition-colors line-clamp-2 mb-1">
                                {item.title}
                              </h5>
                              <span className="text-xs text-gray-500 font-mono">{item.date}</span>
                            </div>
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ) : (
            /* --- FEED VIEW --- */
            <div className="space-y-12">

              {/* Category Filter */}
              <div className="flex items-center justify-center gap-2 flex-wrap">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-6 py-2.5 rounded-xl text-sm font-bold font-orbitron tracking-wide transition-all duration-300 border
                      ${selectedCategory === cat
                        ? 'bg-cyber-cyan text-cyber-black border-cyber-cyan shadow-glow-cyan scale-105'
                        : 'bg-white/5 text-gray-400 border-white/10 hover:border-white/30 hover:text-white'}`}
                  >
                    {cat === 'All' ? <Hash size={14} className="inline mr-1" /> : null}
                    {cat}
                  </button>
                ))}
              </div>

              {/* No Results */}
              {filteredNews.length === 0 && (
                <div className="text-center py-20 text-gray-500">
                  <p>No intelligence found for this category.</p>
                </div>
              )}

              {/* FEATURED HERO (Only on 'All' tab or if filtered has items) */}
              {filteredNews.length > 0 && (
                <div
                  onClick={() => handleReadMore(featuredArticle)}
                  className="relative h-[500px] w-full rounded-3xl overflow-hidden group cursor-pointer border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
                >
                  <img src={featuredArticle.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-cyber-black via-cyber-black/40 to-transparent" />

                  {/* Hero Content */}
                  <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full md:w-3/4">
                    <div className="flex items-center gap-3 mb-4 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100">
                      <span className={`px-3 py-1 rounded text-xs font-bold uppercase border ${getCategoryColor(featuredArticle.category)}`}>
                        {featuredArticle.category}
                      </span>
                      <span className="text-white/80 text-sm font-mono flex items-center gap-2">
                        <Eye size={14} /> Featured Story
                      </span>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-orbitron font-bold text-white mb-4 leading-none group-hover:text-cyber-cyan transition-colors">
                      {featuredArticle.title}
                    </h2>
                    <p className="text-gray-300 text-lg line-clamp-2 md:line-clamp-none mb-6">
                      {featuredArticle.summary}
                    </p>
                    <button className="flex items-center gap-2 text-cyber-cyan font-bold font-orbitron tracking-widest group-hover:gap-4 transition-all">
                      ACCESS INTEL <ArrowRight size={20} />
                    </button>
                  </div>
                </div>
              )}

              {/* NEWS GRID */}
              {remainingArticles.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {remainingArticles.map((item, idx) => (
                    <div
                      key={item.id}
                      onClick={() => handleReadMore(item)}
                      className="group cursor-pointer flex flex-col h-full bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-cyber-cyan/50 hover:shadow-[0_10px_40px_rgba(0,255,255,0.1)] transition-all duration-300 hover:-translate-y-2"
                    >
                      <div className="relative h-48 overflow-hidden">
                        <img src={item.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        <div className="absolute top-4 left-4">
                          <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border ${getCategoryColor(item.category)}`}>
                            {item.category}
                          </span>
                        </div>
                      </div>

                      <div className="p-6 flex flex-col flex-grow">
                        <div className="flex items-center gap-2 text-gray-500 text-xs font-mono mb-3">
                          <Calendar size={12} /> {item.date}
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyber-cyan transition-colors line-clamp-2 font-orbitron">
                          {item.title}
                        </h3>
                        <p className="text-gray-400 text-sm line-clamp-3 mb-6 flex-grow">
                          {item.summary}
                        </p>
                        <div className="flex items-center justify-between pt-4 border-t border-white/5 text-sm font-bold text-gray-500 group-hover:text-white transition-colors">
                          <span>READ MORE</span>
                          <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform text-cyber-cyan" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default NewsPage;
