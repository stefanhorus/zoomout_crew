"use client";

import { useState, Suspense } from "react";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getDiscountPercentageForCode } from "@/lib/discount-codes";

function CheckoutContent() {
  const { cart, getTotalPrice, clearCart } = useCart();
  const { t, language } = useLanguage();
  const { formatPrice, currency } = useCurrency();
  const router = useRouter();
  const [discountCode, setDiscountCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);
  const [discountError, setDiscountError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "revolut">("revolut");
  const [showStripeFallback, setShowStripeFallback] = useState(false);
  const [customerEmail, setCustomerEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const subtotal = getTotalPrice();
  const discountAmount = discountApplied ? subtotal * (discountPercentage / 100) : 0;
  const total = subtotal - discountAmount;

  const handleApplyDiscount = (codeOverride?: string) => {
    setDiscountError("");
    
    const code = (codeOverride ?? discountCode).trim().toUpperCase();
    const percentage = getDiscountPercentageForCode(code);
    
    if (percentage > 0) {
      setDiscountApplied(true);
      setDiscountPercentage(percentage);
      setDiscountCode(code);
      setDiscountError("");
    } else {
      setDiscountError(t("checkout.discountInvalid"));
      setDiscountApplied(false);
      setDiscountPercentage(0);
    }
  };

  const handleRemoveDiscount = () => {
    setDiscountApplied(false);
    setDiscountPercentage(0);
    setDiscountCode("");
    setDiscountError("");
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;

    // Validează emailul
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!customerEmail.trim()) {
      setEmailError(t("checkout.emailError.required"));
      return;
    }
    if (!emailRegex.test(customerEmail.trim())) {
      setEmailError(t("checkout.emailError.invalid"));
      return;
    }
    setEmailError("");

    // Verifică dacă comanda este gratuită (0 lei)
    if (total <= 0) {
      setIsProcessing(true);
      try {
        // Procesează comanda gratuită direct, fără gateway de plată
          const response = await fetch("/api/checkout/free", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              items: cart,
              customerEmail: customerEmail.trim(),
              discountPercentage: discountApplied ? discountPercentage : undefined,
              discountCode: discountApplied ? discountCode : undefined,
              language: language,
              currency: currency,
            }),
          });

        const data = await response.json();

        if (response.ok && data.success) {
          // Șterge coșul după procesarea comenzii gratuite
          clearCart();
          // Redirecționează la pagina de success
          router.push("/checkout/success?free=true");
          return;
        } else {
          throw new Error(data.error || "Failed to process free order");
        }
      } catch (error: any) {
        console.error("Free order error:", error);
        alert(error.message || t("checkout.error.freeOrder"));
        setIsProcessing(false);
        return;
      }
    }

    setIsProcessing(true);
    try {
      // Încearcă întâi Revolut Pay (metoda principală)
      if (paymentMethod === "revolut" || !showStripeFallback) {
        try {
          const response = await fetch("/api/revolut/checkout", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ 
              items: cart,
              discountCode: discountApplied ? discountCode : undefined,
              discountPercentage: discountApplied ? discountPercentage : undefined,
              customerEmail: customerEmail.trim(),
              language: language,
              currency: currency,
            }),
          });

          const data = await response.json();

          if (response.ok && data.checkoutUrl) {
            window.location.href = data.checkoutUrl;
            return;
          } else {
            // Dacă Revolut eșuează, oferă Stripe ca fallback
            console.warn("Revolut checkout failed, offering Stripe fallback");
            setShowStripeFallback(true);
            setPaymentMethod("stripe");
            // Continuă cu Stripe mai jos
          }
        } catch (revolutError) {
          // Dacă Revolut eșuează, oferă Stripe ca fallback
          console.warn("Revolut checkout error, offering Stripe fallback:", revolutError);
          setShowStripeFallback(true);
          setPaymentMethod("stripe");
          // Continuă cu Stripe mai jos
        }
      }

      // Fallback la Stripe (pentru țări fără Revolut Pay sau dacă Revolut eșuează)
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          items: cart,
          discountCode: discountApplied ? discountCode : undefined,
          discountPercentage: discountApplied ? discountPercentage : undefined,
          customerEmail: customerEmail.trim(),
          language: language,
          currency: currency,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout session");
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (error: any) {
      console.error("Checkout error:", error);
      alert(error.message || "A apărut o eroare la procesarea plății. Te rugăm să încerci din nou.");
      setIsProcessing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <main className="min-h-screen text-white pt-24 pb-16 relative">
        <div className="fixed inset-0 w-full h-full z-0">
          <Image
            src="/assets/backgrounds/2.jpg"
            alt="Checkout background"
            fill
            priority
            quality={75}
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center min-h-[60vh]">
          <div className="liquid-glass-strong rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "var(--font-playfair)" }}>
              {t("checkout.emptyCart")}
            </h2>
            <Link
              href="/shop"
              className="liquid-glass-button text-white px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105 inline-block"
              style={{ fontFamily: "var(--font-roboto)" }}
            >
              Continuă cumpărăturile
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen text-white pt-24 pb-16 relative">
      {/* Background Image */}
      <div className="fixed inset-0 w-full h-full z-0">
        <Image
          src="/assets/backgrounds/2.jpg"
          alt="Checkout background"
          fill
          priority
          quality={75}
          sizes="100vw"
          className="object-cover"
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ fontFamily: "var(--font-playfair)" }}>
            {t("checkout.title")}
          </h1>
          <p className="text-gray-300">{t("checkout.orderSummary")}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Order Summary */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="liquid-glass-strong rounded-2xl p-6 backdrop-blur-md">
              <h2 className="text-xl font-bold mb-4" style={{ fontFamily: "var(--font-playfair)" }}>
                {t("checkout.items")}
              </h2>
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex gap-4 pb-4 border-b border-gray-700 last:border-0">
                    <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white mb-1 truncate" style={{ fontFamily: "var(--font-playfair)" }}>
                        {item.product.name}
                      </h3>
                      <p className="text-gray-400 text-sm mb-2">
                        {t("checkout.quantity")}: {item.quantity}
                      </p>
                      <p className="text-white font-semibold">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer Email */}
            <div className="liquid-glass-strong rounded-2xl p-6 backdrop-blur-md">
              <h2 className="text-xl font-bold mb-4" style={{ fontFamily: "var(--font-playfair)" }}>
                {t("checkout.contactInfo")}
              </h2>
              <div className="mb-4">
                <label htmlFor="customerEmail" className="block text-gray-300 mb-2 text-sm font-semibold">
                  {t("checkout.emailAddress")} <span className="text-red-400">*</span>
                </label>
                <input
                  id="customerEmail"
                  type="email"
                  value={customerEmail}
                  onChange={(e) => {
                    setCustomerEmail(e.target.value);
                    setEmailError("");
                  }}
                  placeholder="exemplu@email.com"
                  required
                  className={`w-full px-4 py-3 rounded-xl liquid-glass-input text-white placeholder-gray-400 focus:outline-none focus:ring-2 ${
                    emailError ? "focus:ring-red-500 border-red-500" : "focus:ring-white/20"
                  }`}
                  style={{ fontFamily: "var(--font-roboto)" }}
                />
                {emailError && (
                  <p className="text-red-400 text-sm mt-2">{emailError}</p>
                )}
                <p className="text-gray-400 text-xs mt-2">
                  {t("checkout.emailHelper")}
                </p>
              </div>
            </div>

            {/* Discount Code */}
            <div className="liquid-glass-strong rounded-2xl p-6 backdrop-blur-md">
              <h2 className="text-xl font-bold mb-4" style={{ fontFamily: "var(--font-playfair)" }}>
                {t("checkout.discountCode")}
              </h2>
              {!discountApplied ? (
                <>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                      placeholder={t("checkout.discountCode")}
                      className="flex-1 px-4 py-3 rounded-xl liquid-glass-input text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20"
                      style={{ fontFamily: "var(--font-roboto)" }}
                    />
                    <button
                      onClick={() => handleApplyDiscount()}
                      disabled={!discountCode.trim()}
                      className="liquid-glass-button text-white px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ fontFamily: "var(--font-roboto)" }}
                    >
                      {t("checkout.applyDiscount")}
                    </button>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="text-gray-400 text-xs">{t("checkout.tryCode")}</span>
                    <button
                      type="button"
                      onClick={() => handleApplyDiscount("JOINTHECREW")}
                      className="text-xs font-semibold text-green-200 bg-green-500/20 px-2.5 py-1 rounded-lg border border-green-500/30 cursor-pointer hover:bg-green-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400/60"
                      style={{ fontFamily: "var(--font-roboto)" }}
                    >
                      JOINTHECREW (-50%)
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-between p-4 bg-green-500/20 rounded-xl border border-green-500/50">
                  <div>
                    <p className="text-green-400 font-semibold">
                      {t("checkout.discountApplied")}: {discountCode}
                    </p>
                    <p className="text-gray-300 text-sm">
                      {t("checkout.discount")}: {discountPercentage}%
                    </p>
                  </div>
                  <button
                    onClick={handleRemoveDiscount}
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
              {discountError && (
                <p className="text-red-400 text-sm mt-2">{discountError}</p>
              )}
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="liquid-glass-strong rounded-2xl p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-4" style={{ fontFamily: "var(--font-playfair)" }}>
                {t("checkout.orderSummary")}
              </h2>

              {/* Payment Method Info */}
              {showStripeFallback ? (
                <div className="mb-6 p-4 bg-yellow-500/20 rounded-xl border border-yellow-500/50">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div>
                      <p className="text-yellow-400 font-semibold text-sm mb-1">{t("checkout.revolutPay")} {t("checkout.notAvailable")}</p>
                      <p className="text-gray-300 text-xs">{t("checkout.stripeFallback")}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mb-6 p-4 bg-blue-500/20 rounded-xl border border-blue-500/50">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="text-blue-400 font-semibold text-sm">{t("checkout.revolutPay")}</p>
                      <p className="text-gray-300 text-xs">{t("checkout.revolutInfo")}</p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-300">
                  <span>{t("checkout.subtotal")}</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                {discountApplied && (
                  <div className="flex justify-between text-green-400">
                    <span>{t("checkout.discount")} ({discountPercentage}%)</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="border-t border-gray-700 pt-3 flex justify-between text-white font-bold text-lg">
                  <span>{t("checkout.total")}</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isProcessing || !customerEmail.trim()}
                className="w-full liquid-glass-button text-white py-4 rounded-xl font-semibold transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-center"
                style={{ fontFamily: "var(--font-roboto)" }}
              >
                {isProcessing ? t("checkout.processing") : t("checkout.continueToPayment")}
              </button>
              {!customerEmail.trim() && (
                <p className="text-yellow-400 text-xs mt-2 text-center">
                  {t("checkout.emailRequired")}
                </p>
              )}

              <Link
                href="/shop"
                className="block text-center text-gray-400 hover:text-white transition-colors mt-4 text-sm"
              >
                {t("checkout.backToShop")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen text-white pt-24 pb-16 relative flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </main>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}

