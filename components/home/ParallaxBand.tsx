"use client";

import { motion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

// Bandă cu o filmare aeriană în parallax și două rânduri de text care se mișcă în direcții opuse
export function ParallaxBand() {
  const { t } = useLanguage();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], ["-14%", "14%"]);
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.3, 1.12, 1.25]);
  const lineOneX = useTransform(scrollYProgress, [0, 1], ["-10%", "6%"]);
  const lineTwoX = useTransform(scrollYProgress, [0, 1], ["10%", "-6%"]);

  return (
    <section ref={ref} className="relative h-[115svh] overflow-hidden">
      <motion.div style={{ y: imageY, scale: imageScale }} className="absolute inset-0">
        <Image src="/assets/backgrounds/background4tiny.png" alt="" fill sizes="100vw" className="object-cover" />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/25 to-ink" />
      <div className="relative flex h-full flex-col justify-center gap-[2vw] overflow-hidden">
        <motion.p style={{ x: lineOneX }} className="display-xl whitespace-nowrap pl-[6vw]">
          {t("band.line1")}
        </motion.p>
        <motion.p style={{ x: lineTwoX }} className="display-xl serif-i self-end whitespace-nowrap pr-[6vw]">
          {t("band.line2")}
        </motion.p>
      </div>
    </section>
  );
}
