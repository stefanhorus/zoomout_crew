import { Metadata } from "next";
import StructuredData from "@/components/StructuredData";

export const metadata: Metadata = {
  title: "Adventures - Cinematic Travel Journal",
  description: "Our cinematic travel journal — unique journeys captured from above. Explore breathtaking destinations through aerial videography and photography.",
  keywords: ["travel videography", "aerial travel", "cinematic travel", "drone travel footage", "travel cinematography", "aerial adventures"],
  alternates: {
    canonical: "https://zoomoutcrew.com/adventures",
    languages: {
      "en": "https://zoomoutcrew.com/adventures",
      "ro": "https://zoomoutcrew.com/adventures",
    },
  },
  openGraph: {
    title: "Adventures - Cinematic Travel Journal | Zoomout_crew",
    description: "Our cinematic travel journal — unique journeys captured from above.",
    url: "https://zoomoutcrew.com/adventures",
  },
};

const breadcrumbs = {
  items: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://zoomoutcrew.com",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Adventures",
      item: "https://zoomoutcrew.com/adventures",
    },
  ],
};

export default function AdventuresLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <StructuredData type="BreadcrumbList" data={breadcrumbs} />
      {children}
    </>
  );
}
