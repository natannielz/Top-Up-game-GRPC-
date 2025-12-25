const Skeleton = ({ className, ...props }) => {
  return (
    <div
      className={`animate-pulse bg-white/10 rounded-lg ${className}`}
      {...props}
    />
  );
};

export { Skeleton };
