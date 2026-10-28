"use client";

import { motion, useMotionValue, useScroll, useTransform } from "motion/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useIsDesktop } from "@/lib/hooks";
import { PROJECTS, type Project } from "@/lib/projects";
import { SplitReveal } from "../motion/SplitReveal";
import { ProjectCard } from "../site/ProjectCard";
import { ProjectModal } from "../site/ProjectModal";

const FEATURED = PROJECTS.filter((project) => project.featured);

// Pe desktop secțiunea se "fixează" și proiectele defilează orizontal la scroll vertical
export function SelectedWork() {
  const { t } = useLanguage();
  const isDesktop = useIsDesktop();
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const distance = useMotionValue(0);
  const [sectionHeight, setSectionHeight] = useState<number | null>(null);
  const [selected, setSelected] = useState<Project | null>(null);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const x = useTransform(() => -scrollYProgress.get() * distance.get());

  useEffect(() => {
    const track = trackRef.current;
    if (!isDesktop || !track) return;
    const measure = () => {
      const overflow = Math.max(0, track.scrollWidth - window.innerWidth);
      distance.set(overflow);
      setSectionHeight(window.innerHeight + overflow);
    };
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [isDesktop, distance]);

  const header = (
    <div className="container-site mb-10 flex items-end justify-between gap-10 md:mb-12">
      <div>
        <p className="kicker">{t("work.kicker")}</p>
        <h2 className="display-lg mt-4">
          <SplitReveal text={t("work.title")} />
        </h2>
      </div>
      <div className="hidden max-w-xs pb-2 md:block">
        <p className="text-paper-dim">{t("work.text")}</p>
        <Link href="/portfolio" className="link-line mt-4 inline-block font-medium">
          {t("common.allProjects")} →
        </Link>
      </div>
    </div>
  );

  const endCard = (
    <Link
      href="/portfolio"
      className={`group flex shrink-0 flex-col justify-between rounded-2xl border border-line p-6 transition-colors duration-500 hover:border-rec hover:bg-rec hover:text-ink ${isDesktop ? "" : "w-[72vw] snap-start sm:w-[44vw] md:w-[32vw]"}`}
      data-cursor={t("cursor.view")}
      style={isDesktop ? { height: "min(60svh, 640px)", aspectRatio: "9 / 16" } : { aspectRatio: "9 / 16" }}
    >
      <span className="kicker transition-colors group-hover:text-ink/70">{t("common.allProjects")}</span>
      <span className="display-sm">
        {t("work.endTitle")} <span className="inline-block transition-transform duration-500 group-hover:translate-x-2">→</span>
      </span>
    </Link>
  );

  return (
    <section
      ref={sectionRef}
      className="relative"
      style={isDesktop && sectionHeight ? { height: sectionHeight } : undefined}
    >
      {isDesktop ? (
        <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden">
          {header}
          <motion.div ref={trackRef} style={{ x }} className="flex w-max gap-5 px-[clamp(1.25rem,4vw,3.5rem)] will-change-transform">
            {FEATURED.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index + 1}
                onOpen={setSelected}
                eager
                className="aspect-[9/16] h-[min(60svh,640px)] shrink-0"
              />
            ))}
            {endCard}
          </motion.div>
          <div className="container-site mt-10">
            <div className="h-px bg-line">
              <motion.div style={{ scaleX: scrollYProgress }} className="h-px origin-left bg-paper" />
            </div>
          </div>
        </div>
      ) : (
        <div className="py-24">
          {header}
          <div className="scrollbar-hide flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2">
            {FEATURED.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index + 1}
                onOpen={setSelected}
                eager
                className="aspect-[9/16] w-[72vw] shrink-0 snap-start sm:w-[44vw] md:w-[32vw]"
              />
            ))}
            {endCard}
          </div>
          <div className="container-site mt-8 md:hidden">
            <Link href="/portfolio" className="btn-ghost">
              {t("common.allProjects")} →
            </Link>
          </div>
        </div>
      )}
      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
