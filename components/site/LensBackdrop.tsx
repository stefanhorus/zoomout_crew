"use client";

import { motion, useAnimate, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useEffect, useId } from "react";

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

// Privirea: salt rapid într-o parte, câteva clipe acolo, apoi revine lin în centru
const GLANCE = { duration: 0.24, ease: [0.3, 0.9, 0.3, 1] } as const;
const BACK = { duration: 0.42, ease: [0.45, 0, 0.2, 1] } as const;
// Clipitul: conturul ochiului se închide și se deschide repede
const BLINK = { duration: 0.26, ease: "easeInOut" } as const;

// Unde se uită: doar puțin într-o parte (mai des spre pagină, la stânga)
const nextGaze = () => {
  const side = Math.random() < 0.65 ? -1 : 1;
  return { x: side * (20 + Math.random() * 24), y: -12 + Math.random() * 24 };
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function LensBackdrop() {
  const pupilId = useId();
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  // Inelul de zoom se învârte cu pagina: un sfert de tură la fiecare ~3000px derulați
  const rotate = useTransform(scrollY, (y) => (reduceMotion ? 0 : y * 0.03));
  const [eye, animate] = useAnimate<SVGGElement>();

  // Ochiul se uită din când în când într-o parte și revine în centru; clipește rar (la 9-20 de secunde)
  useEffect(() => {
    if (reduceMotion) return;
    let active = true;
    const visible = () => active && !document.hidden;
    const look = async () => {
      await wait(1500);
      while (active) {
        if (visible()) {
          await animate(".lens-iris", nextGaze(), GLANCE);
          await wait(600 + Math.random() * 900);
          if (active) await animate(".lens-iris", { x: 0, y: 0 }, BACK);
        }
        await wait(2500 + Math.random() * 3500);
      }
    };
    const blink = async () => {
      while (active) {
        await wait(9000 + Math.random() * 11000);
        if (visible()) await animate(eye.current, { scaleY: [1, 0.08, 1] }, BLINK);
      }
    };
    void look();
    void blink();
    return () => {
      active = false;
    };
  }, [animate, eye, reduceMotion]);

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
        {/* Ochiul din logo: conturul clipește (se strânge pe verticală), irisul cu pupila se uită în jur */}
        <g ref={eye} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
          <path
            d={`M${C - EYE_W} ${C} Q${C} ${C - EYE_H} ${C + EYE_W} ${C} Q${C} ${C + EYE_H} ${C - EYE_W} ${C} Z`}
            className="stroke-rec"
            strokeOpacity={0.38}
            strokeWidth={1.4}
            vectorEffect="non-scaling-stroke"
          />
          <g className="lens-iris">
            <circle cx={C} cy={C} r={RINGS[3]} className="stroke-rec" strokeOpacity={0.32} strokeWidth={1.4} vectorEffect="non-scaling-stroke" />
            <circle cx={C} cy={C} r={70} fill={`url(#${pupilId})`} />
            <circle cx={C} cy={C} r={RINGS[0]} className="fill-rec" fillOpacity={0.6} />
          </g>
        </g>
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
