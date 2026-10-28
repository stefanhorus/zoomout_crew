"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useEffect, useId, useState } from "react";

// Fundalul paginilor cu mult text: obiectivul din logo, redus la linii - inele tot mai rare spre margine (zoom out),
// inelul de zoom cu distanțele focale (se rotește când derulezi) și ochiul roșu din logo, în centru.
const C = 500;
const RINGS = Array.from({ length: 14 }, (_, i) => 30 * 1.27 ** i);
const ZOOM_RING = RINGS.find((r) => r > 380) ?? 400;
const FOCAL = ["18", "24", "35", "50", "70", "105", "135", "200"];
const EYE_W = 236;
const EYE_H = 198;

const polar = (r: number, deg: number) => {
  const rad = (deg * Math.PI) / 180;
  return { x: C + r * Math.cos(rad), y: C + r * Math.sin(rad) };
};

const TICKS = Array.from({ length: 120 }, (_, i) => {
  const angle = i * 3 - 90;
  const long = i % 5 === 0;
  return { from: polar(ZOOM_RING + 4, angle), to: polar(ZOOM_RING + (long ? 22 : 11), angle), long };
});

// Distanțele focale pe arcul din stânga sus, ultima fiind unitatea (MM, în roșu)
const LABELS = [...FOCAL, "MM"].map((text, i) => {
  const angle = -150 + i * 21;
  return { text, angle, ...polar(ZOOM_RING + 42, angle) };
});

// Privirea: salt rapid ca la un ochi real, apoi stă pe loc
const GLANCE = { duration: 0.28, ease: [0.3, 0.9, 0.3, 1] } as const;

// O direcție nouă pentru iris - mai des spre pagină (stânga), uneori înapoi în centru; rămâne în conturul ochiului
const nextGaze = () =>
  Math.random() < 0.3 ? { x: 0, y: 0 } : { x: -85 + Math.random() * 125, y: -22 + Math.random() * 44 };

export function LensBackdrop() {
  const pupilId = useId();
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  // Inelul de zoom se învârte cu pagina: un sfert de tură la fiecare ~3000px derulați
  const rotate = useTransform(scrollY, (y) => (reduceMotion ? 0 : y * 0.03));
  const [gaze, setGaze] = useState({ x: 0, y: 0 });

  // Ochiul se uită în altă parte din când în când (la 2-5 secunde)
  useEffect(() => {
    if (reduceMotion) return;
    let timer: ReturnType<typeof setTimeout>;
    const glance = () => {
      if (!document.hidden) setGaze(nextGaze());
      timer = setTimeout(glance, 1800 + Math.random() * 3400);
    };
    timer = setTimeout(glance, 1200);
    return () => clearTimeout(timer);
  }, [reduceMotion]);

  return (
    <div className="lens-backdrop" aria-hidden>
      <svg viewBox="0 0 1000 1000" fill="none" className="absolute inset-0 h-full w-full overflow-visible">
        <defs>
          <radialGradient id={pupilId}>
            <stop offset="0" style={{ stopColor: "var(--color-rec)" }} stopOpacity={0.35} />
            <stop offset="1" style={{ stopColor: "var(--color-rec)" }} stopOpacity={0} />
          </radialGradient>
        </defs>
        {RINGS.map((r, i) => (
          <circle
            key={r}
            cx={C}
            cy={C}
            r={r}
            className="stroke-paper"
            strokeOpacity={0.05 + (0.06 * Math.min(i, 6)) / 6}
            vectorEffect="non-scaling-stroke"
          />
        ))}
        <path
          d={`M${C - EYE_W} ${C} Q${C} ${C - EYE_H} ${C + EYE_W} ${C} Q${C} ${C + EYE_H} ${C - EYE_W} ${C} Z`}
          className="stroke-rec"
          strokeOpacity={0.38}
          strokeWidth={1.4}
          vectorEffect="non-scaling-stroke"
        />
        <motion.g animate={gaze} transition={GLANCE}>
          <circle cx={C} cy={C} r={RINGS[3]} className="stroke-rec" strokeOpacity={0.32} strokeWidth={1.4} vectorEffect="non-scaling-stroke" />
          <circle cx={C} cy={C} r={70} fill={`url(#${pupilId})`} />
          <circle cx={C} cy={C} r={RINGS[0]} className="fill-rec" fillOpacity={0.6} />
        </motion.g>
      </svg>

      <motion.svg viewBox="0 0 1000 1000" className="absolute inset-0 h-full w-full overflow-visible will-change-transform" style={{ rotate }}>
        {TICKS.map(({ from, to, long }, i) => (
          <line
            key={i}
            x1={from.x}
            y1={from.y}
            x2={to.x}
            y2={to.y}
            className="stroke-paper"
            strokeOpacity={long ? 0.32 : 0.16}
            vectorEffect="non-scaling-stroke"
          />
        ))}
        {LABELS.map(({ text, angle, x, y }) => (
          <text
            key={text}
            x={x}
            y={y}
            transform={`rotate(${angle + 90} ${x} ${y})`}
            className={text === "MM" ? "fill-rec" : "fill-paper"}
            fillOpacity={text === "MM" ? 0.7 : 0.38}
            fontSize={13}
            fontWeight={500}
            letterSpacing={2.5}
            textAnchor="middle"
            dominantBaseline="middle"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            {text}
          </text>
        ))}
      </motion.svg>
    </div>
  );
}
