import type { NextConfig } from "next";
import { withNextVideo } from 'next-video/process';

// Site-ul vechi, păstrat la zoomoutcrew.com/2 de când noul design e site-ul principal (2026-11-10). Îl servește
// proiectul Vercel „zoomout-crew-v2” (ramura v2); site-ul principal trimite /2 aici. Fișierele din public/ sunt
// cerute fără /2 (ex. /assets/...), deci vin de la site-ul principal, care le are pe toate; la fel cererile către /api.
const BASE_PATH = "/2";

const nextConfig: NextConfig = {
  basePath: BASE_PATH,

  // Pe domeniul propriu al proiectului (zoomout-crew-v2.vercel.app) rădăcina duce la /2
  async redirects() {
    return [{ source: "/", destination: BASE_PATH, basePath: false, permanent: false }];
  },

  // Optimizări pentru imagini
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    // Fără optimizare: cu basePath, optimizatorul ar căuta /assets/... în acest proiect, nu la site-ul principal
    unoptimized: true,
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
