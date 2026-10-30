import { withBasePath } from "@/lib/base-path";

// Cadrele din /home2: fotograme reale din proiecte (Mux, la secunda aleasă), coperțile videoclipurilor de pe YouTube,
// fotografiile proiectelor și cadre din montajul cu drona și din filmul Life Is Pink (public/assets/v2/home2).
// Secundele de pe Mux sunt alese fără textele de pe ecran din reclame.

export interface Frame {
  // Adresa imaginii la lățimea cerută (doar Mux știe să o redimensioneze; restul ignoră lățimea)
  src: (width: number) => string;
  w: number;
  h: number;
  alt: string;
  project: string;
  remote?: boolean;
  // Apare și în banda de la 200 mm; restul cadrelor se văd abia când faci zoom out
  strip?: boolean;
  // Buclă video din mozaicul de pe prima pagină; fotografia cadrului e chiar coperta ei, ca trecerea să nu se vadă
  video?: string;
}

const muxFrame = (id: string, time: number, w: number, h: number) => ({
  src: (width: number) => `https://image.mux.com/${id}/thumbnail.webp?time=${time}&width=${Math.min(width, w)}`,
  w,
  h,
  remote: true,
});
const local = (file: string, w: number, h: number) => ({ src: () => withBasePath(`/assets/${file}`), w, h });
const youtube = (id: string) => ({ src: () => `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`, w: 1280, h: 720, remote: true });

const PANORAMIC = "iQW9j3rKkGubagCrFEPgfWxQtpnzW5PFdTWw00SpAliA";
const BIG_BELLY = "p1LpNG3CjEe01QQhHDOPG3j5L8kywtmmLSKdJaU51Tjg";
const BIG_BELLY_2 = "DbdlbHpdu541nz100c9oOc700DsUnduPJ6EkEmNIFCzOo";
const TINY_HOUSE = "ILANTrld964hQ4OanXs6lq02kqN01q745BRJGgfqPy7Kk";
const CASA_NUMAA = "BaZoibIrmiaFjm1oPbGIWlhQAZrZHCV9NcIMW4HQN014";
const MULTIVERSE = "Xi5sUxm00g8N5UJGPn7D9Mut4JsMfUFULA01Qn02woUOwo";
const OUTDOOR = "c5jDLrljSoSJid7Du9P9XQb37yzRRrIKqFHYzqpKG8c";
const UTOPIC = "CY6gQczar8Ompqq02jXDHskFOwuuB1W8yng5ZOtXTq800";

const vertical = (id: string, time: number) => muxFrame(id, time, 720, 1280);
const tall = (id: string, time: number) => muxFrame(id, time, 1080, 1920);

