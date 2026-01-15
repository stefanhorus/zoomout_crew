import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us - Get in Touch",
  description: "Get in touch with Zoomout_crew for your aerial cinematography projects. Whether you have a project in mind or just want to say hi, we'd love to hear from you.",
  openGraph: {
    title: "Contact Us - Get in Touch | Zoomout_crew",
    description: "Get in touch with Zoomout_crew for your aerial cinematography projects.",
    url: "https://zoomoutcrew.com/contact",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
