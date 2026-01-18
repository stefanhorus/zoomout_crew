"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface LoadingScreenProps {
  isLoading: boolean;
  onTextComplete?: () => void;
}

export default function LoadingScreen({ isLoading, onTextComplete }: LoadingScreenProps) {
  const [shouldRender, setShouldRender] = useState(true);
  const [progress, setProgress] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [showCursor, setShowCursor] = useState(true);

  const text1 = "See the bigger picture...";
  const text2 = "Welcome to Zoomout_crew website !";

  useEffect(() => {
    if (!isLoading) {
      setDisplayText("");
      setProgress(0);
      return;
    }

    // Timpi exacti conform cerințelor
    const START_DELAY = 500;
    const TEXT1_TYPE_DURATION = 1250; // ~25 chars × 50ms
    const DELAY_BETWEEN = 1000;
    const DELETE_DURATION = 750; // ~25 chars × 30ms
    const TEXT2_TYPE_DURATION = 1750; // ~35 chars × 50ms
    const FINAL_DELAY = 1000;
    const TOTAL_DURATION = START_DELAY + TEXT1_TYPE_DURATION + DELAY_BETWEEN + DELETE_DURATION + TEXT2_TYPE_DURATION + FINAL_DELAY; // 6250ms

    let charIndex = 0;
    let phase: 'start' | 'type1' | 'wait1' | 'delete' | 'type2' | 'wait2' | 'done' = 'start';
    
    // Progress bar animation
    const progressInterval = 50; // Update la fiecare 50ms
    const progressIncrement = (100 / TOTAL_DURATION) * progressInterval;
    const progressTimer = setInterval(() => {
      setProgress((prev) => Math.min(prev + progressIncrement, 100));
    }, progressInterval);

    // Start delay
    const startTimer = setTimeout(() => {
      phase = 'type1';
      charIndex = 0;
    }, START_DELAY);

    // Type first text
    const type1CharDelay = TEXT1_TYPE_DURATION / text1.length; // ~50ms per char
    const type1Timer = setTimeout(() => {
      let currentChar = 0;
      const type1Interval = setInterval(() => {
        if (currentChar < text1.length) {
          setDisplayText(text1.substring(0, currentChar + 1));
          currentChar++;
        } else {
          clearInterval(type1Interval);
          phase = 'wait1';
          
          // Wait between texts
          setTimeout(() => {
            phase = 'delete';
            let deleteChar = text1.length;
            const deleteInterval = setInterval(() => {
              if (deleteChar > 0) {
                setDisplayText(text1.substring(0, deleteChar - 1));
                deleteChar--;
              } else {
                clearInterval(deleteInterval);
                phase = 'type2';
                charIndex = 0;
                
                // Type second text
                let currentChar2 = 0;
                const type2CharDelay = TEXT2_TYPE_DURATION / text2.length; // ~50ms per char
                const type2Interval = setInterval(() => {
                  if (currentChar2 < text2.length) {
                    setDisplayText(text2.substring(0, currentChar2 + 1));
                    currentChar2++;
                  } else {
                    clearInterval(type2Interval);
                    phase = 'wait2';
                    
                    // Final delay
                    setTimeout(() => {
                      phase = 'done';
                      setProgress(100);
                      if (onTextComplete) {
                        onTextComplete();
                      }
                    }, FINAL_DELAY);
                  }
                }, type2CharDelay);
              }
            }, DELETE_DURATION / text1.length); // ~30ms per char
          }, DELAY_BETWEEN);
        }
      }, type1CharDelay);
    }, START_DELAY);

    return () => {
      clearTimeout(startTimer);
      clearTimeout(type1Timer);
      clearInterval(progressTimer);
    };
  }, [isLoading, onTextComplete, text1, text2]);

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
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-4 px-2 drop-shadow-2xl text-white mt-8 min-h-[1.5em] text-center">
          {displayText}
          {showCursor && <span className="cursor-blink">|</span>}
        </h1>
        
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
