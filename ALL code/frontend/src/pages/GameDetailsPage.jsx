import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGameDetails } from '../hooks/useGameDetails';
import MainLayout from '../layouts/MainLayout';
import { Shield, Star, Calendar, Globe, AlertTriangle, CreditCard, ChevronRight, Zap, Trophy, Users } from 'lucide-react';

const GameDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { game, reviews, loading, error } = useGameDetails(id);
  // Top-up Denominations
  // const denominations = [
  //   { id: 1, label: '100 Points', price: 10000, bonus: '+5' },
  //   { id: 2, label: '300 Points', price: 29000, bonus: '+15' },
  //   { id: 3, label: '500 Points', price: 48000, bonus: '+25' },
  //   { id: 4, label: '1000 Points', price: 95000, bonus: '+50' },
  //   { id: 5, label: '2000 Points', price: 185000, bonus: '+120' },
  //   { id: 6, label: '5000 Points', price: 450000, bonus: '+300' },
  // ];

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center bg-gray-950">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-cyan-400 font-mono animate-pulse">ESTABLISHING CONNECTION...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error || !game) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center bg-gray-950">
          <div className="text-center space-y-4 max-w-lg px-4">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto" />
            <h2 className="text-2xl font-bold text-white">DATA RETRIEVAL FAILED</h2>
            <p className="text-gray-400">{error || "Game not found in the archives."}</p>
            <button onClick={() => navigate('/games')} className="btn-secondary mt-4"> Return to Catalog </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-950 pb-20">

        {/* Dynamic Hero Section */}
        <div className="relative h-[60vh] overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/50 to-transparent z-10" />
          <img
            src={game.image}
            alt={game.title}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-[20s]"
          />
          <div className="absolute bottom-0 left-0 w-full z-20 p-6 md:p-12 max-w-7xl mx-auto">
            <div className="flex flex-wrap gap-2 mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
              {game.genres?.map(g => (
                <span key={g} className="px-3 py-1 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                  {g}
                </span>
              ))}
            </div>
            <h1 className="text-4xl md:text-7xl font-bold text-white mb-4 tracking-tight drop-shadow-lg font-orbitron animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-100">
              {game.title}
            </h1>
            <div className="flex items-center gap-6 text-gray-300 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
              {game.score && (
                <div className="flex items-center gap-2 bg-yellow-500/10 px-3 py-1.5 rounded-lg border border-yellow-500/20">
                  <Star className="text-yellow-400 fill-yellow-400" size={18} />
                  <span className="font-bold text-yellow-400">{game.score}</span>
                </div>
              )}
              {game.releaseDate && (
                <div className="flex items-center gap-2">
                  <Calendar size={18} className="text-cyan-400" />
                  <span>{new Date(game.releaseDate).getFullYear()}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-30">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Left Column: Details & Reviews */}
            <div className="lg:col-span-2 space-y-8">

              {/* Description Card */}
              <div className="bg-gray-900/80 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/10 shadow-xl">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Globe className="text-cyan-400" size={20} /> Mission Briefing
                </h3>
                <p className="text-gray-300 leading-relaxed whitespace-pre-line text-lg">
                  {game.description || game.deck || 'No intelligence data available for this operation.'}
                </p>
                {/* Meta Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-white/10">
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Developer</div>
                    <div className="text-white font-medium">Unknown</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Publisher</div>
                    <div className="text-white font-medium">{game.publisher || 'N/A'}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Platforms</div>
                    <div className="text-white font-medium">PC, Mobile</div>
                  </div>
                </div>
              </div>

              {/* Reviews Section */}
              <div className="bg-gray-900/80 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/10 shadow-xl">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Users className="text-purple-400" size={20} /> Intelligence Reports
                </h3>

                {reviews.length > 0 ? (
                  <div className="space-y-4">
                    {reviews.map(review => (
                      <div key={review.id} className="bg-white/5 p-4 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-white text-lg">{review.title}</h4>
                          <div className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                            <Star size={12} className="fill-current" /> {review.score}
                          </div>
                        </div>
                        <p className="text-gray-400 text-sm line-clamp-3 mb-3">{review.deck}</p>
                        <div className="flex justify-between items-center text-xs text-gray-500">
                          <span>Author: {review.authors}</span>
                          <span>{new Date(review.publish_date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 border border-dashed border-gray-700 rounded-xl">
                    <AlertTriangle className="mx-auto text-gray-600 mb-2" size={32} />
                    <p className="text-gray-500">No review data currently available for this title.</p>
                  </div>
                )}
              </div>

            </div>

            {/* Right Column: Top Up Form */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">

                {/* Top Up Card */}
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.15)] relative overflow-hidden">
                  {/* Decorative Elements */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2 relative z-10">
                    <Zap className="text-cyan-400" size={20} /> Instant Top-Up
                  </h3>

                  <div className="space-y-4 relative z-10">
                    <p className="text-gray-400 text-sm">
                      Get premium currency instantly. Secure payment, instant delivery, 24/7 support.
                    </p>

                    <button
                      onClick={() => navigate(`/topup/${game.id}`)}
                      className="w-full btn-primary py-4 text-lg font-bold shadow-glow-cyan flex items-center justify-center gap-2 group animate-pulse"
                    >
                      <Zap size={20} />
                      TOP UP NOW
                      <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>

                    <div className="flex items-center justify-center gap-4 pt-4 border-t border-white/5 opacity-70">
                      <CreditCard size={16} className="text-gray-500" />
                      <span className="text-xs text-gray-500">Supports all major payment methods</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-900/50 rounded-xl p-4 border border-white/5 flex items-start gap-3">
                  <Shield className="text-emerald-400 shrink-0 mt-1" size={18} />
                  <div>
                    <h4 className="text-emerald-400 font-bold text-sm">Secure Transaction</h4>
                    <p className="text-gray-500 text-xs mt-1">
                      All purchases are encrypted and processed immediately. Points are credited instantly upon verification.
                    </p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default GameDetailsPage;
