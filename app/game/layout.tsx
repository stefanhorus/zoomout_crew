import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Drone Games",
  robots: {
    index: false,
    follow: false,
    noindex: true,
    nofollow: true,
  },
};

export default function GameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
