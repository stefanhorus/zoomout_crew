"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { EASE } from "@/components/motion/ease";
import { Reveal } from "@/components/motion/Reveal";
import { CallToAction } from "@/components/site/CallToAction";
import { PageHeader } from "@/components/site/PageHeader";
import { ProjectCard } from "@/components/site/ProjectCard";
import { ProjectModal } from "@/components/site/ProjectModal";
import { useLanguage } from "@/contexts/LanguageContext";
import { PROJECTS, type Project, type ProjectCategory } from "@/lib/projects";

type Filter = "all" | ProjectCategory;

const FILTERS: Array<{ value: Filter; labelKey: string }> = [
  { value: "all", labelKey: "portfolio.allProjects" },
  { value: "commercial", labelKey: "portfolio.commercial" },
  { value: "events", labelKey: "portfolio.events" },
  { value: "real-estate", labelKey: "portfolio.realEstate" },
];

export default function Portfolio() {
  const { t } = useLanguage();
  const [filter, setFilter] = useState<Filter>("all");
  const [selected, setSelected] = useState<Project | null>(null);

  const countFor = (value: Filter) => (value === "all" ? PROJECTS.length : PROJECTS.filter((p) => p.categories.includes(value)).length);
  const visible = filter === "all" ? PROJECTS : PROJECTS.filter((project) => project.categories.includes(filter));

  return (
    <>
      <PageHeader kicker={t("portfolio.title")} title={t("portfolio2.title")} intro={t("portfolio.subtitle")}>
        <Reveal delay={0.5} className="mt-12">
          <div className="flex flex-wrap gap-2" role="group" aria-label={t("portfolio.title")}>
            {FILTERS.map((item) => {
              const active = filter === item.value;
              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setFilter(item.value)}
                  aria-pressed={active}
                  className={`rounded-full border px-5 py-2.5 text-sm font-medium transition-colors duration-300 ${
                    active ? "border-paper bg-paper text-ink" : "border-line text-paper hover:border-paper"
                  }`}
                >
                  {t(item.labelKey)}
                  <span className={`ml-2 tabular-nums ${active ? "text-ink/50" : "text-mute"}`}>{countFor(item.value)}</span>
                </button>
              );
            })}
          </div>
        </Reveal>
      </PageHeader>

      <section className="container-site pb-28 md:pb-40">
        <motion.div layout className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 xl:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {visible.map((project, index) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.8, ease: EASE, delay: Math.min(index, 8) * 0.04 }}
              >
                <ProjectCard
                  project={project}
                  index={index + 1}
                  onOpen={setSelected}
                  className="aspect-[9/16] w-full"
                  sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      <CallToAction />
      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </>
  );
}
