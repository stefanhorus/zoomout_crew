"use client";

interface ImageSkeletonProps {
  className?: string;
  aspectRatio?: "square" | "video" | "landscape" | "portrait";
}

export default function ImageSkeleton({ 
  className = "", 
  aspectRatio = "square" 
}: ImageSkeletonProps) {
  const aspectClasses = {
    square: "aspect-square",
    video: "aspect-video",
    landscape: "aspect-[4/3]",
    portrait: "aspect-[3/4]",
  };

  return (
    <div 
      className={`relative overflow-hidden rounded-xl ${aspectClasses[aspectRatio]} ${className}`}
    >
      {/* Background with liquid glass effect */}
      <div className="absolute inset-0 liquid-glass" />
      
      {/* Shimmer animation */}
      <div className="absolute inset-0 animate-shimmer">
        <div className="h-full w-full bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12" />
      </div>
      
      {/* Subtle pulse effect */}
      <div className="absolute inset-0 animate-pulse opacity-20">
        <div className="h-full w-full bg-white/5" />
      </div>
    </div>
  );
}
