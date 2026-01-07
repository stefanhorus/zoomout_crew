"use client";

import { useState, Suspense } from "react";
import { useCart } from "@/contexts/CartContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

function CheckoutContent() {
  const { cart, getTotalPrice } = useCart();
  const router = useRouter();
  const [discountCode, setDiscountCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);
  const [discountError, setDiscountError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "revolut">("revolut");

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ro-RO", {
      style: "currency",
      currency: "RON",
    }).format(price);
  };

  const subtotal = getTotalPrice();
  const discountAmount = discountApplied ? subtotal * (discountPercentage / 100) : 0;
  const total = subtotal - discountAmount;

  const handleApplyDiscount = () => {
    setDiscountError("");
    
    // Coduri de discount simple (poți extinde cu o bază de date sau API)
    const validCodes: { [key: string]: number } = {
      "FREE": 100,
      "WELCOME10": 10,
      "SAVE20": 20,
      "ZOOMOUT15": 15,
      "FIRST25": 25,
      "ALIS20": 20,
    };

    const code = discountCode.trim().toUpperCase();
    
    if (validCodes[code]) {
      setDiscountApplied(true);
      setDiscountPercentage(validCodes[code]);
      setDiscountError("");
    } else {
      setDiscountError("Cod de discount invalid sau expirat");
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

    setIsProcessing(true);
    try {
      const apiEndpoint = paymentMethod === "revolut" 
        ? "/api/revolut/checkout" 
        : "/api/checkout";

      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          items: cart,
          discountCode: discountApplied ? discountCode : undefined,
          discountPercentage: discountApplied ? discountPercentage : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout session");
      }

      // Redirecționează către checkout
      const checkoutUrl = paymentMethod === "revolut" 
        ? data.checkoutUrl 
        : data.url;

      if (checkoutUrl) {
        window.location.href = checkoutUrl;
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
              Coșul tău este gol
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
            Finalizează comanda
          </h1>
          <p className="text-gray-300">Verifică detaliile comenzii și completează plata</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Order Summary */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="liquid-glass-strong rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4" style={{ fontFamily: "var(--font-playfair)" }}>
                Produsele tale
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
                        Cantitate: {item.quantity}
                      </p>
                      <p className="text-white font-semibold">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Discount Code */}
            <div className="liquid-glass-strong rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4" style={{ fontFamily: "var(--font-playfair)" }}>
                Cod de discount
              </h2>
              {!discountApplied ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                    placeholder="Introdu codul de discount"
                    className="flex-1 px-4 py-3 rounded-xl liquid-glass-input text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20"
                    style={{ fontFamily: "var(--font-roboto)" }}
                  />
                  <button
                    onClick={handleApplyDiscount}
                    disabled={!discountCode.trim()}
                    className="liquid-glass-button text-white px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ fontFamily: "var(--font-roboto)" }}
                  >
                    Aplică
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between p-4 bg-green-500/20 rounded-xl border border-green-500/50">
                  <div>
                    <p className="text-green-400 font-semibold">
                      Cod aplicat: {discountCode}
                    </p>
                    <p className="text-gray-300 text-sm">
                      Reducere: {discountPercentage}%
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
                Rezumat comandă
              </h2>

              {/* Payment Method Selection */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-300 mb-3">Metodă de plată</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setPaymentMethod("revolut")}
                    className={`w-full p-3 rounded-xl border-2 transition-all text-left ${
                      paymentMethod === "revolut"
                        ? "border-white bg-white/10"
                        : "border-gray-700 bg-gray-800/50 hover:border-gray-600"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-white">Revolut Pay</p>
                        <p className="text-xs text-gray-400">Plată directă în Revolut</p>
                      </div>
                      {paymentMethod === "revolut" && (
                        <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center">
                          <div className="w-3 h-3 rounded-full bg-black"></div>
                        </div>
                      )}
                    </div>
                  </button>
                  <button
                    onClick={() => setPaymentMethod("stripe")}
                    className={`w-full p-3 rounded-xl border-2 transition-all text-left ${
                      paymentMethod === "stripe"
                        ? "border-white bg-white/10"
                        : "border-gray-700 bg-gray-800/50 hover:border-gray-600"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-white">Card (Stripe)</p>
                        <p className="text-xs text-gray-400">Visa, Mastercard, etc.</p>
                      </div>
                      {paymentMethod === "stripe" && (
                        <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center">
                          <div className="w-3 h-3 rounded-full bg-black"></div>
                        </div>
                      )}
                    </div>
                  </button>
                </div>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-300">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                {discountApplied && (
                  <div className="flex justify-between text-green-400">
                    <span>Reducere ({discountPercentage}%)</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="border-t border-gray-700 pt-3 flex justify-between text-white font-bold text-lg">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isProcessing}
                className="w-full liquid-glass-button text-white py-4 rounded-xl font-semibold transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-center"
                style={{ fontFamily: "var(--font-roboto)" }}
              >
                {isProcessing ? "Se procesează..." : "Continuă către plată"}
              </button>

              <Link
                href="/shop"
                className="block text-center text-gray-400 hover:text-white transition-colors mt-4 text-sm"
              >
                ← Înapoi la magazin
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

