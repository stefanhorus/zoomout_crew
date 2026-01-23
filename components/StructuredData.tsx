"use client";

interface StructuredDataProps {
  type: "Organization" | "Service" | "Product" | "VideoObject" | "BreadcrumbList";
  data: any;
}

export default function StructuredData({ type, data }: StructuredDataProps) {
  const baseUrl = "https://zoomoutcrew.com";

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
          areaServed: "Worldwide",
          ...data,
        };

      case "Service":
        return {
          "@context": "https://schema.org",
          "@type": "Service",
          serviceType: "Aerial Videography Services",
          provider: {
            "@type": "Organization",
            name: "Zoomout_crew",
          },
          areaServed: "Worldwide",
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
