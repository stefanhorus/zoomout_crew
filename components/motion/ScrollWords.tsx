"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { Fragment, useRef, type ReactNode } from "react";
import { tokenize } from "./rich";

function ScrollWord({
  progress,
  range,
  em,
  children,
}: {
  progress: MotionValue<number>;
  range: [number, number];
  em: boolean;
  children: ReactNode;
}) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  return (
    <motion.span style={{ opacity }} className={em ? "serif-i text-rec" : undefined}>
      {children}
    </motion.span>
  );
}

// Paragraf ale cărui cuvinte se "aprind" pe rând, pe măsură ce derulezi
export function ScrollWords({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.88", "end 0.5"] });
  const tokens = tokenize(text);

  return (
    <p ref={ref} className={className}>
      {tokens.map((token, index) => (
        <Fragment key={index}>
          <ScrollWord progress={scrollYProgress} range={[index / tokens.length, (index + 1) / tokens.length]} em={token.em}>
            {token.text}
          </ScrollWord>
          {index < tokens.length - 1 ? " " : null}
        </Fragment>
      ))}
    </p>
  );
}
