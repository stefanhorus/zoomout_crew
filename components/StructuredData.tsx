"use client";

interface StructuredDataProps {
  type: "Organization" | "Service" | "Product" | "VideoObject" | "BreadcrumbList" | "LocalBusiness";
  data: any;
}

export default function StructuredData({ type, data }: StructuredDataProps) {
  const baseUrl = "https://zoomoutcrew.com";
  const defaultLocationName = "Cluj-Napoca,Romania";
  const defaultPostalAddress = {
    "@type": "PostalAddress",
    addressLocality: "Cluj-Napoca",
    addressCountry: "RO",
  };
  const defaultPlace = {
    "@type": "Place",
    name: defaultLocationName,
    address: defaultPostalAddress,
  };

  const getStructuredData = () => {
    switch (type) {
      case "Organization":
        return {
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Zoomout_crew",
          url: baseUrl,
          logo: `${baseUrl}/assets/logo.png`,
          description: "Servicii profesionale de filmări cu dronă în Cluj-Napoca. LUTs video, preseturi Lightroom, efecte sonore și asset-uri de editare video.",
          sameAs: [
            "https://instagram.com/zoomout_crew",
            "https://www.linkedin.com/company/zoomout-crew",
            "https://youtube.com/@zoomout_crew",
          ],
          contactPoint: {
            "@type": "ContactPoint",
            contactType: "Customer Service",
            email: "contact@zoomoutcrew.com",
            availableLanguage: ["Romanian", "English"],
          },
          address: defaultPostalAddress,
          location: defaultPlace,
          areaServed: defaultLocationName,
          ...data,
        };

      case "LocalBusiness":
        return {
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: "Zoomout_crew - Filmări cu Dronă Cluj",
          image: `${baseUrl}/assets/logo.png`,
          url: baseUrl,
          telephone: "+40-XXX-XXX-XXX", // Actualizează cu numărul real dacă ai
          email: "contact@zoomoutcrew.com",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Cluj-Napoca",
            addressRegion: "Cluj",
            addressCountry: "RO",
            postalCode: "400000",
          },
          geo: {
            "@type": "GeoCoordinates",
            latitude: "46.7712",
            longitude: "23.6236",
          },
          priceRange: "$$",
          openingHoursSpecification: {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            opens: "09:00",
            closes: "18:00",
          },
          servesCuisine: false,
          ...data,
        };

      case "Service":
        return {
          "@context": "https://schema.org",
          "@type": "Service",
          serviceType: "Filmări cu Dronă Cluj | Aerial Videography Services",
          name: "Filmări cu Dronă Cluj-Napoca",
          description: "Servicii profesionale de filmări cu dronă în Cluj-Napoca. Filmări aeriene, post-producție video, color grading și sound design.",
          location: defaultPlace,
          provider: {
            "@type": "LocalBusiness",
            name: "Zoomout_crew",
            address: defaultPostalAddress,
            location: defaultPlace,
          },
          areaServed: {
            "@type": "City",
            name: "Cluj-Napoca",
            addressCountry: "RO",
          },
          ...data,
        };

      case "Product":
        return {
          "@context": "https://schema.org",
          "@type": "Product",
          ...data,
        };

      case "VideoObject":
        return {
          "@context": "https://schema.org",
          "@type": "VideoObject",
          ...data,
        };

      case "BreadcrumbList":
        return {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: data.items,
        };

      default:
        return null;
    }
  };

  const structuredData = getStructuredData();

  if (!structuredData) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
