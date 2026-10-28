"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { EASE } from "../motion/ease";

// Recenzii reale (din pagina About). originalLang = limba în care a fost scrisă recenzia.
const REVIEWS = [
  { key: "about.reviews.review1", avatar: "/assets/reviews/review1.png", originalLang: "en", logo: false },
  { key: "about.reviews.review4", avatar: "/assets/reviews/review2.png", originalLang: "ro", logo: false },
  { key: "about.reviews.review5", avatar: "/assets/brands/rotaract.png", originalLang: "en", logo: true },
] as const;

export function Testimonials() {
  const { t, language } = useLanguage();
  const [index, setIndex] = useState(0);
  const [showOriginal, setShowOriginal] = useState(false);
  const review = REVIEWS[index];
  const isTranslated = review.originalLang !== language;
  const text = !isTranslated || showOriginal ? t(`${review.key}.textOriginal`) : t(`${review.key}.text`);

  const go = (direction: 1 | -1) => {
    setShowOriginal(false);
    setIndex((current) => (current + direction + REVIEWS.length) % REVIEWS.length);
  };

  return (
    <section className="border-t border-line">
      <div className="container-site grid gap-12 py-28 md:py-40 lg:grid-cols-12">
        <div className="flex flex-col justify-between gap-10 lg:col-span-4">
          <div>
            <p className="kicker">{t("reviews.kicker")}</p>
            <h2 className="display-md mt-5 max-w-[10ch]">{t("about.reviews.title")}</h2>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => go(-1)}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-line transition-colors hover:border-paper"
              aria-label={t("common.prev")}
            >
              ←
            </button>
            <span className="kicker tabular-nums text-paper">
              {String(index + 1).padStart(2, "0")} / {String(REVIEWS.length).padStart(2, "0")}
            </span>
            <button
              type="button"
              onClick={() => go(1)}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-line transition-colors hover:border-paper"
              aria-label={t("common.next")}
            >
              →
            </button>
          </div>
        </div>

        <div className="min-h-[420px] lg:col-span-8">
          <AnimatePresence mode="wait">
            <motion.figure
              key={`${index}-${language}-${showOriginal}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.7, ease: EASE }}
            >
              <span aria-hidden className="block font-serif text-7xl leading-none text-rec">“</span>
              <blockquote className="font-serif text-[clamp(1.35rem,2.3vw,2.25rem)] leading-[1.3] tracking-[-0.01em] text-paper">
                {text}
              </blockquote>
              <figcaption className="mt-10 flex flex-wrap items-center gap-4">
                <div className={`relative h-14 w-14 overflow-hidden rounded-full ${review.logo ? "bg-paper p-2" : "bg-ink-3"}`}>
                  <Image src={review.avatar} alt="" fill sizes="56px" className={review.logo ? "object-contain p-1.5" : "object-cover"} />
                </div>
                <div>
                  <p className="font-display text-lg font-semibold">{t(`${review.key}.name`)}</p>
                  <p className="text-sm text-mute">{t(`${review.key}.role`)}</p>
                </div>
                {isTranslated && (
                  <button
                    type="button"
                    onClick={() => setShowOriginal((value) => !value)}
                    className="link-line ml-auto text-sm text-mute hover:text-paper"
                  >
                    {showOriginal ? t("reviews.showTranslation") : t("reviews.showOriginal")}
                  </button>
                )}
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
