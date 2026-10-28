"use client";

import { AnimatePresence, motion, useSpring } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useFinePointer } from "@/lib/hooks";
import { SERVICES } from "@/lib/services";
import { SplitReveal } from "../motion/SplitReveal";

// Lista de servicii; pe desktop, la hover, o imagine urmărește cursorul
export function ServicesIndex() {
  const { t } = useLanguage();
  const finePointer = useFinePointer();
  const [active, setActive] = useState<number | null>(null);
  const x = useSpring(0, { stiffness: 260, damping: 28, mass: 0.5 });
  const y = useSpring(0, { stiffness: 260, damping: 28, mass: 0.5 });

  const listRef = useRef<HTMLUListElement>(null);

  // Poziția cursorului e urmărită global, ca imaginea să apară corect și când intri în listă prin scroll;
  // la scroll, dacă cursorul nu mai e peste listă, imaginea dispare
  useEffect(() => {
    if (!finePointer) return;
    let pointer: { x: number; y: number } | null = null;
    const onMove = (event: PointerEvent) => {
      pointer = { x: event.clientX, y: event.clientY };
      x.set(event.clientX);
      y.set(event.clientY);
    };
    const onScroll = () => {
      if (!pointer || !listRef.current) return;
      const under = document.elementFromPoint(pointer.x, pointer.y);
      if (!under || !listRef.current.contains(under)) setActive(null);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, [finePointer, x, y]);

  return (
    <section className="container-site py-28 md:py-40">
      <div className="mb-14 grid gap-8 md:mb-20 lg:grid-cols-12">
        <p className="kicker lg:col-span-3 lg:pt-3">{t("servicesIndex.kicker")}</p>
        <h2 className="display-md max-w-[16ch] lg:col-span-9">
          <SplitReveal text={t("servicesIndex.title")} />
        </h2>
      </div>

      <ul ref={listRef} onPointerLeave={() => setActive(null)} className="border-b border-line">
        {SERVICES.map((service, index) => (
          <li key={service.key}>
            <Link
              href={`/services#${service.key}`}
              onPointerEnter={() => setActive(index)}
              className="group grid grid-cols-12 items-center gap-4 border-t border-line py-7 md:py-9"
            >
              <span className="kicker col-span-2 tabular-nums transition-colors group-hover:text-rec md:col-span-1">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="display-sm col-span-9 transition-transform duration-700 ease-[var(--ease-expo)] group-hover:translate-x-3 md:col-span-6">
                {t(`services.${service.key}`)}
              </span>
              <span className="hidden text-sm text-mute md:col-span-4 md:block">
                {t(`services.${service.key}.feature1`)} · {t(`services.${service.key}.feature2`)}
              </span>
              <span className="col-span-1 justify-self-end text-2xl transition-transform duration-500 ease-[var(--ease-expo)] group-hover:-rotate-45">
                →
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {finePointer && (
        <motion.div className="pointer-events-none fixed left-0 top-0 z-30" style={{ x, y }} aria-hidden>
          <AnimatePresence>
            {active !== null && (
              <motion.div
                key="preview"
                initial={{ opacity: 0, scale: 0.7, rotate: -4 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={{ type: "spring", stiffness: 300, damping: 26 }}
                className="relative -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl"
                style={{ width: 260, height: 320 }}
              >
                {SERVICES.map((service, index) => (
                  <Image
                    key={service.key}
                    src={service.image}
                    alt=""
                    fill
                    sizes="260px"
                    className={`object-cover transition-opacity duration-500 ${index === active ? "opacity-100" : "opacity-0"}`}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </section>
  );
}
