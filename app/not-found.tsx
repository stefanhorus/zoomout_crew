"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

export default function NotFound() {
  const { t, language } = useLanguage();

  useEffect(() => {
    document.title = `404 - ${t("notFound.title")} | Zoomout_crew`;
  }, [language, t]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-4 py-16 relative">
      {/* Background Image */}
      <div className="fixed inset-0 w-full h-full z-0">
        <Image
          src="/assets/backgrounds/backgroundtiny.png"
          alt="404 background"
          fill
          priority
          quality={75}
          sizes="100vw"
          className="object-cover brightness-50"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-2xl w-full text-center">
        {/* 404 Number */}
        <div className="mb-8">
          <h1 className="text-8xl sm:text-9xl md:text-[12rem] font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 animate-text-shimmer" style={{ fontFamily: "var(--font-playfair)" }}>
            404
          </h1>
        </div>

        {/* Message */}
        <div className="liquid-glass-strong rounded-2xl p-8 md:p-12 mb-8 backdrop-blur-md">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-white" style={{ fontFamily: "var(--font-playfair)" }}>
            {t("notFound.title")}
          </h2>
          <p className="text-gray-300 text-lg sm:text-xl mb-6 leading-relaxed">
            {t("notFound.description")}
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
            <Link
              href="/"
              className="liquid-glass-button text-white px-8 py-3 rounded-xl font-semibold transition-all hover:scale-105 hover:shadow-2xl"
              style={{ fontFamily: "var(--font-roboto)" }}
            >
              {t("notFound.backHome")}
            </Link>
            <Link
              href="/portfolio"
              className="liquid-glass text-white px-8 py-3 rounded-xl font-semibold transition-all hover:scale-105 liquid-glass-hover"
              style={{ fontFamily: "var(--font-roboto)" }}
            >
              {t("notFound.viewPortfolio")}
            </Link>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <Link
            href="/services"
            className="liquid-glass text-center p-4 rounded-xl hover:scale-105 transition-all liquid-glass-hover"
          >
            <p className="text-sm text-gray-300">{t("nav.services")}</p>
          </Link>
          <Link
            href="/shop"
            className="liquid-glass text-center p-4 rounded-xl hover:scale-105 transition-all liquid-glass-hover"
          >
            <p className="text-sm text-gray-300">{t("nav.shop")}</p>
          </Link>
          <Link
            href="/about"
            className="liquid-glass text-center p-4 rounded-xl hover:scale-105 transition-all liquid-glass-hover"
          >
            <p className="text-sm text-gray-300">{t("nav.about")}</p>
          </Link>
          <Link
            href="/contact"
            className="liquid-glass text-center p-4 rounded-xl hover:scale-105 transition-all liquid-glass-hover"
          >
            <p className="text-sm text-gray-300">{t("nav.contact")}</p>
          </Link>
        </div>
      </div>
    </main>
  );
}
