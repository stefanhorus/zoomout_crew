"use client";

import { useState } from "react";
import { Typewriter } from "react-simple-typewriter";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import ImageSkeleton from "@/components/ImageSkeleton";

interface Service {
  id: number;
  title: string;
  showLocation: boolean; // Serviciile de filmare afișează locația; post-producția se poate face de oriunde
  description: string;
  features: string[];
  image: string;
}

// Cheia de traducere a fiecărui serviciu: services.<key>, services.<key>.desc, services.<key>.feature1-4
const SERVICE_DEFINITIONS: Array<{ id: number; key: string; showLocation: boolean; image: string }> = [
  { id: 1, key: "commercials", showLocation: true, image: "/assets/services/hour.jpg" },
  { id: 2, key: "socialMedia", showLocation: true, image: "/assets/adventures/ams1tiny.png" },
  { id: 3, key: "events", showLocation: true, image: "/assets/photos/ratuste1.png" },
  { id: 4, key: "musicVideos", showLocation: true, image: "/assets/backgrounds/2.jpg" },
  { id: 5, key: "drone", showLocation: true, image: "/assets/services/fullday.png" },
  { id: 6, key: "postProduction", showLocation: false, image: "/assets/services/postproduction.jpg" },
];

const getServices = (t: (key: string) => string): Service[] =>
  SERVICE_DEFINITIONS.map(({ id, key, showLocation, image }) => ({
    id,
    title: t(`services.${key}`),
    showLocation,
    description: t(`services.${key}.desc`),
    features: [1, 2, 3, 4].map((n) => t(`services.${key}.feature${n}`)),
    image,
  }));

export default function Services() {
  const { t, language } = useLanguage();
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

  const services = getServices(t);

  return (
    <main className="min-h-screen text-white pt-24 pb-16 relative">
      {/* Background Image */}
      <div className="fixed inset-0 w-full h-full z-0">
        <Image
          src="/assets/backgrounds/background7tiny.jpg"
          alt="Services background"
          fill
          priority
          quality={75}
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header Section */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-4 px-2" style={{ fontFamily: "var(--font-playfair)" }}>
            <Typewriter
              key={language}
              words={[t("services.title")]}
              loop={false}
              cursor
              cursorStyle="|"
              typeSpeed={90}
              deleteSpeed={0}
              delaySpeed={999999}
            />
          </h1>
          <p className="text-gray-300 text-base sm:text-lg md:text-xl px-2">
            {t("services.subtitle")}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {services.map((service) => (
            <div
              key={service.id}
              onClick={() => setSelectedService(service)}
              className="group relative overflow-hidden rounded-2xl cursor-pointer liquid-glass liquid-glass-hover backdrop-blur-md h-full flex flex-col"
            >
              {/* Service Image */}
              <div className="aspect-video relative overflow-hidden">
                {!loadedImages.has(service.id) && (
                  <ImageSkeleton className="absolute inset-0" aspectRatio="video" />
                )}
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className={`object-cover transition-all duration-500 group-hover:scale-110 ${
                    loadedImages.has(service.id) ? 'opacity-100' : 'opacity-0'
                  }`}
                  onLoad={() => setLoadedImages(prev => new Set(prev).add(service.id))}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20 group-hover:from-black/60 group-hover:via-black/30 group-hover:to-black/10 transition-all duration-300" />
              </div>

              {/* Service Info */}
              <div className="p-5 relative flex-1 flex flex-col justify-between">
                <div>
                  <h3
                    className="text-lg md:text-xl font-semibold mb-3 group-hover:text-white transition-colors"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    {service.title}
                  </h3>
                  {service.showLocation && (
                    <div
                      className="flex items-center gap-2 text-xs text-white/70 mb-3"
                      style={{ fontFamily: "var(--font-roboto)" }}
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M12 2a7 7 0 00-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 00-7-7zm0 9.5A2.5 2.5 0 1112 6a2.5 2.5 0 010 5.5z" />
                      </svg>
                      <span>{t("services.location")}</span>
                    </div>
                  )}

                  <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">{service.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for Service Details */}
      {selectedService && (
        <div
          className="fixed inset-0 z-50 flex items-start md:items-center justify-center bg-black/95 backdrop-blur-sm p-0 md:p-4 lg:p-6 overflow-y-auto animate-fade-in"
          onClick={() => setSelectedService(null)}
        >
          <div
            className="relative max-w-4xl w-full liquid-glass-strong rounded-none md:rounded-2xl overflow-hidden my-0 md:my-4 min-h-screen md:min-h-0 max-h-screen md:max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button - Top Right Corner of Modal (like Portfolio) */}
            <button
              onClick={() => setSelectedService(null)}
              className="absolute top-3 right-3 md:top-4 md:right-4 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors z-30"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Modal Image */}
            <div className="flex-shrink-0 bg-black overflow-hidden">
              <div className="relative w-full bg-black overflow-hidden flex items-center justify-center h-[40vh] md:h-[45vh]">
                <img
                  src={selectedService.image}
                  alt={selectedService.title}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-5 sm:p-6 md:p-8 overflow-y-auto flex-1">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4" style={{ fontFamily: "var(--font-playfair)" }}>
                {selectedService.title}
              </h2>
              {selectedService.showLocation && (
                <div
                  className="flex items-center gap-2 text-sm text-white/75 mb-4"
                  style={{ fontFamily: "var(--font-roboto)" }}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 2a7 7 0 00-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 00-7-7zm0 9.5A2.5 2.5 0 1112 6a2.5 2.5 0 010 5.5z" />
                  </svg>
                  <span>{t("services.location")}</span>
                </div>
              )}

              <p className="text-gray-300 text-base sm:text-lg mb-5 md:mb-6 leading-relaxed">
                {selectedService.description}
              </p>

              {/* Features */}
              <div className="mb-6 md:mb-8 pb-4 md:pb-0">
                <h3 className="text-lg sm:text-xl font-semibold mb-3 md:mb-4" style={{ fontFamily: "var(--font-playfair)" }}>
                  {t("services.highlights")}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedService.features.map((feature, index) => (
                    <span key={index} className="liquid-glass px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-white text-xs sm:text-sm md:text-base">
                      {feature}
                    </span>
                  ))}
              </div>
              </div>

              {/* Cerere ofertă - prețurile se discută individual, prin pagina de contact */}
              <Link
                href="/contact"
                className="inline-block liquid-glass-button text-white px-6 py-3 md:px-8 md:py-4 rounded-xl font-semibold text-sm md:text-base transition-all hover:scale-105 mb-4 md:mb-0"
                style={{ fontFamily: "var(--font-roboto)" }}
              >
                {t("services.getQuote")}
              </Link>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
