"use client";

import { motion, useScroll } from "motion/react";
import { useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Reveal } from "../motion/Reveal";
import { SplitReveal } from "../motion/SplitReveal";

const STEPS = [1, 2, 3, 4];

export function Process() {
  const { t } = useLanguage();
  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 0.75", "end 0.6"] });

  return (
    <section className="container-site py-28 md:py-40">
      <div className="grid gap-14 lg:grid-cols-12">
        <div className="self-start lg:sticky lg:top-32 lg:col-span-5">
          <p className="kicker">{t("process.kicker")}</p>
          <h2 className="display-md mt-5 max-w-[12ch]">
            <SplitReveal text={t("process.title")} />
          </h2>
          <Reveal delay={0.2}>
            <p className="lead mt-6 max-w-md">{t("process.text")}</p>
          </Reveal>
        </div>

        <div className="relative lg:col-span-7">
          {/* Linia de progres care se umple la scroll */}
          <div className="absolute bottom-0 left-0 top-0 hidden w-px bg-line md:block">
            <motion.div style={{ scaleY: scrollYProgress }} className="h-full w-px origin-top bg-rec" />
          </div>
          <ol ref={listRef} className="md:pl-12">
            {STEPS.map((step) => (
              <li key={step} className="border-t border-line py-10 first:border-t-0 md:py-14">
                <Reveal>
                  <div className="grid grid-cols-[auto_1fr] gap-6 md:gap-10">
                    <span className="font-display text-sm font-semibold tabular-nums text-rec">{String(step).padStart(2, "0")}</span>
                    <div>
                      <h3 className="display-sm">{t(`process.step${step}.title`)}</h3>
                      <p className="lead mt-4 max-w-lg">{t(`process.step${step}.desc`)}</p>
                    </div>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
