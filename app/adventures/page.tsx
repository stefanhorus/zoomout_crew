"use client";

import { useState } from "react";
import { Typewriter } from "react-simple-typewriter";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import LoadingSkeleton from "@/components/LoadingSkeleton";

// Tipuri de aventuri pentru filtrare
type AdventureCategory = "all" | "europe" | "asia" | "americas" | "africa" | "oceania";

interface Adventure {
  id: number;
  title: string;
  location: string;
  category: AdventureCategory;
  date: string;
  thumbnail: string;
  videoUrl?: string;
  description: string;
  highlights: string[];
  images?: string[];
}

// Date de exemplu - poți înlocui cu aventurile tale reale
const adventures: Adventure[] = [
  {
    id: 1,
    title: "Across Kazakhstan & Kyrgyzstan",
    location: "Kazakhstan & Kyrgyzstan",
    category: "asia",
    date: "2024-07-18",
    thumbnail: "/kz-kg/5.jpg",
    videoUrl: "/kz-kg/kz-kg-video.mp4",
    description:
      "A breathtaking journey through Central Asia. From the surreal landscapes of Charyn Canyon to the alpine lakes of Kyrgyzstan...",
    highlights: [
      "Charyn Canyon",
      "Altyn Emel National Park",
      "Kolsai & Kaindy Lakes",
      "Almaty Mountains",
      "Song-Kul Lake",
      "Karakol Valley",
    ],
    images: [
      "/kz-kg/1.jpg",
      "/kz-kg/2.jpg",
      "/kz-kg/3.jpg",
      "/kz-kg/4.jpg",
      "/kz-kg/5.jpg",
    ],
  },
  {
    id: 2,
    title: "Amsterdam Adventure",
    location: "Amsterdam, Netherlands",
    category: "europe",
    date: "2025-03-15",
    thumbnail: "/ams1tiny.png",
    description: "Exploring the beautiful canals, historic architecture, and vibrant culture of Amsterdam from above.",
    highlights: ["Canal Ring", "Anne Frank House", "Van Gogh Museum", "Jordaan District", "Vondelpark"],
  },
  {
    id: 3,
    title: "Sardinia Discovery",
    location: "Sardinia, Italy",
    category: "europe",
    date: "2025-06-01",
    thumbnail: "/sardinia/sardinia1.jpg",
    description: "Aerial journey through the stunning Mediterranean island of Sardinia, capturing its pristine beaches and rugged landscapes.",
    highlights: ["Costa Smeralda", "Cagliari", "Alghero", "La Maddalena", "Nuraghe Su Nuraxi"],
  },
  {
    id: 4,
    title: "America Summer Journey",
    location: "United States",
    category: "americas",
    date: "2024-07-01",
    thumbnail: "/americasg/americasg1.jpg",
    description: "Summer adventure across America, capturing the diverse landscapes and iconic landmarks from a unique perspective.",
    highlights: ["National Parks", "Coastal Views", "Urban Landscapes", "Mountain Ranges"],
  },
  {
    id: 5,
    title: "America September Expedition",
    location: "United States",
    category: "americas",
    date: "2025-09-01",
    thumbnail: "/americasept/americasept1.png",
    description: "September exploration of America's breathtaking scenery, from coast to coast.",
    highlights: ["Fall Colors", "Desert Landscapes", "Historic Sites", "Natural Wonders"],
  },
  {
    id: 6,
    title: "West Coast Tour",
    location: "West Coast, United States",
    category: "americas",
    date: "2025-10-01",
    thumbnail: "/backgroundtiny.png",
    description: "An epic journey along America's West Coast, capturing the dramatic Pacific coastline and iconic cities.",
    highlights: ["Pacific Coast Highway", "San Francisco", "Los Angeles", "Seattle", "Portland", "Big Sur"],
  },
  {
    id: 7,
    title: "Edinburgh Winter",
    location: "Edinburgh, Scotland",
    category: "europe",
    date: "2025-12-15",
    thumbnail: "/background6tiny.png",
    description: "Winter wonderland in Edinburgh, showcasing the historic city's charm during the festive season.",
    highlights: ["Edinburgh Castle", "Royal Mile", "Arthur's Seat", "Holyrood Palace", "Christmas Markets"],
  },
];

