import { Metadata } from "next";
import StructuredData from "@/components/StructuredData";

export const metadata: Metadata = {
  title: "About Us - Professional Aerial Videography",
  description: "Learn about Zoomout_crew - professional aerial footage and cinematography services. Specialized in capturing breathtaking aerial footage from unique perspectives.",
  keywords: ["about zoomout crew", "aerial videography team", "drone cinematography", "professional videographers", "aerial photography"],
  alternates: {
    canonical: "https://zoomoutcrew.com/about",
    languages: {
      "en": "https://zoomoutcrew.com/about",
      "ro": "https://zoomoutcrew.com/about",
    },
  },
  openGraph: {
    title: "About Us - Professional Aerial Videography | Zoomout_crew",
    description: "Learn about Zoomout_crew - professional aerial footage and cinematography services.",
    url: "https://zoomoutcrew.com/about",
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
      name: "About",
      item: "https://zoomoutcrew.com/about",
    },
  ],
};

export default function AboutLayout({
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
