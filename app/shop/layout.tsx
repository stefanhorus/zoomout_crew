import { Metadata } from "next";
import StructuredData from "@/components/StructuredData";

export const metadata: Metadata = {
  title: "Shop - Professional LUTs, Presets & Creative Assets",
  description: "Discover our premium collection of professional LUTs, Lightroom presets, sound effects, transitions, and creative assets for filmmakers and content creators.",
  keywords: ["LUTs", "cinematic LUTs", "Lightroom presets", "video transitions", "sound design", "filmmaking assets", "color grading"],
  alternates: {
    canonical: "https://zoomoutcrew.com/shop",
    languages: {
      "en": "https://zoomoutcrew.com/shop",
      "ro": "https://zoomoutcrew.com/shop",
    },
  },
  openGraph: {
    title: "Shop - Professional LUTs, Presets & Creative Assets | Zoomout_crew",
    description: "Discover our premium collection of professional LUTs, Lightroom presets, sound effects, transitions, and creative assets.",
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
