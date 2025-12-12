import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { useGameDetails } from '../hooks/useGameData';
import GameHero from '../components/game/GameHero';
import GameSpecs from '../components/game/GameSpecs';
import GameGallery from '../components/game/GameGallery';
import GameNews from '../components/game/GameNews';
import GameSearch from '../components/game/GameSearch';
import LoadingScreen from '../components/LoadingScreen';

const GameIntelligencePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Default to CS:GO (730) if no ID provided
  const gameId = id || '730';

  const { data, isLoading, isError } = useGameDetails(gameId);

  if (isLoading) return <LoadingScreen />;

  if (isError || !data) return (
    <MainLayout>
      <div className="min-h-screen flex items-center justify-center text-white font-orbitron">
        INTELLIGENCE DATA NOT FOUND
      </div>
    </MainLayout>
  );

  return (
    <MainLayout>
      <div className="min-h-screen bg-cyber-black pb-24">
        {/* Floating Search Header */}
        <div className="fixed top-24 left-0 right-0 z-40 flex justify-center pointer-events-none">
          <div className="pointer-events-auto w-full px-4">
            <GameSearch />
          </div>
        </div>

        <GameHero details={data} videos={data.videos} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Details, Tags, Specs, Gallery */}
            <div className="lg:col-span-2 space-y-8">

              {/* About Card */}
              <div className="glass-card p-8 border border-white/10 rounded-2xl">
                <h2 className="text-2xl font-bold font-orbitron text-white mb-6 flex items-center gap-2">
                  <span className="w-1 h-6 bg-cyber-gold rounded-full" />
                  FILE SYNOPSIS
                </h2>
                <div
                  className="prose prose-invert max-w-none text-gray-300 leading-relaxed font-sans"
                  dangerouslySetInnerHTML={{ __html: data.about }}
                />

                {/* Tags Section (Placed below description as requested) */}
                <div className="mt-8 pt-6 border-t border-white/10">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Classified Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(data.tags) && data.tags.length > 0 ? (
                      data.tags.map((tag, i) => (
                        <span key={i} className="px-3 py-1 text-xs font-medium bg-cyber-blue/10 border border-cyber-blue/30 text-cyber-blue rounded-full hover:bg-cyber-blue/20 transition-colors cursor-default">
                          {typeof tag === 'string' ? tag : tag.name || 'Unknown'}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500 italic">No tags available.</span>
                    )}
                  </div>
                </div>
              </div>

              <GameSpecs requirements={data.requirements} />
              <GameGallery screenshots={data.screenshots} />

            </div>

            {/* Right Column: News & Feed */}
            <div className="space-y-8">
              <GameNews news={data.news} />

              {/* Additional "Status" Card to fill space */}
              <div className="glass-card p-6 border border-white/10 rounded-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/10 rounded-full blur-3xl" />
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">System Status</h3>
                <div className="flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                  </span>
                  <span className="text-green-400 font-mono text-sm">ONLINE</span>
                </div>
                <p className="text-xs text-gray-500 mt-2 font-mono">Data stream active. Monitoring endpoints...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default GameIntelligencePage;
