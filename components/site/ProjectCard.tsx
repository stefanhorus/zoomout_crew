"use client";

import Image from "next/image";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { isYouTube, muxPreview, projectCover, splitTitle, type Project, type ProjectCategory } from "@/lib/projects";

export const CATEGORY_KEYS: Record<ProjectCategory, string> = {
  commercial: "portfolio.commercial",
  events: "portfolio.events",
  "real-estate": "portfolio.realEstate",
  "music-videos": "portfolio.musicVideos",
};

interface ProjectCardProps {
  project: Project;
  onOpen: (project: Project) => void;
  index?: number;
  className?: string;
  sizes?: string;
  compact?: boolean; // card mic (ex. "Related work" pe pagina Services)
  eager?: boolean; // încărcare imediată (cardurile din banda orizontală nu sunt detectate corect de lazy-loading)
}

// Card vertical (9:16) - copertă din video (Mux sau YouTube), previzualizare animată la hover pentru Mux
export function ProjectCard({
  project,
  onOpen,
  index,
  className = "",
  sizes = "(max-width: 768px) 75vw, 28vw",
  compact = false,
  eager = false,
}: ProjectCardProps) {
  const { t } = useLanguage();
  const [hovered, setHovered] = useState(false);
  const { name, subtitle } = splitTitle(t(`${project.key}.title`));
  const cover = projectCover(project);
  const video = project.videos?.[0];
  const categories = project.categories.map((category) => t(CATEGORY_KEYS[category])).join(" · ");

  return (
    <button
      type="button"
      onClick={() => onOpen(project)}
      onPointerEnter={(event) => event.pointerType === "mouse" && setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      data-cursor={video ? t("cursor.play") : t("cursor.view")}
      className={`group relative block overflow-hidden rounded-2xl bg-ink-2 text-left ${className}`}
      aria-label={`${name}${subtitle ? ` - ${subtitle}` : ""}`}
    >
      {cover ? (
        <Image
          src={cover}
          alt=""
          fill
          sizes={sizes}
          loading={eager ? "eager" : "lazy"}
          unoptimized={cover.startsWith("https://")}
          className="object-cover transition-transform duration-[1.4s] ease-[var(--ease-expo)] group-hover:scale-[1.06]"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_50%_40%,rgba(242,238,230,0.08),transparent_65%)]">
          {project.logo ? (
            <div className="relative h-[34%] w-[62%] transition-transform duration-[1.4s] ease-[var(--ease-expo)] group-hover:scale-[1.06]">
              <Image src={project.logo} alt="" fill sizes="240px" className="object-contain" />
            </div>
          ) : (
            // Fără video, poze sau logo: titlul (ex. piesa) ca afiș
            <span
              className={`serif-i px-5 text-center leading-none text-paper/85 transition-transform duration-[1.4s] ease-[var(--ease-expo)] group-hover:scale-[1.06] ${
                compact ? "text-2xl md:text-3xl" : "text-5xl md:text-6xl"
              }`}
            >
              {subtitle || name}
            </span>
          )}
        </div>
      )}

      {video && !isYouTube(video) && hovered && (
        <Image
          src={muxPreview(video.playbackId, video.thumbTime)}
          alt=""
          fill
          unoptimized
          sizes={sizes}
          className="object-cover"
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/15 to-ink/30" />

      <div className={`absolute inset-x-0 top-0 flex items-start justify-between ${compact ? "p-3" : "p-4 md:p-5"}`}>
        {index !== undefined && <span className="kicker text-paper/80">{String(index).padStart(2, "0")}</span>}
        {video && (
          <span
            className={`ml-auto flex items-center justify-center rounded-full border border-paper/30 bg-ink/30 backdrop-blur-md transition-colors duration-500 group-hover:border-rec group-hover:bg-rec ${
              compact ? "h-8 w-8" : "h-10 w-10"
            }`}
          >
            <svg className="ml-0.5 h-3 w-3 text-paper transition-colors group-hover:text-ink" viewBox="0 0 12 12" fill="currentColor">
              <path d="M2.5 1.2v9.6L10.5 6z" />
            </svg>
          </span>
        )}
      </div>

      <div className={`absolute inset-x-0 bottom-0 ${compact ? "p-3 md:p-4" : "p-4 md:p-6"}`}>
        {!compact && <p className="kicker mb-3 hidden text-paper/70 sm:block">{categories}</p>}
        <h3
          className={`font-display font-semibold leading-none tracking-tight ${
            compact ? "text-base md:text-lg" : "text-xl md:text-[1.75rem]"
          }`}
        >
          {name}
        </h3>
        {subtitle && !compact && <p className="mt-2 line-clamp-2 hidden text-sm text-paper-dim sm:block">{subtitle}</p>}
      </div>
    </button>
  );
}
