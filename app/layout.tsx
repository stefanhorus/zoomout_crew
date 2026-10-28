import "./globals.css";
import { Playfair_Display, Roboto } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ConditionalAnalytics from "@/components/ConditionalAnalytics";
import { CartProvider } from "@/contexts/CartContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Metadata } from "next";
import StructuredData from "@/components/StructuredData";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-playfair",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: {
    default: "Zoomout_crew - Producție Video & Filmări cu Dronă Cluj",
    template: "%s | Zoomout_crew",
  },
  description: "Producție video în Cluj-Napoca: reclame, conținut pentru social media, aftermovie-uri, videoclipuri muzicale, filmări cu drona și post-producție. Plus LUTs, preseturi Lightroom și asset-uri de editare video.",
  keywords: [
    // Romanian keywords
    "producție video cluj", "videograf cluj", "filmări video cluj", "reclame video cluj",
    "filmări evenimente cluj", "aftermovie cluj", "videoclipuri muzicale", "conținut social media",
    "filmări cu dronă", "filmări cu dronă cluj", "filmări cu dronă cluj napoca", "videografie aeriană cluj",
    "LUTs video", "preseturi lightroom", "efecte sonore", "asset-uri editare video", "color grading",
    // English keywords
    "video production cluj", "videographer cluj", "commercial video production", "event videography",
    "aftermovies", "music videos", "social media video content", "drone videography romania",
    "aerial videography", "drone services cluj", "post-production", "video editing",
    "video LUTs", "lightroom presets", "sound effects", "editing assets", "cinematic LUTs"
  ],
  alternates: {
    canonical: "https://zoomoutcrew.com",
    languages: {
      "en": "https://zoomoutcrew.com",
      "ro": "https://zoomoutcrew.com",
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://zoomoutcrew.com",
    siteName: "Zoomout_crew",
    title: "Zoomout_crew - Producție Video & Filmări cu Dronă Cluj",
    description: "Producție video în Cluj-Napoca: reclame, conținut pentru social media, aftermovie-uri, videoclipuri muzicale, filmări cu drona și post-producție. Plus LUTs, preseturi Lightroom și asset-uri de editare video.",
    images: [
      {
        url: "https://zoomoutcrew.com/assets/logo.png",
        width: 1024,
        height: 1024,
        alt: "Zoomout_crew - Video Production & Drone Filming",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/assets/icon.ico", sizes: "any" },
      { url: "/favicon.ico", type: "image/x-icon" },
    ],
    shortcut: "/favicon.ico",
    apple: "/assets/icon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Prioritate maximă pentru video - preconnect pentru Bunny.net Stream */}
        <link rel="preconnect" href="https://iframe.mediadelivery.net" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://iframe.mediadelivery.net" />
        <link rel="preconnect" href="https://vz-*.b-cdn.net" crossOrigin="anonymous" />
        {/* hreflang tags pentru SEO multilingv */}
        <link rel="alternate" hrefLang="en" href="https://zoomoutcrew.com" />
        <link rel="alternate" hrefLang="ro" href="https://zoomoutcrew.com" />
        <link rel="alternate" hrefLang="x-default" href="https://zoomoutcrew.com" />
        {/* Organization Structured Data */}
        <StructuredData type="Organization" data={{}} />
        {/* LocalBusiness Structured Data for SEO */}
        <StructuredData type="LocalBusiness" data={{}} />
      </head>
      <body
        className={`${roboto.variable} ${playfair.variable} bg-black text-white antialiased flex flex-col min-h-screen`}
      >
        <LanguageProvider>
          <CurrencyProvider>
            <CartProvider>
              <Header />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </CartProvider>
          </CurrencyProvider>
        </LanguageProvider>
        <ConditionalAnalytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
