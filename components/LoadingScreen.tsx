"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Typewriter } from "react-simple-typewriter";

interface LoadingScreenProps {
  isLoading: boolean;
  onTextComplete?: () => void;
}

export default function LoadingScreen({ isLoading, onTextComplete }: LoadingScreenProps) {
  const [shouldRender, setShouldRender] = useState(true);
  const [showText, setShowText] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isLoading) {
      // Pornește textul după un mic delay
      const timer1 = setTimeout(() => {
        setShowText(true);
      }, 500);
      
      // Animație pentru progress bar (6.5 secunde total - sincronizat cu textele)
      const totalDuration = 6500; // ms - același timp cât durează textele
      const interval = 50; // Update la fiecare 50ms
      const increment = (100 / totalDuration) * interval;
      
      const progressTimer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(progressTimer);
            return 100;
          }
          return Math.min(prev + increment, 100);
        });
      }, interval);
      
      // Calculează când se termină al doilea text:
      // 500ms (start) + 1250ms (primul text ~25 chars × 50ms) + 1000ms (delay) + 
      // 750ms (ștergere ~25 chars × 30ms) + 1750ms (al doilea text ~35 chars × 50ms) + 
      // 1000ms (delay final) = ~6250ms total
      // Opresc loading screen-ul după ~6.5 secunde de la start - progress bar ajunge exact la 100%
      const timer2 = setTimeout(() => {
        // Asigură-te că progress bar ajunge la 100% înainte de a opri
        setProgress(100);
        // Mic delay pentru a se asigura că progress bar ajunge vizual la 100%
        setTimeout(() => {
          if (onTextComplete) {
            onTextComplete();
          }
        }, 100);
      }, totalDuration);
      
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearInterval(progressTimer);
      };
    } else {
      // Reset progress când loading-ul se termină
      setProgress(0);
    }
  }, [isLoading, onTextComplete]);

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
        {/* Logo cu animație de fade-in, scale și rotație în jurul axei Y */}
        <div
          className={`transform transition-all duration-700 ${
            isLoading ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
          }`}
          style={{
            transformStyle: 'preserve-3d',
            perspective: '1000px'
          }}
        >
          <Image
            src="/assets/logo.png"
            alt="Zoomout_crew Logo"
            width={200}
            height={200}
            priority
            className="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 object-contain"
            style={{
              animation: 'rotateY 3s linear infinite',
              transformStyle: 'preserve-3d'
            }}
          />
        </div>
        
        {/* Text cu animație Typewriter - scrie "See...", apoi se șterge și scrie "Welcome..." în același loc */}
        {showText && (
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-4 px-2 drop-shadow-2xl text-white mt-8 min-h-[1.5em] text-center">
            <Typewriter
              words={["See the bigger picture...", "Welcome to Zoomout_crew website !"]}
              loop={1}
              cursor
              cursorStyle="|"
              typeSpeed={50}
              deleteSpeed={30}
              delaySpeed={1000}
            />
          </h1>
        )}
        
        {/* Loading Progress Bar - lățime și înălțime fixă */}
        <div className="mt-8 w-full max-w-md mx-auto">
          <div className="bg-white/20 rounded-full overflow-hidden relative" style={{ width: '400px', height: '4px', maxWidth: '100%' }}>
            <div 
              className="absolute top-0 left-0 bg-white/80 rounded-full transition-all duration-300 ease-out"
              style={{ 
                width: `${progress}%`,
                height: '100%',
                minWidth: '0',
                maxWidth: '100%',
                boxShadow: '0 0 10px rgba(255, 255, 255, 0.5)'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
