"use client";

import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import { useHome2Copy } from "./copy";
import { FRAMES, projectName, type Frame } from "./frames";
import { reveal } from "./reveal";
import { Still } from "./Still";

type WorkKey = "panoramic" | "bigbelly" | "tinyhouse" | "lifeispink";
type Picture = Omit<Frame, "project">;

// Fiecare proiect e o bandă de film: un diapozitiv în mijloc și vecinii lui tăiați de marginile ecranului.
// Proiectele verticale (reels) au câte trei cadre pe diapozitiv; pe telefon fiecare cadru devine diapozitivul lui.
const pick = (key: WorkKey, groups: number[][]) => groups.map((group) => group.map((index) => FRAMES[key][index] as Picture));
const WORK: Array<{ key: WorkKey; slides: Picture[][] }> = [
  { key: "panoramic", slides: pick("panoramic", [[0, 9, 2], [3, 4, 5], [6, 7, 8]]) },
  { key: "bigbelly", slides: pick("bigbelly", [[1, 2, 0], [3, 6, 4], [5, 7, 8]]) },
  { key: "tinyhouse", slides: pick("tinyhouse", [[0, 2, 1], [3, 6, 4], [8, 5, 7]]) },
  { key: "lifeispink", slides: pick("lifeispink", [[2], [3], [1], [5], [4], [6]]) },
];

function Strip({ slides, label }: { slides: Picture[][]; label: string }) {
  const scroller = useRef<HTMLDivElement>(null);

  // Pornim de la al doilea diapozitiv, ca vecinii să se vadă de ambele părți (pe telefon diapozitivul se desface
  // în cadre, așa că acolo luăm al doilea cadru)
  useLayoutEffect(() => {
    const box = scroller.current;
    const slide = box?.querySelector<HTMLElement>("[data-slide='1']");
    const target = slide?.offsetWidth ? slide : box?.querySelectorAll<HTMLElement>(".home2-work-frame")[1];
    if (box && target) box.scrollLeft = target.offsetLeft + target.offsetWidth / 2 - box.clientWidth / 2;
  }, []);

  return (
    <div ref={scroller} tabIndex={0} role="group" aria-label={label} className="home2-work-strip">
      {slides.map((slide, index) => (
        <div key={index} data-slide={index} className="home2-work-slide" data-single={slide.length === 1 || undefined}>
          {slide.map((frame) => (
            <div key={frame.alt} className="home2-work-frame">
              <Still frame={frame} width={720} sizes="(max-width: 767px) 80vw, 25vw" eager={index <= 2} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export function WorkStrips() {
  const copy = useHome2Copy();
  return (
    <section aria-labelledby="home2-work" className="pt-[clamp(96px,10vw,160px)]">
      <h2 id="home2-work" {...reveal()} className="home2-display px-[var(--margin)] text-[length:var(--step-head)]">
        {copy.work.title}
      </h2>
      {WORK.map(({ key, slides }, index) => {
        const facts = copy.work.projects[key];
        return (
          <article key={key} className={index === 0 ? "mt-14 md:mt-20" : "mt-16 md:mt-[160px]"} aria-label={projectName(key)}>
            <div {...reveal()}>
              <Strip slides={slides} label={projectName(key)} />
            </div>
            <div {...reveal(90)} className="mt-6 grid gap-x-5 gap-y-2 px-[var(--margin)] md:grid-cols-12 md:px-[13.5vw]">
              <h3 className="font-medium md:col-span-4">
                {projectName(key)} <span className="font-normal text-[var(--muted)]">{facts.category}</span>
              </h3>
              <p className="md:col-span-4">
                {facts.where}. {facts.made}.
              </p>
              <div className="flex flex-col gap-2 md:col-span-4 md:items-end md:text-right">
                <p className="text-[var(--muted)]">{facts.with}</p>
                <Link href="/portfolio" className="home2-link">
                  {copy.work.link}
                </Link>
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}
