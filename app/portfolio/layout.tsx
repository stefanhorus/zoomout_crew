import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio - Professional Aerial Projects",
  description: "Explore our collection of professional aerial footage and cinematography projects. Real estate showcases, event coverage, commercial videography, and creative aerial cinematography.",
  openGraph: {
    title: "Portfolio - Professional Aerial Projects | Zoomout_crew",
    description: "Explore our collection of professional aerial footage and cinematography projects.",
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
