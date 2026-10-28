"use client";

import Link from "next/link";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { useLanguage } from "@/contexts/LanguageContext";

export function NotFoundContent() {
  const { t } = useLanguage();

  return (
    <section className="container-site flex min-h-[100svh] flex-col justify-center pb-24 pt-36">
      <p className="kicker flex items-center gap-2">
        <span className="rec-dot h-1.5 w-1.5" /> 404 · {t("notFound.title")}
      </p>
      <h1 className="display-xl mt-8 max-w-[14ch]">
        <SplitReveal text={t("hero.bigPicture")} mode="mount" delay={0.1} />
      </h1>
      <p className="lead mt-8 max-w-xl">{t("notFound.description")}</p>
      <div className="mt-12 flex flex-wrap gap-3">
        <Link href="/" className="btn-primary">
          {t("notFound.backHome")}
        </Link>
        <Link href="/portfolio" className="btn-ghost">
          {t("notFound.viewPortfolio")} →
        </Link>
      </div>
    </section>
  );
}
