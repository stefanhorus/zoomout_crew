import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Drone Games",
  robots: {
    index: false,
    follow: false,
  },
};

export default function GameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
