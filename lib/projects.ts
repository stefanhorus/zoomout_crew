import { withBasePath } from "@/lib/base-path";

// Proiectele din portofoliu - folosite pe homepage (Selected work), în pagina Portfolio și la Services (Related work).
// Titlurile și descrierile sunt în LanguageContext, la cheile `${key}.title` / `${key}.description`.

export type ProjectCategory = "commercial" | "events" | "real-estate" | "music-videos";

// Video găzduit pe Mux
export interface MuxVideo {
  playbackId: string;
  thumbTime: number; // secunda din video folosită ca imagine de copertă
  previewStart?: number; // de unde pornește animația de 4 s de la hover, dacă nu de la copertă (thumbTime)
  landscape?: boolean; // video 16:9 (restul sunt verticale, 9:16)
  // Bucla verticală de 4 s de la hover pentru clipurile orizontale (public/assets/v2/previews/<preview>.mp4),
  // făcută cu scripts/encode-hover-preview.sh; fără ea, cardul folosește animația de la Mux (muxPreview)
  preview?: string;
}

// Video de pe YouTube (videoclipurile publicate pe canalele artiștilor)
export interface YouTubeVideo {
  youtubeId: string;
  landscape?: boolean;
  preview?: string; // bucla de hover, ca la MuxVideo (YouTube nu oferă altă previzualizare animată)
}

export type ProjectVideo = MuxVideo | YouTubeVideo;

// Cheile textelor pentru numele categoriilor (contexts/translations.ts)
export const CATEGORY_KEYS: Record<ProjectCategory, string> = {
  commercial: "portfolio.commercial",
  events: "portfolio.events",
  "real-estate": "portfolio.realEstate",
  "music-videos": "portfolio.musicVideos",
};

export interface Project {
  id: number;
  // adresa paginii proiectului: /portfolio/<slug>, fără diacritice; n-o mai schimba după ce linkul a fost trimis cuiva
  slug: string;
  key: string;
  categories: ProjectCategory[];
  logo?: string; // afișat când proiectul n-are video sau poze
  // logo alb, pe transparent, afișat peste coperta blurată până la hover (doar proiectele care nu sunt videoclipuri
  // muzicale); se face din logo-ul clientului cu scripts/make-white-logo.sh
  overlayLogo?: string;
  cover?: string; // copertă aleasă (ex. thumbnail-ul oficial); altfel cadrul thumbTime din primul video sau prima poză
  videos?: ProjectVideo[];
  images?: string[]; // pozele; la un proiect cu clipuri apar după ele, în același player cu săgeți
  // forma ramei pozelor (lățime / înălțime, ex. "3 / 4"); implicit "9 / 16", ca la clipurile verticale. Pozele umplu rama
  // și se taie ce iese din ea, așa că pune forma celei mai înguste poze
  imageAspect?: string;
  featured?: boolean; // apare în „Stories we've filmed” pe homepage (proiectele alese de user), în ordinea din PROJECTS
  // ascuns cât nu e gata: lipsește din Portfolio, de pe homepage, din Related work și din sitemap, iar pagina lui dă
  // 404. Ca să-l readuci, șterge rândul `hidden: true`.
  hidden?: boolean;
}

