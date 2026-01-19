"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

// Loading screen component - no progress bar

interface LoadingScreenProps {
  isLoading: boolean;
  onTextComplete?: () => void;
}

export default function LoadingScreen({ isLoading, onTextComplete }: LoadingScreenProps) {
  const [shouldRender, setShouldRender] = useState(true);
  const [displayText, setDisplayText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [loadingText, setLoadingText] = useState("");

  const text1 = "See the bigger picture...";
  const text2 = "Welcome to Zoomout_crew website !";
  const loadingTextContent = "Loading...";

  // Loading text animation - scrie "Loading..." o dată, apoi doar punctele se reîncarcă
  useEffect(() => {
    if (!isLoading) {
      setLoadingText("");
      return;
    }

    const baseText = "Loading";
    let dotsCount = 0;
    const dotsDelay = 500; // 500ms între fiecare punct
    let hasWrittenLoading = false;

    const animateLoading = () => {
      if (!hasWrittenLoading) {
        // Scrie "Loading" complet o singură dată
        setLoadingText(baseText);
        hasWrittenLoading = true;
        // Apoi adaugă punctele
        dotsCount = 1;
        setLoadingText(baseText + ".");
        setTimeout(() => {
          dotsCount = 2;
          setLoadingText(baseText + "..");
          setTimeout(() => {
            dotsCount = 3;
            setLoadingText(baseText + "...");
            // După "Loading...", începe loop-ul cu punctele
            setTimeout(animateDots, dotsDelay);
          }, dotsDelay);
        }, dotsDelay);
      }
    };

    const animateDots = () => {
      // Loop: Loading. -> Loading.. -> Loading... -> Loading. -> ...
      dotsCount++;
      if (dotsCount > 3) {
        dotsCount = 1;
      }
      
      setLoadingText(baseText + ".".repeat(dotsCount));
      setTimeout(animateDots, dotsDelay);
    };

    // Start animația
    const initialDelay = setTimeout(() => {
      animateLoading();
    }, 300);

    return () => {
      clearTimeout(initialDelay);
    };
  }, [isLoading]);

  useEffect(() => {
    if (!isLoading) {
      setDisplayText("");
      return;
    }

    // Timpi exacti conform cerințelor
    const START_DELAY = 500;
    const TYPE_CHAR_DELAY = 50; // 50ms per caracter la scriere
    const DELETE_CHAR_DELAY = 30; // 30ms per caracter la ștergere
    const DELAY_BETWEEN = 1000;
    const FINAL_DELAY = 1000;
    
    const timers: (NodeJS.Timeout | null)[] = [];

    let elapsed = 0;

    // Start delay
    elapsed += START_DELAY;
    const startTimer = setTimeout(() => {
      // Type first text character by character
      let charIndex = 0;
      const type1Interval = setInterval(() => {
        if (charIndex < text1.length) {
          setDisplayText(text1.substring(0, charIndex + 1));
          charIndex++;
        } else {
          clearInterval(type1Interval);
          
          // Wait between texts
          const waitTimer = setTimeout(() => {
            // Delete first text character by character
            let deleteIndex = text1.length;
            const deleteInterval = setInterval(() => {
              if (deleteIndex > 0) {
                setDisplayText(text1.substring(0, deleteIndex - 1));
                deleteIndex--;
              } else {
                clearInterval(deleteInterval);
                
                // Type second text character by character
                let charIndex2 = 0;
                const type2Interval = setInterval(() => {
                  if (charIndex2 < text2.length) {
                    setDisplayText(text2.substring(0, charIndex2 + 1));
                    charIndex2++;
                  } else {
                    clearInterval(type2Interval);
                    
                    // Final delay
                    const finalTimer = setTimeout(() => {
                      if (onTextComplete) {
                        onTextComplete();
                      }
                    }, FINAL_DELAY);
                    timers.push(finalTimer);
                  }
                }, TYPE_CHAR_DELAY);
                timers.push(type2Interval as any);
              }
            }, DELETE_CHAR_DELAY);
            timers.push(deleteInterval as any);
          }, DELAY_BETWEEN);
          timers.push(waitTimer);
        }
      }, TYPE_CHAR_DELAY);
      timers.push(type1Interval as any);
    }, START_DELAY);
    timers.push(startTimer);

    return () => {
      timers.forEach(timer => {
        if (timer) {
          clearTimeout(timer);
          clearInterval(timer as any);
        }
      });
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
        {/* Loading text deasupra logo-ului - înălțime fixă pentru a preveni layout shift */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-6 px-2 drop-shadow-lg text-white text-center min-h-[2em] flex items-center justify-center">
          {loadingText}
          {showCursor && loadingText.length > 0 && <span className="cursor-blink">|</span>}
        </h2>

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
      </div>
    </div>
  );
}
