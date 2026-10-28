"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

// Respectă setarea "reduce motion" din sistemul vizitatorului
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