export const FRAMES = {
  panoramic: [
    { ...vertical(PANORAMIC, 9.6), alt: "A crowd dancing in the snow outside the Panoramic 360 hut", strip: true },
    { ...local("v2/tiles/panoramic-portrait.jpg", 360, 640), alt: "The Panoramic 360 hut and the ski slope from the drone", strip: true, video: "panoramic" },
    { ...vertical(PANORAMIC, 8.2), alt: "The DJ playing outside the hut in an orange jacket", strip: true },
    { ...vertical(PANORAMIC, 4.8), alt: "The DJ booth under the Panoramic Transilvania sign" },
    { ...vertical(PANORAMIC, 10.5), alt: "Skiers riding the chairlift above the pine trees" },
    { ...vertical(PANORAMIC, 11.3), alt: "A drink raised against the sunset over the mountains" },
    { ...vertical(PANORAMIC, 12.3), alt: "Two snowboarders talking on the slope" },
    { ...vertical(PANORAMIC, 13.5), alt: "A guest reading by the fireplace inside the hut" },
    { ...vertical(PANORAMIC, 15.3), alt: "A steak served at the restaurant" },
    { ...vertical(PANORAMIC, 6.5), alt: "The hut on the top of the slope, seen from the drone" },
  ],
  bigbelly: [
    { ...tall(BIG_BELLY, 16), alt: "Guests posing for a group photo outside Big Belly, seen from above", strip: true },
    { ...tall(BIG_BELLY, 1), alt: "The Big Belly storefront from above on opening day" },
    { ...tall(BIG_BELLY, 4), alt: "A crowd at the entrance of the new restaurant" },
    { ...tall(BIG_BELLY, 8), alt: "Guests eating at the tables inside Big Belly" },
    { ...tall(BIG_BELLY, 19), alt: "A tray of burgers on the counter", strip: true },
    { ...tall(BIG_BELLY, 13), alt: "A red lamp over the counter" },
    { ...tall(BIG_BELLY_2, 14), alt: "Friends at a table in the warm light of the restaurant" },
    { ...tall(BIG_BELLY_2, 15), alt: "A waiter carrying a tray of burgers" },
    { ...tall(BIG_BELLY_2, 17), alt: "A family dinner at a corner table" },
  ],
  tinyhouse: [
    { ...tall(TINY_HOUSE, 8), alt: "The red tiny house among the trees, seen from the drone", strip: true },
    { ...tall(TINY_HOUSE, 11), alt: "The bed by the window inside the cabin" },
    { ...tall(TINY_HOUSE, 10), alt: "The wooden kitchen of the cabin" },
    { ...tall(TINY_HOUSE, 19), alt: "A pond with lilies and pine trees" },
    { ...tall(TINY_HOUSE, 22), alt: "The deck facing the mountains at dusk", strip: true },
    { ...tall(TINY_HOUSE, 24), alt: "A man grilling outside the cabin" },
    { ...tall(TINY_HOUSE, 12.5), alt: "A hammock chair under the trees by the cabin" },
    { ...tall(TINY_HOUSE, 25), alt: "Flames on the grill at dusk" },
    { ...tall(TINY_HOUSE, 21.5), alt: "A drawing of the view on an easel by the window" },
  ],
  lifeispink: [
    { ...local("v2/tiles/lifeispink.jpg", 960, 540), alt: "Two people in the doorway of a van lined in pink fabric", strip: true, video: "lifeispink" },
    { ...local("v2/home2/pink-door.webp", 1600, 900), alt: "The pink van with its doors open, seen from the road" },
    { ...local("v2/home2/pink-pair.webp", 1600, 900), alt: "A person crouching inside the pink van" },
    { ...local("v2/home2/pink-duo.webp", 1600, 900), alt: "Three friends laughing inside the pink van" },
    { ...local("v2/home2/pink-sitting.webp", 1600, 900), alt: "A person sitting at the back of the pink van" },
    { ...local("v2/home2/pink-night.webp", 1600, 900), alt: "The pink van glowing on a dark road at night", strip: true },
    { ...local("v2/home2/pink-crouch.webp", 1600, 900), alt: "Two people leaning over the floor of the van" },
  ],
  casanumaa: [
    { ...vertical(CASA_NUMAA, 3.8), alt: "The Casa Numaa terrace between old walls", strip: true },
    { ...vertical(CASA_NUMAA, 4.4), alt: "Tables set on the Casa Numaa terrace" },
    { ...vertical(CASA_NUMAA, 8.0), alt: "A dessert served on a white plate" },
  ],
  multiverse: [
    { ...local("v2/tiles/rooftop-portrait.jpg", 360, 640), alt: "The Multiverse party on a lit rooftop, seen from the drone", strip: true, video: "rooftop" },
    { ...vertical(MULTIVERSE, 0.2), alt: "Guests on the rooftop seen from straight above" },
    { ...vertical(MULTIVERSE, 15.3), alt: "The rooftop bar next to a checkered building" },
    { ...vertical(MULTIVERSE, 19.0), alt: "The rooftop crowd at dusk" },
  ],
  outdoor: [
    { ...muxFrame(OUTDOOR, 10.5, 2160, 3840), alt: "An outdoor lounge on a green hill, seen from the drone", strip: true },
    { ...muxFrame(OUTDOOR, 1.0, 2160, 3840), alt: "Limestone cliffs of a gorge from the air" },
    { ...muxFrame(OUTDOOR, 26.0, 2160, 3840), alt: "The white tent of the lounge from above" },
  ],
  utopic: [
    { ...muxFrame(UTOPIC, 17, 638, 360), alt: "Flames in the dark at the Utopic party", strip: true },
    { ...muxFrame(UTOPIC, 20, 638, 360), alt: "A line of fire on the ground at night" },
  ],
  rotaract: [
    { ...local("photos/ratuste1.png", 1080, 1922), alt: "Rubber ducks on the river at the Rotaract charity race", strip: true },
    { ...local("photos/ratuste2.png", 1080, 1918), alt: "The crowd along the river bank at the duck race" },
  ],
  music: [
    { ...youtube("XD3L5bj4om0"), alt: "Nico Ramírez playing a live set on a rooftop at sunset", strip: true },
    { ...youtube("FMYPoF7MZXA"), alt: "Cover of the Haide, Hai! music video by Mara feat. Lurre" },
    { ...youtube("pA2Szfcner0"), alt: "Cover of the Efort music video by CJ's" },
    { ...youtube("w64x8lvIiP8"), alt: "Cover of the ADEVĂR music video by RONE DAMASC" },
  ],
  air: [
    { ...local("v2/home2/air-cluj.webp", 1600, 900), alt: "St Michael's Church and Piața Unirii in Cluj-Napoca from the drone", strip: true },
    { ...local("v2/tiles/nyc.jpg", 960, 540), alt: "Central Park and the Manhattan skyline from the drone", strip: true, video: "nyc" },
    { ...local("v2/home2/air-sardinia.webp", 1600, 900), alt: "A Sardinian bay with a harbour and hills" },
    { ...local("v2/home2/air-hollywood.webp", 1600, 900), alt: "The Hollywood sign on the hills of Los Angeles" },
    { ...local("v2/home2/air-oxford.webp", 1600, 900), alt: "Tom Tower and the colleges of Oxford from above" },
    { ...local("v2/home2/air-coast.webp", 1600, 900), alt: "A stone tower on a rocky point in turquoise water" },
  ],
  sardinia: [
    { ...local("photos/sardinia1.jpeg", 720, 960), alt: "LA VILLA SUNHOUSE in Sardinia" },
  ],
} satisfies Record<string, Array<Omit<Frame, "project"> & { alt: string }>>;

