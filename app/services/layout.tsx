import { Metadata } from "next";
import StructuredData from "@/components/StructuredData";

export const metadata: Metadata = {
  title: "Servicii Producție Video & Filmări cu Dronă Cluj",
  description: "Servicii de producție video în Cluj-Napoca: reclame și video de brand, conținut pentru social media, evenimente și aftermovie-uri, videoclipuri muzicale, filmări cu drona și post-producție cu color grading și sound design.",
  keywords: [
    // Romanian keywords
    "producție video cluj", "servicii video cluj", "reclame video cluj", "videograf cluj",
    "filmări evenimente cluj", "aftermovie cluj", "videoclipuri muzicale cluj", "conținut social media cluj",
    "filmări cu dronă cluj", "filmări cu dronă cluj napoca", "filmări aeriene cluj", "post-producție video cluj",
    // English keywords
    "video production cluj", "videographer cluj", "commercial video production", "event videography",
    "aftermovies", "music video production", "social media video content", "drone filming cluj",
    "aerial videography services", "post-production", "color grading", "video editing cluj"
  ],
  alternates: {
    canonical: "https://zoomoutcrew.com/services",
    languages: {
      "en": "https://zoomoutcrew.com/services",
      "ro": "https://zoomoutcrew.com/services",
    },
  },
  openGraph: {
    title: "Servicii Producție Video & Filmări cu Dronă Cluj | Zoomout_crew",
    description: "Reclame, conținut social media, aftermovie-uri, videoclipuri muzicale, filmări cu drona și post-producție în Cluj-Napoca.",
    url: "https://zoomoutcrew.com/services",
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
      name: "Services",
      item: "https://zoomoutcrew.com/services",
    },
  ],
};

const serviceStructuredData = {
  serviceType: "Producție Video Cluj | Video Production Services",
  description: "Producție video în Cluj-Napoca: reclame, conținut social media, aftermovie-uri, videoclipuri muzicale, filmări cu drona și post-producție.",
  name: "Producție Video & Filmări cu Dronă Cluj - Zoomout_crew",
  location: {
    "@type": "Place",
    name: "Cluj-Napoca, Romania",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Cluj-Napoca",
      addressRegion: "Cluj",
      addressCountry: "RO",
      postalCode: "400000",
    },
  },
  areaServed: {
    "@type": "City",
    name: "Cluj-Napoca",
    addressCountry: "RO",
  },
  offers: {
    "@type": "Offer",
    priceCurrency: "EUR",
    availability: "https://schema.org/InStock",
  },
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <StructuredData type="BreadcrumbList" data={breadcrumbs} />
      <StructuredData type="Service" data={serviceStructuredData} />
      {children}
    </>
  );
}