const ALL_PROJECTS: Project[] = [
  {
    id: 10,
    slug: "wild-west-tour",
    key: "portfolio.project10", // wild west tour (al treilea cont Mux; exporturile verticale ale userului, din 2026-11-12)
    categories: ["events"],
    logo: withBasePath("/assets/brands/wildwest.webp"),
    overlayLogo: withBasePath("/assets/brands/white/wildwest.png"),
    // ordinea aleasă de user (2026-11-13): reclama ADD1WWT în locul recap-ului („pune asta în loc de recap”), ziua la
    // Lake Powell (dtn11), apoi ziua pe Route 66 și interviul din Las Vegas. Recap-ul a fost șters din Mux ca să facă loc
    // (originalul, RECAPdone.mp4, e în Downloads și pe HoruSSD)
    videos: [
      // ADD1WWT (1:00), reclama turului („This is not your average…”): Route 66, Grand Canyon, Lake Powell, Los Angeles,
      // San Francisco, Las Vegas. Coperta: fata așezată pe o stâncă deasupra Marelui Canion (20.6). Hover-ul pornește de
      // la începutul aceluiași cadru (20.45-24.45): stânca, fata cu steagul la canion, barca de pe Lake Powell, apoi
      // barca văzută de sus. La Mux, de la 20.3 animația încă începe cu cadrul de dinainte
      { playbackId: "wWoCsPFS4TSMo2mIHUysopdvf6o01H4gheVYOAFtsRgI", thumbTime: 20.6, previewStart: 20.45 },
      // dtn11 (0:23), o zi la Lake Powell, Utah: plaja, barca, colacul tras de barcă, jet-ski-ul. Coperta: colacul roșu
      // cu picioarele tuturor în aer și platoul din spate (16.4; la Mux, de la 16.7 e alt cadru, mai de departe). Hover-ul
      // de la 16.3 contează doar dacă ajunge primul
      { playbackId: "Xb89m2FREX82JIVZbmfawi4z1IWpmop3PtXwWUbO01O4", thumbTime: 16.4, previewStart: 16.3 },
      // o zi pe Route 66 (0:19): coperta e fata de la zidul pictat „Historic 66” (13.2); hover-ul de la începutul
      // aceluiași cadru (12.75-16.75) contează doar dacă ajunge iar primul
      { playbackId: "3T01OoFptVaXNzCVhTtyEEy2L73PtoEPdLd8gMs2TcGg", thumbTime: 13.2, previewStart: 12.75 },
      // interviurile cu subtitrare de pe o terasă din Las Vegas, noaptea (1:10). Coperta: gazda și băiatul în bluză
      // verde-deschis care râde, cu subtitrarea „People love it!” (35.75; la Mux, la 35.65 subtitrarea încă lipsește).
      // Hover-ul, de la începutul aceluiași cadru (34.3), contează doar dacă interviul ajunge primul
      { playbackId: "YWP01aPr3hyTIOBQxa2Lhn92d9q27L7JW700H4MSZWfQw", thumbTime: 35.75, previewStart: 34.3 },
    ],
    // ascuns între 2026-11-11 și 2026-11-12, cât nu avea clipuri; userul l-a pus pe site după ce a văzut logo-ul curățat
  },
  {
    id: 11,
    slug: "lepas",
    key: "portfolio.project11", // lepas (al treilea cont Mux; clipurile sunt luate de pe Instagram, @lepasromania, în 720p)
    categories: ["events", "commercial"],
    logo: withBasePath("/assets/brands/lepas.png"),
    overlayLogo: withBasePath("/assets/brands/white/lepas.png"),
    videos: [
      // drona peste Sun Garden, mașina și reacțiile de la volan; coperta e SUV-ul verde la intrarea în Sun Garden (10.3),
      // iar hover-ul pornește cu 1,5 secunde înainte, de la roată (8.8-12.8)
      { playbackId: "TwSR24ylP02D2THBM6voq778HIU00lG2vaaHmfCKNgGN8", thumbTime: 10.3, previewStart: 8.8 },
      // reacțiile celor care au testat mașina
      { playbackId: "Ftj1HA1CPZTAWpgyosyKhVlfyT00dMKikFFE8NCz3khE", thumbTime: 24 },
    ],
    featured: true,
  },
  {
    id: 12,
    slug: "bacademia",
    key: "portfolio.project12", // bacademia (al treilea cont Mux; exporturile verticale ale userului, din 2026-11-10)
    categories: ["commercial"],
    logo: withBasePath("/assets/brands/bacademia.png"),
    overlayLogo: withBasePath("/assets/brands/white/bacademia.png"),
    // ordinea aleasă de user: challenge, UGC de lansare, talking head, sketch
    videos: [
      // challenge pe stradă, în Piața Unirii din Cluj: coperta e cadrul în care zâmbesc amândouă, cu biserica în spate
      // (2.67), iar hover-ul pornește cu 1,5 secunde înainte (1.2-5.2), tot în primul cadru
      { playbackId: "QKlqfMnSQMlbOEwZtqWVrhirabVt101Z9t02W9s025voAE", thumbTime: 2.67, previewStart: 1.2 },
      // UGC-ul de lansare (ca prim clip: fata cu culegerile de Română și Matematică în fața bisericii la 5.0, hover de la 3.5)
      { playbackId: "aimP8x2Iw2nziJOarXzgwZ6TOJ9GAx1G2Ra22Ce2CBw", thumbTime: 5, previewStart: 3.5 },
      // talking head cu ilustrații (Bacademia Ro #1)
      { playbackId: "npXvUkcJs5CwZO3a01kL00BTLh5xQoPAS4tEqWCgXNAds", thumbTime: 16.6 },
      // sketch: „Baltagul dacă era reality show”, partea 1
      { playbackId: "gwbA8R2XrwLGAHtaBATRpXnv3LuERh01LbZcuvCVsqiY", thumbTime: 1.5 },
    ],
  },
  {
    id: 13,
    slug: "one-society",
    key: "portfolio.project13", // one society (al doilea cont Mux; cele două reel-uri sunt luate de pe Instagram, în 720p)
    categories: ["commercial"],
    logo: withBasePath("/assets/brands/onesociety.png"),
    overlayLogo: withBasePath("/assets/brands/white/onesociety.png"),
    // Lime bike la 0:16.5, decupat pe mijloc: hanoracul One Society cu Tower Bridge în spate
    cover: withBasePath("/assets/photos/onesociety-limebike.jpg"),
    videos: [
      { playbackId: "t202Ew4ykBTdRUCOOWbEn801eJDKhj9NJDNUs00HpbjXD00", thumbTime: 16, landscape: true, preview: "onesociety-limebike" }, // Lime bike
      { playbackId: "wQlXWsZMu02MfBrxZyimdpL6KJvWcE2uXwBhOLrmbB00A", thumbTime: 11, landscape: true }, // Londra noaptea
      { playbackId: "ucb142bFWhqBt00MAwmxpgzlsNgcGRtO9DszKaFJ8euU", thumbTime: 4, landscape: true }, // pista de atletism
    ],
  },
  {
    id: 14,
    slug: "welovepng",
    key: "portfolio.project14", // welovepng (clipul e în al doilea cont Mux, cel din .env.local)
    categories: ["commercial"],
    logo: withBasePath("/assets/brands/welovepng.png"),
    overlayLogo: withBasePath("/assets/brands/white/welovepng.png"),
    videos: [{ playbackId: "Kq4qczREZagy4ZMILNX5BFwXeBrb2koFITr65SYQcpw", thumbTime: 20.9, landscape: true, preview: "welovepng-promo" }],
    featured: true,
  },
  {
    id: 15,
    slug: "haide-hai",
    key: "portfolio.project15", // mara feat. lurre - haide, hai! (clipul e în al doilea cont Mux)
    categories: ["music-videos"],
    cover: "https://i.ytimg.com/vi/FMYPoF7MZXA/maxresdefault.jpg", // thumbnail-ul oficial de pe YouTube
    videos: [{ playbackId: "M00nUAy00JC01Ro02R0001QtelvwyWrqT9Y01K4AwlFN9USKVQ", thumbTime: 106, landscape: true, preview: "haide-hai" }],
    featured: true,
  },
  {
    id: 16,
    slug: "cjs-efort",
    key: "portfolio.project16", // cj's - efort
    categories: ["music-videos"],
    // Cadrul de la 0:13 din short-ul vertical al piesei (pe acoperiș, în hanoracul albastru); thumbnail-ul de pe
    // YouTube are titlul scris mare, care în cardul vertical apărea tăiat
    cover: withBasePath("/assets/photos/cjs-efort.jpg"),
    // bucla de hover: scena de pe acoperiș din short (0:12.05-0:15.83), între două tranziții
    videos: [{ youtubeId: "pA2Szfcner0", landscape: true, preview: "cjs-efort" }],
  },
  {
    id: 17,
    slug: "rone-damasc-adevar",
    key: "portfolio.project17", // rone damasc - adevăr
    categories: ["music-videos"],
    // Cadrul de la 0:55 din clipul 4K de pe YouTube, decupat pe mijloc: legat de scaun, cu banderola pe ochi
    cover: withBasePath("/assets/photos/rone-damasc-adevar.jpg"),
    // bucla de hover: 0:54.0-0:57.9 din 4K (scaunul, cadrul larg, prim-planul cu banderola), fără imagini de arhivă
    videos: [{ youtubeId: "w64x8lvIiP8", landscape: true, preview: "rone-damasc-adevar" }],
  },
  {
    id: 18,
    slug: "transylvania-sunset",
    key: "portfolio.project18", // nico ramírez - transylvania sunset (set-ul întreg, în al doilea cont Mux)
    categories: ["music-videos", "events"],
    // Cadrul de la 0:20 decupat pe mijloc: decupajul automat Mux alegea difuzorul din stânga, fără DJ
    cover: withBasePath("/assets/photos/nico-transylvania-sunset.jpg"),
    videos: [{ playbackId: "eXh14zrJ3KDI3neux2RFOT021Sg3XkpxBISF2JBblsmk", thumbTime: 20, landscape: true, preview: "nico-transylvania-sunset" }],
    featured: true,
  },
  {
    id: 19,
    slug: "geosanu-prrizzaa",
    key: "portfolio.project19", // geo$anu - prrizzaa (clipul e în al doilea cont Mux)
    categories: ["music-videos"],
    cover: withBasePath("/assets/photos/geosanu-prrizzaa.jpg"), // thumbnail-ul oficial al piesei
    videos: [{ playbackId: "hpB027Kl8fPmSbVKoMSMw7u01qfilw1xxJNr1WPwPyt02M", thumbTime: 148, landscape: true, preview: "geosanu-prrizzaa" }],
    featured: true,
  },
  {
    id: 20,
    slug: "ministry-of-sound",
    key: "portfolio.project20", // barbaro x risqué la ministry of sound, londra (al doilea cont Mux, care e plin: 10 din 10)
    categories: ["events", "music-videos"],
    videos: [
      // reel-ul serii; coperta și hover-ul pornesc de la DJ-ul cu șapca NY la pult (urmează publicul și dansatoarea)
      { playbackId: "ye3gKVLY2eF9k8wYm58kSLvTbuIWC3RUvmo53wsBX9U", thumbTime: 28.6 },
      // reel-ul cu Nico Ramírez, de la sosire până la pult
      { playbackId: "YsVxnZ8JSmK8PpSHmJR5UWPz6wXi00umNRIoWcjXeRJs", thumbTime: 44.5 },
      // set-ul complet al lui Nico Ramírez (56 min, din 4K convertit la 1080p)
      { playbackId: "aLHaNy87sJC4uStU1JaKt7QdQeh8RUv8aQJTYU0223KM", thumbTime: 500, landscape: true },
    ],
    // pozele de după clipuri, în ordinea cerută de user (2026-11-13): două din ~/Desktop/Barbaro (DSC05947, DSC05950;
    // originale 4672x7008, adică 2:3) și prima poză din caruselul @barbaro_ldn (instagram.com/p/DcO6QKiiFGv, 3072x4096).
    // Rama e 3:4, ca poza din carusel; la cele 2:3 se taie câte ~5% sus și jos
    images: [
      withBasePath("/assets/photos/barbaro-dj-neon.jpg"), // DJ-ul la pult, sub neonul roșu BARBARO
      withBasePath("/assets/photos/barbaro-risque-neon.jpg"), // neonurile RISQUÉ, fața cu pălărie și BARBARO deasupra pultului
      withBasePath("/assets/photos/barbaro-risque-crowd.jpg"), // RISQUÉ și fața cu pălărie, cu publicul în față
    ],
    imageAspect: "3 / 4",
    featured: true,
  },
  {
    id: 1,
    slug: "casa-numaa",
    key: "portfolio.project5", // casa numaa
    categories: ["commercial"],
    logo: withBasePath("/assets/brands/casanumaa.png"),
    overlayLogo: withBasePath("/assets/brands/white/casanumaa.png"),
    videos: [
      { playbackId: "BaZoibIrmiaFjm1oPbGIWlhQAZrZHCV9NcIMW4HQN014", thumbTime: 1 },
      { playbackId: "mUlM3T9v62Udt6bf02520200cihk49QMbiSc7zYCQDvldk", thumbTime: 9 },
    ],
  },
  {
    id: 2,
    slug: "big-belly",
    key: "portfolio.project1", // big belly
    categories: ["events", "commercial"],
    logo: withBasePath("/assets/brands/bigbelly.png"),
    overlayLogo: withBasePath("/assets/brands/white/bigbelly.png"),
    videos: [
      { playbackId: "p1LpNG3CjEe01QQhHDOPG3j5L8kywtmmLSKdJaU51Tjg", thumbTime: 9 },
      { playbackId: "DbdlbHpdu541nz100c9oOc700DsUnduPJ6EkEmNIFCzOo", thumbTime: 12 },
    ],
    featured: true,
  },
  {
    id: 3,
    slug: "panoramic-360",
    key: "portfolio.project9", // panoramic360
    categories: ["events", "commercial"],
    logo: withBasePath("/assets/brands/panoramic360.jpg"),
    overlayLogo: withBasePath("/assets/brands/white/panoramic360.png"),
    videos: [{ playbackId: "iQW9j3rKkGubagCrFEPgfWxQtpnzW5PFdTWw00SpAliA", thumbTime: 3 }],
    featured: true,
  },
  {
    id: 4,
    slug: "multiverse",
    key: "portfolio.project2", // multiverse
    categories: ["events"],
    logo: withBasePath("/assets/brands/multiverse.png"),
    overlayLogo: withBasePath("/assets/brands/white/multiverse.png"),
    videos: [{ playbackId: "Xi5sUxm00g8N5UJGPn7D9Mut4JsMfUFULA01Qn02woUOwo", thumbTime: 9 }],
  },
  {
    id: 6,
    slug: "utopic",
    key: "portfolio.project6", // utopic
    categories: ["events"],
    logo: withBasePath("/assets/brands/utopic.png"),
    overlayLogo: withBasePath("/assets/brands/white/utopic.png"),
    // Pe Mux clipul are doar 638x360, așa că și bucla de hover e limitată la claritatea asta
    videos: [{ playbackId: "CY6gQczar8Ompqq02jXDHskFOwuuB1W8yng5ZOtXTq800", thumbTime: 18, landscape: true, preview: "utopic" }],
  },
  {
    id: 7,
    slug: "rotaract",
    key: "portfolio.project8", // rotaract
    categories: ["events"],
    logo: withBasePath("/assets/brands/rotaract.png"),
    overlayLogo: withBasePath("/assets/brands/white/rotaract.png"),
    images: [withBasePath("/assets/photos/ratuste1.png"), withBasePath("/assets/photos/ratuste2.png"), withBasePath("/assets/photos/ratuste3.png")],
  },
];

