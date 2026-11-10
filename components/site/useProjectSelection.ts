"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { withBasePath } from "@/lib/base-path";
import { getProjectBySlug, projectPath, type Project } from "@/lib/projects";
import { keepScrollPosition } from "../motion/SmoothScroll";

// Cheia din history.state a intrărilor puse de fereastra unui proiect: { slug, page }
const STATE_KEY = "zoomoutProject";

interface ProjectEntry {
  slug: string;
  page: string;
}

function entryFor(state: unknown, page: string): Project | null {
  const entry = (state as Record<string, ProjectEntry | undefined> | null)?.[STATE_KEY];
  if (!entry || entry.page !== page) return null;
  return getProjectBySlug(entry.slug) ?? null;
}

// Fereastra unui proiect, cu adresa proiectului în bara browserului (/portfolio/<slug>), ca linkul să se poată copia.
// Back închide fereastra, Forward o redeschide, iar cine deschide linkul primește pagina proiectului.
// `page` e pagina pe care stă fereastra ("/", "/portfolio", "/services"): la Back/Forward fereastra se redeschide
// doar pe pagina unde a fost deschisă.
export function useProjectSelection(page: string) {
  const [selected, setSelected] = useState<Project | null>(null);
  const ownsEntry = useRef(false); // intrarea curentă din istoric e pusă de fereastră, deci X o poate scoate cu Back

  useEffect(() => {
    // Pagina se montează pe o intrare a ferestrei (ex. Back de pe pagina deschisă din „Cere ofertă”)
    const project = entryFor(window.history.state, page);
    if (project) {
      ownsEntry.current = true;
      queueMicrotask(() => setSelected(project));
    }
    const onPop = (event: PopStateEvent) => {
      const restored = entryFor(event.state, page);
      ownsEntry.current = restored !== null;
      setSelected(restored);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [page]);

  const open = useCallback(
    (project: Project) => {
      keepScrollPosition();
      const entry: ProjectEntry = { slug: project.slug, page };
      if (ownsEntry.current) window.history.replaceState({ [STATE_KEY]: entry }, "", withBasePath(projectPath(project)));
      else window.history.pushState({ [STATE_KEY]: entry }, "", withBasePath(projectPath(project)));
      ownsEntry.current = true;
      setSelected(project);
    },
    [page]
  );

  // Închisă de vizitator (X, Escape, click pe fundal): adresa revine la pagina de dedesubt
  const close = useCallback(() => {
    setSelected(null);
    if (ownsEntry.current) {
      ownsEntry.current = false;
      window.history.back();
    }
  }, []);

  // Închisă pentru că vizitatorul pleacă pe un link din fereastră (ex. „Cere ofertă”): intrarea rămâne în istoric,
  // așa că Back de pe pagina nouă redeschide proiectul
  const leave = useCallback(() => {
    ownsEntry.current = false;
    setSelected(null);
  }, []);

  return { selected, open, close, leave };
}
