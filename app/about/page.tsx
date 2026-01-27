"use client";

import { useState, useEffect } from "react";
import { Typewriter } from "react-simple-typewriter";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";

export default function About() {
  const { t, language } = useLanguage();
  const [showOriginalReview1, setShowOriginalReview1] = useState(false);
  const [showOriginalReview4, setShowOriginalReview4] = useState(false);
  const [showOriginalReview5, setShowOriginalReview5] = useState(false);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

  // Update page title when language changes
  useEffect(() => {
    document.title = `${t("about.title")} - Zoomout_crew`;
  }, [language, t]);

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

  // Reset review 5 to translated when language changes to Romanian
  useEffect(() => {
    if (language === "ro") {
      setShowOriginalReview5(false);
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

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header Section */}
        <div className="text-center mb-10 md:mb-16 animate-fade-in-up">
          <div className="inline-block mb-3 md:mb-4 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-full blur-lg opacity-20 animate-pulse-ring" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-4 relative px-2" style={{ fontFamily: "var(--font-playfair)" }}>
              <Typewriter
                key={language}
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
          <p className="text-gray-100 text-base sm:text-lg md:text-xl max-w-2xl mx-auto animate-slide-in-right drop-shadow-lg px-2" style={{ animationDelay: '0.3s' }}>
            {t("about.subtitle")}
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-8 md:space-y-12">
          {/* Mission Section */}
          <section className="liquid-glass liquid-glass-hover rounded-2xl p-5 sm:p-6 md:p-8 lg:p-12 backdrop-blur-md animate-fade-in-up relative group overflow-hidden">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 md:mb-6 animate-text-shimmer text-white drop-shadow-lg" style={{ fontFamily: "var(--font-playfair)" }}>
              {t("about.mission")}
            </h2>
            <p className="text-gray-100 text-base sm:text-lg leading-relaxed mb-3 md:mb-4 drop-shadow-md" style={{ fontFamily: "var(--font-roboto)" }}>
              {t("about.mission.text1")}
            </p>
            <p className="text-gray-100 text-base sm:text-lg leading-relaxed drop-shadow-md" style={{ fontFamily: "var(--font-roboto)" }}>
              {t("about.mission.text2")}
            </p>
          </section>

          {/* Services Section */}
          <section className="liquid-glass rounded-2xl p-5 sm:p-6 md:p-8 lg:p-12 liquid-glass-hover animate-fade-in-up relative group overflow-hidden" style={{ animationDelay: '0.2s' }}>
            <div className="absolute inset-0 bg-gradient-to-l from-purple-500 via-transparent to-cyan-500 opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-2xl" />
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 md:mb-6 animate-text-shimmer text-white drop-shadow-lg" style={{ fontFamily: "var(--font-playfair)" }}>
                {t("about.whatWeDo")}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="liquid-glass rounded-xl p-4 sm:p-5 md:p-6 liquid-glass-hover backdrop-blur-md relative group overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-400 to-purple-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-xl" />
                  <div className="relative z-10">
                    <h3 className="text-lg sm:text-xl font-semibold mb-2 md:mb-3 text-white drop-shadow-md" style={{ fontFamily: "var(--font-playfair)" }}>
                      {t("about.commercial")}
                    </h3>
                    <p className="text-gray-100 text-sm sm:text-base drop-shadow-sm" style={{ fontFamily: "var(--font-roboto)" }}>
                      {t("about.commercial.desc")}
                    </p>
                  </div>
                </div>
                <div className="liquid-glass rounded-xl p-4 sm:p-5 md:p-6 liquid-glass-hover backdrop-blur-md relative group overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-cyan-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-xl" />
                  <div className="relative z-10">
                    <h3 className="text-lg sm:text-xl font-semibold mb-2 md:mb-3 text-white drop-shadow-md" style={{ fontFamily: "var(--font-playfair)" }}>
                      {t("about.eventCoverage")}
                    </h3>
                    <p className="text-gray-100 text-sm sm:text-base drop-shadow-sm" style={{ fontFamily: "var(--font-roboto)" }}>
                      {t("about.eventCoverage.desc")}
                    </p>
                  </div>
                </div>
                <div className="liquid-glass rounded-xl p-4 sm:p-5 md:p-6 liquid-glass-hover backdrop-blur-md relative group overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-xl" />
                  <div className="relative z-10">
                    <h3 className="text-lg sm:text-xl font-semibold mb-2 md:mb-3 text-white drop-shadow-md" style={{ fontFamily: "var(--font-playfair)" }}>
                      {t("about.realEstate")}
                    </h3>
                    <p className="text-gray-100 text-sm sm:text-base drop-shadow-sm" style={{ fontFamily: "var(--font-roboto)" }}>
                      {t("about.realEstate.desc")}
                    </p>
                  </div>
                </div>
                <div className="liquid-glass rounded-xl p-4 sm:p-5 md:p-6 liquid-glass-hover backdrop-blur-md relative group overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-xl" />
                  <div className="relative z-10">
                    <h3 className="text-lg sm:text-xl font-semibold mb-2 md:mb-3 text-white drop-shadow-md" style={{ fontFamily: "var(--font-playfair)" }}>
                      {t("about.aerialCinematography")}
                    </h3>
                    <p className="text-gray-100 text-sm sm:text-base drop-shadow-sm" style={{ fontFamily: "var(--font-roboto)" }}>
                      {t("about.aerialCinematography.desc")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Why Choose Us Section */}
          <section className="liquid-glass liquid-glass-hover rounded-2xl p-5 sm:p-6 md:p-8 lg:p-12 backdrop-blur-md animate-fade-in-up relative group overflow-hidden" style={{ animationDelay: '0.4s' }}>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 md:mb-6 animate-text-shimmer text-white drop-shadow-lg" style={{ fontFamily: "var(--font-playfair)" }}>
              {t("about.whyChoose")}
            </h2>
            <ul className="space-y-3 md:space-y-4">
              <li className="flex items-start gap-3 md:gap-4 group/item">
                <svg className="w-5 h-5 md:w-6 md:h-6 text-white mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div className="group-hover/item:translate-x-2 transition-transform duration-300">
                  <h3 className="text-base sm:text-lg font-semibold mb-1 text-white drop-shadow-md" style={{ fontFamily: "var(--font-playfair)" }}>
                    {t("about.professionalEquipment")}
                  </h3>
                  <p className="text-gray-100 text-sm sm:text-base drop-shadow-sm" style={{ fontFamily: "var(--font-roboto)" }}>
                    {t("about.professionalEquipment.desc")}
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3 md:gap-4 group/item">
                <svg className="w-5 h-5 md:w-6 md:h-6 text-white mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div className="group-hover/item:translate-x-2 transition-transform duration-300">
                  <h3 className="text-base sm:text-lg font-semibold mb-1 text-white drop-shadow-md" style={{ fontFamily: "var(--font-playfair)" }}>
                    {t("about.creativeVision")}
                  </h3>
                  <p className="text-gray-100 text-sm sm:text-base drop-shadow-sm" style={{ fontFamily: "var(--font-roboto)" }}>
                    {t("about.creativeVision.desc")}
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3 md:gap-4 group/item">
                <svg className="w-5 h-5 md:w-6 md:h-6 text-white mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div className="group-hover/item:translate-x-2 transition-transform duration-300">
                  <h3 className="text-base sm:text-lg font-semibold mb-1 text-white drop-shadow-md" style={{ fontFamily: "var(--font-playfair)" }}>
                    {t("about.experiencedTeam")}
                  </h3>
                  <p className="text-gray-100 text-sm sm:text-base drop-shadow-sm" style={{ fontFamily: "var(--font-roboto)" }}>
                    {t("about.experiencedTeam.desc")}
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3 md:gap-4 group/item">
                <svg className="w-5 h-5 md:w-6 md:h-6 text-white mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div className="group-hover/item:translate-x-2 transition-transform duration-300">
                  <h3 className="text-base sm:text-lg font-semibold mb-1 text-white drop-shadow-md" style={{ fontFamily: "var(--font-playfair)" }}>
                    {t("about.reliableService")}
                  </h3>
                  <p className="text-gray-100 text-sm sm:text-base drop-shadow-sm" style={{ fontFamily: "var(--font-roboto)" }}>
                    {t("about.reliableService.desc")}
                  </p>
                </div>
              </li>
            </ul>
          </section>

          {/* Reviews Section */}
          <section className="liquid-glass-strong rounded-3xl p-5 sm:p-6 md:p-8 lg:p-12 liquid-glass-hover animate-fade-in-up relative group overflow-visible" style={{ animationDelay: '0.5s', backgroundColor: 'rgba(0, 0, 0, 0.4)' }}>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-transparent to-cyan-500 opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-3xl" />
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 md:mb-12 text-center animate-text-shimmer text-white drop-shadow-lg" style={{ fontFamily: "var(--font-playfair)" }}>
                {t("about.reviews.title")}
              </h2>
              
              {/* Mobile: Grid Layout */}
              <div className="grid grid-cols-1 md:hidden gap-4 p-2">
                {/* Review 1 */}
                <div className="liquid-glass liquid-glass-hover rounded-3xl p-4 sm:p-5 md:p-6 lg:p-8 backdrop-blur-md relative group/review overflow-visible transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/20">
                    {/* Profile Picture and Name - Top */}
                    <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-5 pb-3 md:pb-4 border-b border-white/10">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg overflow-hidden shadow-lg shadow-cyan-500/30 transform group-hover/review:scale-110 transition-transform ring-2 ring-cyan-400/30">
                        <Image
                          src="/assets/reviews/review1.png"
                          alt={t("about.reviews.review1.name")}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-white font-semibold text-sm md:text-base group-hover/review:text-cyan-100 transition-colors" style={{ fontFamily: "var(--font-playfair)" }}>
                          {t("about.reviews.review1.name")}
                        </p>
                        <p className="text-gray-400 text-xs md:text-sm" style={{ fontFamily: "var(--font-roboto)" }}>
                          {t("about.reviews.review1.role")}
                        </p>
                      </div>
                    </div>
                    {/* Quote Icon */}
                    <div className="mb-2 md:mb-4 opacity-20 group-hover/review:opacity-40 transition-opacity">
                      <svg className="w-8 h-8 md:w-12 md:h-12 text-cyan-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.996 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.984zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                      </svg>
                    </div>
                    <div className="flex items-center gap-1 mb-3 md:mb-5">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-4 h-4 md:w-5 md:h-5 text-yellow-400 fill-current drop-shadow-lg transform transition-transform group-hover/review:scale-110" style={{ transitionDelay: `${i * 50}ms` }} viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-gray-100 mb-3 md:mb-4 italic text-sm sm:text-base leading-relaxed drop-shadow-md group-hover/review:text-white transition-colors" style={{ fontFamily: "var(--font-roboto)" }}>
                      {language === "ro" ? (showOriginalReview1 ? t("about.reviews.review1.textOriginal") : t("about.reviews.review1.text")) : t("about.reviews.review1.textOriginal")}
                    </p>
                    {language === "ro" && (
                      <button
                        onClick={() => setShowOriginalReview1(!showOriginalReview1)}
                        className="mb-3 md:mb-4 text-xs text-gray-400 hover:text-cyan-300 transition-colors underline"
                      >
                        {showOriginalReview1 ? t("about.reviews.showTranslated") : t("about.reviews.showOriginalEnglish")}
                      </button>
                    )}
                </div>

                {/* Review 4 - Florin Marius */}
                <div className="liquid-glass liquid-glass-hover rounded-3xl p-4 sm:p-5 md:p-6 lg:p-8 backdrop-blur-md relative group/review overflow-visible transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/20">
                    {/* Profile Picture and Name - Top */}
                    <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-5 pb-3 md:pb-4 border-b border-white/10">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg overflow-hidden shadow-lg shadow-green-500/30 transform group-hover/review:scale-110 transition-transform ring-2 ring-green-400/30">
                        <Image
                          src="/assets/reviews/review2.png"
                          alt={t("about.reviews.review4.name")}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-white font-semibold text-sm md:text-base group-hover/review:text-green-100 transition-colors" style={{ fontFamily: "var(--font-playfair)" }}>
                          {t("about.reviews.review4.name")}
                        </p>
                        <p className="text-gray-400 text-xs md:text-sm" style={{ fontFamily: "var(--font-roboto)" }}>
                          {t("about.reviews.review4.role")}
                        </p>
                      </div>
                    </div>
                    {/* Quote Icon */}
                    <div className="mb-2 md:mb-4 opacity-20 group-hover/review:opacity-40 transition-opacity">
                      <svg className="w-8 h-8 md:w-12 md:h-12 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.996 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.984zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                      </svg>
                    </div>
                    <div className="flex items-center gap-1 mb-3 md:mb-5">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-4 h-4 md:w-5 md:h-5 text-yellow-400 fill-current drop-shadow-lg transform transition-transform group-hover/review:scale-110" style={{ transitionDelay: `${i * 50}ms` }} viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-gray-100 mb-3 md:mb-4 italic text-sm sm:text-base leading-relaxed drop-shadow-md group-hover/review:text-white transition-colors" style={{ fontFamily: "var(--font-roboto)" }}>
                      {language === "ro" ? t("about.reviews.review4.textOriginal") : (showOriginalReview4 ? t("about.reviews.review4.textOriginal") : t("about.reviews.review4.text"))}
                    </p>
                    {language === "en" && (
                      <button
                        onClick={() => setShowOriginalReview4(!showOriginalReview4)}
                        className="mb-3 md:mb-4 text-xs text-gray-400 hover:text-green-300 transition-colors underline"
                      >
                        {showOriginalReview4 ? t("about.reviews.showTranslated") : t("about.reviews.showOriginal")}
                      </button>
                    )}
                </div>

                {/* Review 5 - Rotaract Charity Duck Race */}
                <div className="liquid-glass liquid-glass-hover rounded-3xl p-4 sm:p-5 md:p-6 lg:p-8 backdrop-blur-md relative group/review overflow-visible transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20">
                    {/* Profile Picture and Name - Top */}
                    <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-5 pb-3 md:pb-4 border-b border-white/10">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg overflow-hidden shadow-lg shadow-purple-500/30 transform group-hover/review:scale-110 transition-transform ring-2 ring-purple-400/30">
                        <Image
                          src="/assets/brands/rotaract.png"
                          alt={t("about.reviews.review5.name")}
                          width={48}
                          height={48}
                          className="w-full h-full object-contain bg-white/10"
                        />
                      </div>
                      <div>
                        <p className="text-white font-semibold text-sm md:text-base group-hover/review:text-purple-100 transition-colors" style={{ fontFamily: "var(--font-playfair)" }}>
                          {t("about.reviews.review5.name")}
                        </p>
                        <p className="text-gray-400 text-xs md:text-sm" style={{ fontFamily: "var(--font-roboto)" }}>
                          {t("about.reviews.review5.role")}
                        </p>
                      </div>
                    </div>
                    {/* Quote Icon */}
                    <div className="mb-2 md:mb-4 opacity-20 group-hover/review:opacity-40 transition-opacity">
                      <svg className="w-8 h-8 md:w-12 md:h-12 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.996 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.984zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                      </svg>
                    </div>
                    <div className="flex items-center gap-1 mb-3 md:mb-5">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-4 h-4 md:w-5 md:h-5 text-yellow-400 fill-current drop-shadow-lg transform transition-transform group-hover/review:scale-110" style={{ transitionDelay: `${i * 50}ms` }} viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-gray-100 mb-3 md:mb-4 italic text-sm sm:text-base leading-relaxed drop-shadow-md group-hover/review:text-white transition-colors" style={{ fontFamily: "var(--font-roboto)" }}>
                      {language === "ro" ? (showOriginalReview5 ? t("about.reviews.review5.textOriginal") : t("about.reviews.review5.text")) : t("about.reviews.review5.textOriginal")}
                    </p>
                    {language === "ro" && (
                      <button
                        onClick={() => setShowOriginalReview5(!showOriginalReview5)}
                        className="mb-3 md:mb-4 text-xs text-gray-400 hover:text-purple-300 transition-colors underline"
                      >
                        {showOriginalReview5 ? t("about.reviews.showTranslated") : t("about.reviews.showOriginalEnglish")}
                      </button>
                    )}
                </div>
              </div>

              {/* Desktop: Carousel Layout */}
              <div className="hidden md:block relative px-12 md:px-16 lg:px-20 py-2">
                <div className="relative overflow-hidden">
                  <div 
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${currentReviewIndex * 50}%)` }}
                  >
                    {/* Review 1 */}
                    <div className="w-1/2 flex-shrink-0 px-3 py-2">
                      <div className="liquid-glass liquid-glass-hover rounded-3xl p-6 lg:p-8 backdrop-blur-md relative group/review overflow-visible transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/20 h-full">
                          {/* Profile Picture and Name - Top */}
                          <div className="flex items-center gap-4 mb-5 pb-4 border-b border-white/10">
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
                      </div>
                    </div>

                    {/* Review 4 */}
                    <div className="w-1/2 flex-shrink-0 px-3 py-2">
                      <div className="liquid-glass liquid-glass-hover rounded-3xl p-6 lg:p-8 backdrop-blur-md relative group/review overflow-visible transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/20 h-full">
                          {/* Profile Picture and Name - Top */}
                          <div className="flex items-center gap-4 mb-5 pb-4 border-b border-white/10">
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
                      </div>
                    </div>

                    {/* Review 5 */}
                    <div className="w-1/2 flex-shrink-0 px-3 py-2">
                      <div className="liquid-glass liquid-glass-hover rounded-3xl p-6 lg:p-8 backdrop-blur-md relative group/review overflow-visible transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20 h-full">
                          {/* Profile Picture and Name - Top */}
                          <div className="flex items-center gap-4 mb-5 pb-4 border-b border-white/10">
                            <div className="w-12 h-12 rounded-lg overflow-hidden shadow-lg shadow-purple-500/30 transform group-hover/review:scale-110 transition-transform ring-2 ring-purple-400/30">
                              <Image
                                src="/assets/brands/rotaract.png"
                                alt={t("about.reviews.review5.name")}
                                width={48}
                                height={48}
                                className="w-full h-full object-contain bg-white/10"
                              />
                            </div>
                            <div>
                              <p className="text-white font-semibold text-base group-hover/review:text-purple-100 transition-colors" style={{ fontFamily: "var(--font-playfair)" }}>
                                {t("about.reviews.review5.name")}
                              </p>
                              <p className="text-gray-400 text-sm" style={{ fontFamily: "var(--font-roboto)" }}>
                                {t("about.reviews.review5.role")}
                              </p>
                            </div>
                          </div>
                          <div className="mb-4 opacity-20 group-hover/review:opacity-40 transition-opacity">
                            <svg className="w-12 h-12 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
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
                            {language === "ro" ? (showOriginalReview5 ? t("about.reviews.review5.textOriginal") : t("about.reviews.review5.text")) : t("about.reviews.review5.textOriginal")}
                          </p>
                          {language === "ro" && (
                            <button
                              onClick={() => setShowOriginalReview5(!showOriginalReview5)}
                              className="mb-4 text-xs text-gray-400 hover:text-purple-300 transition-colors underline"
                            >
                              {showOriginalReview5 ? t("about.reviews.showTranslated") : t("about.reviews.showOriginalEnglish")}
                            </button>
                          )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Navigation Arrows */}
                <button
                  onClick={() => setCurrentReviewIndex((prev) => (prev === 0 ? 1 : prev - 1))}
                  disabled={currentReviewIndex === 0}
                  className={`absolute left-0 top-1/2 -translate-y-1/2 z-20 backdrop-blur-md text-white rounded-full p-3 md:p-4 transition-all shadow-lg border border-white/20 ${
                    currentReviewIndex === 0
                      ? 'bg-black/20 opacity-40 cursor-not-allowed'
                      : 'liquid-glass-button hover:scale-110 hover:shadow-2xl cursor-pointer'
                  }`}
                  aria-label="Previous reviews"
                >
                  <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={() => setCurrentReviewIndex((prev) => (prev === 1 ? 0 : prev + 1))}
                  disabled={currentReviewIndex === 1}
                  className={`absolute right-0 top-1/2 -translate-y-1/2 z-20 backdrop-blur-md text-white rounded-full p-3 md:p-4 transition-all shadow-lg border border-white/20 ${
                    currentReviewIndex === 1
                      ? 'bg-black/20 opacity-40 cursor-not-allowed'
                      : 'liquid-glass-button hover:scale-110 hover:shadow-2xl cursor-pointer'
                  }`}
                  aria-label="Next reviews"
                >
                  <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Indicators */}
                <div className="flex items-center justify-center gap-2 mt-8">
                  <button
                    onClick={() => setCurrentReviewIndex(0)}
                    className={`h-2 rounded-full transition-all ${
                      currentReviewIndex === 0 ? 'w-8 bg-white' : 'w-2 bg-white/50'
                    }`}
                    aria-label="Go to first page"
                  />
                  <button
                    onClick={() => setCurrentReviewIndex(1)}
                    className={`h-2 rounded-full transition-all ${
                      currentReviewIndex === 1 ? 'w-8 bg-white' : 'w-2 bg-white/50'
                    }`}
                    aria-label="Go to second page"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="text-center liquid-glass liquid-glass-hover rounded-2xl p-5 sm:p-6 md:p-8 lg:p-12 backdrop-blur-md animate-fade-in-up relative group overflow-hidden" style={{ animationDelay: '0.6s' }}>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4 animate-text-shimmer text-white drop-shadow-lg" style={{ fontFamily: "var(--font-playfair)" }}>
              {t("about.readyToWork")}
            </h2>
            <p className="text-gray-100 text-base sm:text-lg mb-5 md:mb-6 drop-shadow-md" style={{ fontFamily: "var(--font-roboto)" }}>
              {t("about.readyToWork.text")}
            </p>
            <a
              href="/contact"
              className="inline-block liquid-glass-button text-white px-8 py-3 rounded-xl font-semibold relative transform hover:scale-105 transition-transform"
              style={{ fontFamily: "var(--font-roboto)" }}
            >
              <span className="relative z-10">{t("about.getInTouch")}</span>
            </a>
          </section>
        </div>
      </div>
    </main>
  );
}

