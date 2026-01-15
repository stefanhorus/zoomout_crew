import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services - Aerial Filming & Post-Production",
  description: "Professional aerial services tailored to bring your vision to life. Aerial filming per hour or full day, professional post-production with color grading and sound design.",
  openGraph: {
    title: "Services - Aerial Filming & Post-Production | Zoomout_crew",
    description: "Professional aerial services tailored to bring your vision to life.",
    url: "https://zoomoutcrew.com/services",
  },
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
