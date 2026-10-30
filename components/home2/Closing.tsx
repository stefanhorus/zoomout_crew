"use client";

import Link from "next/link";
import { useHome2Copy } from "./copy";
import { FRAMES } from "./frames";
import { reveal } from "./reveal";
import { Still } from "./Still";

// Încheierea: trei cadre lipite unul de altul pe toată lățimea, apoi un câmp de culoarea hârtiei cu invitația.
// Fraza subliniată e chiar legătura spre contact.
const PICTURES = [FRAMES.air[0], FRAMES.lifeispink[5], FRAMES.panoramic[5]];

export function Closing() {
  const copy = useHome2Copy();
  return (
    <section aria-labelledby="home2-closing" className="mt-[clamp(96px,10vw,160px)]">
      <div className="grid grid-cols-3">
        {PICTURES.map((picture, index) => (
          <div key={picture.alt} {...reveal(70 * index)} className="relative aspect-[3/4] bg-[var(--surface)] md:aspect-auto md:h-[40svh]">
            <Still frame={picture} width={720} sizes="(max-width: 767px) 100vw, 34vw" />
          </div>
        ))}
      </div>
      <div className="grid min-h-[44svh] bg-[var(--field)] px-[var(--margin)] py-14 text-[var(--bg)] md:grid-cols-12 md:py-20">
        <div {...reveal()} className="md:col-span-7">
          <h2 id="home2-closing" className="text-[length:var(--step-lead)] leading-[1.3]">
            <Link href="/contact" className="home2-underline">
              {copy.closing.title}
            </Link>
          </h2>
          <p className="mt-2 text-[length:var(--step-lead)] leading-[1.3]">{copy.closing.text}</p>
          <p className="mt-8">
            {copy.closing.write}{" "}
            <a href="mailto:contact@zoomoutcrew.com" className="home2-link">
              contact@zoomoutcrew.com
            </a>
          </p>
          <p>{copy.closing.based}</p>
        </div>
      </div>
    </section>
  );
}
