"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { EASE } from "./motion/ease";
import { useScrollLock } from "./motion/SmoothScroll";

export default function Cart({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { cart, removeFromCart, getTotalPrice, clearCart } = useCart();
  const { t } = useLanguage();
  const { formatPrice } = useCurrency();
  const router = useRouter();

  useScrollLock(isOpen);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    onClose();
    router.push("/checkout");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="cart-overlay"
            className="fixed inset-0 z-[60] bg-ink/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={onClose}
          />
          <motion.aside
            key="cart-panel"
            className="fixed right-0 top-0 z-[61] flex h-full w-full flex-col border-l border-line bg-ink-2 sm:w-[420px]"
            initial={{ x: "100%" }}
            animate={{ x: "0%" }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.7, ease: EASE }}
            aria-label={t("cart.title")}
          >
            <div className="flex items-center justify-between border-b border-line px-6 py-5">
              <h2 className="text-2xl font-semibold">{t("cart.title")}</h2>
              <button
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-line transition-colors hover:border-paper"
                aria-label={t("cart.close")}
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
                  <path strokeLinecap="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6" data-lenis-prevent>
              {cart.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <p className="text-lg text-mute">{t("cart.empty")}</p>
                </div>
              ) : (
                <ul className="space-y-4">
                  {cart.map((item) => (
                    <li key={item.product.id} className="flex gap-4 rounded-2xl border border-line p-3">
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-ink-3">
                        <Image src={item.product.image} alt={item.product.name} fill sizes="80px" className="object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-base font-semibold">{item.product.name}</h3>
                        <p className="mt-1 text-sm text-paper-dim">{formatPrice(item.product.price)}</p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="self-start p-1 text-mute transition-colors hover:text-rec"
                        aria-label={`Remove ${item.product.name}`}
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
                          <path strokeLinecap="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {cart.length > 0 && (
              <div className="space-y-3 border-t border-line px-6 py-6">
                <div className="flex items-baseline justify-between">
                  <span className="text-mute">{t("cart.total")}</span>
                  <span className="font-display text-3xl font-semibold">{formatPrice(getTotalPrice())}</span>
                </div>
                <button onClick={handleCheckout} className="btn-primary w-full">
                  {t("cart.checkout")}
                </button>
                <button onClick={clearCart} className="btn-ghost btn-sm w-full">
                  {t("cart.clear")}
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