// Proiectele de pe site, fără cele ascunse; tot site-ul le ia de aici
export const PROJECTS = ALL_PROJECTS.filter((project) => !project.hidden);

export const getProject = (id: number) => PROJECTS.find((p) => p.id === id);
export const getProjectBySlug = (slug: string) => PROJECTS.find((p) => p.slug === slug);

// ---------------- Pagina fiecărui proiect (/portfolio/<slug>) ----------------

export const SITE_URL = "https://zoomoutcrew.com";
export const projectPath = (project: Project) => `/portfolio/${project.slug}`;
// Linkul întreg, de trimis clienților (ex. https://zoomoutcrew.com/portfolio/lepas)
export const projectUrl = (project: Project) => `${SITE_URL}${withBasePath(projectPath(project))}`;

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

// Previzualizare animată (se încarcă doar la hover), pentru clipurile verticale. La cele orizontale Mux dă cel mult
// 640 px și nu decupează, așa că în cardul vertical ar rămâne vreo 114x202 pixeli reali: ele au bucla `preview`.
export function muxPreview(playbackId: string, start: number, width = 360) {
  return `https://image.mux.com/${playbackId}/animated.webp?width=${width}&start=${start}&end=${start + 4}&fps=14`;
}

// Bucla de hover găzduită pe site (HEVC, apoi H.264 pentru browserele fără HEVC). Crește PREVIEWS_VERSION când
// înlocuiești o buclă: mp4-urile stau un an în cache.
const PREVIEWS_VERSION = "1";
export const HEVC_TYPE = 'video/mp4; codecs="hvc1.1.6.L93.90"';

