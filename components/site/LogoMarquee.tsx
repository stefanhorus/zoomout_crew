"use client";

import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import { BRANDS } from "@/lib/brands";
import { VelocityMarquee } from "../motion/VelocityMarquee";

export function LogoMarquee() {
  const { t } = useLanguage();
  return (
    <section className="border-y border-line py-14 md:py-20">
      <div className="container-site mb-10 flex items-center gap-3">
        <span className="rec-dot h-1.5 w-1.5" />
        <p className="kicker">{t("logos.kicker")}</p>
      </div>
      <VelocityMarquee baseVelocity={-2.2}>
        {BRANDS.map((brand) => (
          <div
            key={brand.name}
            className="mx-2 flex h-24 w-44 shrink-0 items-center justify-center rounded-2xl border border-line bg-ink-2 px-6 py-4 md:mx-3 md:h-28 md:w-56"
          >
            <div className="relative h-full w-full">
              <Image src={brand.logo} alt={brand.name} fill sizes="224px" className="object-contain" />
            </div>
          </div>
        ))}
      </VelocityMarquee>
    </section>
  );
}
