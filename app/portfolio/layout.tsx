import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio - Professional Aerial Projects",
  description: "Discover our curated collection of professional aerial videography projects. From real estate showcases and event coverage to commercial productions and creative storytelling, each project represents our commitment to capturing unique perspectives from above.",
  openGraph: {
    title: "Portfolio - Professional Aerial Projects | Zoomout_crew",
    description: "Discover our curated collection of professional aerial videography projects. From real estate showcases and event coverage to commercial productions and creative storytelling.",
    url: "https://zoomoutcrew.com/portfolio",
  },
};

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
