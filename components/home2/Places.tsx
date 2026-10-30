"use client";

import Image from "next/image";
import { useState } from "react";
import { withBasePath } from "@/lib/base-path";
import { useHome2Copy } from "./copy";
import { FRAMES, type Frame } from "./frames";
import { reveal } from "./reveal";
import { Still } from "./Still";

// Unde am filmat: o coloană îngustă de rânduri cu două capete, locul la stânga și ce am filmat acolo la dreapta,
// cu un cerc mic dintr-un cadru filmat acolo (sau un punct, unde n-avem cadru). Pe desktop, alături stă mare
// cadrul locului atins, ca jumătatea dreaptă să nu rămână goală.
type Picture = Omit<Frame, "project"> | null;
const edinburgh: Picture = {
  src: () => withBasePath("/assets/adventures/edinburgh/edinburgh1.png"),
  w: 1440,
  h: 1080,
  alt: "Edinburgh rooftops on a grey day",
};
const PICTURES: Picture[][] = [
  [FRAMES.air[0], FRAMES.music[0], FRAMES.multiverse[1], FRAMES.rotaract[1], null, FRAMES.panoramic[9], FRAMES.tinyhouse[0]],
  [null, null, FRAMES.sardinia[0], FRAMES.air[1], FRAMES.air[3], FRAMES.air[4], edinburgh],
];

export function Places() {
  const copy = useHome2Copy();
  const [shown, setShown] = useState<NonNullable<Picture>>(PICTURES[0][0]!);

  return (
    <section aria-labelledby="home2-places" className="grid gap-10 px-[var(--margin)] pt-[clamp(96px,10vw,160px)] md:grid-cols-12 md:gap-x-5">
      <div className="md:col-span-6 md:col-start-3 lg:col-span-5 lg:col-start-3">
        <h2 id="home2-places" {...reveal()} className="text-[length:var(--step-lead)] font-medium">
          {copy.places.title}
        </h2>
        {copy.places.groups.map((group, column) => (
          <div key={group.name} {...reveal(90 * (column + 1))} className="mt-8 md:mt-10">
            <p className="text-[var(--muted)]">{group.name}</p>
            <ul className="mt-2">
              {group.rows.map(([place, what], row) => {
                const picture = PICTURES[column][row];
                const show = () => picture && setShown(picture);
                return (
                  <li
                    key={place}
                    tabIndex={picture ? 0 : undefined}
                    onMouseEnter={show}
                    onFocus={show}
                    className="flex min-h-11 items-center gap-2 py-1.5 outline-offset-2 md:min-h-9"
                  >
                    <span className="relative h-4 w-4 shrink-0 overflow-hidden rounded-full bg-[var(--surface-2)]">
                      {picture && (
                        <Image src={picture.src(64)} alt="" fill sizes="16px" unoptimized={picture.remote} className="object-cover" />
                      )}
                    </span>
                    <span className="flex flex-1 flex-col justify-between gap-x-6 sm:flex-row sm:items-baseline">
                      <span>{place}</span>
                      <span className="text-[length:var(--step-small)] text-[var(--muted)] sm:text-right">{what}</span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
      <div {...reveal(180)} className="hidden md:col-span-4 md:col-start-9 md:block">
        <div className="sticky top-28 aspect-[4/5] w-full overflow-hidden bg-[var(--surface)]">
          <Still key={shown.alt} frame={shown} width={720} sizes="34vw" className="home2-fade-in home2-drift" />
        </div>
      </div>
    </section>
  );
}
