"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { splitTitle, videoId, videoPlayer, type Project } from "@/lib/projects";
import { EASE } from "../motion/ease";
import { useScrollLock } from "../motion/SmoothScroll";
import { CATEGORY_KEYS } from "./ProjectCard";

function ModalContent({ project, onClose }: { project: Project; onClose: () => void }) {
  const { t } = useLanguage();
  const [index, setIndex] = useState(0);
  const { name, subtitle } = splitTitle(t(`${project.key}.title`));
  const media = project.videos ?? project.images ?? [];
  const count = media.length;

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (count > 1 && event.key === "ArrowRight") setIndex((i) => (i + 1) % count);
      if (count > 1 && event.key === "ArrowLeft") setIndex((i) => (i - 1 + count) % count);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [count, onClose]);

  const video = project.videos?.[index];
  const image = project.images?.[index];

  return (
    <motion.div
      className="fixed inset-0 z-[70] bg-ink/95 backdrop-blur-xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45 }}
      role="dialog"
      aria-modal="true"
      aria-label={name}
    >
      <div className="h-full overflow-y-auto" data-lenis-prevent onClick={onClose}>
        <motion.div
          className="container-site grid min-h-full items-center gap-10 py-24 lg:grid-cols-12 lg:gap-14"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          {/* Media */}
          <div className="flex flex-col items-center gap-5 lg:col-span-7" onClick={(event) => event.stopPropagation()}>
            {video ? (
              <div
                className={`relative overflow-hidden rounded-2xl bg-ink-2 ${
                  video.landscape ? "aspect-video w-full" : "aspect-[9/16] w-full max-w-[min(100%,calc(78svh*9/16))]"
                }`}
              >
                <iframe
                  key={videoId(video)}
                  src={videoPlayer(video)}
                  title={name}
                  allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full border-0"
                />
              </div>
            ) : image ? (
              <div className="relative aspect-[9/16] w-full max-w-[min(100%,calc(78svh*9/16))] overflow-hidden rounded-2xl bg-ink-2">
                <Image key={image} src={image} alt={name} fill sizes="(max-width: 1024px) 90vw, 45vw" className="object-cover" />
              </div>
            ) : (
              <div className="relative flex aspect-[4/5] w-full max-w-md items-center justify-center rounded-2xl border border-line bg-ink-2">
                {project.logo && (
                  <div className="relative h-1/3 w-2/3">
                    <Image src={project.logo} alt={name} fill sizes="320px" className="object-contain" />
                  </div>
                )}
              </div>
            )}

            {count > 1 && (
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setIndex((i) => (i - 1 + count) % count)}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-line transition-colors hover:border-paper"
                  aria-label={t("common.prev")}
                >
                  ←
                </button>
                <span className="kicker tabular-nums text-paper">
                  {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
                </span>
                <button
                  type="button"
                  onClick={() => setIndex((i) => (i + 1) % count)}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-line transition-colors hover:border-paper"
                  aria-label={t("common.next")}
                >
                  →
                </button>
              </div>
            )}
          </div>

          {/* Detalii */}
          <div className="lg:col-span-5" onClick={(event) => event.stopPropagation()}>
            <p className="kicker">{project.categories.map((category) => t(CATEGORY_KEYS[category])).join(" · ")}</p>
            <h2 className="display-md mt-5">{name}</h2>
            {subtitle && <p className="serif-i mt-3 text-2xl text-paper-dim md:text-3xl">{subtitle}</p>}
            <p className="lead mt-8">{t(`${project.key}.description`)}</p>
            <Link href="/contact" onClick={onClose} className="btn-primary mt-10">
              {t("modal.quote")} →
            </Link>
          </div>
        </motion.div>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="fixed right-5 top-5 z-[71] flex h-12 w-12 items-center justify-center rounded-full border border-line bg-ink/60 backdrop-blur-md transition-colors hover:border-paper md:right-8 md:top-8"
        aria-label={t("common.close")}
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
          <path strokeLinecap="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
      </button>
    </motion.div>
  );
}

// Fereastra cu video-ul / pozele unui proiect (randată în body, peste tot site-ul)
export function ProjectModal({ project, onClose }: { project: Project | null; onClose: () => void }) {
  useScrollLock(project !== null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    queueMicrotask(() => setMounted(true));
  }, []);
  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>{project && <ModalContent key={project.id} project={project} onClose={onClose} />}</AnimatePresence>,
    document.body
  );
}
