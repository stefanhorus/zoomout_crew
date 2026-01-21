import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us - Professional Aerial Videography",
  description: "Learn about Zoomout_crew - professional aerial footage and cinematography services. Specialized in capturing breathtaking aerial footage from unique perspectives.",
  openGraph: {
    title: "About Us - Professional Aerial Videography | Zoomout_crew",
    description: "Learn about Zoomout_crew - professional aerial footage and cinematography services.",
    url: "https://zoomoutcrew.com/about",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
