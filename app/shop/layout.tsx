import { Metadata } from "next";
import StructuredData from "@/components/StructuredData";

export const metadata: Metadata = {
  title: "LUTs Video & Editing Assets | Shop - Professional Color Grading Tools",
  description: "Cumpără LUTs video profesionale, preseturi Lightroom, efecte sonore, tranziții și asset-uri de editare video. 64+ LUTs cinematice, 50 preseturi Lightroom, 134 efecte sonore. Perfect pentru editori video și creatori de conținut.",
  keywords: [
    // Romanian keywords
    "LUTs video", "LUTs cinematice", "preseturi lightroom", "efecte sonore video", 
    "tranziții video", "asset-uri editare video", "color grading", "LUTs film",
    "editing assets", "LUTs profesionale", "preseturi video", "efecte video",
    // English keywords
    "LUTs", "cinematic LUTs", "video LUTs", "Lightroom presets", "video transitions", 
    "sound design", "filmmaking assets", "color grading LUTs", "film LUTs",
    "editing assets", "video editing tools", "creative assets", "professional LUTs",
    "video production assets", "color grading presets", "video effects"
  ],
  alternates: {
    canonical: "https://zoomoutcrew.com/shop",
    languages: {
      "en": "https://zoomoutcrew.com/shop",
      "ro": "https://zoomoutcrew.com/shop",
    },
  },
  openGraph: {
    title: "LUTs Video & Editing Assets | Shop - Professional Color Grading Tools | Zoomout_crew",
    description: "Cumpără LUTs video profesionale, preseturi Lightroom, efecte sonore, tranziții și asset-uri de editare video. 64+ LUTs cinematice, 50 preseturi Lightroom, 134 efecte sonore.",
    url: "https://zoomoutcrew.com/shop",
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
      name: "Shop",
      item: "https://zoomoutcrew.com/shop",
    },
  ],
};

export default function ShopLayout({
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
