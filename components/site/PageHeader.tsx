"use client";

import type { ReactNode } from "react";
import { Reveal } from "../motion/Reveal";
import { SplitReveal } from "../motion/SplitReveal";

interface PageHeaderProps {
  kicker: string;
  title: string;
  intro?: string;
  children?: ReactNode;
}

// Antetul paginilor interioare: kicker, titlu mare care apare cuvânt cu cuvânt, intro
export function PageHeader({ kicker, title, intro, children }: PageHeaderProps) {
  return (
    <section className="container-site pb-14 pt-36 md:pb-20 md:pt-48">
      <p className="kicker flex items-center gap-2">
        <span className="rec-dot h-1.5 w-1.5" /> {kicker}
      </p>
      <h1 className="display-xl mt-7 max-w-[15ch]">
        <SplitReveal text={title} mode="mount" delay={0.1} />
      </h1>
      {intro && (
        <Reveal delay={0.35}>
          <p className="lead mt-10 max-w-2xl">{intro}</p>
        </Reveal>
      )}
      {children}
    </section>
  );
}
