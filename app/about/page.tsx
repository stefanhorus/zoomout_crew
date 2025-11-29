"use client";

import { useState, useEffect } from "react";
import { Typewriter } from "react-simple-typewriter";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";

export default function About() {
  const { t, language } = useLanguage();
  const [showOriginalReview1, setShowOriginalReview1] = useState(false);
  const [showOriginalReview4, setShowOriginalReview4] = useState(false);

  // Reset review 1 to translated when language changes to Romanian
  useEffect(() => {
    if (language === "ro") {
      setShowOriginalReview1(false);
    }
  }, [language]);

  // Reset review 4 to translated when language changes to English
  useEffect(() => {
    if (language === "en") {
      setShowOriginalReview4(false);
    }
  }, [language]);
  
  return (
    <main className="min-h-screen text-white pt-24 pb-16 relative overflow-x-hidden">
      {/* Background Image */}
      <div className="fixed inset-0 w-full h-full z-0">
        <Image
          src="/assets/backgrounds/background4tiny.png"
          alt="About background"
          fill
          priority
          quality={75}
          sizes="100vw"
          className="object-cover"
        />
        {/* Dark overlay pentru contrast mai bun */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/45" />
      </div>

      {/* Futuristic Animated Background Orbs */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 rounded-full bg-blue-500 opacity-2 blur-3xl animate-float" style={{ animationDuration: '10s' }} />
        <div className="absolute bottom-40 right-20 w-96 h-96 rounded-full bg-purple-500 opacity-2 blur-3xl animate-float" style={{ animationDelay: '2s', animationDuration: '10s' }} />
        <div className="absolute top-1/2 left-1/3 w-80 h-80 rounded-full bg-cyan-500 opacity-2 blur-3xl animate-float" style={{ animationDelay: '4s', animationDuration: '10s' }} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Header Section */}
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="inline-block mb-4 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-full blur-lg opacity-20 animate-pulse-ring" />
            <h1 className="text-5xl md:text-6xl font-bold mb-4 relative" style={{ fontFamily: "var(--font-playfair)" }}>
              <Typewriter
                words={[t("about.title")]}
                loop={false}
                cursor
                cursorStyle="|"
                typeSpeed={90}
                deleteSpeed={0}
                delaySpeed={999999}
              />
            </h1>
          </div>
          <p className="text-gray-100 text-lg md:text-xl max-w-2xl mx-auto animate-slide-in-right drop-shadow-lg" style={{ animationDelay: '0.3s' }}>
            {t("about.subtitle")}
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-12">
          {/* Mission Section */}
          <section className="liquid-glass-strong rounded-2xl p-8 md:p-12 liquid-glass-hover animate-fade-in-up relative group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-transparent to-purple-500 opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-2xl" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 animate-text-shimmer text-white drop-shadow-lg" style={{ fontFamily: "var(--font-playfair)" }}>
                {t("about.mission")}
              </h2>
              <p className="text-gray-100 text-lg leading-relaxed mb-4 drop-shadow-md" style={{ fontFamily: "var(--font-roboto)" }}>
                {t("about.mission.text1")}
              </p>
              <p className="text-gray-100 text-lg leading-relaxed drop-shadow-md" style={{ fontFamily: "var(--font-roboto)" }}>
                {t("about.mission.text2")}
              </p>
            </div>
          </section>

          {/* Services Section */}
          <section className="liquid-glass-strong rounded-2xl p-8 md:p-12 liquid-glass-hover animate-fade-in-up relative group overflow-hidden" style={{ animationDelay: '0.2s' }}>
            <div className="absolute inset-0 bg-gradient-to-l from-purple-500 via-transparent to-cyan-500 opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-2xl" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 animate-text-shimmer text-white drop-shadow-lg" style={{ fontFamily: "var(--font-playfair)" }}>
                {t("about.whatWeDo")}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="liquid-glass rounded-xl p-6 liquid-glass-hover relative group overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-xl" />
                  <div className="relative z-10">
                    <h3 className="text-xl font-semibold mb-3 text-white drop-shadow-md" style={{ fontFamily: "var(--font-playfair)" }}>
                      {t("about.aerialCinematography")}
                    </h3>
                    <p className="text-gray-100 drop-shadow-sm" style={{ fontFamily: "var(--font-roboto)" }}>
                      {t("about.aerialCinematography.desc")}
                    </p>
                  </div>
                </div>
                <div className="liquid-glass rounded-xl p-6 liquid-glass-hover relative group overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-xl" />
                  <div className="relative z-10">
                    <h3 className="text-xl font-semibold mb-3 text-white drop-shadow-md" style={{ fontFamily: "var(--font-playfair)" }}>
                      {t("about.realEstate")}
                    </h3>
                    <p className="text-gray-100 drop-shadow-sm" style={{ fontFamily: "var(--font-roboto)" }}>
                      {t("about.realEstate.desc")}
                    </p>
                  </div>
                </div>
                <div className="liquid-glass rounded-xl p-6 liquid-glass-hover relative group overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-cyan-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-xl" />
                  <div className="relative z-10">
                    <h3 className="text-xl font-semibold mb-3 text-white drop-shadow-md" style={{ fontFamily: "var(--font-playfair)" }}>
                      {t("about.eventCoverage")}
                    </h3>
                    <p className="text-gray-100 drop-shadow-sm" style={{ fontFamily: "var(--font-roboto)" }}>
                      {t("about.eventCoverage.desc")}
                    </p>
                  </div>
                </div>
                <div className="liquid-glass rounded-xl p-6 liquid-glass-hover relative group overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-400 to-purple-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-xl" />
                  <div className="relative z-10">
                    <h3 className="text-xl font-semibold mb-3 text-white drop-shadow-md" style={{ fontFamily: "var(--font-playfair)" }}>
                      {t("about.commercial")}
                    </h3>
                    <p className="text-gray-100 drop-shadow-sm" style={{ fontFamily: "var(--font-roboto)" }}>
                      {t("about.commercial.desc")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Why Choose Us Section */}
          <section className="liquid-glass-strong rounded-2xl p-8 md:p-12 liquid-glass-hover animate-fade-in-up relative group overflow-hidden" style={{ animationDelay: '0.4s' }}>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-transparent to-purple-500 opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-2xl" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 animate-text-shimmer text-white drop-shadow-lg" style={{ fontFamily: "var(--font-playfair)" }}>
                {t("about.whyChoose")}
              </h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-4 group/item">
                  <svg className="w-6 h-6 text-white mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div className="group-hover/item:translate-x-2 transition-transform duration-300">
                    <h3 className="text-lg font-semibold mb-1 text-white drop-shadow-md" style={{ fontFamily: "var(--font-playfair)" }}>
                      {t("about.professionalEquipment")}
                    </h3>
                    <p className="text-gray-100 drop-shadow-sm" style={{ fontFamily: "var(--font-roboto)" }}>
                      {t("about.professionalEquipment.desc")}
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4 group/item">
                  <svg className="w-6 h-6 text-white mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div className="group-hover/item:translate-x-2 transition-transform duration-300">
                    <h3 className="text-lg font-semibold mb-1 text-white drop-shadow-md" style={{ fontFamily: "var(--font-playfair)" }}>
                      {t("about.creativeVision")}
                    </h3>
                    <p className="text-gray-100 drop-shadow-sm" style={{ fontFamily: "var(--font-roboto)" }}>
                      {t("about.creativeVision.desc")}
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4 group/item">
                  <svg className="w-6 h-6 text-white mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div className="group-hover/item:translate-x-2 transition-transform duration-300">
                    <h3 className="text-lg font-semibold mb-1 text-white drop-shadow-md" style={{ fontFamily: "var(--font-playfair)" }}>
                      {t("about.experiencedTeam")}
                    </h3>
                    <p className="text-gray-100 drop-shadow-sm" style={{ fontFamily: "var(--font-roboto)" }}>
                      {t("about.experiencedTeam.desc")}
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4 group/item">
                  <svg className="w-6 h-6 text-white mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div className="group-hover/item:translate-x-2 transition-transform duration-300">
                    <h3 className="text-lg font-semibold mb-1 text-white drop-shadow-md" style={{ fontFamily: "var(--font-playfair)" }}>
                      {t("about.reliableService")}
                    </h3>
                    <p className="text-gray-100 drop-shadow-sm" style={{ fontFamily: "var(--font-roboto)" }}>
                      {t("about.reliableService.desc")}
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </section>

          {/* Reviews Section */}
          <section className="liquid-glass-strong rounded-2xl p-8 md:p-12 liquid-glass-hover animate-fade-in-up relative group overflow-hidden" style={{ animationDelay: '0.5s' }}>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-transparent to-cyan-500 opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-2xl" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center animate-text-shimmer text-white drop-shadow-lg" style={{ fontFamily: "var(--font-playfair)" }}>
                {t("about.reviews.title")}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {/* Review 1 */}
                <div className="liquid-glass rounded-2xl p-6 md:p-8 liquid-glass-hover relative group/review overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/20">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 via-blue-500/5 to-transparent opacity-0 group-hover/review:opacity-100 transition-opacity duration-500 rounded-2xl" />
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-400/5 to-transparent rounded-full blur-3xl opacity-0 group-hover/review:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10">
                    {/* Quote Icon */}
                    <div className="mb-4 opacity-20 group-hover/review:opacity-40 transition-opacity">
                      <svg className="w-12 h-12 text-cyan-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.996 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.984zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                      </svg>
                    </div>
                    <div className="flex items-center gap-1 mb-5">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-5 h-5 text-yellow-400 fill-current drop-shadow-lg transform transition-transform group-hover/review:scale-110" style={{ transitionDelay: `${i * 50}ms` }} viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-gray-100 mb-4 italic text-base leading-relaxed drop-shadow-md group-hover/review:text-white transition-colors" style={{ fontFamily: "var(--font-roboto)" }}>
                      {language === "ro" ? (showOriginalReview1 ? t("about.reviews.review1.textOriginal") : t("about.reviews.review1.text")) : t("about.reviews.review1.textOriginal")}
                    </p>
                    {language === "ro" && (
                      <button
                        onClick={() => setShowOriginalReview1(!showOriginalReview1)}
                        className="mb-4 text-xs text-gray-400 hover:text-cyan-300 transition-colors underline"
                      >
                        {showOriginalReview1 ? t("about.reviews.showTranslated") : t("about.reviews.showOriginalEnglish")}
                      </button>
                    )}
                    <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                      <div className="w-12 h-12 rounded-lg overflow-hidden shadow-lg shadow-cyan-500/30 transform group-hover/review:scale-110 transition-transform ring-2 ring-cyan-400/30">
                        <Image
                          src="/assets/reviews/review1.png"
                          alt={t("about.reviews.review1.name")}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-white font-semibold text-base group-hover/review:text-cyan-100 transition-colors" style={{ fontFamily: "var(--font-playfair)" }}>
                          {t("about.reviews.review1.name")}
                        </p>
                        <p className="text-gray-400 text-sm" style={{ fontFamily: "var(--font-roboto)" }}>
                          {t("about.reviews.review1.role")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Review 4 - Florin Marius */}
                <div className="liquid-glass rounded-2xl p-6 md:p-8 liquid-glass-hover relative group/review overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/20">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 via-emerald-500/5 to-transparent opacity-0 group-hover/review:opacity-100 transition-opacity duration-500 rounded-2xl" />
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400/5 to-transparent rounded-full blur-3xl opacity-0 group-hover/review:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10">
                    {/* Quote Icon */}
                    <div className="mb-4 opacity-20 group-hover/review:opacity-40 transition-opacity">
                      <svg className="w-12 h-12 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.996 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.984zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                      </svg>
                    </div>
                    <div className="flex items-center gap-1 mb-5">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-5 h-5 text-yellow-400 fill-current drop-shadow-lg transform transition-transform group-hover/review:scale-110" style={{ transitionDelay: `${i * 50}ms` }} viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-gray-100 mb-4 italic text-base leading-relaxed drop-shadow-md group-hover/review:text-white transition-colors" style={{ fontFamily: "var(--font-roboto)" }}>
                      {language === "ro" ? t("about.reviews.review4.textOriginal") : (showOriginalReview4 ? t("about.reviews.review4.textOriginal") : t("about.reviews.review4.text"))}
                    </p>
                    {language === "en" && (
                      <button
                        onClick={() => setShowOriginalReview4(!showOriginalReview4)}
                        className="mb-4 text-xs text-gray-400 hover:text-green-300 transition-colors underline"
                      >
                        {showOriginalReview4 ? t("about.reviews.showTranslated") : t("about.reviews.showOriginal")}
                      </button>
                    )}
                    <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                      <div className="w-12 h-12 rounded-lg overflow-hidden shadow-lg shadow-green-500/30 transform group-hover/review:scale-110 transition-transform ring-2 ring-green-400/30">
                        <Image
                          src="/assets/reviews/review2.png"
                          alt={t("about.reviews.review4.name")}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-white font-semibold text-base group-hover/review:text-green-100 transition-colors" style={{ fontFamily: "var(--font-playfair)" }}>
                          {t("about.reviews.review4.name")}
                        </p>
                        <p className="text-gray-400 text-sm" style={{ fontFamily: "var(--font-roboto)" }}>
                          {t("about.reviews.review4.role")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="text-center liquid-glass-strong rounded-2xl p-8 md:p-12 liquid-glass-hover animate-fade-in-up relative group overflow-hidden" style={{ animationDelay: '0.6s' }}>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-2xl" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-text-shimmer text-white drop-shadow-lg" style={{ fontFamily: "var(--font-playfair)" }}>
                {t("about.readyToWork")}
              </h2>
              <p className="text-gray-100 text-lg mb-6 drop-shadow-md" style={{ fontFamily: "var(--font-roboto)" }}>
                {t("about.readyToWork.text")}
              </p>
              <a
                href="/contact"
                className="inline-block liquid-glass-button text-white px-8 py-3 rounded-xl font-semibold relative transform hover:scale-105 transition-transform"
                style={{ fontFamily: "var(--font-roboto)" }}
              >
                <span className="relative z-10">{t("about.getInTouch")}</span>
              </a>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

