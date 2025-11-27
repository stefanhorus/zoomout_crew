"use client";

import { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import Image from "next/image";

interface Obstacle {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Collectible {
  id: number;
  x: number;
  y: number;
  collected: boolean;
}

export default function Game1() {
  const { t } = useLanguage();
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [droneX, setDroneX] = useState(50);
  const [droneY, setDroneY] = useState(50);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [collectibles, setCollectibles] = useState<Collectible[]>([]);
  const [gameSpeed, setGameSpeed] = useState(1);
  const [initialSpeed, setInitialSpeed] = useState(1);
  const [starValue, setStarValue] = useState(10);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastObstacleTime = useRef(0);
  const lastCollectibleTime = useRef(0);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const handleMove = (clientX: number, clientY: number) => {
      if (!gameAreaRef.current) return;
      const rect = gameAreaRef.current.getBoundingClientRect();
      const x = ((clientX - rect.left) / rect.width) * 100;
      const y = ((clientY - rect.top) / rect.height) * 100;
      
      setDroneX(Math.max(5, Math.min(95, x)));
      setDroneY(Math.max(5, Math.min(95, y)));
    };

    const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY);
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (e.touches[0]) handleMove(e.touches[0].clientX, e.touches[0].clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [gameStarted, gameOver]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const gameLoop = () => {
      const now = Date.now();

      if (now - lastObstacleTime.current > 2000 - gameSpeed * 50) {
        const newObstacle: Obstacle = {
          id: Date.now(),
          x: Math.random() * 80 + 10,
          y: -10,
          width: 8 + Math.random() * 4,
          height: 8 + Math.random() * 4,
        };
        setObstacles((prev) => [...prev, newObstacle]);
        lastObstacleTime.current = now;
      }

      if (now - lastCollectibleTime.current > 3000) {
        const newCollectible: Collectible = {
          id: Date.now() + 10000,
          x: Math.random() * 80 + 10,
          y: -5,
          collected: false,
        };
        setCollectibles((prev) => [...prev, newCollectible]);
        lastCollectibleTime.current = now;
      }

      setObstacles((prev) =>
        prev
          .map((obs) => ({ ...obs, y: obs.y + gameSpeed * 0.5 }))
          .filter((obs) => obs.y < 110)
      );

      setCollectibles((prev) =>
        prev
          .map((col) => ({ ...col, y: col.y + gameSpeed * 0.4 }))
          .filter((col) => col.y < 110 && !col.collected)
      );

      const droneRect = {
        x: droneX - 2.5,
        y: droneY - 2.5,
        width: 5,
        height: 5,
      };

      obstacles.forEach((obs) => {
        if (
          droneRect.x < obs.x + obs.width &&
          droneRect.x + droneRect.width > obs.x &&
          droneRect.y < obs.y + obs.height &&
          droneRect.y + droneRect.height > obs.y
        ) {
          setGameOver(true);
        }
      });

      setCollectibles((prev) => {
        const updated = prev.map((col) => {
          if (
            !col.collected &&
            droneRect.x < col.x + 3 &&
            droneRect.x + droneRect.width > col.x &&
            droneRect.y < col.y + 3 &&
            droneRect.y + droneRect.height > col.y
          ) {
            setScore((s) => s + starValue);
            return { ...col, collected: true };
          }
          return col;
        });
        return updated.filter((col) => !col.collected || col.y < 110);
      });

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animationFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameStarted, gameOver, droneX, droneY, obstacles, collectibles, gameSpeed, score, starValue]);

  // Update speed and star value based on score thresholds
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    if (score >= 5000) {
      setGameSpeed(3);
      setStarValue(350);
    } else if (score >= 2000) {
      setGameSpeed(2.5);
      setStarValue(250);
    } else if (score >= 1500) {
      setGameSpeed(2);
      setStarValue(150);
    } else if (score >= 1000) {
      setGameSpeed(1.75);
      setStarValue(100);
    } else if (score >= 500) {
      setGameSpeed(1.5);
      setStarValue(50);
    } else if (score >= 100) {
      setGameSpeed(1.25);
      setStarValue(30);
    }
  }, [score, gameStarted, gameOver]);

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setDroneX(50);
    setDroneY(50);
    setObstacles([]);
    setCollectibles([]);
    setGameSpeed(initialSpeed);
    setStarValue(10);
    lastObstacleTime.current = Date.now();
    lastCollectibleTime.current = Date.now();
  };

  const resetGame = () => {
    setGameStarted(false);
    setGameOver(false);
    setScore(0);
    setDroneX(50);
    setDroneY(50);
    setObstacles([]);
    setCollectibles([]);
    setGameSpeed(initialSpeed);
    setStarValue(10);
  };

  const increaseSpeed = () => {
    if (!gameStarted && initialSpeed < 5) {
      setInitialSpeed((prev) => Math.min(prev + 0.5, 5));
    }
  };

  const decreaseSpeed = () => {
    if (!gameStarted && initialSpeed > 1) {
      setInitialSpeed((prev) => Math.max(prev - 0.5, 1));
    }
  };

  return (
    <div className="w-full">
      {/* Game Stats */}
      <div className="flex justify-center gap-2 sm:gap-3 md:gap-4 lg:gap-6 mb-2 sm:mb-3 md:mb-4 lg:mb-6">
        <div className="liquid-glass rounded-lg sm:rounded-xl px-3 py-1.5 sm:px-4 sm:py-2 md:px-5 md:py-2.5 lg:px-6 lg:py-3 text-center">
          <p className="text-[10px] sm:text-xs md:text-sm text-gray-400 mb-0.5 sm:mb-1">{t("game.score") || "Score"}</p>
          <p className="text-lg sm:text-xl md:text-2xl font-bold">{score}</p>
        </div>
        <div className="liquid-glass rounded-lg sm:rounded-xl px-3 py-1.5 sm:px-4 sm:py-2 md:px-5 md:py-2.5 lg:px-6 lg:py-3 text-center relative">
          <p className="text-[10px] sm:text-xs md:text-sm text-gray-400 mb-0.5 sm:mb-1">{t("game.speed") || "Speed"}</p>
          <div className="flex items-center justify-center gap-1 sm:gap-1.5 md:gap-2">
            {!gameStarted && !gameOver && (
              <button
                onClick={decreaseSpeed}
                disabled={initialSpeed <= 1}
                className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 flex items-center justify-center rounded-md sm:rounded-lg bg-white/10 hover:bg-white/20 active:bg-white/15 disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:scale-110 active:scale-95"
                aria-label="Decrease speed"
              >
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            )}
            <p className="text-lg sm:text-xl md:text-2xl font-bold min-w-[45px] sm:min-w-[50px] md:min-w-[60px]">
              {gameStarted ? gameSpeed.toFixed(1) : initialSpeed.toFixed(1)}x
            </p>
            {!gameStarted && !gameOver && (
              <button
                onClick={increaseSpeed}
                disabled={initialSpeed >= 5}
                className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 flex items-center justify-center rounded-md sm:rounded-lg bg-white/10 hover:bg-white/20 active:bg-white/15 disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:scale-110 active:scale-95"
                aria-label="Increase speed"
              >
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Game Area */}
      <div
        ref={gameAreaRef}
        className="relative w-full h-[45vh] sm:h-[50vh] md:h-[55vh] lg:h-[60vh] max-h-[400px] sm:max-h-[450px] md:max-h-[500px] lg:max-h-[600px] mx-auto rounded-xl sm:rounded-2xl overflow-hidden liquid-glass-strong border-2 border-white/20"
        style={{ touchAction: "none" }}
      >
        {!gameStarted && !gameOver && (
          <div className="absolute inset-0 flex items-center justify-center z-20 p-2 sm:p-3 md:p-4">
            <div className="text-center liquid-glass-strong rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 lg:p-8 max-w-md w-full mx-2">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2 md:mb-3 lg:mb-4" style={{ fontFamily: "var(--font-playfair)" }}>
                {t("game.ready") || "Ready to Fly?"}
              </h2>
              <p className="text-gray-300 mb-3 sm:mb-4 md:mb-5 lg:mb-6 text-xs sm:text-sm md:text-base leading-relaxed">
                {t("game.instructions1") || "Move your mouse or finger to control the drone. Avoid red obstacles and collect yellow stars!"}
              </p>
              <button
                onClick={startGame}
                className="liquid-glass-button text-white px-4 py-1.5 sm:px-5 sm:py-2 md:px-6 md:py-2.5 lg:px-8 lg:py-3 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm md:text-base hover:scale-105 active:scale-95 transition-transform"
              >
                {t("game.start") || "Start Game"}
              </button>
            </div>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 flex items-center justify-center z-20 p-2 sm:p-3 md:p-4">
            <div className="text-center liquid-glass-strong rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 lg:p-8 max-w-md w-full mx-2">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2 md:mb-3 lg:mb-4 text-red-400" style={{ fontFamily: "var(--font-playfair)" }}>
                {t("game.gameOver") || "Game Over!"}
              </h2>
              <p className="text-lg sm:text-xl md:text-2xl font-bold mb-1 sm:mb-1.5 md:mb-2">{t("game.finalScore") || "Final Score"}: {score}</p>
              <p className="text-gray-300 mb-3 sm:mb-4 md:mb-5 lg:mb-6 text-xs sm:text-sm md:text-base">{t("game.wellDone") || "Well done! Try again to beat your score."}</p>
              <div className="flex gap-2 sm:gap-3 md:gap-4 justify-center">
                <button
                  onClick={startGame}
                  className="liquid-glass-button text-white px-3 py-1.5 sm:px-4 sm:py-1.5 md:px-5 md:py-2 lg:px-6 lg:py-2 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm md:text-base hover:scale-105 active:scale-95 transition-transform"
                >
                  {t("game.playAgain") || "Play Again"}
                </button>
                <button
                  onClick={resetGame}
                  className="liquid-glass text-white px-3 py-1.5 sm:px-4 sm:py-1.5 md:px-5 md:py-2 lg:px-6 lg:py-2 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm md:text-base hover:scale-105 active:scale-95 transition-transform"
                >
                  {t("game.menu") || "Menu"}
                </button>
              </div>
            </div>
          </div>
        )}

        {gameStarted && (
          <div
            className="absolute z-10 transition-all duration-100 ease-out"
            style={{
              left: `${droneX}%`,
              top: `${droneY}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <div className="relative w-10 h-10">
              <Image
                src="/logo.png"
                alt="Drone"
                width={40}
                height={40}
                className="w-full h-full object-contain drop-shadow-lg animate-pulse"
              />
              <div className="absolute inset-0 border-2 border-cyan-400/30 rounded-full animate-spin-slow" />
            </div>
          </div>
        )}

        {obstacles.map((obs) => (
          <div
            key={obs.id}
            className="absolute rounded-lg bg-red-500/80 border-2 border-red-400 shadow-lg shadow-red-500/50"
            style={{
              left: `${obs.x}%`,
              top: `${obs.y}%`,
              width: `${obs.width}%`,
              height: `${obs.height}%`,
              transform: "translate(-50%, -50%)",
            }}
          />
        ))}

        {collectibles.map((col) => (
          !col.collected && (
            <div
              key={col.id}
              className="absolute animate-pulse"
              style={{
                left: `${col.x}%`,
                top: `${col.y}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <svg className="w-6 h-6 text-yellow-400 drop-shadow-lg" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
          )
        ))}

        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
              `,
              backgroundSize: "50px 50px",
            }}
          />
        </div>
      </div>

      {gameStarted && !gameOver && (
        <div className="mt-2 sm:mt-3 md:mt-4 lg:mt-6 text-center px-2 sm:px-3 md:px-4">
          <p className="text-gray-400 text-[10px] sm:text-xs md:text-sm leading-tight sm:leading-normal">
            {t("game.controls1") || "🖱️ Move mouse or 👆 touch to control • ⭐ Collect stars (+10) • ⛔ Avoid obstacles"}
          </p>
        </div>
      )}
    </div>
  );
}

