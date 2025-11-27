"use client";

import Image from "next/image";

interface LoadingSkeletonProps {
  className?: string;
}

export default function LoadingSkeleton({ className = "" }: LoadingSkeletonProps) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Background shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
      
      {/* Logo centered with pulse animation */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-16 h-16 md:w-20 md:h-20 animate-pulse">
          <Image
            src="/logo.png"
            alt="Loading..."
            width={80}
            height={80}
            className="w-full h-full object-contain opacity-30"
            priority
          />
          {/* Rotating ring around logo */}
          <div className="absolute inset-0 border-2 border-white/20 rounded-full animate-spin-slow" 
               style={{ 
                 borderTopColor: 'transparent',
                 borderRightColor: 'rgba(255, 255, 255, 0.3)',
                 borderBottomColor: 'transparent',
                 borderLeftColor: 'rgba(255, 255, 255, 0.1)'
               }} 
          />
        </div>
      </div>
    </div>
  );
}

