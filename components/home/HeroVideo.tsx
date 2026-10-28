"use client";

import { getImageProps } from "next/image";
import { useEffect, useRef } from "react";
import { preload } from "react-dom";

// Fișierele sunt generate cu scripts/encode-hero-video.sh.
// La înlocuirea video-urilor, crește VERSION ca vizitatorii să nu primească varianta veche din cache.
const VERSION = "1";
const DIR = "/assets/v2/video";
const MOBILE = "(max-width: 767px)";
// Ecrane mari sau retina primesc 1440p
const LARGE = "(min-width: 1440px) and (min-resolution: 1.5dppx), (min-width: 2200px)";

// Browserul ia PRIMA sursă care se potrivește la `media` și pe care o poate reda (`type`).
// Desktop: AV1 (cel mai mic) -> HEVC (Safari) -> H.264 (restul).
// Mobil: HEVC -> H.264, decodate hardware pe orice telefon (AV1 ar rula software pe multe Android-uri).
const SOURCES: Array<{ file: string; type: string; media?: string }> = [
  { file: "hero-mobile.hevc.mp4", type: 'video/mp4; codecs="hvc1.1.6.L120.90"', media: MOBILE },
  { file: "hero-mobile.h264.mp4", type: 'video/mp4; codecs="avc1.640028"', media: MOBILE },
  { file: "hero-1440.av1.mp4", type: 'video/mp4; codecs="av01.0.12M.10"', media: LARGE },
  { file: "hero-1440.hevc.mp4", type: 'video/mp4; codecs="hvc1.1.6.L150.90"', media: LARGE },
  { file: "hero-1080.av1.mp4", type: 'video/mp4; codecs="av01.0.08M.10"' },
  { file: "hero-1080.hevc.mp4", type: 'video/mp4; codecs="hvc1.1.6.L120.90"' },
  { file: "hero-1080.h264.mp4", type: 'video/mp4; codecs="avc1.640028"' },
];

const url = (file: string) => `${DIR}/${file}?v=${VERSION}`;
const attr = (value: string) => value.replaceAll('"', "&quot;");

// Video-ul e scris ca HTML brut, ca să pornească direct din HTML-ul serverului, înainte de JavaScript.
// `onplaying` îl face vizibil imediat ce rulează (coperta de dedesubt e exact primul cadru).
const VIDEO_HTML = `<video class="hero-video" autoplay muted loop playsinline preload="auto" disablepictureinpicture disableremoteplayback aria-hidden="true" onplaying="this.setAttribute('data-ready','')">${SOURCES.map(
  (source) =>
    `<source src="${url(source.file)}" type="${attr(source.type)}"${source.media ? ` media="${attr(source.media)}"` : ""}>`
).join("")}</video>`;

// Browserele vechi (Chrome < 120) ignoră `media` la <source> și ar putea alege varianta greșită -
// după încărcare verificăm și, la nevoie, păstrăm doar sursele potrivite pentru ecran.
function enforceMatchingSource(video: HTMLVideoElement) {
  const sources = Array.from(video.querySelectorAll("source"));
  const matches = (source: HTMLSourceElement) => !source.media || window.matchMedia(source.media).matches;
  const expected = sources.find((source) => matches(source) && video.canPlayType(source.type) !== "");
  if (!expected || !video.currentSrc || video.currentSrc === expected.src) return;
  sources.filter((source) => !matches(source)).forEach((source) => source.remove());
  video.load();
  video.play().catch(() => {});
}

export function HeroVideo() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Coperta (primul cadru) e preîncărcată cu prioritate maximă, separat pentru mobil și desktop
  const common = { alt: "", fill: true, preload: true, fetchPriority: "high", sizes: "100vw" } as const;
  const { props: desktopPoster } = getImageProps({ ...common, src: "/assets/v2/hero-poster.jpg" });
  const { props: mobilePoster } = getImageProps({ ...common, src: "/assets/v2/hero-poster-mobile.jpg" });
  for (const [poster, media] of [
    [mobilePoster, MOBILE],
    [desktopPoster, "(min-width: 768px)"],
  ] as const) {
    preload(poster.src, { as: "image", fetchPriority: "high", media, imageSrcSet: poster.srcSet || undefined, imageSizes: "100vw" });
  }

  useEffect(() => {
    const video = containerRef.current?.querySelector("video");
    if (!video) return;
    // Rezervă pentru `onplaying` din HTML, dacă o politică de securitate (CSP) ar bloca atributele inline
    const markReady = () => video.setAttribute("data-ready", "");
    if (!video.paused && video.readyState >= 3) markReady();
    video.addEventListener("playing", markReady);
    const check = () => enforceMatchingSource(video);
    if (video.currentSrc) check();
    else video.addEventListener("loadstart", check, { once: true });
    // Dacă autoplay-ul a fost amânat până la JavaScript (unele browsere), îl pornim acum
    video.play().catch(() => {});
    return () => {
      video.removeEventListener("playing", markReady);
      video.removeEventListener("loadstart", check);
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden bg-ink-2">
      <picture>
        <source media={MOBILE} srcSet={mobilePoster.srcSet || mobilePoster.src} sizes="100vw" />
        {/* eslint-disable-next-line jsx-a11y/alt-text -- alt-ul vine din desktopPoster (decorativ, gol) */}
        <img {...desktopPoster} className="object-cover" />
      </picture>
      <div ref={containerRef} className="absolute inset-0" dangerouslySetInnerHTML={{ __html: VIDEO_HTML }} suppressHydrationWarning />
    </div>
  );
}
