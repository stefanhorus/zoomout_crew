// Serviciile - textele sunt în LanguageContext: services.<key>, services.<key>.desc, services.<key>.feature1-4
export interface ServiceDefinition {
  key: string;
  image: string;
  showLocation: boolean; // serviciile de filmare afișează locația; post-producția se poate face de oriunde
  related: number[]; // id-uri din lib/projects.ts
}

export const SERVICES: ServiceDefinition[] = [
  { key: "commercials", image: "/assets/services/hour.jpg", showLocation: true, related: [1, 3, 11] },
  { key: "socialMedia", image: "/assets/adventures/ams1tiny.png", showLocation: true, related: [12, 1, 2] },
  { key: "events", image: "/assets/photos/ratuste1.png", showLocation: true, related: [4, 6, 10] },
  { key: "musicVideos", image: "/assets/backgrounds/2.jpg", showLocation: true, related: [] },
  { key: "drone", image: "/assets/services/fullday.png", showLocation: true, related: [5, 9, 8] },
  { key: "postProduction", image: "/assets/services/postproduction.jpg", showLocation: false, related: [3, 4] },
];
