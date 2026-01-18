"use client";

import { useState } from "react";
import { useCookie } from "@/contexts/CookieContext";
import { useLanguage } from "@/contexts/LanguageContext";

export default function CookieBanner() {
  const { showBanner, setCookieConsent } = useCookie();
  const { t, language } = useLanguage();
  const [showDetails, setShowDetails] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);

  if (!showBanner) return null;

  const handleAcceptAll = () => {
    setCookieConsent({
      necessary: true,
      analytics: true,
    });
  };

  const handleRejectAll = () => {
    setCookieConsent({
      necessary: true, // Necessary cookies nu pot fi dezactivate
      analytics: false,
    });
  };

  const translations: Record<string, Record<string, string>> = {
    en: {
      title: "Cookie Preferences",
      description: "We use cookies to enhance your experience, analyze site usage, and assist in marketing efforts.",
      necessary: "Necessary",
      necessaryDesc: "Required for the site to function. Cannot be disabled.",
      analytics: "Analytics",
      analyticsDesc: "Helps us understand how visitors interact with our website.",
      acceptAll: "Accept All",
      rejectAll: "Reject All",
      savePreferences: "Save Preferences",
      manageCookies: "Manage Cookies",
      learnMore: "Learn More",
    },
    ro: {
      title: "Preferințe Cookie",
      description: "Folosim cookie-uri pentru a îmbunătăți experiența ta, a analiza utilizarea site-ului și a ajuta în eforturile de marketing.",
      necessary: "Necesare",
      necessaryDesc: "Necesare pentru funcționarea site-ului. Nu pot fi dezactivate.",
      analytics: "Analiză",
      analyticsDesc: "Ne ajută să înțelegem cum interacționează vizitatorii cu site-ul nostru.",
      acceptAll: "Acceptă Totul",
      rejectAll: "Refuză Totul",
      savePreferences: "Salvează Preferințele",
      manageCookies: "Gestionează Cookie-urile",
      learnMore: "Află Mai Mult",
    },
  };

  const texts = translations[language] || translations.en;

  return (
    <>
      {/* Overlay pentru întunecare și blur - fără blur pe mobile pentru a nu bloca video-ul */}
      <div 
        className="fixed inset-0 z-[10] bg-black/30 md:bg-black/60 backdrop-blur-none md:backdrop-blur-md animate-fade-in transition-all duration-300"
        style={{ pointerEvents: 'none' }}
      />
      
      {/* Banner-ul de cookie-uri */}
      <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-6 animate-fade-in-up">
        <div className="liquid-glass max-w-6xl mx-auto rounded-2xl p-6 md:p-8 shadow-2xl">
        <div className="flex flex-col gap-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-xl md:text-2xl font-bold mb-2" style={{ fontFamily: "var(--font-playfair)" }}>
                {texts.title}
              </h3>
              <p className="text-sm md:text-base text-white/80 leading-relaxed">
                {texts.description}
              </p>
            </div>
          </div>

          {/* Cookie Details (when expanded) */}
          {showDetails && (
            <div className="mt-4 space-y-4 pt-4 border-t border-white/20">
              {/* Necessary Cookies */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="necessary"
                  checked={true}
                  disabled={true}
                  className="mt-1 w-5 h-5 rounded border-white/30 bg-white/10 checked:bg-white/20 cursor-not-allowed"
                />
                <div className="flex-1">
                  <label htmlFor="necessary" className="font-semibold block mb-1">
                    {texts.necessary}
                  </label>
                  <p className="text-sm text-white/70">{texts.necessaryDesc}</p>
                </div>
              </div>

              {/* Analytics Cookies */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="analytics"
                  checked={analyticsEnabled}
                  onChange={(e) => setAnalyticsEnabled(e.target.checked)}
                  className="mt-1 w-5 h-5 rounded border-white/30 bg-white/10 checked:bg-white/20 cursor-pointer focus:ring-2 focus:ring-white/50"
                />
                <div className="flex-1">
                  <label htmlFor="analytics" className="font-semibold block mb-1 cursor-pointer">
                    {texts.analytics}
                  </label>
                  <p className="text-sm text-white/70">{texts.analyticsDesc}</p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <div className="flex flex-wrap gap-3 flex-1">
              <button
                onClick={handleAcceptAll}
                className="liquid-glass-button px-6 py-3 rounded-lg font-medium text-white hover:bg-white/30 transition-all duration-300 flex-1 sm:flex-none min-w-[140px]"
              >
                {texts.acceptAll}
              </button>
              <button
                onClick={handleRejectAll}
                className="liquid-glass-button px-6 py-3 rounded-lg font-medium text-white hover:bg-white/30 transition-all duration-300 flex-1 sm:flex-none min-w-[140px]"
              >
                {texts.rejectAll}
              </button>
            </div>
            <button
              onClick={() => {
                if (showDetails) {
                  setCookieConsent({
                    necessary: true,
                    analytics: analyticsEnabled,
                  });
                } else {
                  setShowDetails(true);
                }
              }}
              className="liquid-glass-button px-6 py-3 rounded-lg font-medium text-white hover:bg-white/30 transition-all duration-300"
            >
              {showDetails ? texts.savePreferences : texts.manageCookies}
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
