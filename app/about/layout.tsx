import { Metadata } from "next";
import StructuredData from "@/components/StructuredData";

export const metadata: Metadata = {
  title: "About Us - Video Production Crew from Cluj",
  description: "Learn about Zoomout_crew, a video production crew from Cluj-Napoca: commercials, social media content, aftermovies, music videos and aerial footage.",
  keywords: ["about zoomout crew", "video production team cluj", "videographers cluj", "drone cinematography", "content creators cluj"],
  alternates: {
    canonical: "https://zoomoutcrew.com/about",
    languages: {
      "en": "https://zoomoutcrew.com/about",
      "ro": "https://zoomoutcrew.com/about",
    },
  },
  openGraph: {
    title: "About Us - Video Production Crew from Cluj | Zoomout_crew",
    description: "Learn about Zoomout_crew, a video production crew from Cluj-Napoca.",
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
