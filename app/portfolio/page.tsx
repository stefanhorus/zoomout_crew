"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { Typewriter } from "react-simple-typewriter";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import ImageSkeleton from "@/components/ImageSkeleton";

// Tipuri de proiecte pentru filtrare
type ProjectCategory = "all" | "real-estate" | "events" | "commercial";

interface Project {
  id: number;
  title: string;
  category: ProjectCategory | ProjectCategory[];
  thumbnail: string;
  videoUrl?: string;
  muxVideos?: Array<{
    playbackId: string;
    title: string;
    assetId?: string;
  }>;
  images?: string[];
  description: string;
}

export default function Portfolio() {
  const { t, language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory>("all");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const [selectedVideoIndex, setSelectedVideoIndex] = useState<number>(0);
  const [videoLoaded, setVideoLoaded] = useState(false);

  // Portfolio Projects with translations - memoized to only recreate when language changes
  const projects: Project[] = useMemo(() => [
    {
      id: 1,
      title: t("portfolio.project1.title"),
      category: ["events", "commercial"],
      thumbnail: "/assets/brands/bigbelly.png",
      muxVideos: [
        {
          playbackId: "DbdlbHpdu541nz100c9oOc700DsUnduPJ6EkEmNIFCzOo",
          title: "",
          assetId: "5802zN02zVKzhO3n7ZMBmNmHEbyOOBnjkv23szggUGE6Q",
        },
        {
          playbackId: "p1LpNG3CjEe01QQhHDOPG3j5L8kywtmmLSKdJaU51Tjg",
          title: "",
          assetId: "CGUXZUf8ZQhCvZ24mvF6UstEj2RzCCXz9agK1I00Qxnc",
        },
      ],
      description: t("portfolio.project1.description"),
    },
    {
      id: 2,
      title: t("portfolio.project2.title"),
      category: "events",
      thumbnail: "/assets/brands/multiverse.png",
      muxVideos: [
        {
          playbackId: "Xi5sUxm00g8N5UJGPn7D9Mut4JsMfUFULA01Qn02woUOwo",
          title: "",
          assetId: "01Dl02H4Nql5FM5vD3bxu1awLfSXOqOvg7DKo1LHF00KYk",
        },
      ],
      description: t("portfolio.project2.description"),
    },
    {
      id: 3,
      title: t("portfolio.project3.title"),
      category: "real-estate",
      thumbnail: "/assets/brands/cabanuta.png",
      muxVideos: [
        {
          playbackId: "ILANTrld964hQ4OanXs6lq02kqN01q745BRJGgfqPy7Kk",
          title: "",
          assetId: "bhUSdN7wq8dC4E46Fd7oTbjdhiFpGWKYuJiI9NhS1TQ",
        },
      ],
      description: t("portfolio.project3.description"),
    },
    {
      id: 4,
      title: t("portfolio.project4.title"),
      category: "commercial",
      thumbnail: "/assets/brands/aerlounge.png",
      muxVideos: [
        {
          playbackId: "c5jDLrljSoSJid7Du9P9XQb37yzRRrIKqFHYzqpKG8c",
          title: "",
          assetId: "cTKE4Xu5idbGw3DAqK02UivmpqNNhkwsMZ52C5ghzLRY",
        },
      ],
      description: t("portfolio.project4.description"),
    },
    {
      id: 5,
      title: t("portfolio.project5.title"),
      category: "commercial",
      thumbnail: "/assets/brands/casanumaa.png",
      muxVideos: [
        {
          playbackId: "BaZoibIrmiaFjm1oPbGIWlhQAZrZHCV9NcIMW4HQN014",
          title: "",
          assetId: "UWLY1HppsMNTiG01pLNf02EcG00J01n33vjrJnkHryDkKoM",
        },
        {
          playbackId: "mUlM3T9v62Udt6bf02520200cihk49QMbiSc7zYCQDvldk",
          title: "",
          assetId: "pwcjT01l3vry006Qgy00sjGW01crDlMbDU0101YKrSNRMuGlE",
        },
      ],
      description: t("portfolio.project5.description"),
    },
    {
      id: 6,
      title: t("portfolio.project6.title"),
      category: "events",
      thumbnail: "/assets/brands/utopic.png",
      muxVideos: [
        {
          playbackId: "CY6gQczar8Ompqq02jXDHskFOwuuB1W8yng5ZOtXTq800",
          title: "",
          assetId: "tSi00hlAkFljNSy00QDvqPyhdCBPuoJi2fSZNe3n02iD3g",
        },
      ],
      description: t("portfolio.project6.description"),
    },
    {
      id: 7,
      title: t("portfolio.project7.title"),
      category: "real-estate",
      thumbnail: "/assets/photos/sardinia1.jpeg",
      images: ["/assets/photos/sardinia1.jpeg", "/assets/photos/sardinia2.jpeg"],
      description: t("portfolio.project7.description"),
    },
    {
      id: 8,
      title: t("portfolio.project8.title"),
      category: "events",
      thumbnail: "/assets/brands/rotaract.png",
      images: [
        "/assets/photos/ratuste1.png",
        "/assets/photos/ratuste2.png",
        "/assets/photos/ratuste3.png",
      ],
      description: t("portfolio.project8.description"),
    },
  ], [t, language]);

  const prevLanguageRef = useRef(language);
  
  // Reset selected project when language changes to update translations
  useEffect(() => {
    if (prevLanguageRef.current !== language && selectedProject) {
      const updatedProject = projects.find(p => p.id === selectedProject.id);
      if (updatedProject) {
        setSelectedProject(updatedProject);
        setSelectedVideoIndex(0);
        setVideoLoaded(false);
      }
    }
    prevLanguageRef.current = language;
  }, [language, projects, selectedProject]);

  // Update page title when language changes
  useEffect(() => {
    document.title = `${t("portfolio.title")} - Zoomout_crew`;
  }, [language, t]);

  const categories: { value: ProjectCategory; label: string; labelKey: string }[] = [
    { value: "all", label: "All Projects", labelKey: "portfolio.allProjects" },
    { value: "real-estate", label: "Real Estate", labelKey: "portfolio.realEstate" },
    { value: "events", label: "Events", labelKey: "portfolio.events" },
    { value: "commercial", label: "Commercial", labelKey: "portfolio.commercial" },
  ];

  const filteredProjects =
    selectedCategory === "all"
      ? projects
      : projects.filter((project) => 
          Array.isArray(project.category) 
            ? project.category.includes(selectedCategory)
            : project.category === selectedCategory
        );

  // Keyboard navigation pentru video-uri și imagini
  useEffect(() => {
    if (!selectedProject) return;
    
    const hasMultipleMedia = 
      (selectedProject.muxVideos && selectedProject.muxVideos.length > 1) ||
      (selectedProject.images && selectedProject.images.length > 1);
    
    if (!hasMultipleMedia) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      const mediaLength = selectedProject.muxVideos?.length || selectedProject.images?.length || 0;
      
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setSelectedVideoIndex((prev) => 
          prev === 0 ? mediaLength - 1 : prev - 1
        );
        if (selectedProject.muxVideos) {
          setVideoLoaded(false);
        }
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setSelectedVideoIndex((prev) => 
          prev === mediaLength - 1 ? 0 : prev + 1
        );
        if (selectedProject.muxVideos) {
          setVideoLoaded(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedProject, selectedVideoIndex]);

  return (
    <main className="min-h-screen text-white pt-24 pb-16 relative">
      {/* Background Image */}
      <div className="fixed inset-0 w-full h-full z-0">
        <Image
          src="/assets/backgrounds/background2tiny.png"
          alt="Portfolio background"
          fill
          priority
          quality={75}
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-4" style={{ fontFamily: "var(--font-playfair)" }}>
            <Typewriter
              key={language}
              words={[t("portfolio.title")]}
              loop={false}
              cursor
              cursorStyle="|"
              typeSpeed={90}
              deleteSpeed={0}
              delaySpeed={999999}
            />
          </h1>
          <p className="text-gray-300 text-base sm:text-lg md:text-xl">
            {t("portfolio.subtitle")}
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

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="group relative overflow-hidden rounded-2xl cursor-pointer liquid-glass liquid-glass-hover backdrop-blur-md"
              onClick={() => setSelectedProject(project)}
            >
              {/* Thumbnail */}
              <div className={`aspect-video relative overflow-hidden ${
                (project.thumbnail.includes('.png') && 
                (project.thumbnail.includes('multiverse') || 
                 project.thumbnail.includes('casanumaa') || 
                 project.thumbnail.includes('utopic') ||
                 project.thumbnail.includes('aerlounge') ||
                 project.thumbnail.includes('bigbelly') ||
                 project.thumbnail.includes('cabanuta') ||
                 project.thumbnail.includes('rotaract'))) ||
                project.thumbnail.includes('sardinia')
                  ? 'bg-gradient-to-br from-black/30 via-black/20 to-black/30 backdrop-blur-sm' 
                  : 'bg-gray-900'
              }`}>
                {!loadedImages.has(project.id) && (
                  <ImageSkeleton className="absolute inset-0" aspectRatio="video" />
                )}
                <Image
                  src={project.thumbnail}
                  alt={project.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className={`transition-all duration-500 group-hover:scale-110 ${
                    loadedImages.has(project.id) ? 'opacity-100' : 'opacity-0'
                  } ${
                    (project.thumbnail.includes('.png') && 
                    (project.thumbnail.includes('multiverse') || 
                     project.thumbnail.includes('casanumaa') || 
                     project.thumbnail.includes('utopic') ||
                     project.thumbnail.includes('aerlounge') ||
                     project.thumbnail.includes('bigbelly') ||
                     project.thumbnail.includes('cabanuta') ||
                     project.thumbnail.includes('rotaract'))) ||
                    project.thumbnail.includes('sardinia')
                      ? `object-contain drop-shadow-2xl filter brightness-110 group-hover:brightness-125 ${
                          project.thumbnail.includes('bigbelly')
                            ? 'p-3'
                            : project.thumbnail.includes('casanumaa')
                            ? 'p-2'
                            : 'p-6'
                        }`
                      : 'object-cover'
                  }`}
                  onLoad={() => setLoadedImages(prev => new Set(prev).add(project.id))}
                />
                <div className={`absolute inset-0 transition-all duration-300 ${
                  (project.thumbnail.includes('.png') && 
                  (project.thumbnail.includes('multiverse') || 
                   project.thumbnail.includes('casanumaa') || 
                   project.thumbnail.includes('utopic') ||
                   project.thumbnail.includes('aerlounge') ||
                   project.thumbnail.includes('bigbelly') ||
                   project.thumbnail.includes('cabanuta') ||
                   project.thumbnail.includes('rotaract'))) ||
                  project.thumbnail.includes('sardinia')
                    ? 'bg-gradient-to-t from-black/20 via-transparent to-black/20 group-hover:from-black/10 group-hover:via-transparent group-hover:to-black/10'
                    : 'bg-gradient-to-t from-black/80 via-black/40 to-black/20 group-hover:from-black/60 group-hover:via-black/30 group-hover:to-black/10'
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

              {/* Project Info */}
              <div className="p-5 relative">
                <h3 className="text-xl font-semibold mb-2 group-hover:text-white transition-colors" style={{ fontFamily: "var(--font-playfair)" }}>
                  {project.title}
                </h3>
                <p className="text-gray-200 text-sm group-hover:text-gray-100 transition-colors line-clamp-3">
                  {project.description.split('. ').slice(0, 2).join('. ') + (project.description.split('. ').length > 2 ? '...' : '')}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-16">
            <p className="text-xl text-gray-400">{t("portfolio.noProjects")}</p>
          </div>
        )}
      </div>

      {/* Modal pentru proiect selectat */}
      {selectedProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 md:p-6 overflow-y-auto animate-fade-in"
          onClick={() => {
            setSelectedProject(null);
            setSelectedVideoIndex(0);
            setVideoLoaded(false);
          }}
        >
          <div
            className="max-w-6xl w-full liquid-glass-strong rounded-2xl overflow-hidden my-auto flex flex-col md:flex-row relative max-h-[90vh] md:max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button - Top Right Corner of Modal */}
            <button
              onClick={() => {
                setSelectedProject(null);
                setSelectedVideoIndex(0);
                setVideoLoaded(false);
              }}
              className="absolute top-3 right-3 md:top-4 md:right-4 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors z-30"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Video Section - Left Side */}
            <div className={`relative flex-shrink-0 min-w-0 ${
              selectedProject.muxVideos && selectedProject.muxVideos.length > 0
                ? 'h-[45vh] md:aspect-auto md:h-[85vh] md:max-h-[85vh] md:flex-1' // Reduced height on mobile, full height on desktop
                : selectedProject.images && selectedProject.images.length > 0
                ? 'h-[60vh] md:aspect-auto md:h-[85vh] md:max-h-[85vh] md:flex-1' // Taller height for image projects on mobile
                : 'aspect-video md:aspect-auto md:h-[85vh] md:max-h-[85vh] md:flex-1'
            }`}>
              {selectedProject.muxVideos && selectedProject.muxVideos.length > 0 ? (
                <>
                  {/* Video Navigation Arrows - doar dacă sunt mai multe video-uri */}
                  {selectedProject.muxVideos.length > 1 && (
                    <>
                      {/* Left Arrow */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedVideoIndex((prev) => 
                            prev === 0 ? selectedProject.muxVideos!.length - 1 : prev - 1
                          );
                          setVideoLoaded(false);
                        }}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-all hover:scale-110"
                        aria-label="Previous video"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      
                      {/* Right Arrow */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedVideoIndex((prev) => 
                            prev === selectedProject.muxVideos!.length - 1 ? 0 : prev + 1
                          );
                          setVideoLoaded(false);
                        }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-all hover:scale-110"
                        aria-label="Next video"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                      
                      {/* Video Indicator - bottom center */}
                      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10 flex items-center justify-center gap-2 pointer-events-none">
                        {selectedProject.muxVideos.map((video, index) => (
                          <div
                            key={index}
                            className={`h-2 rounded-full transition-all ${
                              selectedVideoIndex === index
                                ? 'w-8 bg-white'
                                : 'w-2 bg-white/50'
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                  
                  {/* Mux Video Player */}
                  <iframe
                    src={`https://player.mux.com/${selectedProject.muxVideos[selectedVideoIndex].playbackId}?autoplay=true&loop=false&controls=true&muted=false`}
                    style={{
                      width: '100%',
                      height: '100%',
                      border: 'none',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                    }}
                    allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                    allowFullScreen={true}
                    className={`transition-opacity duration-500 ${videoLoaded ? 'opacity-100' : 'opacity-0'}`}
                    onLoad={() => {
                      setVideoLoaded(true);
                      setTimeout(() => {
                        const iframe = document.querySelector(`iframe[src*="${selectedProject.muxVideos![selectedVideoIndex].playbackId}"]`) as HTMLIFrameElement;
                        if (iframe && iframe.contentWindow) {
                          try {
                            iframe.contentWindow.postMessage({ command: 'play' }, '*');
                          } catch (e) {
                            console.log('Mux player autoplay');
                          }
                        }
                      }, 500);
                    }}
                    onError={() => {
                      console.error('Mux video error');
                      setVideoLoaded(true);
                    }}
                  />
                </>
              ) : selectedProject.videoUrl ? (
                <video
                  src={selectedProject.videoUrl}
                  controls
                  autoPlay
                  className="w-full h-full object-cover"
                />
              ) : selectedProject.images && selectedProject.images.length > 0 ? (
                <>
                  {/* Image Navigation Arrows - doar dacă sunt mai multe imagini */}
                  {selectedProject.images.length > 1 && (
                    <>
                      {/* Left Arrow */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedVideoIndex((prev) => 
                            prev === 0 ? selectedProject.images!.length - 1 : prev - 1
                          );
                        }}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-all hover:scale-110"
                        aria-label="Previous image"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      
                      {/* Right Arrow */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedVideoIndex((prev) => 
                            prev === selectedProject.images!.length - 1 ? 0 : prev + 1
                          );
                        }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-all hover:scale-110"
                        aria-label="Next image"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                      
                      {/* Image Indicator - bottom center */}
                      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10 flex items-center justify-center gap-2 pointer-events-none">
                        {selectedProject.images.map((img, index) => (
                          <div
                            key={index}
                            className={`h-2 rounded-full transition-all ${
                              selectedVideoIndex === index
                                ? 'w-8 bg-white'
                                : 'w-2 bg-white/50'
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                  
                  {/* Image Display */}
                  <Image
                    src={selectedProject.images[selectedVideoIndex]}
                    alt={selectedProject.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 80vw"
                    className="object-cover"
                  />
                </>
              ) : (
                <Image
                  src={selectedProject.thumbnail}
                  alt={selectedProject.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 80vw"
                  className="object-cover"
                />
              )}
            </div>
            
            {/* Description Section - Right Side */}
            <div className="flex-1 p-6 md:p-8 lg:p-10 flex flex-col justify-start md:justify-center bg-black/20 md:bg-transparent overflow-y-auto min-h-0">
              <h2 className="text-2xl md:text-2xl lg:text-3xl font-bold mb-4 md:mb-4 leading-tight" style={{ fontFamily: "var(--font-playfair)" }}>
                {selectedProject.title}
                {selectedProject.muxVideos && selectedProject.muxVideos.length > 1 && selectedProject.muxVideos[selectedVideoIndex].title && (
                  <span className="text-base md:text-base lg:text-lg text-gray-400 ml-2 block md:inline mt-2 md:mt-0">
                    - {selectedProject.muxVideos[selectedVideoIndex].title}
                  </span>
                )}
              </h2>
              <p className="text-gray-200 text-base md:text-base lg:text-lg leading-relaxed">{selectedProject.description}</p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

