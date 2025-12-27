"use client";

import { useState, useEffect, useRef } from "react";
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
  shortDescription?: string; // Short description for card view
  highlights: string[];
  images?: string[];
}

// Date de exemplu - poți înlocui cu aventurile tale reale
const adventures: Adventure[] = [
  {
    id: 1,
    title: "Central Asia Expedition",
    location: "Kazakhstan & Kyrgyzstan",
    category: "asia",
    date: "2025-04-15",
    thumbnail: "/assets/adventures/kz-kg/5.jpg",
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
      "/assets/adventures/kz-kg/1.jpg",
      "/assets/adventures/kz-kg/2.jpg",
      "/assets/adventures/kz-kg/3.jpg",
      "/assets/adventures/kz-kg/4.jpg",
      "/assets/adventures/kz-kg/5.jpg",
    ],
  },
  {
    id: 2,
    title: "Amsterdam Unmapped",
    location: "Amsterdam, Netherlands",
    category: "europe",
    date: "2025-03-15",
    thumbnail: "/assets/adventures/ams1tiny.png",
    description: "A week-long Erasmus project adventure in Amsterdam—a boys trip sponsored by the university. During the days, we attended classes at HVA (Hogeschool van Amsterdam), but the rest of our time was all about having fun and exploring the city. We cruised the sunlit canals by boat, went karaoke singing, hit the clubs, and captured Amsterdam's iconic architecture and vibrant culture from unique aerial perspectives.",
    highlights: ["Canal Ring", "Anne Frank House", "Van Gogh Museum", "Jordaan District", "Vondelpark"],
  },
  {
    id: 5,
    title: "East Coast Horizons",
    location: "United States",
    category: "americas",
    date: "2025-09-15",
    thumbnail: "/assets/adventures/americasept/americasept1.png",
    description: "September exploration of America's breathtaking scenery, from coast to coast.",
    highlights: ["Fall Colors", "Desert Landscapes", "Historic Sites", "Natural Wonders"],
    images: [
      "/assets/adventures/americasept/americasept1.png",
      "/assets/adventures/americasept/americasept2.png",
      "/assets/adventures/americasept/americasept3.png",
      "/assets/adventures/americasept/americasept4.png",
      "/assets/adventures/americasept/americasept5.png",
    ],
  },
  {
    id: 3,
    title: "Sardinia Discovery",
    location: "Sardinia, Italy",
    category: "europe",
    date: "2025-09-15",
    thumbnail: "/assets/adventures/sardinia/sardinia1.jpg",
    description: "Aerial journey through the stunning Mediterranean island of Sardinia, capturing its pristine beaches and rugged landscapes.",
    highlights: ["Costa Smeralda", "Cagliari", "Alghero", "La Maddalena", "Nuraghe Su Nuraxi"],
  },
  {
    id: 6,
    title: "West Coast Tour",
    location: "West Coast, United States",
    category: "americas",
    date: "2024-10-15",
    thumbnail: "/assets/backgrounds/backgroundtiny.png",
    description: "An epic journey along America's West Coast, capturing the dramatic Pacific coastline and iconic cities.",
    highlights: ["Pacific Coast Highway", "San Francisco", "Los Angeles", "Seattle", "Portland", "Big Sur"],
  },
  {
    id: 7,
    title: "Edinburgh Escape",
    location: "Edinburgh, Scotland",
    category: "europe",
    date: "2025-12-15",
    thumbnail: "/assets/adventures/edinburgh/edinburgh1.png",
    shortDescription: "A perfect escape from overpopulated London, this two-day trip to Edinburgh offered a refreshing change of pace in the historic Scottish capital.",
    description: "A two-day exploration of Edinburgh's historic charm and stunning architecture. Our journey began at Edinburgh Castle, the iconic fortress that dominates the city skyline from its volcanic rock perch. Wandering through the Royal Mile, we discovered the historic heart of the Old Town connecting the castle to Holyrood Palace, and stumbled upon the hidden gem of Dean's Village with its charming 19th-century architecture and peaceful Water of Leith. The adventure continued up Calton Hill, offering breathtaking panoramic views of the city and its surroundings.\n\nExploring Greyfriars Kirkyard revealed the historic cemetery that inspired J.K. Rowling's Harry Potter characters. Scott Monument was admired from a distance for the best view of this Gothic spire dedicated to Sir Walter Scott. Strolling through Circus Lane, a picturesque cobblestone street with colorful doors and flower boxes, led us to Victoria Street, the curved, colorful street that's said to have inspired Diagon Alley. Our journey also included St. Bernard's Well, the neoclassical structure overlooking the Water of Leith.\n\nDuring our adventure, we had a lovely photoshoot captured by Andreea Cucu. Through aerial cinematography, the city's unique character was captured, from its ancient cobblestone streets to its breathtaking hilltop vistas.",
    highlights: ["Edinburgh Castle", "Royal Mile", "Dean's Village", "Calton Hill", "Greyfriars Kirkyard", "Scott Monument", "Circus Lane", "Victoria Street", "St. Bernard's Well", "timshel.pictures Photoshoot"],
    images: [
      "/assets/adventures/edinburgh/edinburgh1.png",
      "/assets/adventures/edinburgh/edinburgh2.png",
      "/assets/adventures/edinburgh/edinburgh3.png",
      "/assets/adventures/edinburgh/edinburgh4.png",
      "/assets/adventures/edinburgh/edinburgh5.png",
      "/assets/adventures/edinburgh/edinburgh6.png",
      "/assets/adventures/edinburgh/edinburgh7.png",
      "/assets/adventures/edinburgh/edinburgh8.png",
      "/assets/adventures/edinburgh/edinburgh9.png",
      "/assets/adventures/edinburgh/edinburgh10.png",
      "/assets/adventures/edinburgh/edinburgh11.png",
      "/assets/adventures/edinburgh/edinburgh12.png",
      "/assets/adventures/edinburgh/edinburgh13.png",
      "/assets/adventures/edinburgh/edinburgh14.png",
      "/assets/adventures/edinburgh/edinburgh15.png",
      "/assets/adventures/edinburgh/edinburgh16.png",
      "/assets/adventures/edinburgh/edinburgh17.png",
      "/assets/adventures/edinburgh/edinburgh18.png",
      "/assets/adventures/edinburgh/edinburgh19.png",
      "/assets/adventures/edinburgh/edinburgh20.png",
    ],
  },
];

