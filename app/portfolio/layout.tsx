import { Metadata } from "next";
import StructuredData from "@/components/StructuredData";

export const metadata: Metadata = {
  title: "Portfolio - Professional Aerial Projects",
  description: "Discover our curated collection of professional aerial videography projects. From real estate showcases and event coverage to commercial productions and creative storytelling, each project represents our commitment to capturing unique perspectives from above.",
  keywords: ["aerial portfolio", "drone videography projects", "aerial cinematography", "real estate videography", "event coverage", "commercial videography", "aerial footage"],
  alternates: {
    canonical: "https://zoomoutcrew.com/portfolio",
    languages: {
      "en": "https://zoomoutcrew.com/portfolio",
      "ro": "https://zoomoutcrew.com/portfolio",
    },
  },
  openGraph: {
    title: "Portfolio - Professional Aerial Projects | Zoomout_crew",
    description: "Discover our curated collection of professional aerial videography projects. From real estate showcases and event coverage to commercial productions and creative storytelling.",
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