export type ProjectKey = keyof typeof FRAMES;

const NAMES: Record<ProjectKey, string> = {
  panoramic: "Panoramic 360 Transilvania",
  bigbelly: "Big Belly",
  tinyhouse: "Remote Tiny House Retreat",
  lifeispink: "Life Is Pink",
  casanumaa: "Casa Numaa",
  multiverse: "Multiverse Party",
  outdoor: "Outdoor Lounge",
  utopic: "Utopic Party",
  rotaract: "Rotaract Duck Race",
  music: "Music videos",
  air: "From the air",
  sardinia: "LA VILLA SUNHOUSE",
};

export const projectName = (key: ProjectKey) => NAMES[key];

// Foaia de contact: proiectele unul după altul, fiecare ca un șir de cadre
export const SHEET: Frame[] = (Object.keys(FRAMES) as ProjectKey[]).flatMap((key) =>
  FRAMES[key].map((frame) => ({ ...frame, project: NAMES[key] }))
);

// Banda de la 200 mm, în ordinea ei: amestecă proiectele, cu cadrele video printre ele
const STRIP_ORDER: Array<[ProjectKey, number]> = [
  ["panoramic", 0],
  ["bigbelly", 4],
  ["air", 0],
  ["lifeispink", 0],
  ["tinyhouse", 0],
  ["multiverse", 0],
  ["panoramic", 1],
  ["casanumaa", 0],
  ["utopic", 0],
  ["bigbelly", 0],
  ["music", 0],
  ["air", 1],
  ["outdoor", 0],
  ["rotaract", 0],
  ["tinyhouse", 4],
  ["lifeispink", 5],
];
export const STRIP_FRAMES: Frame[] = STRIP_ORDER.map(([key, index]) => ({ ...FRAMES[key][index], project: NAMES[key] }));
// Cadrul care stă în centru la deschidere (bucla din Life Is Pink)
export const STRIP_START = 3;

// Buclele video ale mozaicului (public/assets/v2/tiles), orizontale și verticale
export const loop = (name: string, portrait: boolean) => withBasePath(`/assets/v2/tiles/${name}${portrait ? "-portrait" : ""}.mp4?v=1`);
