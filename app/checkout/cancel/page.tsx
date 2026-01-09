"use client";

import Link from "next/link";
import Image from "next/image";

export default function CheckoutCancel() {
  return (
    <main className="min-h-screen text-white pt-24 pb-16 relative">
      {/* Background Image */}
      <div className="fixed inset-0 w-full h-full z-0">
        <Image
          src="/assets/backgrounds/2.jpg"
          alt="Cancel background"
          fill
          priority
          quality={75}
          sizes="100vw"
          className="object-cover"
        />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="liquid-glass-strong rounded-2xl p-6 md:p-8 text-center backdrop-blur-md">
          {/* Cancel Icon */}
          <div className="mb-6">
            <div className="w-20 h-20 md:w-24 md:h-24 mx-auto bg-yellow-500/20 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-12 h-12 md:w-16 md:h-16 text-yellow-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h1
              className="text-3xl md:text-4xl font-bold mb-2 text-white"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Plată anulată
            </h1>
            <p className="text-gray-300 text-sm md:text-base">
              Comanda ta a fost anulată. Nu a fost procesată nicio plată.
            </p>
          </div>

          {/* Info Message */}
          <div className="mb-6 p-4 bg-gray-800/50 rounded-lg">
            <p className="text-gray-300 text-sm">
              Dacă ai întrebări sau ai nevoie de asistență, te rugăm să ne contactezi.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/shop"
              className="liquid-glass-button text-white px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105 text-center"
              style={{ fontFamily: "var(--font-roboto)" }}
            >
              Înapoi la magazin
            </Link>
            <Link
              href="/contact"
              className="liquid-glass text-white px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105 text-center"
              style={{ fontFamily: "var(--font-roboto)" }}
            >
              Contactează-ne
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

