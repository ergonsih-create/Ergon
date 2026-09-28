import React from 'react';

export interface LoadingSkeletonProps {
  rows?: number;
  height?: string;
  className?: string;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  rows = 3,
  height = 'h-4',
  className = '',
}) => {
  return (
    <div className={`space-y-3 animate-pulse ${className}`}>
      {Array.from({ length: rows }).map((_, idx) => (
        <div
          key={idx}
          className={`${height} bg-[#D9D3C7]/40 rounded-lg ${
            idx === rows - 1 ? 'w-3/4' : 'w-full'
          }`}
        />
      ))}
    </div>
  );
};
