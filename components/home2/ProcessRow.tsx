"use client";

import { useHome2Copy } from "./copy";
import { FRAMES } from "./frames";
import { reveal } from "./reveal";
import { Still } from "./Still";

// Procesul ca un rând de momente; ordinea o spun cuvintele, nu numerele. Golul de deasupra fotografiilor diferă de la
// o coloană la alta, așa că marginile lor de sus urcă și coboară de-a lungul rândului. Pe desktop toate șase încap
// în grilă (fără derulare laterală), pe telefon stau două câte două.
const PICTURES = [FRAMES.bigbelly[3], FRAMES.panoramic[9], FRAMES.panoramic[2], FRAMES.outdoor[0], FRAMES.lifeispink[3], FRAMES.multiverse[3]];
const GAPS = [96, 136, 80, 120, 140, 88];

export function ProcessRow() {
  const copy = useHome2Copy();
  return (
    <section aria-labelledby="home2-process" className="px-[var(--margin)] pt-[clamp(96px,10vw,160px)]">
      <h2 id="home2-process" {...reveal()} className="text-[length:var(--step-lead)] font-medium">
        {copy.process.title}
      </h2>
      <ol className="mt-10 grid grid-cols-2 gap-x-4 gap-y-12 md:mt-14 md:grid-cols-6 md:gap-x-6">
        {copy.process.moments.map(([caption, text], index) => (
          <li key={caption} {...reveal(70 * index)} className="flex flex-col">
            <h3 className="font-medium">{caption}</h3>
            <p className="mt-3">{text}</p>
            <div
              style={{ "--gap": `${GAPS[index]}px` } as React.CSSProperties}
              className="home2-moment-gap relative aspect-[4/5] w-full bg-[var(--surface)]"
            >
              <Still frame={PICTURES[index]} width={720} sizes="(max-width: 767px) 45vw, 16vw" />
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
