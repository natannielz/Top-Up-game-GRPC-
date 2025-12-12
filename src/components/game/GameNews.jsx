import { Newspaper, ExternalLink } from 'lucide-react';

const GameNews = ({ news }) => {
  if (!news || !Array.isArray(news) || news.length === 0) return null;

  return (
    <div className="glass-card border-t border-white/10 mt-12">
      <div className="p-6 border-b border-white/10 flex items-center justify-between">
        <h3 className="text-xl font-bold font-orbitron text-white flex items-center gap-2">
          <Newspaper size={20} className="text-cyber-blue" />
          LATEST INTELLIGENCE
        </h3>
      </div>

      <div className="divide-y divide-white/5">
        {news.slice(0, 3).map((item, idx) => (
          <div key={idx} className="p-6 hover:bg-white/5 transition-colors group">
            <div className="flex justify-between items-start mb-2">
              <h4 className="text-white font-bold group-hover:text-cyber-cyan transition-colors line-clamp-1">
                {item.title}
              </h4>
              <span className="text-xs text-gray-500 font-mono whitespace-nowrap ml-4">
                {new Date(item.date * 1000).toLocaleDateString()}
              </span>
            </div>
            <div
              className="text-gray-400 text-sm line-clamp-2 mb-4 prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: item.contents ? item.contents.replace(/<[^>]*>?/gm, '').substring(0, 150) + '...' : '' }}
            />
            <button className="text-xs font-bold text-cyber-blue flex items-center gap-1 hover:gap-2 transition-all">
              READ FULL REPORT <ExternalLink size={12} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameNews;
