"use client";

import Link from "next/link";
import { useState } from "react";
import { useHome2Copy } from "./copy";
import { reveal } from "./reveal";

// Serviciile ca un index de nume, toate la aceeași mărime: trei coloane (de la sol, din aer, la montaj). Un nume
// atins sau focalizat trece în cerneala plină și își arată descrierea sus, în coloanele goale din dreapta.
// Fiecare nume duce la serviciul lui din pagina Services.
const ANCHORS = [
  ["commercials", "socialMedia", "socialMedia", "events", "events", "events", "musicVideos", "commercials"],
  ["drone", "drone", "drone", "drone", "drone", "drone"],
  ["postProduction", "postProduction", "postProduction", "postProduction", "postProduction", "postProduction"],
];

export function ServiceIndex() {
  const copy = useHome2Copy();
  const [description, setDescription] = useState<string | null>(null);

  return (
    <section aria-labelledby="home2-services" className="px-[var(--margin)] pt-[clamp(96px,10vw,160px)]">
      <h2 id="home2-services" {...reveal()} className="text-[length:var(--step-lead)] font-medium">
        {copy.services.title}
      </h2>
      <div
        className="home2-services relative mt-12 grid gap-10 text-[length:var(--step-lead)] md:mt-16 md:grid-cols-12 md:gap-x-5"
        onMouseLeave={() => setDescription(null)}
      >
        {copy.services.groups.map((group, column) => (
          <div key={group.name} {...reveal(90 * (column + 1))} className="md:col-span-3">
            <h3>{group.name}</h3>
            <ul className="mt-[1.25em] leading-[1.4] md:leading-[1.25]">
              {group.items.map(([name, line], row) => (
                <li key={name}>
                  <Link
                    href={`/services#${ANCHORS[column][row]}`}
                    onMouseEnter={() => setDescription(line)}
                    onFocus={() => setDescription(line)}
                    onBlur={() => setDescription(null)}
                    className="home2-service inline-block py-1 transition-colors duration-300 md:py-0.5"
                  >
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-[length:var(--step-body)] text-[var(--muted)] md:hidden">{group.summary}</p>
          </div>
        ))}
        <p aria-live="polite" className="hidden md:col-span-3 md:block">
          {description}
        </p>
      </div>
    </section>
  );
}
