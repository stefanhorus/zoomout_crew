import { withBasePath } from "@/lib/base-path";

// Serviciile - textele sunt în LanguageContext: services.<key>, services.<key>.desc, services.<key>.feature1-4
export interface ServiceDefinition {
  key: string;
  image: string;
  showLocation: boolean; // serviciile de filmare afișează locația; post-producția se poate face de oriunde
  related: number[]; // id-uri din lib/projects.ts
}

export const SERVICES: ServiceDefinition[] = [
  { key: "commercials", image: withBasePath("/assets/services/hour.jpg"), showLocation: true, related: [1, 3, 11] },
  { key: "socialMedia", image: withBasePath("/assets/adventures/ams1tiny.png"), showLocation: true, related: [12, 1, 2] },
  { key: "events", image: withBasePath("/assets/photos/ratuste1.png"), showLocation: true, related: [4, 6, 10] },
  { key: "musicVideos", image: withBasePath("/assets/backgrounds/2.jpg"), showLocation: true, related: [] },
  { key: "drone", image: withBasePath("/assets/services/fullday.png"), showLocation: true, related: [5, 9, 8] },
  { key: "postProduction", image: withBasePath("/assets/services/postproduction.jpg"), showLocation: false, related: [3, 4] },
];
