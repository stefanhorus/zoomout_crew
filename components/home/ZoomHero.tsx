"use client";

import {
  cubicBezier,
  mix,
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "motion/react";
import { getImageProps } from "next/image";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useMediaQuery, usePrefersReducedMotion } from "@/lib/hooks";
import { EASE } from "../motion/ease";
import { useIntroDone } from "../motion/Preloader";
import { Rich } from "../motion/rich";
import { SplitReveal } from "../motion/SplitReveal";
import { HeroVideo } from "./HeroVideo";
import { withBasePath } from "@/lib/base-path";

// Buclele din mozaic sunt generate cu scripts/make-mosaic-tile.py, fiecare în variantă orizontală (desktop) și
// verticală (telefon). La înlocuirea lor, crește TILES_VERSION ca vizitatorii să nu primească varianta veche din cache.
const TILES_VERSION = "1";
const TILES_DIR = withBasePath("/assets/v2/tiles");
const PORTRAIT = "(orientation: portrait)";

// Mozaicul din jurul video-ului: proiecte de client + filmări aeriene proprii. Poziția 4 (centrul) e video-ul.
const TILES = ["nyc", "casanumaa", "sardinia", "rooftop", null, "panoramic", "hollywood", "outdoor", "lifeispink"];

// Vizitatorul a cerut economie de date (Chrome pe Android, „Data Saver”): rămân doar copertele
const savesData = () => (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;

const zoomEase = cubicBezier(0.42, 0, 0.3, 1);

// O celulă din mozaic: coperta (primul cadru al buclei) și deasupra bucla, care se încarcă abia când e nevoie de ea
// și rulează doar cât timp se vede
function MosaicTile({ name, play, portrait }: { name: string; play: boolean; portrait: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const common = { alt: "", fill: true, sizes: "34vw" } as const;
  const { props: poster } = getImageProps({ ...common, src: `${TILES_DIR}/${name}.jpg` });
  const { props: portraitPoster } = getImageProps({ ...common, src: `${TILES_DIR}/${name}-portrait.jpg` });

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (!play || savesData()) {
      video.pause();
      return;
    }
    const src = new URL(`${TILES_DIR}/${name}${portrait ? "-portrait" : ""}.mp4?v=${TILES_VERSION}`, window.location.href).href;
    if (video.src !== src) {
      // Și la rotirea telefonului: coperta potrivită rămâne la vedere până pornește noul fișier
      video.removeAttribute("data-ready");
      video.src = src;
    }
    video.play().catch(() => {});
  }, [name, play, portrait]);

  return (
    <div className="relative overflow-hidden rounded-[16px] bg-ink-2">
      <picture>
        <source media={PORTRAIT} srcSet={portraitPoster.srcSet || portraitPoster.src} sizes="34vw" />
        {/* eslint-disable-next-line jsx-a11y/alt-text -- alt-ul vine din poster (decorativ, gol) */}
        <img {...poster} className="object-cover" />
      </picture>
      <video
        ref={videoRef}
        className="hero-video"
        muted
        loop
        playsInline
        preload="none"
        aria-hidden
        onPlaying={(event) => event.currentTarget.setAttribute("data-ready", "")}
      />
      <div className="absolute inset-0 bg-ink/20" />
    </div>
  );
}

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

  // Buclele din mozaic pornesc odată cu derularea (până la zoom out celulele sunt în afara ecranului) și se opresc
  // când secțiunea iese din ecran. Cu mișcare redusă mozaicul nu se vede deloc.
  const portrait = useMediaQuery(PORTRAIT);
  const sectionInView = useInView(sectionRef);
  const [scrolledIn, setScrolledIn] = useState(false);
  useMotionValueEvent(scrollYProgress, "change", (progress) => setScrolledIn(progress > 0.01));
  const playTiles = sectionInView && scrolledIn && !reducedMotion;

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
          {TILES.map((tile) =>
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
              <MosaicTile key={tile} name={tile} play={playTiles} portrait={portrait} />
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
