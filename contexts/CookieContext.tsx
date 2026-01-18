"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
}

interface CookieContextType {
  cookieConsent: CookiePreferences | null;
  setCookieConsent: (preferences: CookiePreferences) => void;
  showBanner: boolean;
  setShowBanner: (show: boolean) => void;
}

const CookieContext = createContext<CookieContextType | undefined>(undefined);

const COOKIE_CONSENT_KEY = "zoomout_crew_cookie_consent";

export function CookieProvider({ children }: { children: ReactNode }) {
  const [cookieConsent, setCookieConsentState] = useState<CookiePreferences | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Încarcă consimțământul din localStorage la mount
  useEffect(() => {
    try {
      const savedConsent = localStorage.getItem(COOKIE_CONSENT_KEY);
      if (savedConsent) {
        const preferences = JSON.parse(savedConsent) as CookiePreferences;
        setCookieConsentState(preferences);
        setShowBanner(false);
      } else {
        setShowBanner(true);
      }
    } catch (error) {
      console.error("Error loading cookie consent:", error);
      setShowBanner(true);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Salvează consimțământul în localStorage când se schimbă
  const setCookieConsent = (preferences: CookiePreferences) => {
    setCookieConsentState(preferences);
    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(preferences));
      setShowBanner(false);
    } catch (error) {
      console.error("Error saving cookie consent:", error);
    }
  };

  // Activează/oprește Analytics bazat pe consimțământ
  useEffect(() => {
    if (!isLoaded) return;

    if (cookieConsent?.analytics) {
      // Activează Vercel Analytics
      // Vercel Analytics se încarcă automat când componenta este renderată
      // Vom folosi un script pentru a-l activa/opri
      if (typeof window !== "undefined") {
        // Setăm un flag pentru Analytics
        window.localStorage.setItem("vercel_analytics_enabled", "true");
        // Reîncarcă pagina pentru a activa Analytics (doar prima dată)
        if (!window.localStorage.getItem("analytics_initialized")) {
          window.localStorage.setItem("analytics_initialized", "true");
          // Nu reîncărcăm automat - lăsăm utilizatorul să navigheze normal
        }
      }
    } else {
      // Oprește Analytics
      if (typeof window !== "undefined") {
        window.localStorage.setItem("vercel_analytics_enabled", "false");
        // Opțional: șterge cookie-urile Analytics
        document.cookie.split(";").forEach((cookie) => {
          const eqPos = cookie.indexOf("=");
          const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
          if (name.includes("vercel") || name.includes("analytics")) {
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
          }
        });
      }
    }
  }, [cookieConsent, isLoaded]);

  return (
    <CookieContext.Provider
      value={{
        cookieConsent,
        setCookieConsent,
        showBanner,
        setShowBanner,
      }}
    >
      {children}
    </CookieContext.Provider>
  );
}

export function useCookie() {
  const context = useContext(CookieContext);
  if (context === undefined) {
    throw new Error("useCookie must be used within a CookieProvider");
  }
  return context;
}
