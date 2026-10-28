"use client";

import { motion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { Magnetic } from "@/components/motion/Magnetic";
import { Reveal } from "@/components/motion/Reveal";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { CallToAction } from "@/components/site/CallToAction";
import { PageHeader } from "@/components/site/PageHeader";
import { Process } from "@/components/site/Process";
import { ProjectCard } from "@/components/site/ProjectCard";
import { ProjectModal } from "@/components/site/ProjectModal";
import { useLanguage } from "@/contexts/LanguageContext";
import { getProject, type Project } from "@/lib/projects";
import { SERVICES, type ServiceDefinition } from "@/lib/services";

const pad = (n: number) => String(n).padStart(2, "0");

function ServiceBlock({
  service,
  index,
  onOpen,
}: {
  service: ServiceDefinition;
  index: number;
  onOpen: (project: Project) => void;
}) {
  const { t } = useLanguage();
  const imageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: imageRef, offset: ["start end", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const related = service.related.map(getProject).filter((project): project is Project => Boolean(project));
  const features = [1, 2, 3, 4].map((n) => t(`services.${service.key}.feature${n}`));

  return (
    <section id={service.key} className="scroll-mt-24 border-t border-line py-20 md:py-28">
      <div className="container-site grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="self-start lg:sticky lg:top-28 lg:col-span-5">
          <p className="kicker tabular-nums">
            {pad(index + 1)} / {pad(SERVICES.length)}
          </p>
          <h2 className="display-md mt-5">
            <SplitReveal text={t(`services.${service.key}`)} />
          </h2>
          {service.showLocation && (
            <p className="mt-5 flex items-center gap-2 text-sm text-mute">
              <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M12 2a7 7 0 00-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 00-7-7zm0 9.5A2.5 2.5 0 1112 6a2.5 2.5 0 010 5.5z" />
              </svg>
              {t("services.location")}
            </p>
          )}
          <Reveal>
            <p className="lead mt-7">{t(`services.${service.key}.desc`)}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="kicker mb-4 mt-10">{t("services.highlights")}</p>
            <ul className="flex flex-wrap gap-2">
              {features.map((feature) => (
                <li key={feature} className="rounded-full border border-line px-4 py-2 text-sm text-paper-dim">
                  {feature}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.15} className="mt-10">
            <Magnetic>
              <Link href="/contact" className="btn-primary">
                {t("services.getQuote")} →
              </Link>
            </Magnetic>
          </Reveal>
        </div>

        <div className="lg:col-span-7">
          <div ref={imageRef} className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-ink-2 md:aspect-[16/11]">
            <motion.div style={{ y: imageY }} className="absolute inset-x-0 -inset-y-[9%]">
              <Image src={service.image} alt={t(`services.${service.key}`)} fill sizes="(max-width: 1024px) 100vw, 58vw" className="object-cover" />
            </motion.div>
          </div>

          {related.length > 0 && (
            <Reveal className="mt-10">
              <p className="kicker mb-5">{t("services2.related")}</p>
              <div className="grid grid-cols-3 gap-3 md:gap-4">
                {related.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onOpen={onOpen}
                    compact
                    className="aspect-[9/16] w-full"
                    sizes="(max-width: 768px) 33vw, 19vw"
                  />
                ))}
              </div>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}

export default function Services() {
  const { t } = useLanguage();
  const [selected, setSelected] = useState<Project | null>(null);

  return (
    <>
      <PageHeader kicker={t("services.title")} title={t("servicesIndex.title")} intro={t("services.subtitle")}>
        <Reveal delay={0.5} className="mt-12">
          <p className="kicker mb-4">{t("services2.jump")}</p>
          <nav className="flex flex-wrap gap-2" aria-label={t("services.title")}>
            {SERVICES.map((service, index) => (
              <Link
                key={service.key}
                href={`#${service.key}`}
                className="rounded-full border border-line px-4 py-2.5 text-sm transition-colors duration-300 hover:border-paper hover:bg-paper hover:text-ink"
              >
                <span className="mr-2 tabular-nums text-mute">{pad(index + 1)}</span>
                {t(`services.${service.key}`)}
              </Link>
            ))}
          </nav>
        </Reveal>
      </PageHeader>

      {SERVICES.map((service, index) => (
        <ServiceBlock key={service.key} service={service} index={index} onOpen={setSelected} />
      ))}

      <Process />
      <CallToAction />
      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </>
  );
}
