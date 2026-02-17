import React from 'react';

export function SkeletonLoader({ className = "", height = "h-4", width = "w-full" }) {
  return (
    <div 
      className={`${height} ${width} bg-gradient-to-r from-tea-beige via-tea-amber/30 to-tea-beige rounded-lg animate-pulse ${className}`}
    />
  );
}

export function MetricCardSkeleton() {
  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <SkeletonLoader width="w-12 h-12 rounded-full" />
        <SkeletonLoader width="w-16 h-6" />
      </div>
      <SkeletonLoader height="h-8 mb-2" />
      <SkeletonLoader height="h-4 w-3/4" />
    </div>
  );
}

export function RankingCardSkeleton() {
  return (
    <div className="glass-card p-4 mb-3">
      <div className="flex items-center space-x-4">
        <SkeletonLoader width="w-12 h-12 rounded-full" />
        <div className="flex-1">
          <SkeletonLoader height="h-5 mb-2 w-32" />
          <SkeletonLoader height="h-4 w-24" />
        </div>
        <SkeletonLoader width="w-16 h-8" />
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="glass-card p-4">
          <div className="flex items-center space-x-4">
            <SkeletonLoader width="w-8 h-8" />
            <SkeletonLoader width="w-32 h-5" />
            <SkeletonLoader width="w-24 h-5" />
            <SkeletonLoader width="w-20 h-5" />
            <SkeletonLoader width="w-16 h-5" />
          </div>
        </div>
      ))}
    </div>
  );
}
