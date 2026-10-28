"use client";

import { motion, useInView, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useEffect, useId, useRef } from "react";

// Motivele din zonele negre ale primei pagini, în același limbaj cu obiectivul cu ochiul (LensBackdrop): linii
// subțiri abia vizibile și un singur accent roșu, ca să nu concureze cu textul. Toate sunt decorative.

// Coordonatele sunt rotunjite: sin/cos și puterile pot diferi în ultima zecimală între server și browser, iar React
// ar semnala nepotrivire la hidratare
const round = (value: number) => Math.round(value * 1000) / 1000;
const polar = (cx: number, cy: number, r: number, deg: number) => {
  const rad = (deg * Math.PI) / 180;
  return { x: round(cx + r * Math.cos(rad)), y: round(cy + r * Math.sin(rad)) };
};

// Gradațiile unui inel: o liniuță la fiecare 3 grade, una mai lungă la fiecare 15 (lungimi negative = spre centru)
function Ticks({ cx, cy, r, short, long }: { cx: number; cy: number; r: number; short: number; long: number }) {
  return (
    <>
      {Array.from({ length: 120 }, (_, i) => {
        const isLong = i % 5 === 0;
        const from = polar(cx, cy, r, i * 3);
        const to = polar(cx, cy, r + (isLong ? long : short), i * 3);
        return (
          <line
            key={i}
            x1={from.x}
            y1={from.y}
            x2={to.x}
            y2={to.y}
            className="stroke-paper"
            strokeOpacity={isLong ? 0.32 : 0.16}
            vectorEffect="non-scaling-stroke"
          />
        );
      })}
    </>
  );
}

// Valorile scrise de-a lungul unui inel, ca pe obiectiv; ultima e unitatea, în roșu
function RingLabels(props: {
  cx: number;
  cy: number;
  r: number;
  labels: string[];
  start: number;
  step: number;
  size: number;
  spacing?: number;
}) {
  const { cx, cy, r, labels, start, step, size, spacing = size / 5 } = props;
  return (
    <>
      {labels.map((text, i) => {
        const angle = start + i * step;
        const { x, y } = polar(cx, cy, r, angle);
        const unit = i === labels.length - 1;
        return (
          <text
            key={text}
            x={x}
            y={y}
            transform={`rotate(${angle + 90} ${x} ${y})`}
            className={unit ? "fill-rec" : "fill-paper"}
            fillOpacity={unit ? 0.7 : 0.38}
            fontSize={size}
            fontWeight={500}
            letterSpacing={spacing}
            textAnchor="middle"
            dominantBaseline="middle"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            {text}
          </text>
        );
      })}
    </>
  );
}

/* ------------------------------------------------------------------ Diafragma (lista de servicii) */

const BLADES = 7;
const F_STOPS = ["1.4", "2", "2.8", "4", "5.6", "8", "11", "16", "ƒ"];
const A = 500;
const BLADE_EDGE = 372;

// Diafragma desenată din linii: deschiderea e un poligon cu un vârf pe lamă, iar fiecare latură continuă până la
// marginea lamelor
function aperture(opening: number, turn: number) {
  const vertices = Array.from({ length: BLADES }, (_, i) => polar(A, A, opening, turn - 90 + (i * 360) / BLADES));
  const point = (p: { x: number; y: number }) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
  let blades = "";
  vertices.forEach((vertex, i) => {
    const next = vertices[(i + 1) % BLADES];
    const length = Math.hypot(next.x - vertex.x, next.y - vertex.y);
    const ux = (next.x - vertex.x) / length;
    const uy = (next.y - vertex.y) / length;
    // cât trebuie mers pe direcția laturii ca să ajungi la cercul BLADE_EDGE
    const along = ux * (vertex.x - A) + uy * (vertex.y - A);
    const reach = -along + Math.sqrt(along ** 2 - (vertex.x - A) ** 2 - (vertex.y - A) ** 2 + BLADE_EDGE ** 2);
    blades += `M${point(vertex)}L${point({ x: vertex.x + ux * reach, y: vertex.y + uy * reach })}`;
  });
  return { blades, hole: `M${vertices.map(point).join("L")}Z` };
}

