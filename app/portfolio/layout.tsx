import { Metadata } from "next";
import StructuredData from "@/components/StructuredData";

export const metadata: Metadata = {
  title: "Portfolio - Video Production Projects",
  description: "A selection of our projects: commercials, social media content, event aftermovies, music videos and aerial footage. Every project tells a story, from the first idea to the final cut.",
  keywords: ["video production portfolio", "commercial videography", "event aftermovies", "music videos", "social media content", "drone videography projects", "aerial footage", "real estate videography"],
  alternates: {
    canonical: "https://zoomoutcrew.com/portfolio",
    languages: {
      "en": "https://zoomoutcrew.com/portfolio",
      "ro": "https://zoomoutcrew.com/portfolio",
    },
  },
  openGraph: {
    title: "Portfolio - Video Production Projects | Zoomout_crew",
    description: "A selection of our projects: commercials, social media content, event aftermovies, music videos and aerial footage. Every project tells a story, from the first idea to the final cut.",
    url: "https://zoomoutcrew.com/portfolio",
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
      name: "Portfolio",
      item: "https://zoomoutcrew.com/portfolio",
    },
  ],
};

export default function PortfolioLayout({
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
