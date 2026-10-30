"use client";

import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { useHome2Copy } from "./copy";
import { SHEET, STRIP_FRAMES, STRIP_START, loop } from "./frames";
import { Still } from "./Still";

// Zoom-ul din primul ecran, adică numele Zoomout pus în mâna vizitatorului: la 200 mm vezi o bandă de cadre alese,
// la 85 mm banda se strânge și apar toate cadrele, de la 35 mm în jos rândurile se rup și toată munca încape pe o
// foaie de contact. Înălțimea cadrelor pentru fiecare treaptă e în CSS (.home2-sheet[data-level]).
const LEVELS = [200, 85, 35, 18];
const FRAMES = SHEET.map((frame, id) => ({ ...frame, id }));
// Cadrele benzii sunt aceleași obiecte ca pe foaie (același id), doar în altă ordine
const STRIP = STRIP_FRAMES.map((frame) => FRAMES.find((candidate) => candidate.alt === frame.alt) ?? { ...frame, id: -1 });
const STRIP_IDS = new Set(STRIP.map((frame) => frame.id));
const PROJECTS = new Set(FRAMES.map((frame) => frame.project)).size;
const EASE = [0.16, 1, 0.3, 1] as const;

export function ContactSheetHero() {
  const copy = useHome2Copy();
  const reduceMotion = usePrefersReducedMotion();
  const [level, setLevel] = useState(0);
  const [activeId, setActiveId] = useState(STRIP[STRIP_START].id);
  const [hoverProject, setHoverProject] = useState<string | null>(null);
  const [caption, setCaption] = useState<string | null>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const zoomRow = useRef<HTMLDivElement>(null);
  const sheet = level >= 2;

  // La 85 mm cadrul din centru poate fi unul care nu e în banda de la 200 mm; la întoarcere luăm cadrul din bandă
  // al aceluiași proiect, ca bucla video și titlul să rămână pe ce se vedea
  const zoomTo = (next: number) => {
    if (next === 0 && !STRIP_IDS.has(activeId)) {
      const project = FRAMES.find((frame) => frame.id === activeId)?.project;
      setActiveId((STRIP.find((frame) => frame.project === project) ?? STRIP[STRIP_START]).id);
    }
    setLevel(next);
  };
  const frames = level === 0 ? STRIP : FRAMES;

  // Cadrul din mijlocul benzii e cel luminat; îl găsim la fiecare derulare laterală
  const findActive = useCallback(() => {
    const box = scroller.current;
    if (!box || sheet) return;
    const middle = box.scrollLeft + box.clientWidth / 2;
    let best: { id: number; distance: number } | null = null;
    for (const child of Array.from(box.children) as HTMLElement[]) {
      const distance = Math.abs(child.offsetLeft + child.offsetWidth / 2 - middle);
      if (!best || distance < best.distance) best = { id: Number(child.dataset.id), distance };
    }
    if (best) setActiveId(best.id);
  }, [sheet]);

  useEffect(() => {
    const box = scroller.current;
    if (!box || sheet) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(findActive);
    };
    box.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      box.removeEventListener("scroll", onScroll);
    };
  }, [findActive, sheet]);

  // La deschidere și la fiecare schimbare de zoom în bandă, cadrul activ vine în centru (banda e tăiată de ambele margini)
  useLayoutEffect(() => {
    const box = scroller.current;
    if (!box || sheet) return;
    const target = box.querySelector<HTMLElement>(`[data-id="${activeId}"]`);
    if (target) box.scrollLeft = target.offsetLeft + target.offsetWidth / 2 - box.clientWidth / 2;
    // doar la schimbarea treptei; derularea manuală își actualizează singură cadrul activ
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level]);

  // Pe telefon foaia poate împinge butoanele de zoom sub marginea ecranului; atunci derulăm cât să rămână la vedere
  useLayoutEffect(() => {
    const row = zoomRow.current?.getBoundingClientRect();
    if (row && row.bottom > window.innerHeight) window.scrollBy({ top: row.bottom - window.innerHeight + 16 });
  }, [level]);

  const countLine = copy.hero.count.replace("{frames}", String(FRAMES.length)).replace("{projects}", String(PROJECTS));

  return (
    <section aria-labelledby="home2-title" className="relative flex min-h-[100svh] flex-col pb-[var(--margin)] pt-20 md:pt-24">
      <h1 id="home2-title" className="home2-display home2-arrive max-w-[21ch] px-[var(--margin)] text-[length:var(--step-display)]">
        {copy.hero.title}
      </h1>

      <div className="min-h-6 flex-1" />

      <LayoutGroup>
        <motion.div
          ref={scroller}
          layout={!reduceMotion}
          data-level={level}
          tabIndex={sheet ? -1 : 0}
          role="group"
          aria-label={copy.hero.strip}
          onMouseLeave={() => {
            setHoverProject(null);
            setCaption(null);
          }}
          className="home2-sheet home2-arrive [--arrive-delay:120ms]"
        >
          <AnimatePresence initial={false} mode="popLayout">
            {frames.map((frame, index) => {
              const isActive = !sheet && frame.id === activeId;
              const dim = sheet ? hoverProject !== null && hoverProject !== frame.project : !isActive;
              const showVideo = isActive && level === 0 && frame.video && !reduceMotion;
              return (
                <motion.figure
                  key={frame.id}
                  data-id={frame.id}
                  layout={!reduceMotion}
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.7, ease: EASE }}
                  onMouseEnter={() => {
                    if (!sheet) return;
                    setHoverProject(frame.project);
                    setCaption(`${frame.project}: ${frame.alt}`);
                  }}
                  style={{ aspectRatio: `${frame.w} / ${frame.h}` }}
                  className="home2-frame"
                  data-dim={dim || undefined}
                >
                  <Still
                    frame={frame}
                    width={frame.h > frame.w ? 360 : 640}
                    sizes="(max-width: 767px) 70vw, 34vw"
                    priority={level === 0 && index >= 1 && index <= 4}
                  />
                  {showVideo && frame.video && (
                    <video
                      key={frame.video}
                      className="absolute inset-0 h-full w-full object-cover"
                      src={loop(frame.video, frame.h > frame.w)}
                      poster={frame.src(640)}
                      autoPlay
                      muted
                      loop
                      playsInline
                      aria-hidden
                    />
                  )}
                  {isActive && <figcaption className="home2-frame-title">{frame.project}</figcaption>}
                </motion.figure>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </LayoutGroup>

      <div
        ref={zoomRow}
        role="group"
        aria-label={copy.hero.zoomHelp}
        className="home2-arrive mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 px-[var(--margin)] [--arrive-delay:180ms] md:mt-4"
      >
        <span className="text-[length:var(--step-small)] text-[var(--muted)]">{copy.hero.zoom}</span>
        <div className="flex gap-1">
          {LEVELS.map((mm, index) => (
            <button key={mm} type="button" aria-pressed={level === index} onClick={() => zoomTo(index)} className="home2-zoom-button">
              {mm}&nbsp;mm
            </button>
          ))}
        </div>
        {sheet && (
          <p aria-live="polite" className="text-[length:var(--step-small)] text-[var(--muted)] md:ml-3">
            {caption ?? countLine}
          </p>
        )}
      </div>

      <div className="min-h-6 flex-1" />

      <div className="home2-arrive grid gap-6 px-[var(--margin)] [--arrive-delay:240ms] md:grid-cols-12 md:items-end md:gap-8">
        <p className="max-w-[46ch] md:col-span-8">{copy.hero.lead}</p>
        <div className="md:col-span-4 md:justify-self-end">
          <Link href="/contact" className="home2-button w-full md:w-auto">
            {copy.hero.action}
          </Link>
        </div>
      </div>
    </section>
  );
}
