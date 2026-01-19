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

  const text1 = "See the bigger picture...";
  const text2 = "Welcome to Zoomout_crew website !";

  useEffect(() => {
    if (!isLoading) {
      setDisplayText("");
      return;
    }

    // Timpi reduși pentru loading screen mai scurt
    const START_DELAY = 200; // Redus de la 500ms
    const TYPE_CHAR_DELAY = 30; // Redus de la 50ms per caracter la scriere
    const DELETE_CHAR_DELAY = 20; // Redus de la 30ms per caracter la ștergere
    const DELAY_BETWEEN = 500; // Redus de la 1000ms
    const FINAL_DELAY = 1500; // Mărit pentru a lăsa textul mai mult timp după ce a fost scris
    
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
      className={`fixed inset-0 z-[200] bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center transition-opacity duration-500 ${
        isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Background minimalist cu linii geometrice și mișcare intensă */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
        {/* Grid pattern subtle animat */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            animation: 'gridMove 20s linear infinite',
          }}
        />
        
        {/* Linii diagonale animate - mai multe */}
        <div className="absolute inset-0">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
              style={{
                top: `${10 + i * 10}%`,
                transform: `rotate(${-45 + i * 10}deg)`,
                animation: `slideLine ${2 + i * 0.5}s linear infinite`,
                animationDelay: `${i * 0.3}s`,
              }}
            />
          ))}
        </div>
        
        {/* Linii verticale animate */}
        <div className="absolute inset-0">
          {[...Array(5)].map((_, i) => (
            <div
              key={`vertical-${i}`}
              className="absolute h-full w-px bg-gradient-to-b from-transparent via-white/15 to-transparent"
              style={{
                left: `${15 + i * 20}%`,
                animation: `slideVertical ${3 + i * 0.4}s linear infinite`,
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
        
        {/* Particule flotante */}
        <div className="absolute inset-0">
          {[...Array(12)].map((_, i) => (
            <div
              key={`particle-${i}`}
              className="absolute rounded-full bg-white/10"
              style={{
                width: `${4 + (i % 3) * 2}px`,
                height: `${4 + (i % 3) * 2}px`,
                left: `${(i * 8) % 100}%`,
                top: `${(i * 7) % 100}%`,
                animation: `floatParticle ${4 + (i % 3)}s ease-in-out infinite`,
                animationDelay: `${i * 0.3}s`,
                backdropFilter: 'blur(2px)',
                WebkitBackdropFilter: 'blur(2px)',
              }}
            />
          ))}
        </div>
        
        {/* Gradient radial animat - mai dinamic */}
        <div 
          className="absolute inset-0 animate-gradient-shift"
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.05) 0%, transparent 70%)',
            animation: 'gradientMove 8s ease infinite',
          }}
        />
        
        {/* Wave effect */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            background: 'linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%)',
            backgroundSize: '200% 200%',
            animation: 'waveMove 6s ease infinite',
          }}
        />
      </div>
      
      {/* Conținutul */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4">
        {/* Logo minimalist fără border */}
        <div
          className={`relative transform transition-all duration-700 ${
            isLoading ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          <Image
            src="/assets/logo.png"
            alt="Zoomout_crew Logo"
            width={200}
            height={200}
            priority
            className="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 object-contain"
            style={{
              filter: 'brightness(1.1)',
            }}
          />
        </div>
        
        {/* Text minimalist cu linie subțire */}
        <div className="mt-8 flex flex-col items-center">
          <h1 
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2 px-2 min-h-[1.5em] text-center text-white"
            style={{
              fontFamily: 'var(--font-playfair)',
              letterSpacing: '0.05em',
            }}
          >
            {displayText}
            {showCursor && (
              <span 
                className="cursor-blink ml-1 text-white/80"
                style={{
                  animation: 'blink 1s infinite',
                }}
              >
                |
              </span>
            )}
          </h1>
          
          {/* Linie decorativă sub text */}
          {displayText.length > 0 && (
            <div 
              className="h-px bg-gradient-to-r from-transparent via-white/50 to-transparent w-32 mt-2"
              style={{
                animation: 'expandLine 0.5s ease-out',
              }}
            />
          )}
        </div>
      </div>
      
      {/* Stiluri CSS inline pentru animații */}
      <style jsx>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        
        @keyframes slideLine {
          0% {
            transform: translateX(-100%) rotate(-45deg);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateX(100%) rotate(-45deg);
            opacity: 0;
          }
        }
        
        @keyframes slideVertical {
          0% {
            transform: translateY(-100%);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateY(100%);
            opacity: 0;
          }
        }
        
        @keyframes floatParticle {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.3;
          }
          25% {
            transform: translate(20px, -30px) scale(1.2);
            opacity: 0.6;
          }
          50% {
            transform: translate(-15px, -50px) scale(0.8);
            opacity: 0.4;
          }
          75% {
            transform: translate(30px, -20px) scale(1.1);
            opacity: 0.5;
          }
        }
        
        @keyframes gridMove {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(50px, 50px);
          }
        }
        
        @keyframes gradientMove {
          0%, 100% {
            transform: scale(1) translate(0, 0);
          }
          50% {
            transform: scale(1.2) translate(10%, 10%);
          }
        }
        
        @keyframes waveMove {
          0% {
            background-position: 0% 0%;
          }
          50% {
            background-position: 100% 100%;
          }
          100% {
            background-position: 0% 0%;
          }
        }
        
        @keyframes expandLine {
          from {
            width: 0;
            opacity: 0;
          }
          to {
            width: 8rem;
            opacity: 1;
          }
        }
        
        .cursor-blink {
          display: inline-block;
        }
      `}</style>
    </div>
  );
}
