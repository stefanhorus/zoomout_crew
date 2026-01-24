"use client";

interface StructuredDataProps {
  type: "Organization" | "Service" | "Product" | "VideoObject" | "BreadcrumbList";
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
          description: "Professional aerial videography & more",
          sameAs: [
            // Adaugă link-uri la social media dacă ai
          ],
          contactPoint: {
            "@type": "ContactPoint",
            contactType: "Customer Service",
            email: "contact@zoomoutcrew.com", // Actualizează cu email-ul real
          },
          address: defaultPostalAddress,
          location: defaultPlace,
          areaServed: defaultLocationName,
          ...data,
        };

      case "Service":
        return {
          "@context": "https://schema.org",
          "@type": "Service",
          serviceType: "Aerial Videography Services",
          location: defaultPlace,
          provider: {
            "@type": "Organization",
            name: "Zoomout_crew",
            address: defaultPostalAddress,
            location: defaultPlace,
          },
          areaServed: defaultLocationName,
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
