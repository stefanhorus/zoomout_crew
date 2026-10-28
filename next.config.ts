import type { NextConfig } from "next";
import { withNextVideo } from 'next-video/process';

// v2 e servit la zoomoutcrew.com/2: site-ul live trimite /2 către proiectul Vercel al lui v2.
// Când v2 devine site-ul principal, pune "" aici (și indexarea în Google pornește din nou, vezi app/layout.tsx).
const BASE_PATH = "/2";

const nextConfig: NextConfig = {
  basePath: BASE_PATH || undefined,
  env: { NEXT_PUBLIC_BASE_PATH: BASE_PATH },

  // Pe domeniul propriu al lui v2 (și local) rădăcina duce la /2
  async redirects() {
    return BASE_PATH ? [{ source: "/", destination: BASE_PATH, basePath: false, permanent: false }] : [];
  },

  // Optimizări pentru imagini
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    // Copertele proiectelor vin direct de la Mux
    remotePatterns: [{ protocol: "https", hostname: "image.mux.com" }],
    // Local (npm run dev) servim imaginile direct: pe SSD-ul exFAT macOS creează fișiere "._*" în
    // .next/dev/cache/images, iar Next le citește în locul imaginii (imagini stricate în browser).
    // În producție (Vercel) optimizarea rămâne activă.
    unoptimized: process.env.NODE_ENV === "development",
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
