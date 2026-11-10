import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectPage } from "@/components/site/ProjectPage";
import { translations } from "@/contexts/translations";
import { getProjectBySlug, PROJECTS, projectUrl } from "@/lib/projects";

interface Props {
  params: Promise<{ slug: string }>;
}

// Câte o pagină pentru fiecare proiect din lib/projects.ts, generată la build; orice altă adresă dă 404
export const dynamicParams = false;

export function generateStaticParams() {
  return PROJECTS.map((project) => ({ slug: project.slug }));
}

// Titlul și descrierea din previzualizarea linkului (WhatsApp, Instagram, e-mail), în engleză ca restul
// metadatelor; pe pagină, textele urmează limba aleasă de vizitator
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};
  const title = translations.en[`${project.key}.title`];
  const description = translations.en[`${project.key}.description`];
  const url = projectUrl(project);

  return {
    // absolut: layout-ul Portfolio are un titlu fix, care oprește șablonul „%s | Zoomout_crew” din layout-ul principal
    title: { absolute: `${title} | Zoomout_crew` },
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      siteName: "Zoomout_crew",
      url,
      title: `${title} | Zoomout_crew`,
      description,
      // imaginea vine din opengraph-image.tsx: coperta proiectului cu titlul, 1200x630
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Zoomout_crew`,
      description,
    },
  };
}

export default async function ProjectRoute({ params }: Props) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();
  return <ProjectPage project={project} />;
}
