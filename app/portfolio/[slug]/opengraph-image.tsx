import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { translations } from "@/contexts/translations";
import { BASE_PATH } from "@/lib/base-path";
import { CATEGORY_KEYS, getProjectBySlug, isYouTube, PROJECTS, splitTitle, type Project } from "@/lib/projects";

// Imaginea din previzualizarea linkului unui proiect (WhatsApp, Instagram, iMessage, e-mail): 1200x630, cu coperta
// proiectului și titlul. O copertă orizontală umple tot cadrul; una verticală (reel-urile) stă întreagă în stânga,
// ca să nu-i taie nimic din fețe sau din produs.

export const alt = "Zoomout_crew - video production project";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return PROJECTS.map((project) => ({ slug: project.slug }));
}

const INK = "#0a0a0b";
const PAPER = "#f2eee6";
const DIM = "#a6a29a";
const REC = "#ff4a2b";

interface Cover {
  src: string;
  landscape: boolean;
}

// Lățimea și înălțimea unui PNG sau JPEG, din antetul fișierului
function imageSize(data: Buffer): { width: number; height: number } | null {
  if (data.length > 24 && data.readUInt32BE(0) === 0x89504e47) return { width: data.readUInt32BE(16), height: data.readUInt32BE(20) };
  if (data[0] !== 0xff || data[1] !== 0xd8) return null;
  let offset = 2;
  while (offset + 9 < data.length && data[offset] === 0xff) {
    const marker = data[offset + 1];
    if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
      return { height: data.readUInt16BE(offset + 5), width: data.readUInt16BE(offset + 7) };
    }
    offset += 2 + data.readUInt16BE(offset + 2);
  }
  return null;
}

// O poză din public/ (calea din date are deja /2 în față), ca data URL. Doar PNG și JPEG se pot desena; formatul se
// citește din fișier, nu din extensie (o poză poate fi, de exemplu, AVIF salvată ca .jpeg), restul rămâne afară
async function localCover(path: string): Promise<Cover | null> {
  const file = BASE_PATH && path.startsWith(BASE_PATH) ? path.slice(BASE_PATH.length) : path;
  try {
    const data = await readFile(join(process.cwd(), "public", file));
    const png = data.length > 24 && data.readUInt32BE(0) === 0x89504e47;
    const jpeg = data[0] === 0xff && data[1] === 0xd8;
    if (!png && !jpeg) return null;
    const dimensions = imageSize(data);
    return {
      src: `data:${png ? "image/png" : "image/jpeg"};base64,${data.toString("base64")}`,
      landscape: dimensions ? dimensions.width > dimensions.height : false,
    };
  } catch {
    return null;
  }
}

// Aceeași copertă ca pe card: thumbnail-ul oficial (videoclipurile de pe YouTube), coperta aleasă sau cadrul de la Mux
async function shareCover(project: Project): Promise<Cover | null> {
  const video = project.videos?.[0];
  if (video && isYouTube(video)) return { src: `https://i.ytimg.com/vi/${video.youtubeId}/maxresdefault.jpg`, landscape: true };
  if (project.cover?.startsWith("https://")) return { src: project.cover, landscape: true };
  const local = project.cover ?? (video ? undefined : project.images?.[0]);
  if (local) {
    const cover = await localCover(local);
    if (cover) return cover;
  }
  if (!video) return null;
  return video.landscape
    ? { src: `https://image.mux.com/${video.playbackId}/thumbnail.jpg?width=1200&time=${video.thumbTime}`, landscape: true }
    : { src: `https://image.mux.com/${video.playbackId}/thumbnail.jpg?width=708&time=${video.thumbTime}`, landscape: false };
}

// Inter Tight, fontul titlurilor de pe site, doar cu literele folosite (cu diacritice); fără rețea rămâne fontul implicit
async function interTight(weight: number, text: string): Promise<ArrayBuffer | null> {
  try {
    const css = await (
      await fetch(`https://fonts.googleapis.com/css2?family=Inter+Tight:wght@${weight}&text=${encodeURIComponent(text)}`)
    ).text();
    const url = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1];
    if (!url) return null;
    const response = await fetch(url);
    return response.ok ? await response.arrayBuffer() : null;
  } catch {
    return null;
  }
}

export default async function ProjectShareImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  const en = translations.en;
  const { name, subtitle } = splitTitle(project ? en[`${project.key}.title`] : "Zoomout_crew");
  const categories = project ? project.categories.map((category) => en[CATEGORY_KEYS[category]]).join(" · ").toUpperCase() : "";
  const brand = "ZOOMOUT_CREW · PORTFOLIO";
  const cover = project ? await shareCover(project) : null;

  const letters = `${name}${subtitle}${categories}${brand}`;
  const [bold, regular] = await Promise.all([interTight(600, letters), interTight(400, letters)]);
  const fonts = [
    ...(bold ? [{ name: "Inter Tight", data: bold, weight: 600 as const, style: "normal" as const }] : []),
    ...(regular ? [{ name: "Inter Tight", data: regular, weight: 400 as const, style: "normal" as const }] : []),
  ];
  const titleSize = name.length > 22 ? 58 : name.length > 14 ? 74 : 92;

  const text = (
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1, height: "100%", padding: "58px 64px" }}>
      <div style={{ display: "flex", alignItems: "center", fontSize: 21, letterSpacing: 5, color: DIM }}>
        <div style={{ width: 12, height: 12, borderRadius: 6, background: REC, marginRight: 16 }} />
        {brand}
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: titleSize, fontWeight: 600, lineHeight: 1.02, letterSpacing: -2, color: PAPER }}>{name}</div>
        {subtitle ? <div style={{ fontSize: 34, lineHeight: 1.25, marginTop: 22, color: "#d2cdc4" }}>{subtitle}</div> : null}
      </div>
      <div style={{ display: "flex", fontSize: 19, letterSpacing: 4, color: DIM }}>{categories}</div>
    </div>
  );

  return new ImageResponse(
    cover?.landscape ? (
      <div style={{ display: "flex", position: "relative", width: "100%", height: "100%", background: INK, fontFamily: "Inter Tight" }}>
        <img src={cover.src} alt="" width={1200} height={630} style={{ position: "absolute", top: 0, left: 0, width: 1200, height: 630, objectFit: "cover" }} />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 1200,
            height: 630,
            backgroundImage: "linear-gradient(90deg, rgba(10,10,11,0.95) 0%, rgba(10,10,11,0.82) 42%, rgba(10,10,11,0.2) 100%)",
          }}
        />
        <div style={{ display: "flex", position: "relative", width: 780, height: "100%" }}>{text}</div>
      </div>
    ) : (
      <div style={{ display: "flex", width: "100%", height: "100%", background: INK, fontFamily: "Inter Tight" }}>
        {cover ? (
          <img src={cover.src} alt="" width={354} height={630} style={{ width: 354, height: 630, objectFit: "cover" }} />
        ) : (
          <div style={{ display: "flex", width: 14, height: "100%", background: REC }} />
        )}
        {text}
      </div>
    ),
    { ...size, fonts: fonts.length ? fonts : undefined }
  );
}
