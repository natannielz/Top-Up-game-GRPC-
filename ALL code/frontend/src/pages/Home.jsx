import { useState, useEffect, Suspense } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Hero3D from '../components/Hero3D';
import GameGrid from '../components/GameGrid';
import { Zap, Gamepad2, ArrowRight, Sparkles, Shield, Clock, ChevronRight, ChevronLeft } from 'lucide-react';
import { useData } from '../context/DataContext';

const Ticker = () => {
  return (
    <div className="ticker-wrap border-b border-white/5 bg-cyber-black/50 backdrop-blur-sm relative z-40">
      <div className="ticker">
        <div className="ticker-item">User ProGamer99 just topped up 1000 Diamonds MLBB</div>
        <div className="ticker-item">New Event: Winter Championship starts in 2 days!</div>
        <div className="ticker-item">Server Maintenance scheduled for 02:00 UTC</div>
        <div className="ticker-item">User KillerX bought Valorant Points (1600)</div>
        <div className="ticker-item">Discount: 20% OFF on all RPG titles this weekend</div>
      </div>
    </div>
  );
};

const FeaturedCarousel = ({ games }) => {
  const [current, setCurrent] = useState(0);
  const featuredGames = games.slice(0, 3); // Take first 3 games

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % featuredGames.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [featuredGames.length]);

  if (!featuredGames.length) return null;

  return (
    <div className="relative w-full h-[300px] md:h-[400px] rounded-2xl overflow-hidden border border-white/10 group">
      {featuredGames.map((game, index) => (
        <div
          key={game._id || game.id || index}
          className={`absolute inset-0 transition-opacity duration-1000 ${index === current ? 'opacity-100' : 'opacity-0'}`}
        >
          <img src={game.image} alt={game.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-cyber-black via-cyber-black/50 to-transparent" />
          <div className="absolute bottom-0 left-0 p-8 space-y-2">
            <span className="badge-neon mb-2">FEATURED</span>
            <h3 className="text-3xl md:text-5xl font-orbitron font-bold text-white">{game.title}</h3>
            <p className="text-gray-300 max-w-lg line-clamp-2 md:line-clamp-none">{game.description || 'Experience the ultimate gaming adventure. Top up now for exclusive rewards.'}</p>
            <Link to={`/game/${game._id || game.id}`} className="inline-flex items-center gap-2 mt-4 text-cyber-cyan font-bold hover:text-white transition-colors">
              GET IT NOW <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      ))}

      <div className="absolute bottom-4 right-4 flex gap-2 z-10">
        {featuredGames.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-2 h-2 rounded-full transition-all ${idx === current ? 'bg-cyber-cyan w-6' : 'bg-white/30'}`}
          />
        ))}
      </div>
    </div>
  );
};

const Home = () => {
  const [activeTab, setActiveTab] = useState('TOPUP');
  const { games } = useData(); // Pure local data from context

  // No more API fallback. Local Only.

  return (
    <MainLayout>
      <div className="relative overflow-hidden">
        {/* Ambient Background Gradients */}
        <div className="absolute top-0 right-0 w-1/2 h-[700px] bg-gradient-to-l from-cyber-purple/15 via-cyber-blue/10 to-transparent pointer-events-none" />
        <div className="absolute top-1/3 left-0 w-1/3 h-96 bg-gradient-to-r from-cyber-cyan/10 to-transparent blur-3xl pointer-events-none" />

        {/* Live Ticker */}
        <Ticker />

        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Left Content */}
            <div className="space-y-8 z-10">
              {/* Status Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyber-dark/60 border border-cyber-cyan/20 backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-cyber-green animate-pulse shadow-[0_0_10px_rgba(0,255,136,0.6)]" />
                <span className="text-xs font-semibold text-cyber-green uppercase tracking-wider">System Online</span>
              </div>

              {/* Main Heading with Glitch */}
              <h1 className="text-5xl sm:text-6xl md:text-8xl font-orbitron font-bold leading-[1] text-white">
                LEVEL UP <br />
                <span
                  className="glitch text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan to-cyber-purple"
                  data-text="INSTANTLY"
                >
                  INSTANTLY
                </span>
              </h1>

              {/* Description */}
              <p className="text-gray-400 text-lg max-w-lg leading-relaxed border-l-2 border-cyber-cyan/50 pl-4">
                The nexus for elite gamers. Secure top-ups, instant delivery, and premium game vouchers.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 pt-2">
                <Link to="/games" className="btn-neon group relative overflow-hidden">
                  <span className="relative z-10 flex items-center gap-2">
                    <Zap size={20} className="group-hover:animate-pulse" />
                    INITIATE TOP UP
                  </span>
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12" />
                </Link>
                <Link to="/games" className="btn-ghost group flex items-center gap-2">
                  <Gamepad2 size={20} />
                  BROWSE ARSENAL
                </Link>
              </div>

              {/* Stats Row */}
              <div className="flex items-center gap-8 pt-6 border-t border-white/10">
                <div className="text-center">
                  <h4 className="font-orbitron font-bold text-2xl text-white">10K<span className="text-cyber-cyan">+</span></h4>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Transactions</p>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div className="text-center">
                  <h4 className="font-orbitron font-bold text-2xl text-white">99<span className="text-cyber-cyan">%</span></h4>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Uptime</p>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div className="text-center">
                  <h4 className="font-orbitron font-bold text-2xl text-white">4.9<span className="text-cyber-gold">★</span></h4>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Rating</p>
                </div>
              </div>
            </div>

            {/* Right Content - 3D Hero */}
            <div className="relative h-[500px] w-full flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-tr from-cyber-cyan/10 via-cyber-purple/10 to-transparent blur-[100px] rounded-full pointer-events-none animate-pulse" />
              <Suspense fallback={<div className="w-full h-full flex items-center justify-center"><div className="w-12 h-12 border-2 border-cyber-cyan border-t-transparent rounded-full animate-spin" /></div>}>
                <Hero3D />
              </Suspense>
            </div>
          </div>
        </div>

        {/* Featured Carousel Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="text-cyber-gold" />
            <h2 className="text-xl font-orbitron font-bold text-white">FEATURED DROPS</h2>
          </div>
          <FeaturedCarousel games={games} />
        </div>

        {/* Tab Switcher */}
        <div className="max-w-md mx-auto mb-12 relative z-20 px-4">
          <div className="bg-cyber-dark/80 backdrop-blur-xl p-1.5 rounded-2xl flex relative border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
            {/* Sliding Background */}
            <div
              className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] rounded-xl transition-all duration-500 ease-out z-0
                ${activeTab === 'TOPUP' ? 'left-1.5 bg-gradient-to-r from-cyber-cyan to-cyber-blue' : 'left-[calc(50%+3px)] bg-gradient-to-r from-cyber-purple to-cyber-magenta'}`}
              style={{ boxShadow: activeTab === 'TOPUP' ? '0 0 30px rgba(0,255,255,0.4)' : '0 0 30px rgba(188,19,254,0.4)' }}
            />

            <button
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl relative z-10 transition-colors duration-300 font-semibold font-orbitron
                ${activeTab === 'TOPUP' ? 'text-cyber-black' : 'text-gray-400 hover:text-white'}`}
              onClick={() => setActiveTab('TOPUP')}
            >
              <Zap size={18} />
              <span>TOP UP</span>
            </button>

            <button
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl relative z-10 transition-colors duration-300 font-semibold font-orbitron
                ${activeTab === 'GAME' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
              onClick={() => setActiveTab('GAME')}
            >
              <Gamepad2 size={18} />
              <span>GAMES</span>
            </button>
          </div>
        </div>

        {/* Game Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-orbitron font-bold text-white relative pl-4 border-l-4 border-cyber-cyan">
              {activeTab === 'TOPUP' ? 'POPULAR GAMES' : 'TRENDING TITLES'}
            </h2>
            <Link to="/games" className="text-sm font-bold text-cyber-cyan hover:text-white transition-colors flex items-center gap-1">VIEW ALL <ChevronRight size={16} /></Link>
          </div>
          <GameGrid activeTab={activeTab} />
        </div>

        {/* Service Features */}
        <div className="border-t border-white/5 bg-cyber-black/50 backdrop-blur-sm py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: Zap, title: "Instant Delivery", desc: "items are delivered automatically within seconds." },
                { icon: Shield, title: "Secure Transactions", desc: "256-bit SSL encryption protects your payments." },
                { icon: Clock, title: "24/7 Support", desc: "Our team is here to help anytime, day or night." }
              ].map((feat, i) => (
                <div key={i} className="flex gap-4 p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-cyber-cyan/30 transition-colors group">
                  <div className="w-12 h-12 rounded-xl bg-cyber-cyan/10 flex items-center justify-center text-cyber-cyan group-hover:scale-110 transition-transform">
                    <feat.icon size={24} />
                  </div>
                  <div>
                    <h4 className="text-white font-bold font-orbitron mb-1">{feat.title}</h4>
                    <p className="text-gray-400 text-sm leading-relaxed">{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </MainLayout>
  );
};

export default Home;
