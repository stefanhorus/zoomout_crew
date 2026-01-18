"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Typewriter } from "react-simple-typewriter";

interface LoadingScreenProps {
  isLoading: boolean;
}

export default function LoadingScreen({ isLoading }: LoadingScreenProps) {
  const [shouldRender, setShouldRender] = useState(true);
  const [showFirstText, setShowFirstText] = useState(false);
  const [showSecondText, setShowSecondText] = useState(false);

  useEffect(() => {
    if (isLoading) {
      // Pornește primul text după un mic delay
      const timer1 = setTimeout(() => {
        setShowFirstText(true);
      }, 500);
      
      // Pornește al doilea text după primul
      const timer2 = setTimeout(() => {
        setShowSecondText(true);
      }, 3000);
      
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [isLoading]);

  useEffect(() => {
    if (!isLoading) {
      // Delay pentru animația de fade-out
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-[200] bg-black flex items-center justify-center transition-opacity duration-500 ${
        isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Background Image cu efect liquid glass */}
      <div className="absolute inset-0 w-full h-full z-0">
        <Image
          src="/assets/backgrounds/background7tiny.jpg"
          alt="Loading background"
          fill
          priority
          quality={85}
          sizes="100vw"
          className="object-cover opacity-60"
        />
        {/* Liquid glass overlay */}
        <div className="absolute inset-0 liquid-glass" style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(60px) saturate(200%)',
          WebkitBackdropFilter: 'blur(60px) saturate(200%)',
          border: 'none',
        }} />
        {/* Dark overlay pentru contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
      </div>
      
      {/* Conținutul */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4">
        {/* Logo cu animație de fade-in, scale și rotație */}
        <div
          className={`transform transition-all duration-700 ${
            isLoading ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
          }`}
        >
          <Image
            src="/assets/logo.png"
            alt="Zoomout_crew Logo"
            width={200}
            height={200}
            priority
            className="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 object-contain animate-spin-slow"
            style={{
              animation: 'spin 3s linear infinite'
            }}
          />
        </div>
        
        {/* Prima linie cu animație Typewriter */}
        {showFirstText && (
          <div className="mt-8 mb-4">
            <p
              className="text-white/90 text-lg md:text-xl lg:text-2xl font-medium text-center min-h-[1.5em]"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              {showFirstText && (
                <Typewriter
                  words={["See the bigger picture..."]}
                  loop={false}
                  cursor
                  cursorStyle="|"
                  typeSpeed={70}
                  deleteSpeed={50}
                  delaySpeed={1000}
                />
              )}
            </p>
          </div>
        )}
        
        {/* A doua linie cu animație Typewriter */}
        {showSecondText && (
          <div className="mt-2">
            <p
              className="text-white/80 text-base md:text-lg lg:text-xl font-medium text-center min-h-[1.5em]"
              style={{ fontFamily: "var(--font-roboto)" }}
            >
              {showSecondText && (
                <Typewriter
                  words={["Welcome to Zoomout_crew website !"]}
                  loop={false}
                  cursor
                  cursorStyle="|"
                  typeSpeed={70}
                  deleteSpeed={50}
                  delaySpeed={1000}
                />
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