export default function Adventures() {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<AdventureCategory>("all");
  const [selectedAdventure, setSelectedAdventure] = useState<Adventure | null>(null);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

  const categories: { value: AdventureCategory; label: string; labelKey: string }[] = [
    { value: "all", label: "All Adventures", labelKey: "adventures.all" },
    { value: "europe", label: "Europe", labelKey: "adventures.europe" },
    { value: "asia", label: "Asia", labelKey: "adventures.asia" },
    { value: "americas", label: "Americas", labelKey: "adventures.americas" },
    { value: "africa", label: "Africa", labelKey: "adventures.africa" },
    { value: "oceania", label: "Oceania", labelKey: "adventures.oceania" },
  ];

  const filteredAdventures =
    selectedCategory === "all"
      ? adventures
      : adventures.filter((adventure) => adventure.category === selectedCategory);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ro-RO", { year: "numeric", month: "long", day: "numeric" });
  };

  return (
    <main className="min-h-screen text-white pt-24 pb-16 relative">
      {/* Background Image */}
      <div className="fixed inset-0 w-full h-full z-0">
        <Image
          src="/background3.jpg"
          alt="Adventures background"
          fill
          priority
          quality={75}
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Title */}
        <div className="text-center mb-12">
          <h1
            className="text-5xl md:text-6xl font-bold mb-4"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            <Typewriter
              words={[t("adventures.title")]}
              loop={false}
              cursor
              cursorStyle="|"
              typeSpeed={90}
              deleteSpeed={0}
              delaySpeed={999999}
            />
          </h1>
          <p className="text-gray-300">
            {t("adventures.subtitle")}
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-12 px-2">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-4 py-1.5 md:px-6 md:py-2 rounded-xl font-semibold transition-all duration-300 text-sm md:text-base ${
                selectedCategory === cat.value
                  ? "liquid-glass-button text-white scale-105"
                  : "liquid-glass liquid-glass-hover text-white"
              }`}
              style={{ fontFamily: "var(--font-roboto)" }}
            >
              {t(cat.labelKey)}
            </button>
          ))}
        </div>

        {/* Grid cu aventuri */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredAdventures.map((adv) => (
            <div
              key={adv.id}
              onClick={() => setSelectedAdventure(adv)}
              className="group relative overflow-hidden rounded-2xl cursor-pointer liquid-glass liquid-glass-hover h-full flex flex-col"
            >
              <div className="aspect-video relative overflow-hidden bg-gray-900">
                {!loadedImages.has(adv.id) && (
                  <LoadingSkeleton className="absolute inset-0" />
                )}
                <Image
                  src={adv.thumbnail}
                  alt={adv.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className={`object-cover transition-all duration-500 group-hover:scale-110 ${
                    loadedImages.has(adv.id) ? 'opacity-100' : 'opacity-0'
                  } ${
                    adv.thumbnail.includes('sardinia') ? 'brightness-125 contrast-110' : 
                    adv.thumbnail.includes('ams') ? 'brightness-110 contrast-105' : 
                    adv.thumbnail.includes('americasept') ? 'brightness-110 contrast-105' : ''
                  }`}
                  unoptimized={adv.thumbnail.includes('tiny')}
                  onLoad={() => setLoadedImages(prev => new Set(prev).add(adv.id))}
                />
                <div className={`absolute inset-0 bg-gradient-to-t transition-all duration-300 ${
                  adv.thumbnail.includes('sardinia') 
                    ? 'from-black/40 via-black/20 to-black/5 group-hover:from-black/30 group-hover:via-black/15 group-hover:to-black/0'
                    : adv.thumbnail.includes('ams') || adv.thumbnail.includes('americasept')
                    ? 'from-black/60 via-black/30 to-black/10 group-hover:from-black/50 group-hover:via-black/25 group-hover:to-black/5'
                    : 'from-black/80 via-black/40 to-black/20 group-hover:from-black/60 group-hover:via-black/30 group-hover:to-black/10'
                }`} />
                
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

              <div className="p-5 relative flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <p className="text-gray-400 text-xs md:text-sm">{formatDate(adv.date)}</p>
                    <span className="text-gray-400 text-xs md:text-sm flex items-center gap-1">
                      <svg className="w-3 h-3 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                      </svg>
                      {adv.location}
                    </span>
                  </div>

                  <h3
                    className="text-lg md:text-xl font-semibold mb-2 group-hover:text-white transition-colors"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    {adv.title}
                  </h3>

                  <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">{adv.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredAdventures.length === 0 && (
          <div className="text-center py-16">
            <p className="text-xl text-gray-400">{t("adventures.noAdventures")}</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedAdventure && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 md:p-6 overflow-y-auto animate-fade-in"
          onClick={() => setSelectedAdventure(null)}
        >
          <div
            className="max-w-5xl w-full liquid-glass-strong rounded-2xl overflow-hidden my-4 max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Media: Video ou image */}
            <div className="relative w-full flex-shrink-0 bg-black overflow-hidden flex items-center justify-center">
              {selectedAdventure.videoUrl ? (
                <video
                  src={selectedAdventure.videoUrl}
                  controls
                  autoPlay
                  preload="metadata"
                  className="w-full h-auto max-h-[60vh] object-contain"
                />
              ) : (
                <div className="relative w-full h-[60vh]">
                  <Image
                  src={selectedAdventure.thumbnail}
                  alt={selectedAdventure.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 80vw"
                    className="object-contain"
                />
                </div>
              )}

              {/* Close Button */}
              <button
                onClick={() => setSelectedAdventure(null)}
                className="absolute top-4 right-4 bg-black/70 hover:bg-black/90 backdrop-blur-sm text-white rounded-full p-2.5 transition-all hover:scale-110 shadow-lg z-10"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content - Scrollable */}
            <div className="p-6 md:p-8 overflow-y-auto flex-1">
              {/* Header with date and location */}
              <div className="mb-6 pb-4 border-b border-white/10">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-gray-300">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm md:text-base font-medium">{formatDate(selectedAdventure.date)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                      <span className="text-sm md:text-base font-medium">{selectedAdventure.location}</span>
                    </div>
                  </div>
                </div>

                <h2 className="text-3xl md:text-5xl font-bold mb-3 leading-tight" style={{ fontFamily: "var(--font-playfair)" }}>
                  {selectedAdventure.title}
                </h2>
              </div>
              
              <p className="text-gray-300 text-base md:text-lg mb-8 leading-relaxed">
                {selectedAdventure.description}
              </p>

              {/* Highlights */}
              {selectedAdventure.highlights && selectedAdventure.highlights.length > 0 && (
              <div className="mb-8">
                  <h3 className="text-xl md:text-2xl font-semibold mb-5 flex items-center gap-2" style={{ fontFamily: "var(--font-playfair)" }}>
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  {t("adventures.highlights")}
                </h3>
                  <div className="flex flex-wrap gap-3">
                  {selectedAdventure.highlights.map((h, i) => (
                      <span 
                        key={i} 
                        className="liquid-glass px-5 py-2.5 rounded-xl text-white text-sm md:text-base font-medium transition-all hover:scale-105 cursor-default"
                      >
                      {h}
                    </span>
                  ))}
                </div>
              </div>
              )}

              {/* Gallery */}
              {selectedAdventure.images && selectedAdventure.images.length > 0 && (
                <div>
                  <h3 className="text-xl md:text-2xl font-semibold mb-5 flex items-center gap-2" style={{ fontFamily: "var(--font-playfair)" }}>
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {t("adventures.gallery")}
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {selectedAdventure.images.map((src, i) => (
                      <div
                        key={i}
                        className="group relative aspect-video overflow-hidden rounded-xl cursor-pointer liquid-glass-hover"
                        onClick={() =>
                          setSelectedAdventure({
                            ...selectedAdventure,
                            videoUrl: undefined,
                            thumbnail: src,
                          })
                        }
                      >
                        <Image
                          src={src}
                          alt={`Gallery ${i + 1}`}
                          fill
                          sizes="(max-width: 768px) 50vw, 33vw"
                          className="rounded-xl object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                          <svg className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

