"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { EASE } from "./ease";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}

// Elementul apare (fade + slide) când intră în ecran
export function Reveal({ children, className, delay = 0, y = 48 }: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 1.2, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}
