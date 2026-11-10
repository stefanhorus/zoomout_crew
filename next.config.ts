import type { NextConfig } from "next";
import { withNextVideo } from 'next-video/process';

// Din 2026-11-10 noul design e site-ul principal, la zoomoutcrew.com. Site-ul vechi a rămas la zoomoutcrew.com/2:
// îl servește proiectul Vercel „zoomout-crew-v2” (ramura v2, cu basePath /2), iar rewrites de mai jos îl aduc sub domeniu.
// Un prefix aici ar muta iar noul design sub el (și ar opri indexarea în Google, vezi app/layout.tsx).
const BASE_PATH = "";
const OLD_SITE = "https://zoomout-crew-v2.vercel.app";

const nextConfig: NextConfig = {
  basePath: BASE_PATH || undefined,
  env: { NEXT_PUBLIC_BASE_PATH: BASE_PATH },

  async redirects() {
    // Sub un prefix, rădăcina domeniului duce la el
    if (BASE_PATH) return [{ source: "/", destination: BASE_PATH, basePath: false, permanent: false }];
    // Linkurile proiectelor trimise cât timp noul design stătea la /2 (ex. zoomoutcrew.com/2/portfolio/lepas)
    return [{ source: "/2/portfolio/:slug", destination: "/portfolio/:slug", permanent: true }];
  },

  // zoomoutcrew.com/2 = site-ul vechi. beforeFiles: pe Vercel, cererile prin care paginile se preîncarcă (antetul RSC)
  // ajung la el neschimbate; altfel Vercel le modifică adresa, iar site-ul de la /2 răspunde cu 404.
  async rewrites() {
    if (BASE_PATH) return [];
    return {
      beforeFiles: [
        { source: "/2", destination: `${OLD_SITE}/2` },
        { source: "/2/:path*", destination: `${OLD_SITE}/2/:path*` },
      ],
    };
  },

  // app/portfolio/[slug]/opengraph-image.tsx citește copertele din public/ doar la build. Fără excluderea asta, Vercel
  // pune tot public/ (cu video-urile) în funcția paginilor de proiect, peste limita de 250 MB, și deploy-ul pică.
  outputFileTracingExcludes: {
    "/portfolio/**": ["public/**/*"],
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
