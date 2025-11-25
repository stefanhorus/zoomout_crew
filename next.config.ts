import type { NextConfig } from "next";
import { withNextVideo } from 'next-video/process';

const nextConfig: NextConfig = {
  // Optimizări pentru imagini
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },

  // Optimizări pentru build
  experimental: {
    optimizePackageImports: ['react-simple-typewriter'],
  },

  // Configurație Turbopack (Next.js 16 folosește Turbopack implicit)
  turbopack: {},

  // Compresie
  compress: true,
  
  // Power optimizations
  poweredByHeader: false,

  // Headers pentru fișiere video
  async headers() {
    return [
      {
        source: '/:path*.mp4',
        headers: [
          {
            key: 'Content-Type',
            value: 'video/mp4',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:path*.mov',
        headers: [
          {
            key: 'Content-Type',
            value: 'video/quicktime',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default withNextVideo(nextConfig);
