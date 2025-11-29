"use client";

import { useState } from "react";
import { Typewriter } from "react-simple-typewriter";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";

type ServiceCategory = "all" | "videography" | "production";

interface Service {
  id: number;
  title: string;
  category: ServiceCategory;
  icon: string;
  price: string;
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
    price: "70€/hour",
    description: t("services.aerialFilmingHour.desc"),
    features: [
      t("services.aerialFilmingHour.feature1"),
      t("services.aerialFilmingHour.feature2"),
      t("services.aerialFilmingHour.feature3"),
      t("services.aerialFilmingHour.feature4")
    ],
    image: "/assets/backgrounds/background4tiny.png",
  },
  {
    id: 2,
    title: t("services.aerialFilmingDay"),
    category: "videography",
    icon: "M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    price: "250€/day",
    description: t("services.aerialFilmingDay.desc"),
    features: [
      t("services.aerialFilmingDay.feature1"),
      t("services.aerialFilmingDay.feature2"),
      t("services.aerialFilmingDay.feature3"),
      t("services.aerialFilmingDay.feature4")
    ],
    image: "/assets/backgrounds/background5.jpg",
  },
  {
    id: 3,
    title: t("services.postProduction"),
    category: "production",
    icon: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h10a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z",
    price: "50€/video (discount for multiple)",
    description: t("services.postProduction.desc"),
    features: [
      t("services.postProduction.feature1"),
      t("services.postProduction.feature2"),
      t("services.postProduction.feature3"),
      t("services.postProduction.feature4"),
      t("services.postProduction.feature5")
    ],
    image: "/assets/backgrounds/background3.jpg",
  },
];

export default function Services() {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory>("all");
  const [selectedService, setSelectedService] = useState<Service | null>(null);

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
      <div className="absolute inset-0 w-full h-full z-0">
        <Image
          src="/assets/backgrounds/background5.jpg"
          alt="Services background"
          fill
          priority
          quality={75}
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-4" style={{ fontFamily: "var(--font-playfair)" }}>
            <Typewriter
              words={[t("services.title")]}
              loop={false}
              cursor
              cursorStyle="|"
              typeSpeed={90}
              deleteSpeed={0}
              delaySpeed={999999}
            />
          </h1>
          <p className="text-gray-300">
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
            <div
              key={service.id}
              onClick={() => setSelectedService(service)}
              className="group relative overflow-hidden rounded-2xl cursor-pointer liquid-glass liquid-glass-hover h-full flex flex-col"
            >
              {/* Service Image */}
              <div className="aspect-video relative overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20 group-hover:from-black/60 group-hover:via-black/30 group-hover:to-black/10 transition-all duration-300" />
                
                {/* Play Icon Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="bg-white/20 backdrop-blur-md rounded-full p-4 transform scale-75 group-hover:scale-100 transition-transform duration-300 shadow-2xl">
                    <svg
                      className="w-12 h-12 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                  </svg>
                  </div>
                </div>
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

                  {/* Price - Stylized */}
                  <div className="mb-3">
                    <div className="inline-block liquid-glass-button px-4 py-2 rounded-xl">
                      <div className="text-2xl md:text-3xl font-bold text-white mb-0.5" style={{ fontFamily: "var(--font-playfair)" }}>
                        {service.price}
                      </div>
                    </div>
                </div>

                  <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">{service.description}</p>
                </div>
              </div>
            </div>
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 md:p-6 overflow-y-auto animate-fade-in"
          onClick={() => setSelectedService(null)}
        >
          <div
            className="max-w-4xl w-full liquid-glass-strong rounded-2xl overflow-hidden my-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Image */}
            <div className="relative aspect-video">
              <img
                src={selectedService.image}
                alt={selectedService.title}
                className="w-full h-full object-contain bg-black"
              />
              
              {/* Close Button */}
              <button
                onClick={() => setSelectedService(null)}
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 md:p-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: "var(--font-playfair)" }}>
                {selectedService.title}
              </h2>

              {/* Price - Stylized */}
              <div className="mb-6">
                <div className="inline-block liquid-glass-button px-6 py-3 rounded-xl">
                  <div className="text-3xl md:text-4xl font-bold text-white" style={{ fontFamily: "var(--font-playfair)" }}>
                  {selectedService.price}
                  </div>
                </div>
              </div>

              <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                {selectedService.description}
              </p>

              {/* Pricing Info for Post-Production */}
              {selectedService.id === 3 && (
                <div className="mb-6 p-4 rounded-xl liquid-glass border border-white/10">
                  <h4 className="text-lg font-semibold mb-3" style={{ fontFamily: "var(--font-playfair)" }}>
                    {t("services.postProduction.pricing")}
                  </h4>
                  <ul className="space-y-2 text-gray-300">
                    <li>• {t("services.postProduction.pricing1")} <span className="text-white font-semibold">50€</span></li>
                    <li>• {t("services.postProduction.pricing2")} <span className="text-white font-semibold">45€/video</span></li>
                    <li>• {t("services.postProduction.pricing3")} <span className="text-white font-semibold">40€/video</span></li>
                  </ul>
                </div>
              )}

              {/* Features */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4" style={{ fontFamily: "var(--font-playfair)" }}>
                  {t("services.highlights")}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedService.features.map((feature, index) => (
                    <span key={index} className="liquid-glass px-4 py-2 rounded-lg text-white text-sm md:text-base">
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
