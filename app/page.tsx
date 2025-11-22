"use client";

import { useState, useRef, useEffect } from "react";
import { Typewriter } from "react-simple-typewriter";
import Image from "next/image";

export default function Home() {
  const brands = [
    { id: 1, name: "Brand 1", logo: "/bigbelly.png", width: 350, height: 175 },
    { id: 2, name: "Brand 2", logo: "/casanumaa.png", width: 280, height: 140 },
    { id: 3, name: "Brand 3", logo: "/visualdelights.png", width: 200, height: 100 },
    { id: 4, name: "Brand 4", logo: "/utopic.png", width: 200, height: 100 },
    { id: 5, name: "Brand 5", logo: "/aerlounge.png", width: 170, height: 85 },
    { id: 6, name: "Brand 6", logo: "/multiverse.png", width: 170, height: 85 },
  ];

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isTouching, setIsTouching] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const startXRef = useRef<number>(0);
  const scrollLeftRef = useRef<number>(0);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
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

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center bg-black text-white pt-24 md:pt-32 lg:pt-48">
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
        <video
          src={isMobile ? "/Drone-hero-mobile-1080.mp4" : "/drone-hero-landscape4k.mp4"}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="w-full h-full object-cover"
        />
        {/* Gradient overlay pentru contrast mai bun */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/25 to-black/50" />
      </div>

      {/* Conținutul de deasupra video-ului */}
      <div className="relative z-10 text-center px-4 md:px-6 max-w-4xl mb-12 md:mb-20 lg:mb-32 animate-fade-in">
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
          Professional aerial footage & more
        </p>

        <a
          href="/portfolio"
          className="inline-block liquid-glass-button text-white px-6 py-3 md:px-8 md:py-4 rounded-xl font-semibold text-sm md:text-base"
          style={{ fontFamily: "var(--font-roboto)" }}
        >
          See portfolio
        </a>
      </div>

      {/* Proudly Worked With Section */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-6 pb-12 md:pb-16 mt-16 md:mt-32 lg:mt-40">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-8 md:mb-12 px-2 drop-shadow-lg text-white" style={{ fontFamily: "var(--font-playfair)" }}>
          Proudly Worked With:
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
                        maxWidth: isLarge ? `${brand.width}px` : `${brand.width}px` 
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
                        maxWidth: isLarge ? `${brand.width}px` : `${brand.width}px` 
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