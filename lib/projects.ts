import { withBasePath } from "@/lib/base-path";

// Proiectele din portofoliu - folosite pe homepage (Selected work), în pagina Portfolio și la Services (Related work).
// Titlurile și descrierile sunt în LanguageContext, la cheile `${key}.title` / `${key}.description`.

export type ProjectCategory = "commercial" | "events" | "real-estate" | "music-videos";

// Video găzduit pe Mux
export interface MuxVideo {
  playbackId: string;
  thumbTime: number; // secunda din video folosită ca imagine de copertă
  landscape?: boolean; // video 16:9 (restul sunt verticale, 9:16)
}

// Video de pe YouTube (videoclipurile publicate pe canalele artiștilor)
export interface YouTubeVideo {
  youtubeId: string;
  landscape?: boolean;
}

export type ProjectVideo = MuxVideo | YouTubeVideo;

export interface Project {
  id: number;
  key: string;
  categories: ProjectCategory[];
  logo?: string; // afișat când proiectul n-are video sau poze
  videos?: ProjectVideo[];
  images?: string[];
  featured?: boolean; // apare în "Selected work" pe homepage
}

export const PROJECTS: Project[] = [
  {
    id: 10,
    key: "portfolio.project10", // wild west tour
    categories: ["events"],
    logo: withBasePath("/assets/brands/wildwest.webp"),
  },
  {
    id: 11,
    key: "portfolio.project11", // lepas
    categories: ["events", "commercial"],
    logo: withBasePath("/assets/brands/lepas.png"),
  },
  {
    id: 12,
    key: "portfolio.project12", // bacademia
    categories: ["commercial"],
    logo: withBasePath("/assets/brands/bacademia.png"),
  },
  {
    id: 13,
    key: "portfolio.project13", // one society
    categories: ["commercial"],
    logo: withBasePath("/assets/brands/onesociety.png"),
  },
  {
    id: 14,
    key: "portfolio.project14", // welovepng
    categories: ["commercial"],
    logo: withBasePath("/assets/brands/welovepng.png"),
  },
  {
    id: 15,
    key: "portfolio.project15", // mara feat. lurre - haide, hai!
    categories: ["music-videos"],
    videos: [{ youtubeId: "FMYPoF7MZXA", landscape: true }],
  },
  {
    id: 16,
    key: "portfolio.project16", // cj's - efort
    categories: ["music-videos"],
    videos: [{ youtubeId: "pA2Szfcner0", landscape: true }],
  },
  {
    id: 1,
    key: "portfolio.project5", // casa numaa
    categories: ["commercial"],
    logo: withBasePath("/assets/brands/casanumaa.png"),
    videos: [
      { playbackId: "BaZoibIrmiaFjm1oPbGIWlhQAZrZHCV9NcIMW4HQN014", thumbTime: 1 },
      { playbackId: "mUlM3T9v62Udt6bf02520200cihk49QMbiSc7zYCQDvldk", thumbTime: 9 },
    ],
    featured: true,
  },
  {
    id: 2,
    key: "portfolio.project1", // big belly
    categories: ["events", "commercial"],
    logo: withBasePath("/assets/brands/bigbelly.png"),
    videos: [
      { playbackId: "p1LpNG3CjEe01QQhHDOPG3j5L8kywtmmLSKdJaU51Tjg", thumbTime: 9 },
      { playbackId: "DbdlbHpdu541nz100c9oOc700DsUnduPJ6EkEmNIFCzOo", thumbTime: 12 },
    ],
    featured: true,
  },
  {
    id: 3,
    key: "portfolio.project9", // panoramic360
    categories: ["commercial"],
    logo: withBasePath("/assets/brands/panoramic360.jpg"),
    videos: [{ playbackId: "iQW9j3rKkGubagCrFEPgfWxQtpnzW5PFdTWw00SpAliA", thumbTime: 3 }],
    featured: true,
  },
  {
    id: 4,
    key: "portfolio.project2", // multiverse
    categories: ["events"],
    logo: withBasePath("/assets/brands/multiverse.png"),
    videos: [{ playbackId: "Xi5sUxm00g8N5UJGPn7D9Mut4JsMfUFULA01Qn02woUOwo", thumbTime: 9 }],
    featured: true,
  },
  {
    id: 5,
    key: "portfolio.project3", // remote tiny house (cabanuta)
    categories: ["real-estate"],
    logo: withBasePath("/assets/brands/cabanuta.png"),
    videos: [{ playbackId: "ILANTrld964hQ4OanXs6lq02kqN01q745BRJGgfqPy7Kk", thumbTime: 6 }],
    featured: true,
  },
  {
    id: 6,
    key: "portfolio.project6", // utopic
    categories: ["events"],
    logo: withBasePath("/assets/brands/utopic.png"),
    videos: [{ playbackId: "CY6gQczar8Ompqq02jXDHskFOwuuB1W8yng5ZOtXTq800", thumbTime: 18, landscape: true }],
    featured: true,
  },
  {
    id: 7,
    key: "portfolio.project8", // rotaract
    categories: ["events"],
    logo: withBasePath("/assets/brands/rotaract.png"),
    images: [withBasePath("/assets/photos/ratuste1.png"), withBasePath("/assets/photos/ratuste2.png"), withBasePath("/assets/photos/ratuste3.png")],
    featured: true,
  },
  {
    id: 8,
    key: "portfolio.project7", // la villa sunhouse
    categories: ["real-estate"],
    logo: withBasePath("/assets/photos/sardinia1.jpeg"),
    images: [withBasePath("/assets/photos/sardinia1.jpeg"), withBasePath("/assets/photos/sardinia2.jpeg")],
  },
  {
    id: 9,
    key: "portfolio.project4", // outdoor lounge (aer lounge)
    categories: ["commercial"],
    logo: withBasePath("/assets/brands/aerlounge.png"),
    videos: [{ playbackId: "c5jDLrljSoSJid7Du9P9XQb37yzRRrIKqFHYzqpKG8c", thumbTime: 12 }],
    featured: true,
  },
];

