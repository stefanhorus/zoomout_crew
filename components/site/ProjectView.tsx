"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { CATEGORY_KEYS, projectUrl, splitTitle, videoId, videoPlayer, type Project } from "@/lib/projects";

// Trimite linkul proiectului: pe telefon deschide meniul de share (WhatsApp, Instagram...), pe calculator îl copiază
function ShareLink({ project, title }: { project: Project; title: string }) {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const url = projectUrl(project);
    if (navigator.share && window.matchMedia("(pointer: coarse)").matches) {
      try {
        await navigator.share({ title, url });
      } catch {
        // meniul a fost închis fără să trimită
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      window.prompt(t("project.copy"), url);
    }
  };

  return (
    <button type="button" onClick={share} className="btn-ghost" aria-live="polite">
      {copied ? t("project.copied") : t("project.share")}
    </button>
  );
}

interface ProjectViewProps {
  project: Project;
  autoplay?: boolean; // fereastra pornește clipul singur; pagina proiectului îl lasă pe cadrul de copertă
  heading?: "h1" | "h2";
  onLeave?: () => void; // click pe „Cere ofertă” (pleacă pe altă pagină)
}

// Clipurile (sau pozele) unui proiect și detaliile lui, în două coloane ale unei grile de 12: în fereastra deschisă
// din carduri și pe pagina proiectului (/portfolio/<slug>)
export function ProjectView({ project, autoplay = true, heading: Heading = "h2", onLeave }: ProjectViewProps) {
  const { t } = useLanguage();
  const [index, setIndex] = useState(0);
  const title = t(`${project.key}.title`);
  const { name, subtitle } = splitTitle(title);
  // întâi clipurile, apoi pozele (un proiect poate avea doar una dintre ele sau pe amândouă)
  const videos = project.videos ?? [];
  const images = project.images ?? [];
  const count = videos.length + images.length;

  useEffect(() => {
    if (count < 2) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") setIndex((i) => (i + 1) % count);
      if (event.key === "ArrowLeft") setIndex((i) => (i - 1 + count) % count);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [count]);

  const video = videos[index];
  const image = index >= videos.length ? images[index - videos.length] : undefined;
  // rama pozei: forma din proiect (implicit 9:16) și cel mult 78% din înălțimea ecranului, ca la clipurile verticale
  const imageAspect = project.imageAspect ?? "9 / 16";

  return (
    <>
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
              src={videoPlayer(video, { autoplay })}
              title={name}
              allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
              className="absolute inset-0 h-full w-full border-0"
            />
          </div>
        ) : image ? (
          <div
            className="relative w-full overflow-hidden rounded-2xl bg-ink-2"
            style={{ aspectRatio: imageAspect, maxWidth: `min(100%, calc(78svh * ${imageAspect}))` }}
          >
            <Image key={image} src={image} alt={name} fill sizes="(max-width: 1024px) 90vw, 45vw" className="object-cover" />
          </div>
        ) : (
          <div className="relative flex aspect-[4/5] w-full max-w-md items-center justify-center rounded-2xl border border-line bg-ink-2">
            {project.logo ? (
              <div className="relative h-1/3 w-2/3">
                <Image src={project.logo} alt={name} fill sizes="320px" className="object-contain" />
              </div>
            ) : (
              <span className="serif-i px-8 text-center text-6xl leading-none text-paper/85 md:text-7xl">{subtitle || name}</span>
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
        <Heading className="display-md mt-5">{name}</Heading>
        {subtitle && <p className="serif-i mt-3 text-2xl text-paper-dim md:text-3xl">{subtitle}</p>}
        <p className="lead mt-8">{t(`${project.key}.description`)}</p>
        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Link href="/contact" onClick={onLeave} className="btn-primary">
            {t("modal.quote")} →
          </Link>
          <ShareLink project={project} title={title} />
        </div>
      </div>
    </>
  );
}
