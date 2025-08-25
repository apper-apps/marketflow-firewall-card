import React from "react";

const Loading = () => {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="h-6 bg-gray-200 rounded w-32 shimmer"></div>
        <div className="flex gap-2">
          <div className="h-8 w-8 bg-gray-200 rounded shimmer"></div>
          <div className="h-8 w-8 bg-gray-200 rounded shimmer"></div>
        </div>
      </div>

      {/* Product Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Image Skeleton */}
            <div className="h-48 bg-gray-200 shimmer"></div>
            
            {/* Content Skeleton */}
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gray-200 rounded shimmer"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 shimmer"></div>
              
              {/* Stars Skeleton */}
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }, (_, j) => (
                  <div key={j} className="h-3 w-3 bg-gray-200 rounded shimmer"></div>
                ))}
              </div>
              
              {/* Price and Button Skeleton */}
              <div className="flex items-center justify-between">
                <div className="h-6 bg-gray-200 rounded w-16 shimmer"></div>
                <div className="h-8 w-8 bg-gray-200 rounded shimmer"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Loading;