"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { SERVICES } from "@/lib/services";
import { VelocityMarquee } from "../motion/VelocityMarquee";

function Star() {
  return (
    <svg className="mx-6 h-[0.45em] w-[0.45em] shrink-0 text-rec md:mx-10" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 0l2.4 8.2L22.4 4 18 11.2 24 12l-6 .8 4.4 7.2-8-4.2L12 24l-2.4-8.2-8 4.2L6 12.8 0 12l6-.8L1.6 4l8 4.2z" />
    </svg>
  );
}

export function TextMarquee() {
  const { t } = useLanguage();
  return (
    <section className="overflow-hidden border-y border-line py-10 md:py-14" aria-label={t("servicesIndex.kicker")}>
      <VelocityMarquee baseVelocity={-3.2}>
        {SERVICES.map((service, index) => (
          <span key={service.key} className="flex items-center font-display text-[clamp(3rem,9vw,9.5rem)] font-semibold leading-none tracking-[-0.05em]">
            <span className={index % 2 === 1 ? "text-outline" : undefined}>{t(`marquee.${service.key}`)}</span>
            <Star />
          </span>
        ))}
      </VelocityMarquee>
    </section>
  );
}
