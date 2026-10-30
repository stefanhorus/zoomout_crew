import type { Metadata } from "next";
import { Work_Sans } from "next/font/google";
import { Home2 } from "@/components/home2/Home2";

// Varianta de prima pagină după principiile Taste Skill, ca s-o comparăm cu cea actuală. Un singur font, Work Sans.
const workSans = Work_Sans({ subsets: ["latin", "latin-ext"], weight: ["300", "400", "500"], display: "swap" });

export const metadata: Metadata = {
  title: { absolute: "Zoomout_crew, video and drone crew from Cluj-Napoca" },
  robots: { index: false, follow: false },
};

export default function Home2Page() {
  const face = workSans.style.fontFamily;
  return (
    <>
      {/* Pe pagina asta tot textul, inclusiv meniul de sus, folosește Work Sans */}
      <style>{`html:root{--font-display-face:${face};--font-body-face:${face};--font-serif-face:${face}}`}</style>
      <Home2 />
    </>
  );
}
