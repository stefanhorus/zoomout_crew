"use client";

import { cubicBezier, mix, motion, useMotionValue, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { muxThumb } from "@/lib/projects";
import { EASE } from "../motion/ease";
import { useIntroDone } from "../motion/Preloader";
import { Rich } from "../motion/rich";
import { SplitReveal } from "../motion/SplitReveal";
import { HeroVideo } from "./HeroVideo";

const square = (id: string, time: number) => muxThumb(id, { time, width: 900, height: 900, smartcrop: true });

// Mozaicul din jurul video-ului: proiecte de client + filmări aeriene proprii. Poziția 4 (centrul) e video-ul.
const TILES: Array<{ src: string; remote?: boolean } | null> = [
  { src: "/assets/backgrounds/background6tiny.png" },
  { src: square("BaZoibIrmiaFjm1oPbGIWlhQAZrZHCV9NcIMW4HQN014", 1), remote: true },
  { src: "/assets/backgrounds/background4tiny.png" },
  { src: square("Xi5sUxm00g8N5UJGPn7D9Mut4JsMfUFULA01Qn02woUOwo", 9), remote: true },
  null,
  { src: square("iQW9j3rKkGubagCrFEPgfWxQtpnzW5PFdTWw00SpAliA", 3), remote: true },
  { src: "/assets/backgrounds/backgroundtiny.png" },
  { src: square("c5jDLrljSoSJid7Du9P9XQb37yzRRrIKqFHYzqpKG8c", 12), remote: true },
  { src: "/assets/adventures/edinburgh/edinburgh7.png" },
];

const zoomEase = cubicBezier(0.42, 0, 0.3, 1);

export function ZoomHero() {
  const { t } = useLanguage();
  const reducedMotion = usePrefersReducedMotion();
  const introDone = useIntroDone();
  const sectionRef = useRef<HTMLElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);
  // Cât trebuie mărit mozaicul ca celula din centru să umple ecranul (se calculează la resize)
  const startScale = useMotionValue(3.4);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const zoom = useTransform(scrollYProgress, [0.04, 0.72], [0, 1], { ease: zoomEase });
  const scale = useTransform(() => mix(startScale.get(), 1, zoom.get()));
  const centerRadius = useTransform(zoom, [0, 1], [0, 16]);
  const headlineOpacity = useTransform(scrollYProgress, [0.02, 0.16], [1, 0]);
  const headlineY = useTransform(scrollYProgress, [0, 0.16], [0, -110]);
  const shadeOpacity = useTransform(scrollYProgress, [0, 0.22], [1, 0]);
  const scrimOpacity = useTransform(scrollYProgress, [0.62, 0.8], [0, 0.55]);
  const captionOpacity = useTransform(scrollYProgress, [0.66, 0.8], [0, 1]);
  const captionScale = useTransform(scrollYProgress, [0.66, 0.92], [0.9, 1]);

  useEffect(() => {
    const cell = centerRef.current;
    if (!cell) return;
    const measure = () => {
      const scaleX = window.innerWidth / cell.offsetWidth;
      const scaleY = window.innerHeight / cell.offsetHeight;
      startScale.set(Math.max(scaleX, scaleY) * 1.015);
    };
    const observer = new ResizeObserver(measure);
    observer.observe(cell);
    return () => observer.disconnect();
  }, [startScale]);

  return (
    <section ref={sectionRef} className={`relative bg-ink ${reducedMotion ? "h-[100svh]" : "h-[340vh]"}`}>
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <motion.div
          style={{ scale: reducedMotion ? startScale : scale }}
          className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-[1vw] p-[3.5vw] will-change-transform"
        >
          {TILES.map((tile, index) =>
            tile === null ? (
              <motion.div
                key="video"
                ref={centerRef}
                style={{ borderRadius: reducedMotion ? 0 : centerRadius }}
                className="relative overflow-hidden"
              >
                <HeroVideo />
              </motion.div>
            ) : (
              <div key={index} className="relative overflow-hidden rounded-[16px] bg-ink-2">
                <Image src={tile.src} alt="" fill sizes="34vw" unoptimized={tile.remote} className="object-cover" />
                <div className="absolute inset-0 bg-ink/20" />
              </div>
            )
          )}
        </motion.div>

        {/* Umbră pentru lizibilitatea titlului peste video */}
        <motion.div
          style={{ opacity: shadeOpacity }}
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/15 to-ink/45"
        />
        <motion.div style={{ opacity: scrimOpacity }} className="pointer-events-none absolute inset-0 bg-ink" />

        {/* Titlul */}
        <motion.div style={{ opacity: headlineOpacity, y: headlineY }} className="absolute inset-x-0 bottom-0 pb-[7svh]">
          <div className="container-site">
            <motion.p
              className="kicker flex items-center gap-3 text-paper"
              initial={{ opacity: 0 }}
              animate={{ opacity: introDone ? 1 : 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              <span className="rec-dot" /> REC <span className="text-paper/40">/</span> {t("hero.location")}
            </motion.p>
            <h1 className="display-xl mt-6">
              <SplitReveal text={t("hero.line1")} mode="mount" play={introDone} delay={0.15} />
              <br />
              <SplitReveal text={t("hero.line2")} mode="mount" play={introDone} delay={0.32} />
            </h1>
            <motion.div
              className="mt-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between"
              initial={{ opacity: 0, y: 20 }}
              animate={introDone ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 1, ease: EASE, delay: 0.85 }}
            >
              <p className="max-w-xl text-[15px] text-paper-dim md:text-base">{t("hero.meta")}</p>
              <span className="kicker flex items-center gap-3 text-paper/80">
                {t("hero.scroll")}
                <span className="relative block h-9 w-px overflow-hidden bg-paper/25">
                  <motion.span
                    className="absolute left-0 top-0 block h-3 w-px bg-paper"
                    animate={{ y: [-12, 36] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                  />
                </span>
              </span>
            </motion.div>
          </div>
        </motion.div>

        {/* "See the bigger picture." apare după zoom out */}
        {!reducedMotion && (
          <motion.div
            style={{ opacity: captionOpacity, scale: captionScale }}
            className="pointer-events-none absolute inset-0 flex items-center justify-center px-6"
          >
            <p className="display-lg max-w-[14ch] text-center">
              <Rich text={t("hero.bigPicture")} />
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
