"use client";

import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  wrap,
} from "motion/react";
import { useRef, type ReactNode } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks";

interface VelocityMarqueeProps {
  children: ReactNode;
  // procente din lățimea unei copii pe secundă; negativ = spre stânga
  baseVelocity?: number;
  className?: string;
}

// Bandă care curge continuu și accelerează / își schimbă direcția după viteza scroll-ului
export function VelocityMarquee({ children, baseVelocity = -3, className }: VelocityMarqueeProps) {
  const reducedMotion = usePrefersReducedMotion();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 4], { clamp: false });
  // 4 copii identice: când prima a ieșit complet, revenim (de la -25% la 0%)
  const x = useTransform(baseX, (v) => `${wrap(-25, 0, v)}%`);
  const direction = useRef(1);

  useAnimationFrame((_, delta) => {
    if (reducedMotion) return;
    let moveBy = direction.current * baseVelocity * (delta / 1000);
    const factor = velocityFactor.get();
    if (factor < 0) direction.current = -1;
    else if (factor > 0) direction.current = 1;
    moveBy += direction.current * moveBy * factor;
    baseX.set(baseX.get() + moveBy / 4);
  });

  return (
    <div className={`flex overflow-hidden whitespace-nowrap ${className ?? ""}`}>
      <motion.div className="flex shrink-0 flex-nowrap whitespace-nowrap will-change-transform" style={{ x }}>
        {[0, 1, 2, 3].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center" aria-hidden={copy > 0}>
            {children}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
