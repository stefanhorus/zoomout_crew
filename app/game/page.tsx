"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import Image from "next/image";
import Game1 from "./Game1";
import Game2 from "./Game2";

type GameMode = "selection" | "game1" | "game2";

export default function Game() {
  const { t } = useLanguage();
  const [gameMode, setGameMode] = useState<GameMode>("selection");

  return (
    <main className="min-h-screen text-white pt-16 sm:pt-20 md:pt-24 pb-6 sm:pb-8 md:pb-16 relative">
      {/* Background */}
      <div className="fixed inset-0 w-full h-full z-0">
        <Image
          src="/assets/backgrounds/background3.jpg"
          alt="Game background"
          fill
          priority
          quality={75}
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/70" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-3 sm:mb-4 md:mb-6 lg:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-1 sm:mb-2 md:mb-3 lg:mb-4" style={{ fontFamily: "var(--font-playfair)" }}>
            {t("game.title") || "Drone Games"}
          </h1>
          <p className="text-gray-300 text-xs sm:text-sm md:text-base lg:text-lg px-2 sm:px-4">
            {t("game.subtitle") || "Choose your game mode and start playing!"}
          </p>
        </div>

        {/* Game Selection */}
        {gameMode === "selection" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6 lg:gap-8 mb-3 sm:mb-4 md:mb-6 lg:mb-8">
            {/* Game 1 - Avoid & Collect */}
            <div
              onClick={() => setGameMode("game1")}
              className="liquid-glass-strong rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 lg:p-8 cursor-pointer hover:scale-105 active:scale-95 transition-all duration-300 group"
            >
              <div className="text-center">
                <div className="mb-2 sm:mb-3 md:mb-4 flex justify-center">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 lg:w-20 lg:h-20 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-2xl font-bold mb-1 sm:mb-2 md:mb-3 group-hover:text-cyan-300 transition-colors" style={{ fontFamily: "var(--font-playfair)" }}>
                  {t("game.mode1.title") || "Avoid & Collect"}
                </h2>
                <p className="text-gray-300 mb-2 sm:mb-3 md:mb-4 text-xs sm:text-sm md:text-base">
                  {t("game.mode1.description") || "Control the drone freely. Avoid red obstacles and collect yellow stars!"}
                </p>
                <div className="text-xs sm:text-xs md:text-sm text-gray-400 space-y-0.5 sm:space-y-1">
                  <p>⭐ Collect stars</p>
                  <p>⛔ Avoid obstacles</p>
                  <p>🖱️ Free movement</p>
                </div>
              </div>
            </div>

            {/* Game 2 - Space Invaders */}
            <div
              onClick={() => setGameMode("game2")}
              className="liquid-glass-strong rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 lg:p-8 cursor-pointer hover:scale-105 active:scale-95 transition-all duration-300 group"
            >
              <div className="text-center">
                <div className="mb-2 sm:mb-3 md:mb-4 flex justify-center">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 lg:w-20 lg:h-20 bg-gradient-to-br from-red-400 to-purple-500 rounded-full flex items-center justify-center">
                    <svg className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                    </svg>
                  </div>
                </div>
                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-2xl font-bold mb-1 sm:mb-2 md:mb-3 group-hover:text-red-300 transition-colors" style={{ fontFamily: "var(--font-playfair)" }}>
                  {t("game.mode2.title") || "Space Invaders"}
                </h2>
                <p className="text-gray-300 mb-2 sm:mb-3 md:mb-4 text-xs sm:text-sm md:text-base">
                  {t("game.mode2.description") || "Destroy all enemies! Shoot and avoid enemy bullets."}
                </p>
                <div className="text-xs sm:text-xs md:text-sm text-gray-400 space-y-0.5 sm:space-y-1">
                  <p>⚔️ Destroy enemies</p>
                  <p>🔫 Shoot bullets</p>
                  <p>⌨️ Keyboard controls</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Back to Selection Button */}
        {gameMode !== "selection" && (
          <div className="mb-2 sm:mb-3 md:mb-4 lg:mb-6 text-center">
            <button
              onClick={() => setGameMode("selection")}
              className="liquid-glass text-white px-3 py-1 sm:px-4 sm:py-1.5 md:px-6 md:py-2 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm md:text-base hover:scale-105 active:scale-95 transition-transform"
            >
              ← {t("game.backToMenu") || "Back to Menu"}
            </button>
          </div>
        )}

        {/* Render Selected Game */}
        {gameMode === "game1" && <Game1 />}
        {gameMode === "game2" && <Game2 />}
      </div>
    </main>
  );
}
