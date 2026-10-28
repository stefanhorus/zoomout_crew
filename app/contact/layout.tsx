import { Metadata } from "next";
import StructuredData from "@/components/StructuredData";

export const metadata: Metadata = {
  title: "Contact Us - Get in Touch",
  description: "Get in touch with Zoomout_crew for your next video project: commercials, social media content, aftermovies, music videos or drone filming. Tell us about your idea and we'll get back to you with a quote.",
  keywords: ["contact zoomout crew", "video production quote", "hire videographer cluj", "videograf cluj", "drone services contact"],
  alternates: {
    canonical: "https://zoomoutcrew.com/contact",
    languages: {
      "en": "https://zoomoutcrew.com/contact",
      "ro": "https://zoomoutcrew.com/contact",
    },
  },
  openGraph: {
    title: "Contact Us - Get in Touch | Zoomout_crew",
    description: "Get in touch with Zoomout_crew for your next video project and get a quote.",
    url: "https://zoomoutcrew.com/contact",
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
      name: "Contact",
      item: "https://zoomoutcrew.com/contact",
    },
  ],
};

export default function ContactLayout({
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
