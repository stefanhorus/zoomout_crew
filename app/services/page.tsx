"use client";

import { useState, useEffect } from "react";
import { Typewriter } from "react-simple-typewriter";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import ImageSkeleton from "@/components/ImageSkeleton";

type ServiceCategory = "all" | "videography" | "production";
const SERVICES_DISCOUNT_PERCENT = 40;
const SERVICES_DISCOUNT_FACTOR = 1 - SERVICES_DISCOUNT_PERCENT / 100;

interface Service {
  id: number;
  title: string;
  category: ServiceCategory;
  icon: string;
  location: string;
  basePriceEUR: number;
  oldPriceSuffix: string;
  newPriceSuffix: string;
  priceNote?: string;
  description: string;
  features: string[];
  image: string;
}

const getServices = (t: (key: string) => string): Service[] => [
  {
    id: 1,
    title: t("services.aerialFilmingHour"),
    category: "videography",
    icon: "M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    location: "Cluj-Napoca,Romania",
    basePriceEUR: 100,
    oldPriceSuffix: t("services.price.hour"),
    newPriceSuffix: t("services.price.hour"),
    description: t("services.aerialFilmingHour.desc"),
    features: [
      t("services.aerialFilmingHour.feature1"),
      t("services.aerialFilmingHour.feature2"),
      t("services.aerialFilmingHour.feature3"),
      t("services.aerialFilmingHour.feature4")
    ],
    image: "/assets/services/hour.jpg",
  },
  {
    id: 2,
    title: t("services.aerialFilmingDay"),
    category: "videography",
    icon: "M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    location: "Cluj-Napoca,Romania",
    basePriceEUR: 350,
    oldPriceSuffix: t("services.price.day"),
    newPriceSuffix: t("services.price.day"),
    description: t("services.aerialFilmingDay.desc"),
    features: [
      t("services.aerialFilmingDay.feature1"),
      t("services.aerialFilmingDay.feature2"),
      t("services.aerialFilmingDay.feature3"),
      t("services.aerialFilmingDay.feature4")
    ],
    image: "/assets/services/fullday.png",
  },
  {
    id: 3,
    title: t("services.postProduction"),
    category: "production",
    icon: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h10a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z",
    location: "Cluj-Napoca,Romania",
    basePriceEUR: 80,
    oldPriceSuffix: t("services.price.video"),
    newPriceSuffix: t("services.price.video"),
    priceNote: t("services.price.discountMultiple"),
    description: t("services.postProduction.desc"),
    features: [
      t("services.postProduction.feature1"),
      t("services.postProduction.feature2"),
      t("services.postProduction.feature3"),
      t("services.postProduction.feature4"),
      t("services.postProduction.feature5")
    ],
    image: "/assets/services/postproduction.jpg",
  },
];

