"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { Magnetic } from "../motion/Magnetic";
import { SplitReveal } from "../motion/SplitReveal";

export function CallToAction() {
  const { t } = useLanguage();
  return (
    <section className="relative overflow-hidden py-32 md:py-44">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_65%_at_50%_100%,rgba(255,74,43,0.17),transparent_70%)]" />
      <div className="container-site relative text-center">
        <p className="kicker flex items-center justify-center gap-2">
          <span className="rec-dot h-1.5 w-1.5" /> {t("cta.kicker")}
        </p>
        <h2 className="display-xl mx-auto mt-8 max-w-[16ch]">
          <SplitReveal text={t("cta.line1")} />
          <br />
          <SplitReveal text={t("cta.line2")} delay={0.18} />
        </h2>
        <div className="mt-14 flex flex-col items-center gap-7">
          <Magnetic>
            <Link href="/contact" className="btn-primary px-9 py-5 text-base">
              {t("common.quote")} →
            </Link>
          </Magnetic>
          <p className="text-mute">
            {t("cta.or")}{" "}
            <a href="mailto:contact@zoomoutcrew.com" className="link-line text-paper">
              contact@zoomoutcrew.com
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
