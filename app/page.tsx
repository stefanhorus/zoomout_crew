"use client";

import { useState, useRef, useEffect } from "react";
import { Typewriter } from "react-simple-typewriter";
import Image from "next/image";
import Video from 'next-video';
import videoLoop from '/videos/bg.mp4';
import { useLanguage } from "@/contexts/LanguageContext";
import { useCookie } from "@/contexts/CookieContext";
import Link from "next/link";

export default function Home() {
  const { t, language } = useLanguage();
  const { showBanner } = useCookie();
  const [shouldStartTypewriter, setShouldStartTypewriter] = useState(false);

  // Update page title when language changes
  useEffect(() => {
    document.title = "Zoomout_crew - Professional aerial footage and more";
  }, [language]);

  // Pornește animația Typewriter doar după ce banner-ul de cookie-uri este închis
  useEffect(() => {
    if (!showBanner) {
      // Dacă banner-ul nu este afișat, pornește animația după un mic delay
      const timer = setTimeout(() => {
        setShouldStartTypewriter(true);
      }, 300); // Mic delay pentru tranziție fluidă
      return () => clearTimeout(timer);
    } else {
      // Dacă banner-ul este afișat, oprește animația
      setShouldStartTypewriter(false);
    }
  }, [showBanner]);
  
  const brands = [
    { id: 1, name: "Big Belly", logo: "/assets/brands/bigbelly.png", width: 320, height: 160 },
    { id: 2, name: "Casa Numaa", logo: "/assets/brands/casanumaa.png", width: 280, height: 140 },
    { id: 3, name: "Rotaract", logo: "/assets/brands/rotaract.png", width: 200, height: 100 },
    { id: 4, name: "Visual Delights", logo: "/assets/brands/visualdelights.png", width: 200, height: 100 },
    { id: 5, name: "Utopic", logo: "/assets/brands/utopic.png", width: 200, height: 100 },
    { id: 6, name: "Aer Lounge", logo: "/assets/brands/aerlounge.png", width: 170, height: 85 },
    { id: 7, name: "Multiverse", logo: "/assets/brands/multiverse.png", width: 170, height: 85 },
  ];

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [viewportHeight, setViewportHeight] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isTouching, setIsTouching] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const startXRef = useRef<number>(0);
  const scrollLeftRef = useRef<number>(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    const updateViewportHeight = () => {
      setViewportHeight(window.innerHeight);
    };
    
    checkMobile();
    updateViewportHeight();
    const handleResize = () => {
      checkMobile();
      updateViewportHeight();
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Animație automată cu JavaScript pentru mobil
  useEffect(() => {
    if (!isMobile || !wrapperRef.current) {
      return;
    }

    const wrapper = wrapperRef.current;
    let scrollPosition = wrapper.scrollLeft || 0;
    const scrollSpeed = 0.5;
    let animationId: number;
    let isRunning = true;

    const animate = () => {
      if (!isRunning || isPaused || !wrapper) {
        if (isPaused) {
          // Salvează poziția curentă când e paused
          scrollPosition = wrapper.scrollLeft;
        }
        return;
      }

      const maxScroll = wrapper.scrollWidth - wrapper.clientWidth;
      if (maxScroll <= 0) {
        animationId = requestAnimationFrame(animate);
        return;
      }

      // Folosește poziția curentă dacă e paused și apoi reia
      if (scrollPosition === 0 && wrapper.scrollLeft > 0) {
        scrollPosition = wrapper.scrollLeft;
      }

      scrollPosition += scrollSpeed;
      
      // Reset la început când ajunge la jumătate
      if (scrollPosition >= maxScroll / 2) {
        scrollPosition = 0;
      }

      wrapper.scrollLeft = scrollPosition;
      animationId = requestAnimationFrame(animate);
    };

    const startDelay = setTimeout(() => {
      if (!isPaused) {
        animationId = requestAnimationFrame(animate);
      }
    }, 100);

    return () => {
      isRunning = false;
      clearTimeout(startDelay);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isMobile, isPaused]);

  // Detectare touch pentru scroll manual
  useEffect(() => {
    if (!isMobile || !wrapperRef.current) return;

    const wrapper = wrapperRef.current;

    const handleTouchStart = (e: TouchEvent) => {
      setIsTouching(true);
      setIsPaused(true);
      startXRef.current = e.touches[0].pageX - wrapper.offsetLeft;
      scrollLeftRef.current = wrapper.scrollLeft;
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isTouching) return;
      e.preventDefault();
      const x = e.touches[0].pageX - wrapper.offsetLeft;
      const walk = (x - startXRef.current) * 2;
      wrapper.scrollLeft = scrollLeftRef.current - walk;
    };

    const handleTouchEnd = () => {
      setIsTouching(false);
      // Reia animația după 1 secundă, păstrând poziția curentă
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        setIsPaused(false);
      }, 1000);
    };

    wrapper.addEventListener('touchstart', handleTouchStart, { passive: false });
    wrapper.addEventListener('touchmove', handleTouchMove, { passive: false });
    wrapper.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      wrapper.removeEventListener('touchstart', handleTouchStart);
      wrapper.removeEventListener('touchmove', handleTouchMove);
      wrapper.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isMobile, isTouching]);

  // Permite scroll-ul vertical pe mobile, dar previne doar scroll-ul orizontal pentru branduri
  useEffect(() => {
    // Nu mai blocăm scroll-ul vertical pe mobil
    // Scroll-ul orizontal pentru branduri este gestionat separat prin touch handlers
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobile]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Video loading și error handling
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => {
      setVideoLoaded(true);
      // Forțează play după ce video-ul poate fi redat
      video.play().catch((err) => {
        console.error("Video autoplay failed:", err);
        // Dacă autoplay eșuează, încercă din nou când utilizatorul interacționează
        const tryPlay = () => {
          video.play().catch(() => {});
          document.removeEventListener('click', tryPlay);
          document.removeEventListener('touchstart', tryPlay);
        };
        document.addEventListener('click', tryPlay, { once: true });
        document.addEventListener('touchstart', tryPlay, { once: true });
      });
    };

    const handleError = (e: Event) => {
      console.error("Video loading error:", e);
      setVideoError(true);
    };

    const handleLoadedMetadata = () => {
      // Încearcă să pornească video-ul când metadata este încărcată
      if (video.readyState >= 2) {
        video.play().catch(() => {});
      }
    };

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, []);

  // Preconnect este adăugat în layout.tsx head pentru încărcare mai rapidă (SSR)

  // Preload all background images for other pages (după video)
  useEffect(() => {
    const backgrounds = [
      '/assets/backgrounds/background2tiny.png',
      '/assets/backgrounds/background3.jpg',
      '/assets/backgrounds/background4tiny.png',
      '/assets/backgrounds/background6tiny.png',
      '/assets/backgrounds/background7tiny.jpg',
      '/assets/backgrounds/backgroundtiny.png',
      '/assets/backgrounds/2.jpg',
    ];

    // Delay pentru preload-ul imaginilor, prioritate la video
    const timer = setTimeout(() => {
      backgrounds.forEach((src) => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
      });
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center bg-black text-white" style={{ minHeight: '100vh' }}>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 1s ease-out;
        }
        .scroll-container-desktop {
          animation: scroll 30s linear infinite;
          display: flex;
          width: fit-content;
        }
        .scroll-container-mobile {
          display: flex;
          width: fit-content;
        }
      `}} />
      
      {/* Video de fundal cu overlay gradient - Mutat sus pentru prioritate maximă */}
      <div className="absolute inset-0 w-full h-full z-0" style={{ willChange: 'transform' }}>
        {/* Fallback image dacă video-ul nu se încarcă */}
        {videoError && (
          <div className="absolute inset-0 w-full h-full bg-black">
            <Image
              src="/assets/backgrounds/backgroundtiny.png"
              alt="Background fallback"
              fill
              priority
              quality={75}
              sizes="100vw"
              className="object-cover opacity-50"
            />
          </div>
        )}
        
        {/* Folosim Mux Player iframe pentru video-ul "Hero" în producție */}
        {process.env.NODE_ENV === 'production' ? (
          <div className="absolute inset-0 w-full h-full overflow-hidden">
            {isMobile ? (
              <iframe
                src="https://player.mux.com/1ZNl7mG4dyczA01qMJ6TVCQyxJfuHDwNbw1q00bB1brhg?metadata-video-title=Drone-Hero-mobile-1080&video-title=Drone-Hero-mobile-1080&autoplay=muted&loop=true&controls=false&muted=true&preload=auto"
                loading="eager"
                style={{ 
                  width: '100vw',
                  height: '177.78vw', // 9/16 aspect ratio (16/9 inversat pentru vertical)
                  minHeight: '100vh',
                  minWidth: '56.25vh', // 9/16 aspect ratio inversat
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  border: 'none',
                  pointerEvents: 'none',
                  zIndex: 1 // Asigură că video-ul este sub conținut dar deasupra fundalului
                }}
                allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                allowFullScreen={false}
                className={`transition-opacity duration-500 ${videoLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => {
                  setVideoLoaded(true);
                  // Forțează play imediat după încărcare (reduc delay pentru încărcare mai rapidă)
                  const iframe = document.querySelector('iframe[src*="1ZNl7mG4dyczA01qMJ6TVCQyxJfuHDwNbw1q00bB1brhg"]') as HTMLIFrameElement;
                  if (iframe && iframe.contentWindow) {
                    // Încearcă imediat, apoi retry după 200ms dacă nu funcționează
                    try {
                      iframe.contentWindow.postMessage({ command: 'play' }, '*');
                    } catch (e) {
                      console.log('Mux player autoplay mobile');
                    }
                    // Retry pentru siguranță
                    setTimeout(() => {
                      try {
                        iframe.contentWindow?.postMessage({ command: 'play' }, '*');
                      } catch (e) {}
                    }, 200);
                  }
                }}
                onError={() => {
                  console.error('Mux video error for mobile');
                  setVideoError(true);
                }}
              />
            ) : (
            <iframe
                src="https://player.mux.com/rPkrPLnjqozMsmWc0202RmP6vsJMmPRTh400013oNIpBxVo?metadata-video-title=Drone-Hero-2-2k-clean&video-title=Drone-Hero-2-2k-clean&autoplay=muted&loop=true&controls=false&muted=true&preload=auto"
                loading="eager"
              style={{ 
                width: '100vw', 
                height: '56.25vw', // 16:9 aspect ratio
                minHeight: '100vh',
                minWidth: '177.78vh', // 16:9 aspect ratio inversat
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                border: 'none',
                pointerEvents: 'none',
                zIndex: 1 // Asigură că video-ul este sub conținut dar deasupra fundalului
              }}
              allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
              allowFullScreen={false}
              className={`transition-opacity duration-500 ${videoLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => {
                setVideoLoaded(true);
                // Forțează play imediat după încărcare (reduc delay pentru încărcare mai rapidă)
                const iframe = document.querySelector('iframe[src*="rPkrPLnjqozMsmWc0202RmP6vsJMmPRTh400013oNIpBxVo"]') as HTMLIFrameElement;
                if (iframe && iframe.contentWindow) {
                  // Încearcă imediat, apoi retry după 200ms dacă nu funcționează
                  try {
                    iframe.contentWindow.postMessage({ command: 'play' }, '*');
                  } catch (e) {
                    console.log('Mux player autoplay desktop');
                  }
                  // Retry pentru siguranță
                  setTimeout(() => {
                    try {
                      iframe.contentWindow?.postMessage({ command: 'play' }, '*');
                    } catch (e) {}
                  }, 200);
                }
              }}
                onError={() => {
                  console.error('Mux video error for desktop');
                  setVideoError(true);
                }}
            />
            )}
          </div>
        ) : (
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            crossOrigin="anonymous"
            className={`w-full h-full object-cover transition-opacity duration-500 ${videoLoaded ? 'opacity-100' : 'opacity-0'}`}
            style={{ 
              backgroundColor: '#000',
              zIndex: 1 // Asigură că video-ul este sub conținut dar deasupra fundalului
            }}
          >
            {/* Video local pentru development */}
            {isMobile ? (
              <>
                <source src="/assets/videos/Drone-hero-mobile-1080.mp4" type="video/mp4" />
                <source src="/assets/videos/Drone-Hero-2-1080.mp4" type="video/mp4" />
              </>
            ) : (
              <source src="/assets/videos/Drone-Hero-2-2k-clean.mp4" type="video/mp4" />
            )}
          </video>
        )}
        {/* Dark overlay pentru a întuneca video-ul */}
        <div className="absolute inset-0 w-full h-full bg-black/40 z-0" />
      </div>

      {/* Hidden Game Button - Left Middle - Invisible but still clickable */}
      <Link
        href="/game"
        className="fixed left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 md:w-14 md:h-14 rounded-full opacity-0 hover:opacity-100 transition-all duration-300 flex items-center justify-center group"
        style={{ transform: 'translateY(-50%)' }}
        aria-label="Game"
      >
        <svg 
          className="w-6 h-6 md:w-7 md:h-7 text-white/50 group-hover:text-white transition-colors" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </Link>

      {/* Conținutul de deasupra video-ului */}
      <div 
        className="relative z-[20] text-center px-4 md:px-6 max-w-4xl animate-fade-in"
        style={{
          marginBottom: viewportHeight < 700 ? '1rem' : viewportHeight < 900 ? '2rem' : '3rem',
          marginTop: viewportHeight < 700 ? '-2rem' : viewportHeight < 900 ? '-3rem' : '-4rem'
        }}
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-4 px-2 drop-shadow-2xl text-white">
          {shouldStartTypewriter ? (
            <Typewriter
              key={language}
              words={["Zoomout_crew"]}
              loop={false}
              cursor
              cursorStyle="|"
              typeSpeed={90}
              deleteSpeed={50}
              delaySpeed={7000}
            />
          ) : (
            <span>Zoomout_crew</span>
          )}
        </h1>

        <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-5 md:mb-6 lg:mb-8 px-2 text-gray-100 drop-shadow-lg leading-tight md:leading-normal">
          {t("home.tagline")}
        </p>

        <a
          href="/portfolio"
          className="inline-block liquid-glass-button text-white px-5 py-2.5 md:px-8 md:py-4 rounded-xl font-semibold text-sm md:text-base"
          style={{ fontFamily: "var(--font-roboto)" }}
        >
          {t("home.cta")}
        </a>
      </div>

      {/* Proudly Worked With Section - Poziționat în partea de jos */}
      <div 
        className="absolute bottom-0 left-0 right-0 z-10 w-full max-w-7xl mx-auto px-4 md:px-6"
        style={{
          paddingBottom: viewportHeight < 700 ? '1rem' : viewportHeight < 900 ? '1.5rem' : '2rem'
        }}
      >
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-6 md:mb-8 lg:mb-12 px-2 drop-shadow-lg text-white" style={{ fontFamily: "var(--font-playfair)" }}>
          {t("home.workedWith")}
        </h2>
        <div className={`relative w-full ${isMobile ? "overflow-x-auto" : "overflow-hidden"}`}>
          {/* Desktop: Auto-scroll */}
          {!isMobile && (
            <div className="flex scroll-container-desktop">
              {/* First set of logos */}
              {brands.map((brand) => {
                const isLarge = brand.id === 1 || brand.id === 2; // bigbelly sau casanumaa
                return (
                  <div
                    key={brand.id}
                    className="flex-shrink-0 w-40 md:w-48 lg:w-64 h-20 md:h-24 flex items-center justify-center liquid-glass rounded-xl p-3 md:p-4 group mx-2 md:mx-4 backdrop-blur-md"
                  >
                    <Image
                      src={brand.logo}
                      alt={brand.name}
                      width={brand.width}
                      height={brand.height}
                      className="object-contain w-auto h-auto opacity-70 group-hover:opacity-100 transition-opacity"
                      style={{ 
                        height: isLarge ? `${brand.height}px` : `${brand.height}px`,
                        maxHeight: isLarge ? `${brand.height}px` : `${brand.height}px`, 
                        width: isLarge ? `${brand.width}px` : `${brand.width}px`,
                        maxWidth: '100%' 
                      }}
                    />
                  </div>
                );
              })}
              {/* Duplicate set for seamless loop */}
              {brands.map((brand) => {
                const isLarge = brand.id === 1 || brand.id === 2; // bigbelly sau casanumaa
                return (
                  <div
                    key={`${brand.id}-duplicate`}
                    className="flex-shrink-0 w-40 md:w-48 lg:w-64 h-20 md:h-24 flex items-center justify-center liquid-glass rounded-xl p-3 md:p-4 group mx-2 md:mx-4 backdrop-blur-md"
                  >
                    <Image
                      src={brand.logo}
                      alt={brand.name}
                      width={brand.width}
                      height={brand.height}
                      className="object-contain w-auto h-auto opacity-70 group-hover:opacity-100 transition-opacity"
                      style={{ 
                        height: isLarge ? `${brand.height}px` : `${brand.height}px`,
                        maxHeight: isLarge ? `${brand.height}px` : `${brand.height}px`, 
                        width: isLarge ? `${brand.width}px` : `${brand.width}px`,
                        maxWidth: '100%' 
                      }}
                    />
                  </div>
                );
              })}
            </div>
          )}

          {/* Mobile: Auto-scroll with manual override */}
          {isMobile && (
            <div 
              ref={wrapperRef}
              className="overflow-x-auto overflow-y-hidden relative w-full scrollbar-hide"
              style={{
                WebkitOverflowScrolling: "touch",
                userSelect: "none",
              }}
            >
              <div
                ref={scrollContainerRef}
                className="flex scroll-container-mobile"
                style={{
                  userSelect: "none",
                  touchAction: "pan-x",
                }}
              >
              {/* First set of logos */}
              {brands.map((brand) => {
                const isLarge = brand.id === 1 || brand.id === 2; // bigbelly sau casanumaa
                const mobileWidth = brand.width * 0.7; // Reduce logo size by 30% on mobile
                const mobileHeight = brand.height * 0.7;
                return (
                  <div
                    key={brand.id}
                    className="flex-shrink-0 w-32 h-20 flex items-center justify-center liquid-glass rounded-xl p-3 group mx-2 active:scale-95 backdrop-blur-md"
                    style={{
                      background: 'rgba(255, 255, 255, 0.15)',
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                      boxShadow: '0 16px 64px 0 rgba(0, 0, 0, 0.45), inset 0 1px 0 0 rgba(255, 255, 255, 0.35), inset 0 -1px 0 0 rgba(255, 255, 255, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    <Image
                      src={brand.logo}
                      alt={brand.name}
                      width={brand.width}
                      height={brand.height}
                      className="object-contain w-auto h-auto opacity-100 transition-opacity grayscale-0 pointer-events-none"
                      style={{ 
                        height: isLarge ? `${mobileHeight}px` : `${mobileHeight}px`,
                        maxHeight: isLarge ? `${mobileHeight}px` : `${mobileHeight}px`, 
                        width: isLarge ? `${mobileWidth}px` : `${mobileWidth}px`,
                        maxWidth: isLarge ? `${mobileWidth}px` : `${mobileWidth}px` 
                      }}
                    />
                  </div>
                );
              })}
              {/* Duplicate set for seamless loop */}
              {brands.map((brand) => {
                const isLarge = brand.id === 1 || brand.id === 2; // bigbelly sau casanumaa
                const mobileWidth = brand.width * 0.7; // Reduce logo size by 30% on mobile
                const mobileHeight = brand.height * 0.7;
                return (
                  <div
                    key={`${brand.id}-duplicate`}
                    className="flex-shrink-0 w-32 h-20 flex items-center justify-center liquid-glass rounded-xl p-3 group mx-2 active:scale-95 backdrop-blur-md"
                    style={{
                      background: 'rgba(255, 255, 255, 0.15)',
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                      boxShadow: '0 16px 64px 0 rgba(0, 0, 0, 0.45), inset 0 1px 0 0 rgba(255, 255, 255, 0.35), inset 0 -1px 0 0 rgba(255, 255, 255, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    <Image
                      src={brand.logo}
                      alt={brand.name}
                      width={brand.width}
                      height={brand.height}
                      className="object-contain w-auto h-auto opacity-100 transition-opacity grayscale-0 pointer-events-none"
                      style={{ 
                        height: isLarge ? `${mobileHeight}px` : `${mobileHeight}px`,
                        maxHeight: isLarge ? `${mobileHeight}px` : `${mobileHeight}px`, 
                        width: isLarge ? `${mobileWidth}px` : `${mobileWidth}px`,
                        maxWidth: isLarge ? `${mobileWidth}px` : `${mobileWidth}px` 
                      }}
                    />
                  </div>
                );
              })}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}