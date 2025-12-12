import { useState } from 'react';
import { X, ZoomIn } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const GameGallery = ({ screenshots }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  if (!screenshots || !Array.isArray(screenshots) || screenshots.length === 0) return null;

  return (
    <div className="py-12">
      <h3 className="text-2xl font-bold font-orbitron text-white mb-8 flex items-center gap-2 px-4">
        <span className="w-2 h-8 bg-cyber-purple rounded-full" />
        VISUAL EVIDENCE
      </h3>

      {/* Masonry-ish Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4 h-96 overflow-y-auto custom-scrollbar">
        {screenshots.map((shot, idx) => (
          <div
            key={idx}
            onClick={() => setSelectedImage(shot.image)}
            className="relative group cursor-pointer rounded-xl overflow-hidden aspect-video border border-white/10 hover:border-cyber-cyan transition-all"
          >
            <img
              src={shot.image}
              alt={`Evidence ${idx}`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <ZoomIn className="text-white" />
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={() => setSelectedImage(null)}
          >
            <button className="absolute top-4 right-4 text-white hover:text-red-500 transition-colors">
              <X size={32} />
            </button>
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              src={selectedImage}
              className="max-w-full max-h-[90vh] rounded-lg shadow-2xl border border-white/20"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GameGallery;
