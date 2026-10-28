"use client";

import { motion, useAnimate, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { useEffect, useId, useRef } from "react";

// Fundalul paginilor cu mult text: obiectivul din logo, redus la linii - inele tot mai rare spre margine (zoom out),
// inelul de zoom cu distanțele focale (se rotește când derulezi) și ochiul roșu din logo, în centru.
// Coordonatele sunt rotunjite: sin/cos și puterile pot diferi în ultima zecimală între server și browser, iar React
// ar semnala nepotrivire la hidratare
const round = (value: number) => Math.round(value * 1000) / 1000;

const C = 500;
const RINGS = Array.from({ length: 14 }, (_, i) => round(30 * 1.27 ** i));
const ZOOM_RING = RINGS.find((r) => r > 380) ?? 400;
const FOCAL = ["18", "24", "35", "50", "70", "105", "135", "200"];
const EYE_W = 236;
const EYE_H = 198;

const polar = (r: number, deg: number) => {
  const rad = (deg * Math.PI) / 180;
  return { x: round(C + r * Math.cos(rad)), y: round(C + r * Math.sin(rad)) };
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

// Cât de departe se poate uita irisul, ca să rămână în conturul ochiului
const GAZE_X = 44;
const GAZE_Y = 15;
// Mișcarea irisului: rapidă și fără să treacă de țintă
const GAZE_SPRING = { stiffness: 220, damping: 24, mass: 0.6 };
// Clipitul: conturul ochiului se închide și se deschide repede
const BLINK = { duration: 0.26, ease: "easeInOut" } as const;

// O tură de priviri: trei spre stânga, spre pagină (în sus, drept, în jos) și una singură spre dreapta, în ordine aleatorie
const gazeLoop = () => {
  const toLeft = [-9, 0, 9].map((y) => ({ x: -(28 + Math.random() * 16), y: y - 2 + Math.random() * 4 }));
  const loop = toLeft.sort(() => Math.random() - 0.5);
  loop.splice(Math.floor(Math.random() * 4), 0, { x: 20 + Math.random() * 14, y: -6 + Math.random() * 12 });
  return loop;
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// `className` alege locul: implicit fix, în dreapta paginilor cu mult text (.lens-backdrop); pe prima pagină stă în Intro
export function LensBackdrop({ className = "lens-backdrop" }: { className?: string }) {
  const pupilId = useId();
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  // Inelul de zoom se învârte cu pagina: un sfert de tură la fiecare ~3000px derulați
  const rotate = useTransform(scrollY, (y) => (reduceMotion ? 0 : y * 0.03));
  const lens = useRef<HTMLDivElement>(null);
  const [eye, animate] = useAnimate<SVGGElement>();
  const gazeX = useSpring(0, GAZE_SPRING);
  const gazeY = useSpring(0, GAZE_SPRING);

  // Pe desktop ochiul urmărește cursorul. Altfel (pe telefon, sau după 5 secunde fără mișcarea mouse-ului) se uită
  // din când în când într-o parte și revine în centru. Clipește rar (la 9-20 de secunde).
  useEffect(() => {
    if (reduceMotion) return;
    let active = true;
    let lastPointerMove = 0;
    const lookAt = (x: number, y: number) => {
      gazeX.set(x);
      gazeY.set(y);
    };
    const visible = () => active && !document.hidden;
    const idle = () => Date.now() - lastPointerMove > 5000;

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || !lens.current) return;
      lastPointerMove = Date.now();
      const box = lens.current.getBoundingClientRect();
      const dx = event.clientX - (box.left + box.width / 2);
      const dy = event.clientY - (box.top + box.height / 2);
      // Privirea ajunge la maximum când cursorul e la peste 500px de ochi
      const reach = Math.min(1, Math.hypot(dx, dy) / 500);
      const angle = Math.atan2(dy, dx);
      lookAt(Math.cos(angle) * GAZE_X * reach, Math.sin(angle) * GAZE_Y * reach);
    };
    const onPointerLeave = () => {
      lastPointerMove = 0;
      lookAt(0, 0);
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onPointerLeave);

    const glance = async () => {
      await wait(1500);
      let queue: Array<{ x: number; y: number }> = [];
      while (active) {
        if (visible() && idle()) {
          if (!queue.length) queue = gazeLoop();
          const target = queue.shift() ?? { x: 0, y: 0 };
          lookAt(target.x, target.y);
          await wait(800 + Math.random() * 900);
          if (active && idle()) lookAt(0, 0);
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
    void glance();
    void blink();
    return () => {
      active = false;
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [animate, eye, gazeX, gazeY, reduceMotion]);

  return (
    <div ref={lens} className={className} aria-hidden>
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
          <motion.g className="lens-iris" style={{ x: gazeX, y: gazeY }}>
            <circle cx={C} cy={C} r={RINGS[3]} className="stroke-rec" strokeOpacity={0.32} strokeWidth={1.4} vectorEffect="non-scaling-stroke" />
            <circle cx={C} cy={C} r={70} fill={`url(#${pupilId})`} />
            <circle cx={C} cy={C} r={RINGS[0]} className="fill-rec" fillOpacity={0.6} />
          </motion.g>
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