// Cât trece secțiunea prin ecran, diafragma se închide (de la f/1.4 spre f/8) și se rotește, ca la un obiectiv real
export function ApertureMotif({ className }: { className: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const glowId = useId();
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const opening = useTransform(scrollYProgress, (p) => (reduceMotion ? 130 : 190 - 120 * p));
  const shape = useTransform(() => aperture(opening.get(), reduceMotion ? 0 : 46 * scrollYProgress.get()));
  const blades = useTransform(shape, (s) => s.blades);
  const hole = useTransform(shape, (s) => s.hole);
  const glow = useTransform(opening, (r) => r * 1.2);
  const rotate = useTransform(scrollYProgress, (p) => (reduceMotion ? 0 : 30 - 70 * p));

  return (
    <div ref={ref} className={className} aria-hidden>
      <svg viewBox="0 0 1000 1000" fill="none" className="absolute inset-0 h-full w-full overflow-visible">
        <defs>
          <radialGradient id={glowId}>
            <stop offset="0" style={{ stopColor: "var(--color-rec)" }} stopOpacity={0.2} />
            <stop offset="1" style={{ stopColor: "var(--color-rec)" }} stopOpacity={0} />
          </radialGradient>
        </defs>
        {[
          [482, 0.05],
          [464, 0.07],
          [BLADE_EDGE, 0.1],
        ].map(([r, opacity]) => (
          <circle key={r} cx={A} cy={A} r={r} className="stroke-paper" strokeOpacity={opacity} vectorEffect="non-scaling-stroke" />
        ))}
        <motion.circle cx={A} cy={A} r={glow} fill={`url(#${glowId})`} />
        <motion.path d={blades} className="stroke-paper" strokeOpacity={0.14} vectorEffect="non-scaling-stroke" />
        <motion.path
          d={hole}
          className="stroke-rec"
          strokeOpacity={0.45}
          strokeWidth={1.4}
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
        <circle cx={A} cy={A} r={9} className="fill-rec" fillOpacity={0.6} />
      </svg>
      <motion.svg viewBox="0 0 1000 1000" className="absolute inset-0 h-full w-full overflow-visible will-change-transform" style={{ rotate }}>
        <Ticks cx={A} cy={A} r={386} short={10} long={20} />
        <RingLabels cx={A} cy={A} r={432} labels={F_STOPS} start={-150} step={21} size={21} spacing={1} />
      </motion.svg>
    </div>
  );
}

/* ------------------------------------------------------------------ Inelul de focalizare (cei patru pași) */

const DISTANCES = ["0.5", "0.7", "1", "1.5", "2", "3", "5", "10", "∞", "M"];
const F = 300;
const FOCUS_R = 270;
const FOCUS_STEP = 24;

// Inelul de focalizare al obiectivului, văzut de sus: pe măsură ce parcurgi pașii, distanțele trec prin dreptul
// indexului roșu, de aproape (ideea) până la infinit (ecranul). Se vede doar jumătatea de sus.
export function FocusRingMotif({ progress }: { progress: MotionValue<number> }) {
  const reduceMotion = useReducedMotion();
  const rotate = useTransform(progress, (p) => (reduceMotion ? -2 * FOCUS_STEP : -(DISTANCES.length - 2) * FOCUS_STEP * p));
  const svg = "absolute left-0 top-0 aspect-square w-full overflow-visible";

  return (
    <div className="relative mt-14 aspect-[600/318] w-full max-w-[440px] overflow-hidden" aria-hidden>
      <svg viewBox="0 0 600 600" fill="none" className={svg}>
        {[
          [FOCUS_R + 14, 0.07],
          [FOCUS_R, 0.16],
          [FOCUS_R - 84, 0.06],
        ].map(([r, opacity]) => (
          <circle key={r} cx={F} cy={F} r={r} className="stroke-paper" strokeOpacity={opacity} vectorEffect="non-scaling-stroke" />
        ))}
        {/* Indexul și marcajele de profunzime de câmp de o parte și de alta */}
        {[-24, -12, 12, 24].map((offset) => {
          const from = polar(F, F, FOCUS_R + 4, offset - 90);
          const to = polar(F, F, FOCUS_R + 12, offset - 90);
          return (
            <line key={offset} x1={from.x} y1={from.y} x2={to.x} y2={to.y} className="stroke-rec" strokeOpacity={0.4} vectorEffect="non-scaling-stroke" />
          );
        })}
        <path d={`M${F} ${F - FOCUS_R + 34}V${F - FOCUS_R - 8}`} className="stroke-rec" strokeOpacity={0.55} vectorEffect="non-scaling-stroke" />
        <path d={`M${F - 7} ${F - FOCUS_R - 22}H${F + 7}L${F} ${F - FOCUS_R - 10}Z`} className="fill-rec" fillOpacity={0.75} />
      </svg>
      <motion.svg viewBox="0 0 600 600" className={`${svg} will-change-transform`} style={{ rotate }}>
        <Ticks cx={F} cy={F} r={FOCUS_R} short={-11} long={-21} />
        <RingLabels cx={F} cy={F} r={FOCUS_R - 46} labels={DISTANCES} start={-90} step={FOCUS_STEP} size={17} spacing={1} />
      </motion.svg>
    </div>
  );
}

/* ------------------------------------------------------------------ Vizorul (recenziile) */

const CORNERS = [
  "left-0 top-0 border-l border-t",
  "right-0 top-0 border-r border-t",
  "bottom-0 left-0 border-b border-l",
  "bottom-0 right-0 border-b border-r",
];
const pad = (value: number) => String(value).padStart(2, "0");

// Recenziile sunt „interviuri la cameră”: colțurile vizorului, REC cu timecode-ul care curge cât timp secțiunea e pe
// ecran (25 de cadre pe secundă) și setările de expunere. Stă în marginea secțiunii, nu peste text.
export function ViewfinderMotif() {
  const ref = useRef<HTMLDivElement>(null);
  const timecode = useRef<HTMLSpanElement>(null);
  const recorded = useRef(0);
  const inView = useInView(ref);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!inView || reduceMotion) return;
    let frame = 0;
    let last = performance.now();
    const tick = (now: number) => {
      recorded.current += now - last;
      last = now;
      const frames = Math.floor(recorded.current / 40);
      if (timecode.current) {
        timecode.current.textContent = `${pad(Math.floor(frames / 90000) % 24)}:${pad(Math.floor(frames / 1500) % 60)}:${pad(Math.floor(frames / 25) % 60)}:${pad(frames % 25)}`;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, reduceMotion]);

  return (
    <div ref={ref} className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
      <div className="container-site h-full">
        <div className="relative h-full">
          <div className="absolute inset-x-0 inset-y-10 md:inset-y-16">
            {CORNERS.map((corner) => (
              <span key={corner} className={`absolute h-6 w-6 border-paper/30 md:h-9 md:w-9 ${corner}`} />
            ))}
            <p className="kicker absolute left-9 top-0 flex -translate-y-1/2 items-center gap-2 md:left-14">
              <span className="rec-dot h-1.5 w-1.5" /> REC
              <span ref={timecode} className="tabular-nums text-paper/50">
                00:00:00:00
              </span>
            </p>
            <p className="kicker absolute right-9 top-0 hidden -translate-y-1/2 tabular-nums sm:block md:right-14">
              F2.8 · 1/50 · ISO 800
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ Inelele obiectivului (îndemnul de la final) */

const RINGS = Array.from({ length: 13 }, (_, i) => round(30 * 1.27 ** i));

// Obiectivul răsare de sub îndemn, din strălucirea roșie: când secțiunea intră în ecran inelele se depărtează
// (zoom out) și gradațiile de pe marginea lui se rotesc. Fără valori scrise, ca titlul să rămână curat.
export function ZoomRingsMotif({ className }: { className: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center end"] });
  const scale = useTransform(scrollYProgress, (p) => (reduceMotion ? 1 : 1.3 - 0.3 * p));
  const rotate = useTransform(scrollYProgress, (p) => (reduceMotion ? 0 : 24 - 24 * p));

  return (
    <motion.div ref={ref} className={className} style={{ scale }} aria-hidden>
      <svg viewBox="0 0 1000 1000" fill="none" className="absolute inset-0 h-full w-full overflow-visible">
        {RINGS.map((r, i) => (
          <circle
            key={r}
            cx={500}
            cy={500}
            r={r}
            className="stroke-paper"
            strokeOpacity={0.05 + (0.06 * Math.min(i, 6)) / 6}
            vectorEffect="non-scaling-stroke"
          />
        ))}
        <circle cx={500} cy={500} r={RINGS[3]} className="stroke-rec" strokeOpacity={0.35} strokeWidth={1.4} vectorEffect="non-scaling-stroke" />
        <circle cx={500} cy={500} r={RINGS[0]} className="fill-rec" fillOpacity={0.55} />
      </svg>
      <motion.svg viewBox="0 0 1000 1000" className="absolute inset-0 h-full w-full overflow-visible will-change-transform" style={{ rotate }}>
        <Ticks cx={500} cy={500} r={RINGS[12] + 4} short={9} long={18} />
      </motion.svg>
    </motion.div>
  );
}
