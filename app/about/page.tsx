"use client";

import { Typewriter } from "react-simple-typewriter";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";

export default function About() {
  const { t } = useLanguage();
  
  return (
    <main className="min-h-screen text-white pt-24 pb-16 relative overflow-x-hidden">
      {/* Background Image */}
      <div className="fixed inset-0 w-full h-full z-0">
        <Image
          src="/background4.jpg"
          alt="About background"
          fill
          priority
          quality={75}
          sizes="100vw"
          className="object-cover"
        />
        {/* Dark overlay pentru contrast mai bun */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/75" />
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

