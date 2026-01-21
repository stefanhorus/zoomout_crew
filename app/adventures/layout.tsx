import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Adventures - Cinematic Travel Journal",
  description: "Our cinematic travel journal — unique journeys captured from above. Explore breathtaking destinations through aerial videography and photography.",
  openGraph: {
    title: "Adventures - Cinematic Travel Journal | Zoomout_crew",
    description: "Our cinematic travel journal — unique journeys captured from above.",
    url: "https://zoomoutcrew.com/adventures",
  },
};

export default function AdventuresLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