export default function Services() {
  const { t, language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory>("all");
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

  const formatEuro = (value: number) => (Number.isInteger(value) ? `${value}` : value.toFixed(2));

  // Update page title when language changes
  useEffect(() => {
    document.title = `${t("services.title")} - Zoomout_crew`;
  }, [language, t]);

  const categories: { value: ServiceCategory; label: string; labelKey: string }[] = [
    { value: "all", label: "All Services", labelKey: "services.allServices" },
    { value: "videography", label: "Filming", labelKey: "services.filming" },
    { value: "production", label: "Editing", labelKey: "services.editing" },
  ];

  const services = getServices(t);
  const filteredServices =
    selectedCategory === "all"
      ? services
      : services.filter((service) => service.category === selectedCategory);

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

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-8 md:mb-12 px-2">
          {categories.map((category) => (
            <button
              key={category.value}
              onClick={() => setSelectedCategory(category.value)}
              className={`px-4 py-1.5 md:px-6 md:py-2 rounded-xl font-semibold transition-all duration-300 text-sm md:text-base ${
                selectedCategory === category.value
                  ? "liquid-glass-button text-white scale-105"
                  : "liquid-glass liquid-glass-hover text-white"
              }`}
              style={{ fontFamily: "var(--font-roboto)" }}
            >
              {t(category.labelKey)}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredServices.map((service) => (
            (() => {
              const discountedPriceEUR = service.basePriceEUR * SERVICES_DISCOUNT_FACTOR;
              return (
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
                  <div
                    className="flex items-center gap-2 text-xs text-white/70 mb-3"
                    style={{ fontFamily: "var(--font-roboto)" }}
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M12 2a7 7 0 00-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 00-7-7zm0 9.5A2.5 2.5 0 1112 6a2.5 2.5 0 010 5.5z" />
                    </svg>
                    <span>{t("services.location")}</span>
                  </div>

                  {/* Price - Stylized */}
                  <div className="mb-3">
                    <div className="inline-block liquid-glass-button px-4 py-2 rounded-xl">
                      <div className="text-[11px] md:text-xs text-white/85 font-semibold mb-1" style={{ fontFamily: "var(--font-roboto)" }}>
                        {t("services.limitedTimeOffer")}
                      </div>
                      <div className="flex items-baseline gap-2">
                        <div className="text-sm md:text-base text-white/60 line-through" style={{ fontFamily: "var(--font-playfair)" }}>
                          {formatEuro(service.basePriceEUR)}€{service.oldPriceSuffix}
                        </div>
                        <div className="text-2xl md:text-3xl font-bold text-white" style={{ fontFamily: "var(--font-playfair)" }}>
                          {formatEuro(discountedPriceEUR)}€{service.newPriceSuffix}
                        </div>
                        <span className="text-[10px] md:text-xs font-semibold text-green-200 bg-green-500/20 px-2 py-1 rounded-lg border border-green-500/30 whitespace-nowrap shrink-0">
                          {t("services.offLabel")}
                        </span>
                      </div>
                      {service.priceNote && (
                        <div className="text-[10px] md:text-xs text-white/70 mt-1" style={{ fontFamily: "var(--font-roboto)" }}>
                          {service.priceNote}
                        </div>
                      )}
                    </div>
                </div>

                  <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">{service.description}</p>
                </div>
              </div>
            </div>
              );
            })()
          ))}
        </div>

        {/* Empty State */}
        {filteredServices.length === 0 && (
          <div className="text-center py-16">
            <p className="text-xl text-gray-400">{t("services.noServices")}</p>
          </div>
        )}
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
              <div
                className="flex items-center gap-2 text-sm text-white/75 mb-4"
                style={{ fontFamily: "var(--font-roboto)" }}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2a7 7 0 00-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 00-7-7zm0 9.5A2.5 2.5 0 1112 6a2.5 2.5 0 010 5.5z" />
                </svg>
                <span>{t("services.location")}</span>
              </div>

              {/* Price - Stylized */}
              <div className="mb-5 md:mb-6">
                <div className="inline-block liquid-glass-button px-4 py-2 md:px-6 md:py-3 rounded-xl">
                  <div className="text-xs md:text-sm text-white/85 font-semibold mb-1" style={{ fontFamily: "var(--font-roboto)" }}>
                    {t("services.limitedTimeOffer")}
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="text-base md:text-lg text-white/60 line-through" style={{ fontFamily: "var(--font-playfair)" }}>
                      {formatEuro(selectedService.basePriceEUR)}€{selectedService.oldPriceSuffix}
                    </div>
                    <div className="flex items-baseline gap-2">
                      <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white" style={{ fontFamily: "var(--font-playfair)" }}>
                        {formatEuro(selectedService.basePriceEUR * SERVICES_DISCOUNT_FACTOR)}€{selectedService.newPriceSuffix}
                      </div>
                      <span className="text-xs font-semibold text-green-200 bg-green-500/20 px-2 py-1 rounded-lg border border-green-500/30 whitespace-nowrap shrink-0">
                        {t("services.offLabel")}
                      </span>
                    </div>
                    {selectedService.priceNote && (
                      <div className="text-xs text-white/70 mt-1" style={{ fontFamily: "var(--font-roboto)" }}>
                        {selectedService.priceNote}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <p className="text-gray-300 text-base sm:text-lg mb-5 md:mb-6 leading-relaxed">
                {selectedService.description}
              </p>

              {/* Pricing Info for Post-Production */}
              {selectedService.id === 3 && (
                <div className="mb-5 md:mb-6 p-4 rounded-xl liquid-glass border border-white/10">
                  <h4 className="text-base sm:text-lg font-semibold mb-2 md:mb-3" style={{ fontFamily: "var(--font-playfair)" }}>
                    {t("services.postProduction.pricing")}
                  </h4>
                  <ul className="space-y-2 text-sm sm:text-base text-gray-300">
                    <li>
                      • {t("services.postProduction.pricing1")}{" "}
                      <span className="text-white/60 line-through mr-2">80€</span>
                      <span className="text-white font-semibold">{formatEuro(80 * SERVICES_DISCOUNT_FACTOR)}€</span>
                    </li>
                    <li>
                      • {t("services.postProduction.pricing2")}{" "}
                      <span className="text-white/60 line-through mr-2">72€/video</span>
                      <span className="text-white font-semibold">{formatEuro(72 * SERVICES_DISCOUNT_FACTOR)}€/video</span>
                    </li>
                    <li>
                      • {t("services.postProduction.pricing3")}{" "}
                      <span className="text-white/60 line-through mr-2">64€/video</span>
                      <span className="text-white font-semibold">{formatEuro(64 * SERVICES_DISCOUNT_FACTOR)}€/video</span>
                    </li>
                  </ul>
                </div>
              )}

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
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
