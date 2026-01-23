import "./globals.css";
import { Playfair_Display, Roboto } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ConditionalAnalytics from "@/components/ConditionalAnalytics";
import { CartProvider } from "@/contexts/CartContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { CookieProvider } from "@/contexts/CookieContext";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Metadata } from "next";

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
    default: "Zoomout_crew - Professional Aerial Footage & Cinematography",
    template: "%s | Zoomout_crew",
  },
  description: "Professional aerial videography & more",
  keywords: ["aerial footage", "drone cinematography", "aerial videography", "drone services", "real estate videography", "event coverage", "commercial videography"],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://zoomoutcrew.com",
    siteName: "Zoomout_crew",
    title: "Zoomout_crew - Professional Aerial Footage & Cinematography",
    description: "Professional aerial videography & more",
    images: [
      {
        url: "https://zoomoutcrew.com/assets/logo.png",
        width: 1024,
        height: 1024,
        alt: "Zoomout_crew - Professional Aerial Videography",
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
      </head>
      <body
        className={`${roboto.variable} ${playfair.variable} bg-black text-white antialiased flex flex-col min-h-screen`}
      >
        <CookieProvider>
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
        </CookieProvider>
      </body>
    </html>
  );
}
