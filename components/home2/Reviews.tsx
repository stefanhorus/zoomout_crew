"use client";

import { useHome2Copy } from "./copy";
import { FRAMES } from "./frames";
import { reveal } from "./reveal";
import { Still } from "./Still";

// Recenziile, fiecare sub o fâșie joasă din ce am filmat pentru acel client (n-avem fotografii cu oamenii).
// Lățimile fâșiilor sunt inegale (4, 3 și 3 coloane), toate la 110px înălțime.
const PICTURES = [FRAMES.utopic[0], FRAMES.tinyhouse[0], FRAMES.rotaract[0]];
const SPANS = ["md:col-span-4", "md:col-span-3", "md:col-span-3"];

export function Reviews() {
  const copy = useHome2Copy();
  return (
    <section aria-labelledby="home2-reviews" className="grid gap-6 px-[var(--margin)] pt-[clamp(96px,10vw,160px)] md:grid-cols-12 md:gap-x-2">
      <h2 id="home2-reviews" {...reveal()} className="md:col-span-2">
        {copy.reviews.title}
      </h2>
      {copy.reviews.items.map((review, index) => (
        <figure key={review.name} {...reveal(90 * (index + 1))} className={`mt-4 md:mt-0 ${SPANS[index]}`}>
          <div className="relative h-[84px] w-full overflow-hidden bg-[var(--surface)] md:h-[110px]">
            <Still frame={PICTURES[index]} width={720} sizes="(max-width: 767px) 100vw, 34vw" />
          </div>
          <figcaption className="mt-3">
            <span>{review.name}</span> <span className="text-[var(--muted)]">{review.role}</span>
          </figcaption>
          <blockquote className="mt-2 max-w-[42ch] pr-4">“{review.quote}”</blockquote>
        </figure>
      ))}
    </section>
  );
}
