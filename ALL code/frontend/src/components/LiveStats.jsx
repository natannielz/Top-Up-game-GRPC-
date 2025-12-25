import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';

const LiveStats = () => {
  const [count, setCount] = useState(null);
  const [loading, setLoading] = useState(true);

  // Generate 4 consistent random seeds for the avatars so they don't flicker on re-render
  // In a real app, these could fetch recent actual buyer avatars
  const [avatarSeeds] = useState(() => Array.from({ length: 4 }, () => Math.random().toString(36).substring(7)));

  useEffect(() => {
    fetch('https://api.counterapi.dev/v1/gamerzone_official/topup-counter/')
      .then(res => {
        if (res.status === 404) return { count: 0 }; // Handle new counter
        if (!res.ok) throw new Error('API Error');
        return res.json();
      })
      .then(data => {
        if (data && typeof data.count === 'number') {
          setCount(data.count);
        }
      })
      .catch(err => {
        // Only log if it's not a handled 404 (though 404 is handled above, safety check)
        console.warn("LiveStats: Using fallback data");
        // Fallback: check localStorage for local count or default
        const localTransactions = JSON.parse(localStorage.getItem('transactions') || '[]');
        setCount(localTransactions.length > 0 ? localTransactions.length : 1250);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null; // Or a subtle skeleton

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8"
    >
      <div className="bg-gradient-to-r from-cyber-dark/80 to-cyber-black/80 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[0_0_20px_rgba(0,255,255,0.05)]">

        {/* Text Section */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-500/10 rounded-full animate-pulse">
            <Flame className="text-orange-500" size={20} fill="currentColor" />
          </div>
          <div>
            <h3 className="text-white font-bold text-sm sm:text-base">
              <span className="text-cyber-cyan text-lg mr-1">{count?.toLocaleString('id-ID')}</span>
              Transactions Successfully Processed!
            </h3>
            <p className="text-xs text-gray-400">Join thousands of gamers upgrading their gear today.</p>
          </div>
        </div>

        {/* Avatars Section */}
        <div className="flex items-center gap-4">
          <div className="flex -space-x-3">
            {avatarSeeds.map((seed, i) => (
              <div key={i} className="relative w-8 h-8 rounded-full border-2 border-cyber-black overflow-hidden bg-cyber-dark">
                <img
                  src={`https://api.dicebear.com/9.x/lorelei/svg?seed=${seed}`}
                  alt="User"
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
            <div className="w-8 h-8 rounded-full border-2 border-cyber-black bg-cyber-dark flex items-center justify-center text-[10px] font-bold text-gray-300">
              +99
            </div>
          </div>
          <div className="hidden sm:block text-right">
            <div className="text-xs text-green-400 font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-ping"></span>
              Live Activity
            </div>
            <div className="text-[10px] text-gray-500">Updated just now</div>
          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default LiveStats;
