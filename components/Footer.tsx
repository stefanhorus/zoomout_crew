"use client";

import { useLenis } from "lenis/react";
import { motion } from "motion/react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { SERVICES } from "@/lib/services";
import { EASE } from "./motion/ease";
import { Rich } from "./motion/rich";

const MENU = [
  { href: "/", labelKey: "nav.home" },
  { href: "/portfolio", labelKey: "nav.portfolio" },
  { href: "/services", labelKey: "nav.services" },
  { href: "/about", labelKey: "nav.about" },
  { href: "/shop", labelKey: "nav.shop" },
  { href: "/contact", labelKey: "nav.contact" },
];

const SOCIALS = [
  { name: "Instagram", href: "https://instagram.com/zoomout_crew" },
  { name: "YouTube", href: "https://youtube.com/@zoomout_crew" },
  { name: "LinkedIn", href: "https://www.linkedin.com/company/zoomout-crew" },
];

export default function Footer() {
  const { t } = useLanguage();
  const lenis = useLenis();
  const year = new Date().getFullYear();

  const backToTop = () => {
    if (lenis) lenis.scrollTo(0, { duration: 1.6 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative overflow-hidden border-t border-line bg-ink">
      <div className="container-site pb-10 pt-20 md:pt-28">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <p className="kicker">{t("cta.kicker")}</p>
            <h2 className="display-lg mt-5">
              <Rich text={t("footer.title")} />
            </h2>
            <a
              href="mailto:contact@zoomoutcrew.com"
              className="link-line mt-8 inline-block font-display text-2xl font-medium tracking-tight text-paper-dim transition-colors hover:text-paper md:text-4xl"
            >
              contact@zoomoutcrew.com
            </a>
          </div>

          <nav className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-6 lg:pt-3" aria-label="Footer">
            <div>
              <p className="kicker mb-5">{t("footer.menu")}</p>
              <ul className="space-y-2.5">
                {MENU.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="link-line text-paper-dim transition-colors hover:text-paper">
                      {t(link.labelKey)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="kicker mb-5">{t("footer.services")}</p>
              <ul className="space-y-2.5">
                {SERVICES.map((service) => (
                  <li key={service.key}>
                    <Link href={`/services#${service.key}`} className="link-line text-paper-dim transition-colors hover:text-paper">
                      {t(`marquee.${service.key}`)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="kicker mb-5">{t("footer.follow")}</p>
              <ul className="space-y-2.5">
                {SOCIALS.map((social) => (
                  <li key={social.name}>
                    <a href={social.href} target="_blank" rel="noopener noreferrer" className="link-line text-paper-dim transition-colors hover:text-paper">
                      {social.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>

        <div className="mt-20 flex flex-col gap-4 border-t border-line pt-6 text-sm text-mute md:flex-row md:items-center md:justify-between">
          <p>
            © {year} Zoomout_crew. {t("footer.allRightsReserved")}
          </p>
          <p className="flex items-center gap-2">
            <span className="rec-dot h-1.5 w-1.5" /> {t("footer.based")}
          </p>
          <button type="button" onClick={backToTop} className="link-line self-start text-paper-dim hover:text-paper md:self-auto">
            {t("common.backToTop")} ↑
          </button>
        </div>
      </div>

      {/* Numele pe toată lățimea, care urcă la scroll */}
      <motion.div
        aria-hidden
        className="pointer-events-none select-none px-[1.5vw]"
        initial={{ y: "35%" }}
        whileInView={{ y: "0%" }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, ease: EASE }}
      >
        <svg viewBox="0 0 1000 150" className="block w-full" preserveAspectRatio="xMidYMax meet">
          <text
            x="0"
            y="128"
            textLength="1000"
            lengthAdjust="spacingAndGlyphs"
            className="fill-paper/[0.07]"
            style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 168, letterSpacing: "-0.05em" }}
          >
            Zoomout_crew
          </text>
        </svg>
      </motion.div>
    </footer>
  );
}
