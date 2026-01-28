import { Metadata } from "next";
import StructuredData from "@/components/StructuredData";

export const metadata: Metadata = {
  title: "Filmări cu Dronă Cluj | Servicii Filmări Aeriene & Post-Producție",
  description: "Servicii profesionale de filmări cu dronă în Cluj-Napoca. Filmări aeriene pe oră sau zi completă, post-producție profesională cu color grading și sound design. Filmări evenimente, imobiliare, comerciale și cinematice.",
  keywords: [
    // Romanian keywords
    "filmări cu dronă cluj", "filmări cu dronă cluj napoca", "servicii filmări dronă cluj", 
    "videografie aeriană cluj", "filmări aeriene cluj", "dronă cluj", "filmări evenimente dronă cluj",
    "filmări imobiliare dronă", "filmări comerciale dronă", "post-producție video cluj",
    // English keywords
    "aerial filming services cluj", "drone videography cluj", "drone services cluj napoca",
    "aerial cinematography romania", "post-production", "color grading", "video editing cluj",
    "aerial photography cluj", "drone filming cluj", "aerial videography services"
  ],
  alternates: {
    canonical: "https://zoomoutcrew.com/services",
    languages: {
      "en": "https://zoomoutcrew.com/services",
      "ro": "https://zoomoutcrew.com/services",
    },
  },
  openGraph: {
    title: "Filmări cu Dronă Cluj | Servicii Filmări Aeriene & Post-Producție | Zoomout_crew",
    description: "Servicii profesionale de filmări cu dronă în Cluj-Napoca. Filmări aeriene pe oră sau zi completă, post-producție profesională cu color grading și sound design.",
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
  serviceType: "Filmări cu Dronă Cluj | Aerial Videography Services",
  description: "Servicii profesionale de filmări cu dronă în Cluj-Napoca. Filmări aeriene, post-producție video, color grading și sound design.",
  name: "Filmări cu Dronă Cluj - Zoomout_crew",
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
