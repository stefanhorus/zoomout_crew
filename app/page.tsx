"use client";

import { useState, useRef, useEffect } from "react";
import { Typewriter } from "react-simple-typewriter";
import Image from "next/image";
import Video from 'next-video';
import videoLoop from '/videos/bg.mp4';
import { useLanguage } from "@/contexts/LanguageContext";

export default function Home() {
  const { t } = useLanguage();
  
  const brands = [
    { id: 1, name: "Brand 1", logo: "/bigbelly.png", width: 320, height: 160 },
    { id: 2, name: "Brand 2", logo: "/casanumaa.png", width: 280, height: 140 },
    { id: 3, name: "Brand 3", logo: "/visualdelights.png", width: 200, height: 100 },
    { id: 4, name: "Brand 4", logo: "/utopic.png", width: 200, height: 100 },
    { id: 5, name: "Brand 5", logo: "/aerlounge.png", width: 170, height: 85 },
    { id: 6, name: "Brand 6", logo: "/multiverse.png", width: 170, height: 85 },
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

  // Previne scroll-ul pe mobile
  useEffect(() => {
    if (isMobile) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
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
      
      {/* Video de fundal cu overlay gradient */}
      <div className="absolute inset-0 w-full h-full z-0">
        {/* Fallback image dacă video-ul nu se încarcă */}
        {videoError && (
          <div className="absolute inset-0 w-full h-full bg-black">
            <Image
              src="/background.jpg"
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
        {process.env.NODE_ENV === 'production' && !isMobile ? (
          <div className="absolute inset-0 w-full h-full overflow-hidden">
            <iframe
              src="https://player.mux.com/rPkrPLnjqozMsmWc0202RmP6vsJMmPRTh400013oNIpBxVo?metadata-video-title=Drone-Hero-2-2k-clean&video-title=Drone-Hero-2-2k-clean&autoplay=muted&loop=true&controls=false&muted=true"
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
                pointerEvents: 'none'
              }}
              allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
              allowFullScreen={false}
              className={`transition-opacity duration-500 ${videoLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => {
                setVideoLoaded(true);
                // Forțează play după ce iframe-ul se încarcă
                setTimeout(() => {
                  const iframe = document.querySelector('iframe[src*="player.mux.com"]') as HTMLIFrameElement;
                  if (iframe && iframe.contentWindow) {
                    try {
                      iframe.contentWindow.postMessage({ command: 'play' }, '*');
                    } catch (e) {
                      console.log('Mux player autoplay');
                    }
                  }
                }, 500);
              }}
              onError={() => setVideoError(true)}
            />
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
            style={{ backgroundColor: '#000' }}
          >
            {/* Video local pentru mobile și development */}
            {isMobile ? (
              <>
                <source src="/Drone-hero-mobile-1080.mp4" type="video/mp4" />
                <source src="/Drone-Hero-2-1080.mp4" type="video/mp4" />
              </>
            ) : (
              <source src="/Drone-Hero-2-2k-clean.mp4" type="video/mp4" />
            )}
          </video>
        )}
        {/* Gradient overlay pentru contrast mai bun - mai întunecat */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/45 to-black/65" />
      </div>

      {/* Conținutul de deasupra video-ului */}
      <div 
        className="relative z-10 text-center px-4 md:px-6 max-w-4xl animate-fade-in"
        style={{
          marginBottom: viewportHeight < 700 ? '1rem' : viewportHeight < 900 ? '2rem' : '3rem'
        }}
      >
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 px-2 drop-shadow-2xl text-white">
          <Typewriter
            words={["Zoomout_crew"]}
            loop={false}
            cursor
            cursorStyle="|"
            typeSpeed={90}
            deleteSpeed={50}
            delaySpeed={7000}
          />
        </h1>

        <p className="text-lg md:text-xl lg:text-2xl mb-6 md:mb-8 px-2 text-gray-100 drop-shadow-lg">
          {t("home.tagline")}
        </p>

        <a
          href="/portfolio"
          className="inline-block liquid-glass-button text-white px-6 py-3 md:px-8 md:py-4 rounded-xl font-semibold text-sm md:text-base"
          style={{ fontFamily: "var(--font-roboto)" }}
        >
          {t("home.cta")}
        </a>
      </div>

      {/* Proudly Worked With Section */}
      <div 
        className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-6"
        style={{
          marginTop: viewportHeight < 700 ? '1rem' : viewportHeight < 900 ? '2rem' : viewportHeight < 1100 ? '3rem' : '4rem',
          paddingBottom: viewportHeight < 700 ? '2rem' : viewportHeight < 900 ? '3rem' : '4rem'
        }}
      >
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-8 md:mb-12 px-2 drop-shadow-lg text-white" style={{ fontFamily: "var(--font-playfair)" }}>
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
                    className="flex-shrink-0 w-40 md:w-48 lg:w-64 h-20 md:h-24 flex items-center justify-center liquid-glass rounded-xl p-3 md:p-4 group mx-2 md:mx-4"
                  >
                    <Image
                      src={brand.logo}
                      alt={brand.name}
                      width={brand.width}
                      height={brand.height}
                      className="object-contain w-auto h-auto opacity-70 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0"
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
                    className="flex-shrink-0 w-40 md:w-48 lg:w-64 h-20 md:h-24 flex items-center justify-center liquid-glass rounded-xl p-3 md:p-4 group mx-2 md:mx-4"
                  >
                    <Image
                      src={brand.logo}
                      alt={brand.name}
                      width={brand.width}
                      height={brand.height}
                      className="object-contain w-auto h-auto opacity-70 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0"
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
                    className="flex-shrink-0 w-32 h-20 flex items-center justify-center liquid-glass rounded-xl p-3 group mx-2 active:scale-95"
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
                    className="flex-shrink-0 w-32 h-20 flex items-center justify-center liquid-glass rounded-xl p-3 group mx-2 active:scale-95"
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