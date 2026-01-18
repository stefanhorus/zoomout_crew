"use client";

import { useEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/next";
import { useCookie } from "@/contexts/CookieContext";

export default function ConditionalAnalytics() {
  const { cookieConsent } = useCookie();
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    // Verifică consimțământul pentru Analytics
    if (cookieConsent?.analytics) {
      setShouldLoad(true);
    } else if (cookieConsent === null) {
      // Dacă nu există consimțământ încă, verifică localStorage
      try {
        const savedConsent = localStorage.getItem("zoomout_crew_cookie_consent");
        if (savedConsent) {
          const preferences = JSON.parse(savedConsent);
          if (preferences.analytics) {
            setShouldLoad(true);
          }
        }
      } catch (error) {
        // Dacă nu există consimțământ, nu încărca Analytics
        setShouldLoad(false);
      }
    } else {
      setShouldLoad(false);
    }
  }, [cookieConsent]);

  // Nu încărca Analytics dacă utilizatorul nu a dat consimțământ
  if (!shouldLoad) {
    return null;
  }

  return <Analytics />;
}
