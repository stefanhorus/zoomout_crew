import type { NextConfig } from "next";
import { withNextVideo } from 'next-video/process';

const nextConfig: NextConfig = {
  // Optimizări pentru imagini
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    unoptimized: false,
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

  // zoomoutcrew.com/2 afișează noul design (v2), găzduit separat în proiectul Vercel „zoomout-crew-v2”.
  // beforeFiles: pe Vercel, cererile prin care paginile se preîncarcă (antetul RSC) ajung la v2 neschimbate;
  // altfel Vercel le modifică adresa înainte să le trimită, iar v2 răspunde cu 404.
  async rewrites() {
    return {
      beforeFiles: [
        { source: '/2', destination: 'https://zoomout-crew-v2.vercel.app/2' },
        { source: '/2/:path*', destination: 'https://zoomout-crew-v2.vercel.app/2/:path*' },
      ],
    };
  },

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
