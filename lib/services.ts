import { withBasePath } from "@/lib/base-path";
import { getProject, isYouTube, type Project } from "@/lib/projects";

// Un proiect din „Related work”: id-ul din lib/projects.ts sau, cu `previewStart`, același proiect cu animația de la
// hover pornită din alt loc al clipului decât pe restul site-ului (ex. la Drone, Lepas arată zborul de la început)
export type RelatedProject = number | { id: number; previewStart: number };

// Serviciile - textele sunt în LanguageContext: services.<key>, services.<key>.desc, services.<key>.feature1-4
export interface ServiceDefinition {
  key: string;
  image: string;
  focus?: string; // punctul de interes al pozei (object-position), când nu e centrul: pozele se decupează diferit pe ecrane
  showLocation: boolean; // serviciile de filmare afișează locația; post-producția se poate face de oriunde
  related: RelatedProject[];
}

export const SERVICES: ServiceDefinition[] = [
  { key: "commercials", image: withBasePath("/assets/services/welovepng-bts.jpg"), showLocation: true, related: [13, 3, 11] },
  { key: "socialMedia", image: withBasePath("/assets/services/social-media.webp"), focus: "50% 25%", showLocation: true, related: [12, 1, 10] },
  { key: "events", image: withBasePath("/assets/photos/ratuste1.png"), showLocation: true, related: [20, 10, 2] },
  { key: "musicVideos", image: withBasePath("/assets/services/music-videos.webp"), showLocation: true, related: [15, 19, 16] },
  { key: "drone", image: withBasePath("/assets/services/fullday.png"), showLocation: true, related: [3, { id: 11, previewStart: 0.2 }, 1] },
  { key: "postProduction", image: withBasePath("/assets/services/postproduction.jpg"), showLocation: false, related: [3, 4] },
];

// Proiectele din „Related work” ale unui serviciu, cu animația de hover mutată unde e cerut
export function relatedProjects(service: ServiceDefinition): Project[] {
  return service.related.flatMap((entry) => {
    const project = getProject(typeof entry === "number" ? entry : entry.id);
    if (!project) return [];
    const [first, ...rest] = project.videos ?? [];
    if (typeof entry === "number" || !first || isYouTube(first)) return [project];
    return [{ ...project, videos: [{ ...first, previewStart: entry.previewStart }, ...rest] }];
  });
}
