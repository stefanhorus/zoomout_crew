import "./globals.css";
import "lenis/dist/lenis.css";
import { Inter, Inter_Tight, Instrument_Serif } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ConditionalAnalytics from "@/components/ConditionalAnalytics";
import { CartProvider } from "@/contexts/CartContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { Metadata } from "next";
import StructuredData from "@/components/StructuredData";
import SmoothScroll from "@/components/motion/SmoothScroll";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { CursorLabel } from "@/components/motion/CursorLabel";
import { Preloader, introSeenScript } from "@/components/motion/Preloader";
import { BASE_PATH, withBasePath } from "@/lib/base-path";

// latin-ext pentru diacriticele românești (ă, î, ș, ț)
const display = Inter_Tight({
  subsets: ["latin", "latin-ext"],
  variable: "--font-display-face",
  display: "swap",
});

const body = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-body-face",
  display: "swap",
});

const serif = Instrument_Serif({
  subsets: ["latin", "latin-ext"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif-face",
  display: "swap",
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
  // Cât timp v2 e doar o copie de test sub /2, Google nu o indexează (ar dubla paginile site-ului live)
  robots: BASE_PATH
    ? { index: false, follow: false }
    : {
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
      { url: withBasePath("/favicon.ico"), sizes: "any" },
      { url: withBasePath("/assets/icon.ico"), sizes: "any" },
      { url: withBasePath("/favicon.ico"), type: "image/x-icon" },
    ],
    shortcut: withBasePath("/favicon.ico"),
    apple: withBasePath("/assets/icon.ico"),
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Intro-ul se arată o singură dată pe sesiune - clasa se pune înainte de prima randare */}
        <script dangerouslySetInnerHTML={{ __html: introSeenScript }} />
        {/* Prioritate pentru video: Bunny.net Stream (hero) și Mux (proiecte) */}
        <link rel="preconnect" href="https://vz-b2ef903c-299.b-cdn.net" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://image.mux.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://stream.mux.com" />
        {/* hreflang tags pentru SEO multilingv */}
        <link rel="alternate" hrefLang="en" href="https://zoomoutcrew.com" />
        <link rel="alternate" hrefLang="ro" href="https://zoomoutcrew.com" />
        <link rel="alternate" hrefLang="x-default" href="https://zoomoutcrew.com" />
        {/* Organization Structured Data */}
        <StructuredData type="Organization" data={{}} />
        {/* LocalBusiness Structured Data for SEO */}
        <StructuredData type="LocalBusiness" data={{}} />
      </head>
      <body className={`${display.variable} ${body.variable} ${serif.variable} flex min-h-screen flex-col bg-ink text-paper antialiased`}>
        <LanguageProvider>
          <CurrencyProvider>
            <CartProvider>
              <MotionProvider>
                <SmoothScroll>
                  <Preloader />
                  <Header />
                  <main className="flex-1">{children}</main>
                  <Footer />
                  <CursorLabel />
                </SmoothScroll>
              </MotionProvider>
            </CartProvider>
          </CurrencyProvider>
        </LanguageProvider>
        <div className="grain" aria-hidden />
        <ConditionalAnalytics />
      </body>
    </html>
  );
}