export default function Adventures() {
  const { t, language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<AdventureCategory>("all");
  const [selectedAdventure, setSelectedAdventure] = useState<Adventure | null>(null);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [imageLoading, setImageLoading] = useState<boolean>(true);
  const [highlightClicks, setHighlightClicks] = useState<{ [key: number]: number }>({});
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  const categories: { value: AdventureCategory; label: string; labelKey: string }[] = [
    { value: "all", label: "All Adventures", labelKey: "adventures.all" },
    { value: "europe", label: "Europe", labelKey: "adventures.europe" },
    { value: "asia", label: "Asia", labelKey: "adventures.asia" },
    { value: "americas", label: "Americas", labelKey: "adventures.americas" },
    { value: "africa", label: "Africa", labelKey: "adventures.africa" },
    { value: "oceania", label: "Oceania", labelKey: "adventures.oceania" },
  ];

  const filteredAdventures = (
    selectedCategory === "all"
      ? adventures
      : adventures.filter((adventure) => adventure.category === selectedCategory)
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const locale = language === "ro" ? "ro-RO" : "en-US";
    return date.toLocaleDateString(locale, { year: "numeric", month: "long" });
  };

  // Reset image index when adventure changes
  useEffect(() => {
    if (selectedAdventure) {
      setSelectedImageIndex(0);
      setIsFullscreen(false);
      setImageLoading(true);
      setHighlightClicks({});
    }
  }, [selectedAdventure]);

  // Handle highlight click to navigate to specific images
  const handleHighlightClick = (highlightIndex: number) => {
    if (!selectedAdventure?.images || selectedAdventure.images.length === 0) return;
    
    const clickCount = highlightClicks[highlightIndex] || 0;
    const totalImages = selectedAdventure.images.length;
    
    if (highlightIndex === 0) {
      // First highlight: cycles between image 4 (index 3) and image 14 (index 13)
      const imageSequence = [3, 13]; // Indices for images 4 and 14
      const currentSequenceIndex = clickCount % imageSequence.length;
      const targetIndex = Math.min(imageSequence[currentSequenceIndex], totalImages - 1);
      setSelectedImageIndex(targetIndex);
      setHighlightClicks({ ...highlightClicks, [highlightIndex]: clickCount + 1 });
    } else if (highlightIndex === 1) {
      // Second highlight: first click -> image 5 (index 4), second click -> image 10 (index 9)
      if (clickCount === 0) {
        const targetIndex = Math.min(4, totalImages - 1); // Image 5 (index 4)
        setSelectedImageIndex(targetIndex);
        setHighlightClicks({ ...highlightClicks, [highlightIndex]: 1 });
      } else {
        const targetIndex = Math.min(9, totalImages - 1); // Image 10 (index 9)
        setSelectedImageIndex(targetIndex);
        setHighlightClicks({ ...highlightClicks, [highlightIndex]: 0 }); // Reset for next cycle
      }
    } else if (highlightIndex === 2) {
      // Third highlight: first click -> image 2 (index 1), second click -> image 11 (index 10)
      if (clickCount === 0) {
        const targetIndex = Math.min(1, totalImages - 1); // Image 2 (index 1)
        setSelectedImageIndex(targetIndex);
        setHighlightClicks({ ...highlightClicks, [highlightIndex]: 1 });
      } else {
        const targetIndex = Math.min(10, totalImages - 1); // Image 11 (index 10)
        setSelectedImageIndex(targetIndex);
        setHighlightClicks({ ...highlightClicks, [highlightIndex]: 0 }); // Reset for next cycle
      }
    } else if (highlightIndex === 3) {
      // Fourth highlight: cycles through images 3, 6, 7, 15 (indices 2, 5, 6, 14)
      const imageSequence = [2, 5, 6, 14]; // Indices for images 3, 6, 7, 15
      const currentSequenceIndex = clickCount % imageSequence.length;
      const targetIndex = Math.min(imageSequence[currentSequenceIndex], totalImages - 1);
      setSelectedImageIndex(targetIndex);
      setHighlightClicks({ ...highlightClicks, [highlightIndex]: clickCount + 1 });
    } else if (highlightIndex === 4) {
      // Fifth highlight: navigate to image 16 (index 15)
      const targetIndex = Math.min(15, totalImages - 1); // Image 16 (index 15)
      setSelectedImageIndex(targetIndex);
      setHighlightClicks({ ...highlightClicks, [highlightIndex]: clickCount + 1 });
    } else if (highlightIndex === 5) {
      // Sixth highlight: cycles between image 8 (index 7) and image 17 (index 16)
      const imageSequence = [7, 16]; // Indices for images 8 and 17
      const currentSequenceIndex = clickCount % imageSequence.length;
      const targetIndex = Math.min(imageSequence[currentSequenceIndex], totalImages - 1);
      setSelectedImageIndex(targetIndex);
      setHighlightClicks({ ...highlightClicks, [highlightIndex]: clickCount + 1 });
    } else if (highlightIndex === 6) {
      // Seventh highlight: navigate to image 9 (index 8)
      const targetIndex = Math.min(8, totalImages - 1); // Image 9 (index 8)
      setSelectedImageIndex(targetIndex);
      setHighlightClicks({ ...highlightClicks, [highlightIndex]: clickCount + 1 });
    } else if (highlightIndex === 7) {
      // Eighth highlight: navigate to image 18 (index 17)
      const targetIndex = Math.min(17, totalImages - 1); // Image 18 (index 17)
      setSelectedImageIndex(targetIndex);
      setHighlightClicks({ ...highlightClicks, [highlightIndex]: clickCount + 1 });
    } else if (highlightIndex === 8) {
      // Ninth highlight: navigate to image 11 (index 10)
      const targetIndex = Math.min(10, totalImages - 1); // Image 11 (index 10)
      setSelectedImageIndex(targetIndex);
      setHighlightClicks({ ...highlightClicks, [highlightIndex]: clickCount + 1 });
    } else if (highlightIndex === 9) {
      // Tenth highlight: cycles between image 19 (index 18) and image 20 (index 19)
      const imageSequence = [18, 19]; // Indices for images 19 and 20
      const currentSequenceIndex = clickCount % imageSequence.length;
      const targetIndex = Math.min(imageSequence[currentSequenceIndex], totalImages - 1);
      setSelectedImageIndex(targetIndex);
      setHighlightClicks({ ...highlightClicks, [highlightIndex]: clickCount + 1 });
    }
  };

  // Reset loading state when image index changes
  useEffect(() => {
    if (selectedAdventure?.images) {
      setImageLoading(true);
    }
  }, [selectedImageIndex, selectedAdventure]);

  // Handle swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!selectedAdventure?.images || selectedAdventure.images.length <= 1) return;
    
    const diff = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (Math.abs(diff) > minSwipeDistance) {
      if (diff > 0) {
        // Swipe left - next image
        setSelectedImageIndex((prev) => 
          prev === selectedAdventure.images!.length - 1 ? 0 : prev + 1
        );
      } else {
        // Swipe right - previous image
        setSelectedImageIndex((prev) => 
          prev === 0 ? selectedAdventure.images!.length - 1 : prev - 1
        );
      }
    }
  };

  // Handle keyboard navigation
  useEffect(() => {
    if (!selectedAdventure?.images || selectedAdventure.images.length <= 1) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setSelectedImageIndex((prev) => 
          prev === 0 ? selectedAdventure.images!.length - 1 : prev - 1
        );
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setSelectedImageIndex((prev) => 
          prev === selectedAdventure.images!.length - 1 ? 0 : prev + 1
        );
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedAdventure]);

  // Handle fullscreen
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <main className="min-h-screen text-white pt-24 pb-16 relative">
      {/* Background Image */}
      <div className="fixed inset-0 w-full h-full z-0">
        <Image
          src="/assets/backgrounds/background3.jpg"
          alt="Adventures background"
          fill
          priority
          quality={75}
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Title */}
        <div className="text-center mb-8 md:mb-12">
          <h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-4 px-2"
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
          <p className="text-gray-300 text-sm sm:text-base px-2">
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
                {!adv.thumbnail.includes('americasept') && (
                  <div className={`absolute inset-0 bg-gradient-to-t transition-all duration-300 ${
                    adv.thumbnail.includes('sardinia') 
                      ? 'from-black/50 via-black/25 to-black/8 group-hover:from-black/40 group-hover:via-black/20 group-hover:to-black/3'
                      : adv.thumbnail.includes('edinburgh')
                      ? 'from-black/30 via-black/15 to-black/0 group-hover:from-black/15 group-hover:via-black/6 group-hover:to-black/0'
                      : adv.thumbnail.includes('kz-kg')
                      ? 'from-black/50 via-black/25 to-black/5 group-hover:from-black/35 group-hover:via-black/15 group-hover:to-black/2'
                      : adv.thumbnail.includes('backgroundtiny')
                      ? 'from-black/40 via-black/20 to-black/5 group-hover:from-black/30 group-hover:via-black/15 group-hover:to-black/2'
                      : adv.thumbnail.includes('ams')
                      ? 'from-black/40 via-black/20 to-black/5 group-hover:from-black/30 group-hover:via-black/15 group-hover:to-black/2'
                      : 'from-black/80 via-black/40 to-black/20 group-hover:from-black/60 group-hover:via-black/30 group-hover:to-black/10'
                  }`} />
                )}
                
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

                  <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors line-clamp-3">
                    {adv.shortDescription || adv.description.split('\n\n')[0] || adv.description.split('. ').slice(0, 3).join('. ') + (adv.description.split('. ').length > 3 ? '...' : '')}
                  </p>
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
            className="max-w-5xl w-full liquid-glass-strong rounded-2xl overflow-hidden my-auto max-h-[90vh] md:max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Media Section */}
            <div className="flex-shrink-0 bg-black overflow-hidden">
              {/* Main Media: Video ou image */}
              <div className={`relative w-full bg-black overflow-hidden flex items-center justify-center ${
                selectedAdventure.images && selectedAdventure.images.length > 0
                  ? 'h-[45vh] md:h-[50vh]' // Adjusted height when gallery is present
                  : 'h-[45vh] md:h-[60vh]' // Standard height for videos only
              }`}>
              {selectedAdventure.videoUrl ? (
                <video
                  src={selectedAdventure.videoUrl}
                  controls
                  autoPlay
                  preload="metadata"
                    className="w-full h-full object-contain"
                  />
                ) : selectedAdventure.images && selectedAdventure.images.length > 0 ? (
                  <>
                    {/* Image with swipe navigation */}
                    <div 
                      className="relative w-full h-full"
                      onTouchStart={(e) => {
                        // Don't handle touch if clicking on navigation buttons
                        if ((e.target as HTMLElement).closest('button')) return;
                        handleTouchStart(e);
                      }}
                      onTouchMove={(e) => {
                        if ((e.target as HTMLElement).closest('button')) return;
                        handleTouchMove(e);
                      }}
                      onTouchEnd={(e) => {
                        if ((e.target as HTMLElement).closest('button')) return;
                        handleTouchEnd();
                      }}
                    >
                      {imageLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black z-0">
                          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        </div>
                      )}
                      <Image
                        key={`${selectedAdventure.id}-${selectedImageIndex}-${selectedAdventure.images[selectedImageIndex]}`}
                        src={selectedAdventure.images[selectedImageIndex]}
                        alt={`${selectedAdventure.title} - Image ${selectedImageIndex + 1}`}
                        fill
                        sizes="(max-width: 768px) 100vw, 80vw"
                        className={`object-contain transition-opacity duration-300 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
                        unoptimized={true}
                        onLoad={() => setImageLoading(false)}
                        onError={() => {
                          console.error('Failed to load image:', selectedAdventure.images?.[selectedImageIndex]);
                          setImageLoading(false);
                        }}
                      />
                      
                      {/* Navigation Arrows - only if more than one image */}
                      {selectedAdventure.images.length > 1 && (
                        <>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              const prevIndex = selectedImageIndex === 0 ? selectedAdventure.images!.length - 1 : selectedImageIndex - 1;
                              setSelectedImageIndex(prevIndex);
                            }}
                            onTouchEnd={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              const prevIndex = selectedImageIndex === 0 ? selectedAdventure.images!.length - 1 : selectedImageIndex - 1;
                              setSelectedImageIndex(prevIndex);
                            }}
                            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-all hover:scale-110"
                            aria-label="Previous image"
                          >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                          </button>
                          
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              const nextIndex = selectedImageIndex === selectedAdventure.images!.length - 1 ? 0 : selectedImageIndex + 1;
                              setSelectedImageIndex(nextIndex);
                            }}
                            onTouchEnd={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              const nextIndex = selectedImageIndex === selectedAdventure.images!.length - 1 ? 0 : selectedImageIndex + 1;
                              setSelectedImageIndex(nextIndex);
                            }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-all hover:scale-110"
                            aria-label="Next image"
                          >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                          
                          {/* Image Indicator */}
                          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center justify-center gap-2">
                            {selectedAdventure.images.map((_, index) => (
                              <div
                                key={index}
                                className={`h-2 rounded-full transition-all ${
                                  selectedImageIndex === index
                                    ? 'w-8 bg-white'
                                    : 'w-2 bg-white/50'
                                }`}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="relative w-full h-full">
                  <Image
                  src={selectedAdventure.thumbnail}
                  alt={selectedAdventure.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 80vw"
                    className="object-contain"
                />
                </div>
              )}

                {/* Fullscreen Button - only for images */}
                {selectedAdventure.images && selectedAdventure.images.length > 0 && !selectedAdventure.videoUrl && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFullscreen();
                    }}
                    className="absolute top-3 left-3 md:top-4 md:left-4 bg-black/70 hover:bg-black/90 backdrop-blur-sm text-white rounded-full p-2 md:p-2.5 transition-all hover:scale-110 shadow-lg z-10"
                    aria-label="Fullscreen"
                  >
                    <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                  </button>
              )}

              {/* Close Button */}
              <button
                onClick={() => setSelectedAdventure(null)}
                  className="absolute top-3 right-3 md:top-4 md:right-4 bg-black/70 hover:bg-black/90 backdrop-blur-sm text-white rounded-full p-2 md:p-2.5 transition-all hover:scale-110 shadow-lg z-10"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              </div>
            </div>

            {/* Content - Scrollable */}
            <div className="p-6 md:p-8 overflow-y-auto flex-1 min-h-0">
              {/* Header with date and location */}
              <div className="mb-5 md:mb-6 pb-3 md:pb-4 border-b border-white/10">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-3 mb-3 md:mb-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-gray-300">
                      <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                      <span className="text-xs sm:text-sm md:text-base font-medium">{formatDate(selectedAdventure.date)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                      <span className="text-xs sm:text-sm md:text-base font-medium">{selectedAdventure.location}</span>
                    </div>
                  </div>
                </div>

                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-3 leading-tight" style={{ fontFamily: "var(--font-playfair)" }}>
                  {selectedAdventure.title}
                </h2>
              </div>
              
              <div className="text-gray-200 text-base md:text-lg mb-6 md:mb-8 leading-relaxed">
                {selectedAdventure.description.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 last:mb-0">
                    {paragraph.trim()}
                  </p>
                ))}
              </div>

              {/* Highlights */}
              {selectedAdventure.highlights && selectedAdventure.highlights.length > 0 && (
              <div className="mb-6 md:mb-8">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-4 md:mb-5 flex items-center gap-2" style={{ fontFamily: "var(--font-playfair)" }}>
                    <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  {t("adventures.highlights")}
                </h3>
                  <div className="flex flex-wrap gap-2 md:gap-3">
                  {selectedAdventure.highlights.map((h, i) => (
                      <button
                        key={i} 
                        onClick={() => handleHighlightClick(i)}
                        className="liquid-glass px-3 py-1.5 md:px-5 md:py-2.5 rounded-xl text-white text-xs sm:text-sm md:text-base font-medium transition-all hover:scale-105 cursor-pointer"
                        disabled={!selectedAdventure.images || selectedAdventure.images.length === 0}
                      >
                      {h}
                    </button>
                  ))}
                </div>
              </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Image Modal */}
      {isFullscreen && selectedAdventure && selectedAdventure.images && selectedAdventure.images.length > 0 && (
        <div
          className="fixed inset-0 z-[60] bg-black flex items-center justify-center"
          onClick={toggleFullscreen}
        >
          <div 
            className="relative w-full h-full flex items-center justify-center"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onClick={(e) => e.stopPropagation()}
                      >
                        {imageLoading && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black z-0">
                            <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          </div>
                        )}
                        <Image
              key={`fullscreen-${selectedAdventure.id}-${selectedImageIndex}-${selectedAdventure.images[selectedImageIndex]}`}
              src={selectedAdventure.images[selectedImageIndex]}
              alt={`${selectedAdventure.title} - Image ${selectedImageIndex + 1}`}
              fill
              sizes="100vw"
              className={`object-contain transition-opacity duration-300 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
              unoptimized={true}
              onLoad={() => setImageLoading(false)}
              onError={() => {
                console.error('Failed to load fullscreen image:', selectedAdventure.images?.[selectedImageIndex]);
                setImageLoading(false);
              }}
            />
            
            {/* Navigation Arrows */}
            {selectedAdventure.images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const prevIndex = selectedImageIndex === 0 ? selectedAdventure.images!.length - 1 : selectedImageIndex - 1;
                    setSelectedImageIndex(prevIndex);
                  }}
                  onTouchEnd={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const prevIndex = selectedImageIndex === 0 ? selectedAdventure.images!.length - 1 : selectedImageIndex - 1;
                    setSelectedImageIndex(prevIndex);
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-4 transition-all hover:scale-110"
                  aria-label="Previous image"
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const nextIndex = selectedImageIndex === selectedAdventure.images!.length - 1 ? 0 : selectedImageIndex + 1;
                    setSelectedImageIndex(nextIndex);
                  }}
                  onTouchEnd={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const nextIndex = selectedImageIndex === selectedAdventure.images!.length - 1 ? 0 : selectedImageIndex + 1;
                    setSelectedImageIndex(nextIndex);
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-4 transition-all hover:scale-110"
                  aria-label="Next image"
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                </button>
                
                {/* Image Indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex items-center justify-center gap-2">
                  {selectedAdventure.images.map((_, index) => (
                    <div
                      key={index}
                      className={`h-2 rounded-full transition-all ${
                        selectedImageIndex === index
                          ? 'w-8 bg-white'
                          : 'w-2 bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
            
            {/* Close Fullscreen Button */}
            <button
              onClick={toggleFullscreen}
              className="absolute top-4 right-4 bg-black/70 hover:bg-black/90 backdrop-blur-sm text-white rounded-full p-3 transition-all hover:scale-110 shadow-lg z-10"
              aria-label="Exit fullscreen"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

