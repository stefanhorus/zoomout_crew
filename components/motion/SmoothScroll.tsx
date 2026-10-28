"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, type ReactNode } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks";

// La schimbarea paginii pornim de sus (sau de la #ancoră), dar nu la Back/Forward.
function ScrollReset() {
  const pathname = usePathname();
  const lenis = useLenis();
  const isPopNavigation = useRef(false);

  useEffect(() => {
    const onPop = () => {
      isPopNavigation.current = true;
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    if (isPopNavigation.current) {
      isPopNavigation.current = false;
      return;
    }
    const hash = window.location.hash;
    const target = hash ? document.querySelector<HTMLElement>(hash) : null;
    if (target) {
      if (lenis) lenis.scrollTo(target, { offset: -90, immediate: true, force: true });
      else target.scrollIntoView();
    } else if (lenis) {
      lenis.scrollTo(0, { immediate: true, force: true });
    }
  }, [pathname, lenis]);

  return null;
}

export default function SmoothScroll({ children }: { children: ReactNode }) {
  // Cu "reduce motion" activat în sistem, scroll-ul rămâne cel nativ (fără inerție)
  const reducedMotion = usePrefersReducedMotion();

  return (
    <ReactLenis root options={{ lerp: 0.09, smoothWheel: !reducedMotion, wheelMultiplier: 1, anchors: { offset: -90 } }}>
      <ScrollReset />
      {children}
    </ReactLenis>
  );
}

// Blochează scroll-ul paginii cât timp e deschis un modal / meniu / coș
export function useScrollLock(locked: boolean) {
  const lenis = useLenis();
  useEffect(() => {
    if (!locked) return;
    lenis?.stop();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      lenis?.start();
      document.body.style.overflow = previous;
    };
  }, [locked, lenis]);
}
