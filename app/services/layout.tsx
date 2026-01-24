import { Metadata } from "next";
import StructuredData from "@/components/StructuredData";

export const metadata: Metadata = {
  title: "Services - Aerial Filming & Post-Production",
  description: "Professional aerial services tailored to bring your vision to life. Aerial filming per hour or full day, professional post-production with color grading and sound design.",
  keywords: ["aerial filming services", "drone videography", "aerial cinematography", "post-production", "color grading", "video editing", "aerial photography"],
  alternates: {
    canonical: "https://zoomoutcrew.com/services",
    languages: {
      "en": "https://zoomoutcrew.com/services",
      "ro": "https://zoomoutcrew.com/services",
    },
  },
  openGraph: {
    title: "Services - Aerial Filming & Post-Production | Zoomout_crew",
    description: "Professional aerial services tailored to bring your vision to life.",
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
  serviceType: "Aerial Videography Services",
  description: "Professional aerial filming and post-production services",
  location: {
    "@type": "Place",
    name: "Cluj-Napoca,Romania",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Cluj-Napoca",
      addressCountry: "RO",
    },
  },
  areaServed: "Cluj-Napoca,Romania",
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
