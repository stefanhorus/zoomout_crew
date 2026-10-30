"use client";

import { useEffect, useRef } from "react";
import { AboutFacts } from "./AboutFacts";
import { Closing } from "./Closing";
import { ContactSheetHero } from "./ContactSheetHero";
import { Places } from "./Places";
import { ProcessRow } from "./ProcessRow";
import { Reviews } from "./Reviews";
import { ServiceIndex } from "./ServiceIndex";
import { TileFooter } from "./TileFooter";
import { WorkStrips } from "./WorkStrips";

// /home2: prima pagină refăcută după principiile Taste Skill, direcția „The contact sheet” (seed 1126451056).
// Ideea: numele Zoomout devine zoom-ul foii de contact. Notițele rundei sunt în .taste-skill/notes.md.
export function Home2() {
  const page = useRef<HTMLDivElement>(null);

  // Cât timp e deschisă pagina asta, granulația filmului de pe restul site-ului e oprită (vezi .home2-page în CSS)
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("home2-page");
    return () => root.classList.remove("home2-page");
  }, []);

  // Părțile marcate cu reveal() apar pe rând când secțiunea lor intră în ecran (o singură dată)
  useEffect(() => {
    const root = page.current;
    if (!root || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).dataset.shown = "";
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px" }
    );
    root.querySelectorAll("[data-reveal]").forEach((element) => observer.observe(element));
    root.classList.add("home2-reveal-ready");
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={page} className="home2">
      <ContactSheetHero />
      <WorkStrips />
      <AboutFacts />
      <ServiceIndex />
      <ProcessRow />
      <Reviews />
      <Places />
      <Closing />
      <TileFooter />
    </div>
  );
}
