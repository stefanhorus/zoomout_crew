"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useHome2Copy } from "./copy";
import { reveal } from "./reveal";

const SOCIALS = [
  ["Instagram", "https://instagram.com/zoomout_crew"],
  ["YouTube", "https://youtube.com/@zoomout_crew"],
  ["LinkedIn", "https://www.linkedin.com/company/zoomout-crew"],
];

// Ora din Cluj, pentru clienții din alte fusuri; se afișează abia în browser, ca să nu difere de HTML-ul serverului
function useClujTime() {
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => {
    const format = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Bucharest" });
    const update = () => setTime(format.format(new Date()));
    update();
    const timer = setInterval(update, 30_000);
    return () => clearInterval(timer);
  }, []);
  return time;
}

// Subsolul ca ultimele două rânduri ale unei planșe: plăci pline, fără linii, fiecare celulă folosită.
// Pe telefon și pe tabletă plăcile stau pe două coloane.
export function TileFooter() {
  const copy = useHome2Copy();
  const time = useClujTime();
  return (
    <footer className="home2-tiles mt-3">
      <div {...reveal()} className="home2-tile order-6 lg:order-none lg:col-span-4 lg:row-start-1">
        <p className="text-[length:var(--step-lead)] leading-[1.3]">{copy.footer.statement}</p>
        <p className="text-[length:var(--step-small)] text-[var(--muted)]">{copy.footer.legal}</p>
      </div>
      <nav aria-label="Footer" {...reveal(60)} className="home2-tile order-3 lg:order-none lg:col-span-3 lg:row-start-1">
        <ul className="space-y-1">
          {copy.footer.nav.map(([href, label]) => (
            <li key={href}>
              <Link href={href} className="home2-link">
                {label}
              </Link>
            </li>
          ))}
        </ul>
        <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-1">
          {SOCIALS.map(([name, href]) => (
            <li key={name}>
              <a href={href} target="_blank" rel="noopener noreferrer" className="home2-link">
                {name}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <div {...reveal(120)} className="home2-tile order-5 lg:order-none lg:col-span-2 lg:row-start-1">
        <p>{copy.footer.city}</p>
        <p className="text-[var(--muted)]">{time ? `${time} ${copy.footer.time}` : " "}</p>
      </div>
      <div {...reveal(180)} className="home2-tile order-4 lg:order-none lg:col-span-3 lg:row-start-1">
        <span aria-hidden />
        <a href="mailto:contact@zoomoutcrew.com" className="home2-link break-all text-[length:var(--step-lead)]">
          contact@zoomoutcrew.com
        </a>
      </div>
      <div {...reveal(90)} className="home2-tile home2-tile-wordmark order-1 col-span-2 lg:order-none lg:col-span-8 lg:row-start-2">
        <p className="home2-display text-[clamp(2.75rem,9vw,9rem)] leading-none">Zoomout_crew</p>
      </div>
      <Link href="/contact" {...reveal(150)} className="home2-tile home2-tile-accent order-2 col-span-2 lg:order-none lg:col-span-4 lg:row-start-2">
        <span className="text-[length:var(--step-lead)] font-medium">{copy.footer.start}</span>
        <svg viewBox="0 0 48 48" className="h-12 w-12 self-end" fill="none" stroke="currentColor" strokeWidth={4} aria-hidden>
          <path d="M8 40 40 8M16 8h24v24" />
        </svg>
      </Link>
    </footer>
  );
}
