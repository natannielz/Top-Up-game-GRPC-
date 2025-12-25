import { useState, useMemo } from 'react';

const Avatar = ({
  seed,
  src,
  size = 'md',
  className = '',
  alt = 'User Avatar'
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Generate DiceBear URL if no custom src is provided
  // Using 'bottts' collection for Gamer/Cyberpunk theme
  const diceBearUrl = useMemo(() => {
    const seedValue = seed || 'anonymous';
    return `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(seedValue)}&backgroundColor=b6e3f4,c0aede,d1d4f9`;
  }, [seed]);

  const finalSrc = src || diceBearUrl;

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  const currentSize = sizeClasses[size] || sizeClasses.md;

  return (
    <div className={`relative rounded-full overflow-hidden bg-white/5 border border-white/10 ${currentSize} ${className}`}>
      {/* Loading Skeleton */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 animate-pulse bg-white/10" />
      )}

      {/* Actual Image */}
      <img
        src={finalSrc}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
      />

      {/* Fallback if even DiceBear fails (rare) */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 text-xs text-gray-500 font-bold">
          ?
        </div>
      )}
    </div>
  );
};

export default Avatar;
