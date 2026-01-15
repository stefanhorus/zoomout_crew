import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop - Professional LUTs, Presets & Creative Assets",
  description: "Discover our premium collection of professional LUTs, Lightroom presets, sound effects, transitions, and creative assets for filmmakers and content creators.",
  openGraph: {
    title: "Shop - Professional LUTs, Presets & Creative Assets | Zoomout_crew",
    description: "Discover our premium collection of professional LUTs, Lightroom presets, sound effects, transitions, and creative assets.",
    url: "https://zoomoutcrew.com/shop",
  },
};

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
