"use client";

import { useHome2Copy } from "./copy";
import { reveal } from "./reveal";

// Despre echipă: faptele în coloana îngustă din stânga, paragraful de la linia de 34% din lățime. Al doilea rând
// repetă aceeași linie pentru clienți, în două liste cu numele la stânga și domeniul la dreapta.
export function AboutFacts() {
  const copy = useHome2Copy();
  return (
    <section aria-labelledby="home2-about" className="px-[var(--margin)] pt-[clamp(96px,10vw,160px)]">
      <div className="grid gap-10 md:grid-cols-[34%_1fr] md:gap-0">
        <div {...reveal(90)} className="order-2 md:order-1 md:w-[180px]">
          <h2 id="home2-about" className="font-medium">
            {copy.about.title}
          </h2>
          <dl className="mt-6 grid grid-cols-2 gap-5 text-[length:var(--step-small)] md:grid-cols-1">
            {copy.about.facts.map(([label, value]) => (
              <div key={label}>
                <dt className="text-[var(--muted)]">{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <p {...reveal()} className="order-1 max-w-[56ch] text-[length:var(--step-lead)] leading-[1.35] md:order-2 md:max-w-[86%]">
          {copy.about.text}
        </p>
      </div>

      <div {...reveal()} className="mt-[120px] grid gap-6 md:grid-cols-[34%_1fr] md:gap-0">
        <p className="text-[length:var(--step-small)] text-[var(--muted)]">{copy.about.clientsWord}</p>
        <div className="flex flex-col gap-10 md:flex-row md:gap-16">
          {copy.about.clients.map((column, index) => (
            <ul key={index} className="w-full space-y-2.5 text-[length:var(--step-small)] md:w-[300px]">
              {column.map(([name, field]) => (
                <li key={name} className="flex justify-between gap-6">
                  <span>{name}</span>
                  <span className="text-right text-[var(--muted)]">{field}</span>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
