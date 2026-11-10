"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";

function CheckoutSuccessContent() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const isFree = searchParams.get("free") === "true";
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    if (isFree) {
      // Pentru comenzile gratuite, nu trebuie să încărcăm sesiunea
      setLoading(false);
    } else if (sessionId) {
      fetch(`/api/checkout/session?session_id=${sessionId}`)
        .then((res) => res.json())
        .then((data) => {
          setSession(data.session);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching session:", error);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [sessionId, isFree]);

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("ro-RO", {
      style: "currency",
      currency: "RON",
    }).format(amount / 100); // Stripe returnează în cenți
  };

  return (
    <div className="liquid-glass-strong rounded-2xl p-6 md:p-8 text-center">
      {loading ? (
        <div className="py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-gray-300">Se încarcă...</p>
        </div>
      ) : (
        <>
          {/* Success Icon */}
          <div className="mb-6">
            <div className="w-20 h-20 md:w-24 md:h-24 mx-auto bg-green-500/20 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-12 h-12 md:w-16 md:h-16 text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1
              className="text-3xl md:text-4xl font-bold mb-2 text-white"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              {isFree ? t("checkout.success.freeTitle") : t("checkout.success.title")}
            </h1>
            <p className="text-gray-300 text-sm md:text-base">
              {t("checkout.success.message")}
            </p>
          </div>

          {/* Session Details */}
          {(session || isFree) && (
            <div className="mb-6 p-4 bg-gray-800/50 rounded-lg text-left">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">{t("checkout.success.total")}</span>
                  <span className="text-white font-semibold">
                    {isFree ? "0.00 RON" : formatPrice(session.amount_total)}
                  </span>
                </div>
                {isFree && (
                  <div className="mt-2 p-3 bg-green-500/20 rounded-lg border border-green-500/50">
                    <p className="text-green-400 text-sm font-semibold">
                      {t("checkout.success.freeMessage")}
                    </p>
                  </div>
                )}
                {session?.customer_details?.email && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Email:</span>
                    <span className="text-white">{session.customer_details.email}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/shop"
              className="liquid-glass-button text-white px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105 text-center"
              style={{ fontFamily: "var(--font-roboto)" }}
            >
              {t("checkout.success.continueShopping")}
            </Link>
            <Link
              href="/"
              className="liquid-glass text-white px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105 text-center"
              style={{ fontFamily: "var(--font-roboto)" }}
            >
              {t("checkout.success.home")}
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

export default function CheckoutSuccess() {
  return (
    <main className="min-h-screen text-white pt-24 pb-16 relative">
      {/* Background Image */}
      <div className="fixed inset-0 w-full h-full z-0">
        <Image
          src="/assets/backgrounds/2.jpg"
          alt="Success background"
          fill
          priority
          quality={75}
          sizes="100vw"
          className="object-cover"
        />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <Suspense
          fallback={
            <div className="liquid-glass-strong rounded-2xl p-6 md:p-8 text-center backdrop-blur-md">
              <div className="py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                <p className="text-gray-300">Se încarcă...</p>
              </div>
            </div>
          }
        >
          <CheckoutSuccessContent />
        </Suspense>
      </div>
    </main>
  );
}

