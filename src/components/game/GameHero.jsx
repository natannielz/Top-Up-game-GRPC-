import { Play, Euro, Calendar } from 'lucide-react';
import ReactPlayer from 'react-player';

const GameHero = ({ details, videos }) => {
  if (!details) return <div className="h-[60vh] bg-black/50 animate-pulse" />;

  // Find a valid video (mp4) from the list
  const heroVideo = videos.find(v => v.video.includes('.mp4'))?.video;
  // Fallback image
  const heroImage = details.thumbnail || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80';

  return (
    <div className="relative h-[80vh] w-full overflow-hidden flex items-center justify-center">
      {/* Background Video Layer */}
      <div className="absolute inset-0 z-0">
        {heroVideo ? (
          <ReactPlayer
            url={heroVideo}
            playing
            loop
            muted
            width="100%"
            height="100%"
            className="react-player scale-125 opacity-50"
            style={{ objectFit: 'cover' }}
          />
        ) : (
          <img src={heroImage} className="w-full h-full object-cover opacity-50" alt="Hero" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
      </div>

      {/* Content Layer */}
      <div className="relative z-10 text-center px-4 max-w-5xl">
        <div className="mb-6 animate-fade-in-up">
          <span className="inline-block px-3 py-1 rounded border border-cyber-cyan/30 bg-cyber-cyan/5 text-cyber-cyan text-xs font-mono tracking-widest uppercase mb-4 backdrop-blur-md">
            CLASSIFIED INTELLIGENCE
          </span>
        </div>

        <h1 className="text-6xl md:text-8xl font-black font-orbitron text-white mb-6 drop-shadow-lg tracking-tighter">
          {details.title || 'UNKNOWN TARGET'}
        </h1>

        <div className="flex items-center justify-center gap-6 text-lg font-mono text-gray-300">
          <div className="flex items-center gap-2 bg-black/40 px-4 py-2 rounded-lg border border-white/10 backdrop-blur">
            <Calendar size={18} className="text-cyber-purple" />
            <span>{details.release_date || 'TBA'}</span>
          </div>
          <div className="flex items-center gap-2 bg-black/40 px-4 py-2 rounded-lg border border-white/10 backdrop-blur">
            <Euro size={18} className="text-cyber-gold" />
            <span>{details.price || 'FREE'}</span>
          </div>
        </div>

        {/* Tags */}
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {/* Tags passed from parent usually, but details might have genres */}
          {details.genre && details.genre.split(',').map((g, i) => (
            <span key={i} className="px-3 py-1 rounded-full text-xs font-bold bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-cyber-cyan/50 transition-colors">
              {g.trim()}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameHero;
