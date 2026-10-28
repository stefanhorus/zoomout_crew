"use client";

import { AnimatePresence, motion, useSpring } from "motion/react";
import { useEffect, useState } from "react";
import { useFinePointer } from "@/lib/hooks";

// Eticheta care urmărește cursorul peste elementele cu data-cursor="Play" / "View"
export function CursorLabel() {
  const finePointer = useFinePointer();
  const x = useSpring(-200, { stiffness: 520, damping: 42, mass: 0.35 });
  const y = useSpring(-200, { stiffness: 520, damping: 42, mass: 0.35 });
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    if (!finePointer) return;
    let pointer: { x: number; y: number } | null = null;
    const update = (element: Element | null) => {
      const next = element?.closest("[data-cursor]")?.getAttribute("data-cursor") ?? null;
      setLabel((previous) => (previous === next ? previous : next));
    };
    const onMove = (event: PointerEvent) => {
      pointer = { x: event.clientX, y: event.clientY };
      x.set(event.clientX);
      y.set(event.clientY);
      update(event.target instanceof Element ? event.target : null);
    };
    // La scroll conținutul se mută sub cursor - recitim elementul de sub el
    const onScroll = () => {
      if (pointer) update(document.elementFromPoint(pointer.x, pointer.y));
    };
    const onLeave = () => {
      pointer = null;
      setLabel(null);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [finePointer, x, y]);

  if (!finePointer) return null;

  return (
    <motion.div className="pointer-events-none fixed left-0 top-0 z-[90]" style={{ x, y }} aria-hidden>
      <AnimatePresence>
        {label && (
          <motion.div
            key="cursor-label"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 420, damping: 30 }}
            className="flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full bg-paper px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink shadow-2xl"
          >
            <span className="rec-dot h-1.5 w-1.5" />
            {label}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
