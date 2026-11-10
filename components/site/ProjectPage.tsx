"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { PROJECTS, projectPath, splitTitle, type Project } from "@/lib/projects";
import { CallToAction } from "./CallToAction";
import { ProjectView } from "./ProjectView";

// Pagina unui proiect (/portfolio/<slug>): ce vede cine deschide linkul trimis sau reîncarcă fereastra proiectului.
// Clipul stă pe cadrul de copertă până apasă play (cu sunet); jos, proiectul anterior și următor din Portfolio.
export function ProjectPage({ project }: { project: Project }) {
  const { t } = useLanguage();
  const index = PROJECTS.findIndex((item) => item.id === project.id);
  const prev = PROJECTS[(index - 1 + PROJECTS.length) % PROJECTS.length];
  const next = PROJECTS[(index + 1) % PROJECTS.length];
  const nameOf = (item: Project) => splitTitle(t(`${item.key}.title`)).name;

  return (
    <>
      <div className="container-site pt-28 md:pt-36">
        <Link href="/portfolio" className="kicker link-line">
          ← {t("common.allProjects")}
        </Link>
      </div>

      <section className="container-site grid items-center gap-10 pb-20 pt-10 md:pb-28 lg:grid-cols-12 lg:gap-14">
        <ProjectView project={project} autoplay={false} heading="h1" />
      </section>

      <nav aria-label={t("portfolio.title")} className="container-site grid border-t border-line md:grid-cols-2">
        <Link href={projectPath(prev)} className="group block border-b border-line py-10 md:border-b-0 md:border-r md:py-14 md:pr-10">
          <span className="kicker transition-colors group-hover:text-rec">← {t("project.prev")}</span>
          <span className="display-sm mt-4 block transition-transform duration-700 ease-[var(--ease-expo)] group-hover:-translate-x-2">
            {nameOf(prev)}
          </span>
        </Link>
        <Link href={projectPath(next)} className="group block py-10 md:py-14 md:pl-10 md:text-right">
          <span className="kicker transition-colors group-hover:text-rec">{t("project.next")} →</span>
          <span className="display-sm mt-4 block transition-transform duration-700 ease-[var(--ease-expo)] group-hover:translate-x-2">
            {nameOf(next)}
          </span>
        </Link>
      </nav>

      <CallToAction />
    </>
  );
}
