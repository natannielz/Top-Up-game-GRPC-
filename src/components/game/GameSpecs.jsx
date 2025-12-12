import { ChevronRight } from 'lucide-react';

const GameSpecs = ({ requirements }) => {
  if (!requirements || Object.keys(requirements).length === 0) return null;

  // The API returns distinct objects for min/rec like "minimal_requirements" or "recommended_requirements"
  // But sometimes it returns a different structure. We need to handle flexibility.
  // Assuming strict structure for this demo based on typical RapidAPI responses.

  const minSpecs = requirements.minimal || {};
  const recSpecs = requirements.recommended || {};

  return (
    <div className="glass-card p-8 border border-white/10 rounded-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-10 font-black text-6xl text-white font-orbitron select-none">
        SPECS
      </div>

      <h3 className="text-2xl font-bold font-orbitron text-white mb-8 flex items-center gap-2">
        <span className="w-2 h-8 bg-cyber-cyan rounded-full" />
        SYSTEM ARCHITECTURE
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Minimum */}
        <div className="space-y-4">
          <h4 className="text-cyber-cyan font-mono text-sm tracking-widest uppercase border-b border-cyber-cyan/20 pb-2 mb-4">
            MINIMUM CONFIGURATION
          </h4>
          <SpecRow label="OS" value={minSpecs.os} />
          <SpecRow label="CPU" value={minSpecs.processor} />
          <SpecRow label="GPU" value={minSpecs.graphics} />
          <SpecRow label="RAM" value={minSpecs.memory} />
          <SpecRow label="STORAGE" value={minSpecs.storage} />
        </div>

        {/* Recommended */}
        <div className="space-y-4">
          <h4 className="text-cyber-purple font-mono text-sm tracking-widest uppercase border-b border-cyber-purple/20 pb-2 mb-4">
            RECOMMENDED CONFIGURATION
          </h4>
          <SpecRow label="OS" value={recSpecs.os} />
          <SpecRow label="CPU" value={recSpecs.processor} />
          <SpecRow label="GPU" value={recSpecs.graphics} />
          <SpecRow label="RAM" value={recSpecs.memory} />
          <SpecRow label="STORAGE" value={recSpecs.storage} />
        </div>
      </div>
    </div>
  );
};

const SpecRow = ({ label, value }) => {
  if (!value) return null;
  return (
    <div className="flex flex-col">
      <span className="text-xs text-gray-500 font-mono mb-1">{label}</span>
      <span className="text-sm text-gray-200 font-medium leading-relaxed">{value}</span>
    </div>
  );
};

export default GameSpecs;
