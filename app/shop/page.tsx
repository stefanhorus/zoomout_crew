"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { EASE } from "@/components/motion/ease";
import { Reveal } from "@/components/motion/Reveal";
import { useScrollLock } from "@/components/motion/SmoothScroll";
import { PageHeader } from "@/components/site/PageHeader";
import { useCart } from "@/contexts/CartContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { products, type Product, type ProductCategory } from "@/lib/products";

const CATEGORIES: Array<{ value: ProductCategory; labelKey: string }> = [
  { value: "all", labelKey: "shop.allProducts" },
  { value: "luts", labelKey: "shop.luts" },
  { value: "lightroom-presets", labelKey: "shop.lightroomPresets" },
  { value: "sound-design", labelKey: "shop.soundDesign" },
  { value: "transitions", labelKey: "shop.transitions" },
  { value: "bundle", labelKey: "shop.bundle" },
  { value: "other", labelKey: "shop.other" },
];

// Cât economisești la pachete față de produsele luate separat (aceleași valori ca pe site-ul actual)
const BUNDLE_SAVINGS: Record<number, number> = { 11: 1000, 12: 450 };

export default function Shop() {
  const { t, language } = useLanguage();
  const { formatPrice } = useCurrency();
  const { addToCart } = useCart();
  const [promoCopied, setPromoCopied] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showNewsletterPopup, setShowNewsletterPopup] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  useScrollLock(selectedProduct !== null);

  // Popup-ul de newsletter apare o singură dată, după o secundă
  useEffect(() => {
    if (localStorage.getItem("newsletter_popup_seen")) return;
    const timer = setTimeout(() => setShowNewsletterPopup(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!selectedProduct) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setSelectedProduct(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedProduct]);

  const description = (product: Product) => (language === "ro" && product.descriptionRo ? product.descriptionRo : product.description);

  const handleNewsletterClose = () => {
    setShowNewsletterPopup(false);
    localStorage.setItem("newsletter_popup_seen", "true");
  };

  const handleCopyPromoCode = async () => {
    try {
      await navigator.clipboard.writeText("JOINTHECREW");
      setPromoCopied(true);
      window.setTimeout(() => setPromoCopied(false), 1400);
    } catch {
      // clipboard indisponibil - ignorăm
    }
  };

  const handleNewsletterSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const cleanedEmail = newsletterEmail.trim().toLowerCase();
    if (!cleanedEmail || !cleanedEmail.includes("@") || !cleanedEmail.includes(".")) {
      setNewsletterStatus("error");
      return;
    }
    setNewsletterStatus("sending");
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email: cleanedEmail }),
      });
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        setNewsletterStatus("error");
        return;
      }
      const data = await response.json();
      if (response.ok && data.success) {
        setNewsletterStatus("success");
        setTimeout(handleNewsletterClose, 2000);
      } else {
        setNewsletterStatus("error");
      }
    } catch {
      setNewsletterStatus("error");
    }
  };

  // Cardul produsului "zboară" spre iconița coșului din header
  const animateToCart = (buttonElement: HTMLElement) => {
    const productCard = buttonElement.closest<HTMLElement>("[data-product-card]");
    if (!productCard) return;
    const cardRect = productCard.getBoundingClientRect();
    const cartButtons = Array.from(document.querySelectorAll<HTMLElement>('button[aria-label="Open shopping cart"]'));
    const cartIcon =
      cartButtons.find((button) => {
        const rect = button.getBoundingClientRect();
        return rect.width > 0 && rect.top >= 0 && rect.bottom <= window.innerHeight;
      }) ?? cartButtons[0];
    if (!cartIcon) return;

    const cartRect = cartIcon.getBoundingClientRect();
    const deltaX = cartRect.left + cartRect.width / 2 - (cardRect.left + cardRect.width / 2);
    const deltaY = cartRect.top + cartRect.height / 2 - (cardRect.top + cardRect.height / 2);
    const duration = Math.min(1000, Math.hypot(deltaX, deltaY) * 1.2);

    const flyingCard = productCard.cloneNode(true) as HTMLElement;
    flyingCard.style.cssText = `position:fixed;left:${cardRect.left}px;top:${cardRect.top}px;width:${cardRect.width}px;height:${cardRect.height}px;pointer-events:none;z-index:9999;opacity:0.95;border-radius:16px;overflow:hidden;`;
    document.body.appendChild(flyingCard);
    productCard.style.opacity = "0.3";
    productCard.style.transition = "opacity 0.3s";
    void flyingCard.offsetHeight;
    flyingCard.style.transition = `transform ${duration}ms cubic-bezier(0.25,0.46,0.45,0.94), opacity ${duration}ms ease-out`;
    flyingCard.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(0.15)`;
    flyingCard.style.opacity = "0";
    setTimeout(() => {
      productCard.style.opacity = "1";
      flyingCard.remove();
    }, duration);
  };

  const handleAddToCart = (product: Product, event?: React.MouseEvent<HTMLButtonElement>) => {
    if (event?.currentTarget) animateToCart(event.currentTarget);
    setTimeout(() => addToCart(product), 50);
  };

  const filteredProducts = selectedCategory === "all" ? products : products.filter((product) => product.category === selectedCategory);

  return (
    <>
      <PageHeader kicker={t("shop.title")} title={t("shop2.title")} intro={t("shop.subtitle")}>
        {/* Cod promo */}
        <Reveal delay={0.45} className="mt-10">
          <button
            type="button"
            onClick={handleCopyPromoCode}
            className="group flex w-full max-w-xl items-center justify-between gap-4 rounded-2xl border border-rec/40 bg-rec/10 px-5 py-4 text-left transition-colors duration-300 hover:border-rec"
            aria-label="Promo code JOINTHECREW"
          >
            <span className="flex items-center gap-3 text-sm font-medium md:text-base">
              <span className="rec-dot shrink-0" />
              {promoCopied ? t("promo.copied") : t("promo.jointhecrew")}
            </span>
            <span className="shrink-0 rounded-full bg-paper px-3 py-1.5 text-[11px] font-bold tracking-[0.14em] text-ink transition-colors group-hover:bg-rec">
              {t("promo.copy")}
            </span>
          </button>
        </Reveal>

        <Reveal delay={0.55} className="mt-10">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((category) => {
              const active = selectedCategory === category.value;
              return (
                <button
                  key={category.value}
                  type="button"
                  onClick={() => setSelectedCategory(category.value)}
                  aria-pressed={active}
                  className={`rounded-full border px-5 py-2.5 text-sm font-medium transition-colors duration-300 ${
                    active ? "border-paper bg-paper text-ink" : "border-line hover:border-paper"
                  }`}
                >
                  {t(category.labelKey)}
                </button>
              );
            })}
          </div>
        </Reveal>
      </PageHeader>

      <section className="container-site pb-28 md:pb-40">
        <motion.div layout className="grid grid-cols-1 gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product, index) => (
              <motion.article
                key={product.id}
                layout
                data-product-card
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.8, ease: EASE, delay: Math.min(index, 8) * 0.04 }}
                className="group flex flex-col bg-ink"
              >
                <button
                  type="button"
                  onClick={() => setSelectedProduct(product)}
                  className="relative aspect-square overflow-hidden rounded-2xl bg-ink-2"
                  data-cursor={t("cursor.view")}
                  aria-label={`${product.name} - ${t("shop2.details")}`}
                >
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-[1.2s] ease-[var(--ease-expo)] group-hover:scale-105"
                  />
                  {product.discountPercentage && (
                    <span className="absolute right-3 top-3 rounded-full bg-rec px-3 py-1.5 text-xs font-bold text-ink">-{product.discountPercentage}%</span>
                  )}
                  {product.category === "bundle" && product.originalPrice && (
                    <span className="absolute left-3 top-3 rounded-full bg-paper px-3 py-1.5 text-xs font-bold text-ink">
                      {t("shop.save")} {formatPrice(BUNDLE_SAVINGS[product.id] ?? product.originalPrice - product.price)}
                    </span>
                  )}
                </button>

                <div className="mt-5 flex flex-1 flex-col">
                  <h3 className="text-xl font-semibold tracking-tight">{product.name}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-mute">{description(product)}</p>
                  <div className="mt-5 flex items-end justify-between gap-4">
                    <div>
                      {product.originalPrice && <p className="text-sm text-mute line-through">{formatPrice(product.originalPrice)}</p>}
                      <p className="font-display text-2xl font-semibold tracking-tight">{formatPrice(product.price)}</p>
                    </div>
                    <button
                      type="button"
                      onClick={(event) => handleAddToCart(product, event)}
                      disabled={!product.inStock}
                      className="btn-primary btn-sm disabled:opacity-40"
                    >
                      {t("shop.addToCart")}
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredProducts.length === 0 && <p className="py-20 text-center text-xl text-mute">{t("shop.noProducts")}</p>}
      </section>

      {/* Detaliile produsului */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            key="product-modal"
            className="fixed inset-0 z-[70] bg-ink/95 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            role="dialog"
            aria-modal="true"
            aria-label={selectedProduct.name}
          >
            <div className="h-full overflow-y-auto" data-lenis-prevent onClick={() => setSelectedProduct(null)}>
              <motion.div
                className="container-site grid min-h-full items-center gap-10 py-24 lg:grid-cols-2 lg:gap-16"
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: EASE }}
              >
                <div className="relative aspect-square overflow-hidden rounded-2xl bg-ink-2" onClick={(event) => event.stopPropagation()}>
                  <Image src={selectedProduct.image} alt={selectedProduct.name} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
                </div>
                <div onClick={(event) => event.stopPropagation()}>
                  <p className="kicker">{t(CATEGORIES.find((c) => c.value === selectedProduct.category)?.labelKey ?? "shop.title")}</p>
                  <h2 className="display-md mt-5">{selectedProduct.name}</h2>
                  <p className="mt-8 whitespace-pre-line leading-relaxed text-paper-dim">{description(selectedProduct)}</p>
                  <div className="mt-10 flex flex-wrap items-end justify-between gap-6 border-t border-line pt-8">
                    <div>
                      {selectedProduct.originalPrice && (
                        <p className="text-mute line-through">{formatPrice(selectedProduct.originalPrice)}</p>
                      )}
                      <p className="font-display text-4xl font-semibold tracking-tight">{formatPrice(selectedProduct.price)}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        addToCart(selectedProduct);
                        setSelectedProduct(null);
                      }}
                      disabled={!selectedProduct.inStock}
                      className="btn-primary disabled:opacity-40"
                    >
                      {t("shop.addToCart")}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
            <button
              type="button"
              onClick={() => setSelectedProduct(null)}
              className="fixed right-5 top-5 flex h-12 w-12 items-center justify-center rounded-full border border-line bg-ink/60 backdrop-blur-md transition-colors hover:border-paper md:right-8 md:top-8"
              aria-label={t("common.close")}
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
                <path strokeLinecap="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Newsletter */}
      <AnimatePresence>
        {showNewsletterPopup && (
          <motion.div
            key="newsletter"
            className="fixed bottom-4 left-4 right-4 z-[65] mx-auto max-w-md rounded-3xl border border-line bg-ink-2 p-6 shadow-2xl sm:left-auto sm:right-6 sm:bottom-6 md:p-8"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.8, ease: EASE }}
            role="dialog"
            aria-label={t("newsletter.title")}
          >
            <button
              type="button"
              onClick={handleNewsletterClose}
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-line text-mute transition-colors hover:border-paper hover:text-paper"
              aria-label={t("common.close")}
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                <path strokeLinecap="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
            <p className="kicker flex items-center gap-2">
              <span className="rec-dot h-1.5 w-1.5" /> Newsletter
            </p>
            <h2 className="mt-4 pr-8 text-2xl font-semibold tracking-tight">{t("newsletter.title")}</h2>
            <p className="mt-3 text-sm text-paper-dim">{t("newsletter.text")}</p>
            {newsletterStatus === "success" ? (
              <p className="mt-6 font-medium text-paper">{t("newsletter.success")}</p>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="mt-6 space-y-3">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(event) => setNewsletterEmail(event.target.value)}
                  placeholder={t("newsletter.placeholder")}
                  required
                  autoComplete="email"
                  inputMode="email"
                  disabled={newsletterStatus === "sending"}
                  className="w-full rounded-full border border-line bg-ink px-5 py-3.5 text-sm text-paper placeholder:text-mute focus:border-paper focus:outline-none"
                />
                <button type="submit" disabled={newsletterStatus === "sending" || !newsletterEmail.trim()} className="btn-primary w-full disabled:opacity-50">
                  {newsletterStatus === "sending" ? t("newsletter.subscribing") : t("newsletter.subscribe")}
                </button>
                {newsletterStatus === "error" && <p className="text-sm text-rec">{t("newsletter.error")}</p>}
              </form>
            )}
            <button type="button" onClick={handleNewsletterClose} className="link-line mt-4 text-xs text-mute hover:text-paper">
              {t("newsletter.later")}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
