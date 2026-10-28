"use client";

import { motion, type Variants } from "motion/react";
import { Fragment } from "react";
import { EASE } from "./ease";
import { tokenize } from "./rich";

interface SplitRevealProps {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  // "inView": pornește când intră în ecran; "mount": pornește când `play` devine true
  mode?: "inView" | "mount";
  play?: boolean;
}

const word: Variants = {
  hidden: { y: "118%" },
  show: { y: "0%", transition: { duration: 1.15, ease: EASE } },
};

// Titlu care apare cuvânt cu cuvânt, din spatele unei "măști"
export function SplitReveal({ text, className, delay = 0, stagger = 0.06, mode = "inView", play = true }: SplitRevealProps) {
  const tokens = tokenize(text);
  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: stagger, delayChildren: delay } },
  };
  const trigger =
    mode === "mount"
      ? { initial: "hidden", animate: play ? "show" : "hidden" }
      : { initial: "hidden", whileInView: "show", viewport: { once: true, margin: "0px 0px -10% 0px" } };

  // Cuvintele rămân text normal (fără copie ascunsă), ca Google și cititoarele de ecran să-l citească o singură dată
  return (
    <span className={className}>
      <motion.span variants={container} {...trigger}>
        {tokens.map((token, index) => (
          <Fragment key={index}>
            <span className={`inline-block overflow-hidden pb-[0.14em] -mb-[0.14em] align-bottom ${token.em ? "pr-[0.08em] -mr-[0.08em]" : ""}`}>
              <motion.span variants={word} className={`inline-block will-change-transform ${token.em ? "serif-i" : ""}`}>
                {token.text}
              </motion.span>
            </span>
            {index < tokens.length - 1 ? " " : null}
          </Fragment>
        ))}
      </motion.span>
    </span>
  );
}
