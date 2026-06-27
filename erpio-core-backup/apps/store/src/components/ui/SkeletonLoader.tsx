import React from 'react';

const SkeletonLoader: React.FC = () => {
  return (
    <div className="animate-pulse rounded-md bg-zinc-200 h-48 w-full flex items-center justify-center">
      <div className="w-3/4 h-2 bg-zinc-300 rounded"></div>
    </div>
  );
};

export default SkeletonLoader;