export function previewLoop(name: string) {
  const base = withBasePath(`/assets/v2/previews/${name}`);
  return { hevc: `${base}.hevc.mp4?v=${PREVIEWS_VERSION}`, h264: `${base}.mp4?v=${PREVIEWS_VERSION}` };
}

// Cu autoplay (fereastra deschisă la click) sau, pe pagina proiectului, oprit pe cadrul de copertă
export function muxPlayer(playbackId: string, { autoplay = true, thumbTime }: { autoplay?: boolean; thumbTime?: number } = {}) {
  const poster = thumbTime !== undefined ? `&thumbnail-time=${thumbTime}` : "";
  return `https://player.mux.com/${playbackId}?${autoplay ? "autoplay=true&" : ""}accent-color=%23ff4a2b${poster}`;
}

export const isYouTube = (video: ProjectVideo): video is YouTubeVideo => "youtubeId" in video;

export const videoId = (video: ProjectVideo) => (isYouTube(video) ? video.youtubeId : video.playbackId);

// Playerul din fereastra proiectului (youtube-nocookie nu pune cookie-uri până la redare)
export function videoPlayer(video: ProjectVideo, { autoplay = true }: { autoplay?: boolean } = {}) {
  return isYouTube(video)
    ? `https://www.youtube-nocookie.com/embed/${video.youtubeId}?${autoplay ? "autoplay=1&" : ""}rel=0&playsinline=1`
    : muxPlayer(video.playbackId, autoplay ? {} : { autoplay: false, thumbTime: video.thumbTime });
}

// Imaginea de copertă a unui proiect (pentru carduri verticale)
export function projectCover(project: Project, width = 640): string | null {
  if (project.cover) return project.cover;
  const video = project.videos?.[0];
  if (video && isYouTube(video)) return `https://i.ytimg.com/vi/${video.youtubeId}/maxresdefault.jpg`;
  if (video) {
    return video.landscape
      ? muxThumb(video.playbackId, { time: video.thumbTime, width, height: Math.round((width * 16) / 9), smartcrop: true })
      : muxThumb(video.playbackId, { time: video.thumbTime, width });
  }
  return project.images?.[0] ?? null;
}
