"use client";

import { animate, motion } from "motion/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { EASE, EASE_IN_OUT } from "./ease";
import { Rich } from "./rich";
import { withBasePath } from "@/lib/base-path";

const SESSION_KEY = "zc_intro";

declare global {
  interface Window {
    __introDone?: boolean;
  }
}

function announceIntroDone() {
  window.__introDone = true;
  window.dispatchEvent(new Event("intro:done"));
}

// Scriptul din <head> ascunde intro-ul înainte de prima randare pentru cine l-a văzut deja în sesiune.
// Pagina de test /home2 (după Taste Skill) n-are intro și nici granulație: titlul trebuie să se vadă din primul cadru.
export const introSeenScript = `try{var h=document.documentElement;if(location.pathname.indexOf("/home2")>-1)h.classList.add("intro-seen","home2-page");if(sessionStorage.getItem("${SESSION_KEY}")||matchMedia("(prefers-reduced-motion: reduce)").matches)h.classList.add("intro-seen")}catch(e){}`;

// Hero-ul își pornește animația abia după intro
export function useIntroDone() {
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (window.__introDone) {
      queueMicrotask(() => setDone(true));
      return;
    }
    const onDone = () => setDone(true);
    window.addEventListener("intro:done", onDone);
    return () => window.removeEventListener("intro:done", onDone);
  }, []);
  return done;
}

export function Preloader() {
  const { t } = useLanguage();
  const [count, setCount] = useState(0);
  const [phase, setPhase] = useState<"count" | "exit" | "done">("count");

  useEffect(() => {
    if (document.documentElement.classList.contains("intro-seen")) {
      announceIntroDone();
      return;
    }
    const controls = animate(0, 100, {
      duration: 1.5,
      ease: EASE_IN_OUT,
      onUpdate: (value) => setCount(Math.round(value)),
      onComplete: () => {
        setPhase("exit");
        announceIntroDone();
      },
    });
    return () => controls.stop();
  }, []);

  if (phase === "done") return null;

  return (
    <motion.div
      className="preloader fixed inset-0 z-[100] flex flex-col justify-between bg-ink p-6 md:p-10"
      initial={{ y: "0%" }}
      animate={{ y: phase === "exit" ? "-100%" : "0%" }}
      transition={{ duration: 1.05, ease: EASE }}
      onAnimationComplete={() => {
        if (phase !== "exit") return;
        try {
          sessionStorage.setItem(SESSION_KEY, "1");
        } catch {
          // sessionStorage indisponibil (mod privat) - intro-ul va reapărea, nu e grav
        }
        setPhase("done");
      }}
    >
      <div className="flex items-center gap-3">
        <Image src={withBasePath("/assets/logo.png")} alt="" width={36} height={36} className="rounded-full" priority />
        <span className="font-display text-lg font-semibold tracking-tight">Zoomout_crew</span>
      </div>

      <p className="display-md max-w-3xl text-paper/90">
        <Rich text={t("hero.bigPicture")} />
      </p>

      <div className="flex items-end justify-between">
        <span className="kicker flex items-center gap-2 text-paper">
          <span className="rec-dot" /> REC
        </span>
        <span className="font-display text-6xl font-semibold tabular-nums tracking-tight md:text-8xl">
          {String(count).padStart(3, "0")}
        </span>
      </div>
    </motion.div>
  );
}
