"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { splitTitle, type Project } from "@/lib/projects";
import { EASE } from "../motion/ease";
import { useScrollLock } from "../motion/SmoothScroll";
import { ProjectView } from "./ProjectView";

function ModalContent({ project, onClose, onLeave }: { project: Project; onClose: () => void; onLeave: () => void }) {
  const { t } = useLanguage();
  const { name } = splitTitle(t(`${project.key}.title`));

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

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
          <ProjectView project={project} onLeave={onLeave} />
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

// Fereastra cu video-ul / pozele unui proiect (randată în body, peste tot site-ul). `onLeave` se cheamă când
// vizitatorul pleacă pe un link din fereastră (altfel `onClose`); vezi useProjectSelection.
export function ProjectModal({
  project,
  onClose,
  onLeave,
}: {
  project: Project | null;
  onClose: () => void;
  onLeave?: () => void;
}) {
  useScrollLock(project !== null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    queueMicrotask(() => setMounted(true));
  }, []);
  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {project && <ModalContent key={project.id} project={project} onClose={onClose} onLeave={onLeave ?? onClose} />}
    </AnimatePresence>,
    document.body
  );
}