export const getProject = (id: number) => PROJECTS.find((p) => p.id === id);

// "Casa Numaa - Fine Dining Restaurant" -> { name: "Casa Numaa", subtitle: "Fine Dining Restaurant" }
export function splitTitle(title: string): { name: string; subtitle: string } {
  const [name, ...rest] = title.split(" - ");
  return { name: name.trim(), subtitle: rest.join(" - ").trim() };
}

// ---------------- Mux helpers ----------------

export function muxThumb(
  playbackId: string,
  { time = 2, width = 640, height, smartcrop = false }: { time?: number; width?: number; height?: number; smartcrop?: boolean } = {}
) {
  const size = height ? `width=${width}&height=${height}` : `width=${width}`;
  const fit = smartcrop ? "&fit_mode=smartcrop" : "";
  return `https://image.mux.com/${playbackId}/thumbnail.webp?${size}${fit}&time=${time}`;
}

// Previzualizare animată (se încarcă doar la hover)
export function muxPreview(playbackId: string, start: number, width = 360) {
  return `https://image.mux.com/${playbackId}/animated.webp?width=${width}&start=${start}&end=${start + 4}&fps=14`;
}

export function muxPlayer(playbackId: string) {
  return `https://player.mux.com/${playbackId}?autoplay=true&accent-color=%23ff4a2b`;
}

export const isYouTube = (video: ProjectVideo): video is YouTubeVideo => "youtubeId" in video;

export const videoId = (video: ProjectVideo) => (isYouTube(video) ? video.youtubeId : video.playbackId);

// Playerul din fereastra proiectului (youtube-nocookie nu pune cookie-uri până la redare)
export function videoPlayer(video: ProjectVideo) {
  return isYouTube(video)
    ? `https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0&playsinline=1`
    : muxPlayer(video.playbackId);
}

// Imaginea de copertă a unui proiect (pentru carduri verticale)
export function projectCover(project: Project, width = 640): string | null {
  const video = project.videos?.[0];
  if (video && isYouTube(video)) return `https://i.ytimg.com/vi/${video.youtubeId}/maxresdefault.jpg`;
  if (video) {
    return video.landscape
      ? muxThumb(video.playbackId, { time: video.thumbTime, width, height: Math.round((width * 16) / 9), smartcrop: true })
      : muxThumb(video.playbackId, { time: video.thumbTime, width });
  }
  return project.images?.[0] ?? null;
}
