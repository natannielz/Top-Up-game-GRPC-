
import { motion } from 'framer-motion';

const CosmicCard = ({ children, className = "", hoverEffect = true }) => {
  return (
    <motion.div
      whileHover={hoverEffect ? { scale: 1.02, y: -5 } : {}}
      transition={{ type: 'spring', stiffness: 300 }}
      className={`
        relative overflow-hidden
        bg-slate-900/60 backdrop-blur-md
        border border-white/10
        rounded-2xl
        shadow-lg
        group
        ${className}
      `}
    >
      {/* Glow Effect on Hover */}
      {hoverEffect && (
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-tr from-cyber-cyan/10 to-cyber-purple/10" />
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyber-cyan to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
          <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyber-purple to-transparent translate-x-[100%] group-hover:translate-x-[-100%] transition-transform duration-1000" />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};

export default CosmicCard;
