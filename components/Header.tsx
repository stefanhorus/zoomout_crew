"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll, type Variants } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { CURRENCIES } from "@/lib/currency";
import { EASE } from "./motion/ease";
import { useScrollLock } from "./motion/SmoothScroll";
import Cart from "./Cart";

const NAV_LINKS = [
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

// Text care "se rostogolește" la hover
function RollText({ children }: { children: string }) {
  return (
    <span className="relative block overflow-hidden">
      <span className="block transition-transform duration-500 ease-[var(--ease-expo)] group-hover:-translate-y-full">{children}</span>
      <span aria-hidden className="absolute inset-0 block translate-y-full transition-transform duration-500 ease-[var(--ease-expo)] group-hover:translate-y-0">
        {children}
      </span>
    </span>
  );
}

function LanguageToggle({ className = "" }: { className?: string }) {
  const { language, setLanguage } = useLanguage();
  return (
    <div className={`flex items-center rounded-full border border-line p-1 text-[11px] font-semibold tracking-[0.14em] ${className}`}>
      {(["en", "ro"] as const).map((lang) => (
        <button
          key={lang}
          type="button"
          onClick={() => setLanguage(lang)}
          aria-pressed={language === lang}
          className={`rounded-full px-2.5 py-1.5 uppercase transition-colors duration-300 ${
            language === lang ? "bg-paper text-ink" : "text-mute hover:text-paper"
          }`}
        >
          {lang}
        </button>
      ))}
    </div>
  );
}

function CurrencyToggle({ className = "" }: { className?: string }) {
  const { currency, setCurrency } = useCurrency();
  return (
    <label className={`relative flex items-center rounded-full border border-line text-[11px] font-semibold tracking-[0.14em] ${className}`}>
      <span className="sr-only">Currency</span>
      <select
        value={currency}
        onChange={(event) => setCurrency(event.target.value as (typeof CURRENCIES)[number])}
        className="appearance-none bg-transparent py-2 pl-3 pr-7 uppercase text-paper outline-none"
      >
        {CURRENCIES.map((code) => (
          <option key={code} value={code} className="bg-ink text-paper">
            {code}
          </option>
        ))}
      </select>
      <svg className="pointer-events-none absolute right-2.5 h-3 w-3 text-mute" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path d="M2.5 4.5 6 8l3.5-3.5" />
      </svg>
    </label>
  );
}

const menuList: Variants = {
  closed: {},
  open: { transition: { staggerChildren: 0.06, delayChildren: 0.25 } },
};
const menuItem: Variants = {
  closed: { y: "110%" },
  open: { y: "0%", transition: { duration: 0.9, ease: EASE } },
};

export default function Header() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const { getTotalItems } = useCart();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [lastPathname, setLastPathname] = useState(pathname);

  // Meniul se închide singur când se schimbă pagina
  if (lastPathname !== pathname) {
    setLastPathname(pathname);
    setMenuOpen(false);
  }

  useScrollLock(menuOpen);

  useMotionValueEvent(scrollY, "change", (current) => {
    const previous = scrollY.getPrevious() ?? 0;
    setScrolled(current > 40);
    setHidden(current > previous && current > 320);
  });

  const itemCount = getTotalItems();
  const showCurrency = pathname.startsWith("/shop") || pathname.startsWith("/checkout");
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  const cartButton = (
    <button
      type="button"
      onClick={() => setCartOpen(true)}
      className="relative flex h-10 w-10 items-center justify-center rounded-full border border-line transition-colors duration-300 hover:border-paper"
      aria-label="Open shopping cart"
    >
      <svg className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 7h12l-1 13H7L6 7Z M9 7a3 3 0 0 1 6 0" />
      </svg>
      {itemCount > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rec px-1 text-[10px] font-bold text-ink">
          {itemCount}
        </span>
      )}
    </button>
  );

  return (
    <>
      <motion.header
        initial={false}
        animate={{ y: hidden && !menuOpen ? "-110%" : "0%" }}
        transition={{ duration: 0.55, ease: EASE }}
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ${
          scrolled && !menuOpen ? "border-b border-line bg-ink/70 backdrop-blur-xl" : "border-b border-transparent"
        }`}
      >
        <div className="container-site flex h-16 items-center justify-between gap-6 md:h-20">
          <Link href="/" className="group flex items-center gap-3" aria-label="Zoomout_crew - Home">
            <Image
              src="/assets/logo.png"
              alt=""
              width={36}
              height={36}
              priority
              className="rounded-full transition-transform duration-700 ease-[var(--ease-expo)] group-hover:rotate-[20deg]"
            />
            <span className="font-display text-[17px] font-semibold tracking-tight">Zoomout_crew</span>
          </Link>

          <nav className="hidden items-center gap-9 lg:flex" aria-label="Main">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`group flex items-center gap-2 text-[15px] font-medium transition-colors ${
                  isActive(link.href) ? "text-paper" : "text-paper/75 hover:text-paper"
                }`}
              >
                {isActive(link.href) && <span className="rec-dot h-1.5 w-1.5" />}
                <RollText>{t(link.labelKey)}</RollText>
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 md:gap-3">
            <LanguageToggle className="hidden md:flex" />
            {showCurrency && <CurrencyToggle className="hidden md:flex" />}
            {cartButton}
            <Link href="/contact" className="btn-primary btn-sm hidden md:inline-flex">
              {t("common.quote")}
            </Link>
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              className="relative flex h-10 w-10 items-center justify-center rounded-full border border-line lg:hidden"
              aria-label={t("common.menu")}
              aria-expanded={menuOpen}
            >
              <span className={`absolute h-px w-4 bg-paper transition-transform duration-500 ease-[var(--ease-expo)] ${menuOpen ? "rotate-45" : "-translate-y-[3px]"}`} />
              <span className={`absolute h-px w-4 bg-paper transition-transform duration-500 ease-[var(--ease-expo)] ${menuOpen ? "-rotate-45" : "translate-y-[3px]"}`} />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Meniu mobil pe tot ecranul */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            className="fixed inset-0 z-40 flex flex-col bg-ink lg:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.8, ease: EASE }}
            data-lenis-prevent
          >
            <div className="container-site flex flex-1 flex-col justify-between overflow-y-auto pb-10 pt-28">
              <motion.ul variants={menuList} initial="closed" animate="open" className="space-y-1">
                {[{ href: "/", labelKey: "nav.home" }, ...NAV_LINKS].map((link) => (
                  <li key={link.href} className="overflow-hidden">
                    <motion.div variants={menuItem}>
                      <Link
                        href={link.href}
                        onClick={() => setMenuOpen(false)}
                        className={`flex items-baseline gap-3 py-1 font-display text-[13vw] font-semibold leading-[1] tracking-[-0.045em] sm:text-7xl ${
                          isActive(link.href) && link.href !== "/" ? "text-rec" : ""
                        }`}
                      >
                        {t(link.labelKey)}
                      </Link>
                    </motion.div>
                  </li>
                ))}
              </motion.ul>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: EASE, delay: 0.55 }}
                className="mt-12 space-y-6 border-t border-line pt-6"
              >
                <div className="flex items-center gap-3">
                  <LanguageToggle />
                  <CurrencyToggle />
                </div>
                <a href="mailto:contact@zoomoutcrew.com" className="block text-lg text-paper-dim">
                  contact@zoomoutcrew.com
                </a>
                <div className="flex gap-5 text-sm text-mute">
                  {SOCIALS.map((social) => (
                    <a key={social.name} href={social.href} target="_blank" rel="noopener noreferrer" className="hover:text-paper">
                      {social.name}
                    </a>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Cart isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
