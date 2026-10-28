"use client";

import { motion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { useRef } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { CallToAction } from "@/components/site/CallToAction";
import { LogoMarquee } from "@/components/site/LogoMarquee";
import { PageHeader } from "@/components/site/PageHeader";
import { Testimonials } from "@/components/site/Testimonials";
import { useLanguage } from "@/contexts/LanguageContext";

// Motivele existente din pagina About (about.*)
const VALUES = ["professionalEquipment", "creativeVision", "experiencedTeam", "reliableService"];

export default function About() {
  const { t } = useLanguage();
  const imageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: imageRef, offset: ["start end", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.15, 1]);

  return (
    <>
      <PageHeader kicker={t("about2.kicker")} title={t("about2.title")} intro={t("about2.intro")} />

      {/* Imagine aeriană mare, cu parallax */}
      <section className="container-site">
        <div ref={imageRef} className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-ink-2 md:aspect-[21/9]">
          <motion.div style={{ y: imageY, scale: imageScale }} className="absolute inset-x-0 -inset-y-[11%]">
            <Image src="/assets/backgrounds/background6tiny.png" alt="" fill priority sizes="100vw" className="object-cover" />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
          <p className="kicker absolute bottom-5 left-5 flex items-center gap-2 text-paper md:bottom-8 md:left-8">
            <span className="rec-dot h-1.5 w-1.5" /> New York
          </p>
        </div>
      </section>

      {/* Povestea */}
      <section className="container-site py-28 md:py-40">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="kicker">{t("about2.storyKicker")}</p>
            <h2 className="display-lg mt-5">
              <SplitReveal text={t("about2.storyTitle")} />
            </h2>
          </div>
          <div className="space-y-8 lg:col-span-6 lg:col-start-7 lg:pt-4">
            <Reveal>
              <p className="font-display text-[clamp(1.35rem,2.1vw,2rem)] font-medium leading-[1.3] tracking-[-0.02em]">{t("about2.story1")}</p>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="lead">{t("about2.story2")}</p>
            </Reveal>
          </div>
        </div>
      </section>

      <LogoMarquee />

      {/* De ce să lucrezi cu noi */}
      <section className="container-site py-28 md:py-40">
        <div className="mb-14 md:mb-20">
          <p className="kicker">{t("about2.valuesKicker")}</p>
          <h2 className="display-lg mt-5 max-w-[14ch]">
            <SplitReveal text={t("about2.valuesTitle")} />
          </h2>
        </div>
        <div className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-2">
          {VALUES.map((value, index) => (
            <Reveal key={value} delay={(index % 2) * 0.1} className="h-full">
              <div className="flex h-full flex-col gap-10 bg-ink p-8 md:p-12">
                <span className="font-display text-sm font-semibold tabular-nums text-rec">{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="display-sm">{t(`about.${value}`)}</h3>
                  <p className="lead mt-4 max-w-md">{t(`about.${value}.desc`)}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <Testimonials />
      <CallToAction />
    </>
  );
}
