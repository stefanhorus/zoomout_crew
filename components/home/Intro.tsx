"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { Reveal } from "../motion/Reveal";
import { ScrollWords } from "../motion/ScrollWords";
import { LensBackdrop } from "../site/LensBackdrop";

export function Intro() {
  const { t } = useLanguage();
  return (
    <section className="relative overflow-hidden">
      <LensBackdrop className="lens-intro" />
      <div className="container-site grid gap-10 py-28 md:py-44 lg:grid-cols-12">
        <p className="kicker flex h-fit items-center gap-2 lg:col-span-3 lg:pt-4">
          <span className="rec-dot h-1.5 w-1.5" /> {t("intro.kicker")}
        </p>
        <div className="lg:col-span-9">
          <ScrollWords
            text={t("intro.text")}
            className="font-display text-[clamp(1.9rem,4.1vw,4.3rem)] font-medium leading-[1.07] tracking-[-0.035em]"
          />
          <Reveal className="mt-12">
            <Link href="/about" className="btn-ghost">
              {t("intro.link")} →
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
