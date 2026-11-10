"use client";

import { getImageProps } from "next/image";
import { useLayoutEffect, useRef } from "react";
import { preload } from "react-dom";

// Același video hero ca pe site-ul principal (copiat din components/home/HeroVideo.tsx al noului design).
// Fișierele stau la site-ul principal: căile încep cu /assets (fără /2), deci vin de la zoomoutcrew.com, la fel ca
// restul pozelor acestui site vechi. VERSION trebuie să fie aceeași ca acolo, ca browserul să refolosească fișierele.
const VERSION = "1";
const DIR = "/assets/v2/video";
// Ecran vertical = video-ul vertical (telefoane, tablete în portret)
const PORTRAIT = "(orientation: portrait)";
// Ecrane mari sau retina primesc 1440p
const LARGE = "(min-width: 1440px) and (min-resolution: 1.5dppx), (min-width: 2200px)";

// Browserul ia PRIMA sursă care se potrivește la `media` și pe care o poate reda (`type`).
// Desktop: AV1 (cel mai mic) -> HEVC (Safari) -> H.264 (restul). Vertical: HEVC -> H.264.
const SOURCES: Array<{ file: string; type: string; media?: string }> = [
  { file: "hero-mobile.hevc.mp4", type: 'video/mp4; codecs="hvc1.1.6.L120.90"', media: PORTRAIT },
  { file: "hero-mobile.h264.mp4", type: 'video/mp4; codecs="avc1.640028"', media: PORTRAIT },
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
const VIDEO_TAG = `<video class="hero-video" autoplay muted loop playsinline preload="auto" disablepictureinpicture disableremoteplayback aria-hidden="true" onplaying="this.setAttribute('data-ready','')">`;
const SOURCE_TAGS = SOURCES.map(
  (source) =>
    `<source src="${url(source.file)}" type="${attr(source.type)}"${source.media ? ` media="${attr(source.media)}"` : ""}>`
).join("");
// În HTML-ul serverului video-ul are toate sursele și browserul o alege singur. Când apare din JavaScript (navigare
// între pagini) pornește fără surse și îi dăm noi fișierul. Obiectul trebuie să fie mereu același: la un obiect nou
// React rescrie innerHTML la fiecare randare, iar video-ul ar fi recreat.
const VIDEO_INNER_HTML = { __html: `${VIDEO_TAG}${typeof window === "undefined" ? SOURCE_TAGS : ""}</video>` };

// Fișierul potrivit pentru ecran, după aceleași reguli ca atributele `media` de mai sus
function pickSource(video: HTMLVideoElement) {
  const source = SOURCES.find(
    (candidate) => (!candidate.media || window.matchMedia(candidate.media).matches) && video.canPlayType(candidate.type) !== ""
  );
  return source && new URL(url(source.file), window.location.href).href;
}

export default function HeroVideo() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Coperta (primul cadru) e preîncărcată cu prioritate maximă, separat pentru ecran vertical și orizontal
  const common = { alt: "", fill: true, preload: true, fetchPriority: "high", sizes: "100vw" } as const;
  const { props: desktopPoster } = getImageProps({ ...common, src: "/assets/v2/hero-poster.jpg" });
  const { props: mobilePoster } = getImageProps({ ...common, src: "/assets/v2/hero-poster-mobile.jpg" });
  for (const [poster, media] of [
    [mobilePoster, PORTRAIT],
    [desktopPoster, "(orientation: landscape)"],
  ] as const) {
    preload(poster.src, { as: "image", fetchPriority: "high", media, imageSrcSet: poster.srcSet || undefined, imageSizes: "100vw" });
  }

  // useLayoutEffect: video-ul primește fișierul înainte ca pagina să fie afișată
  useLayoutEffect(() => {
    const video = containerRef.current?.querySelector("video");
    if (!video) return;
    const expected = pickSource(video);
    if (expected && video.currentSrc !== expected) video.src = expected;
    const markReady = () => video.setAttribute("data-ready", "");
    if (!video.paused && video.readyState >= 3) markReady();
    video.addEventListener("playing", markReady);
    // Dacă autoplay-ul a fost amânat până la JavaScript (unele browsere), îl pornim acum
    video.play().catch(() => {});
    return () => video.removeEventListener("playing", markReady);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden bg-black">
      <picture>
        <source media={PORTRAIT} srcSet={mobilePoster.srcSet || mobilePoster.src} sizes="100vw" />
        {/* eslint-disable-next-line jsx-a11y/alt-text -- alt-ul vine din desktopPoster (decorativ, gol) */}
        <img {...desktopPoster} className="object-cover" />
      </picture>
      <div ref={containerRef} className="absolute inset-0" dangerouslySetInnerHTML={VIDEO_INNER_HTML} suppressHydrationWarning />
    </div>
  );
}
