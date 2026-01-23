import { Metadata } from "next";
import StructuredData from "@/components/StructuredData";

export const metadata: Metadata = {
  title: "Contact Us - Get in Touch",
  description: "Get in touch with Zoomout_crew for your aerial videography projects. Whether you have a project in mind or just want to say hi, we'd love to hear from you.",
  keywords: ["contact zoomout crew", "aerial videography contact", "drone services contact", "hire videographer"],
  alternates: {
    canonical: "https://zoomoutcrew.com/contact",
    languages: {
      "en": "https://zoomoutcrew.com/contact",
      "ro": "https://zoomoutcrew.com/contact",
    },
  },
  openGraph: {
    title: "Contact Us - Get in Touch | Zoomout_crew",
    description: "Get in touch with Zoomout_crew for your aerial videography projects.",
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
