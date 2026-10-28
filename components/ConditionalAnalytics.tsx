"use client";

import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { BASE_PATH } from "@/lib/base-path";

// Copia de test de sub /2 nu trimite statistici: Vercel le-ar număra la site-ul live, pe aceleași pagini (fără /2)
export default function ConditionalAnalytics() {
  if (BASE_PATH) return null;
  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  );
}
