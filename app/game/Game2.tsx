"use client";

import { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import Image from "next/image";

interface Enemy {
  id: number;
  x: number;
  y: number;
  row: number;
  col: number;
}

interface Bullet {
  id: number;
  x: number;
  y: number;
  type: "player" | "enemy";
}

export default function Game2() {
  const { t } = useLanguage();
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [droneX, setDroneX] = useState(50);
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [bullets, setBullets] = useState<Bullet[]>([]);
  const [enemyDirection, setEnemyDirection] = useState<"left" | "right">("right");
  const [enemySpeed, setEnemySpeed] = useState(0.3);
  const [canShoot, setCanShoot] = useState(true);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const keysPressed = useRef<Set<string>>(new Set());
  const lastEnemyMoveTime = useRef(0);
  const lastEnemyShootTime = useRef(0);

  const initializeEnemies = () => {
    const newEnemies: Enemy[] = [];
    const rows = 4;
    const cols = 8;
    const startY = 15;
    const spacingX = 10;
    const spacingY = 8;
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        newEnemies.push({
          id: row * cols + col,
          x: 10 + col * spacingX,
          y: startY + row * spacingY,
          row,
          col,
        });
      }
    }
    setEnemies(newEnemies);
  };

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current.add(e.key.toLowerCase());
      if (e.key === " " || e.key === "ArrowUp") {
        e.preventDefault();
        shoot();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.key.toLowerCase());
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [gameStarted, gameOver, droneX]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const handleMove = (clientX: number) => {
      if (!gameAreaRef.current) return;
      const rect = gameAreaRef.current.getBoundingClientRect();
      const x = ((clientX - rect.left) / rect.width) * 100;
      setDroneX(Math.max(5, Math.min(95, x)));
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (gameAreaRef.current) {
        const rect = gameAreaRef.current.getBoundingClientRect();
        if (e.clientX >= rect.left && e.clientX <= rect.right) {
          handleMove(e.clientX);
        }
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (e.touches[0] && gameAreaRef.current) {
        const rect = gameAreaRef.current.getBoundingClientRect();
        if (e.touches[0].clientX >= rect.left && e.touches[0].clientX <= rect.right) {
          handleMove(e.touches[0].clientX);
        }
      }
    };

    const handleClick = () => {
      if (gameAreaRef.current) shoot();
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("click", handleClick);
    window.addEventListener("touchstart", handleClick);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("click", handleClick);
      window.removeEventListener("touchstart", handleClick);
    };
  }, [gameStarted, gameOver]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const moveInterval = setInterval(() => {
      if (keysPressed.current.has("arrowleft") || keysPressed.current.has("a")) {
        setDroneX((x) => Math.max(5, x - 2));
      }
      if (keysPressed.current.has("arrowright") || keysPressed.current.has("d")) {
        setDroneX((x) => Math.min(95, x + 2));
      }
    }, 16);

    return () => clearInterval(moveInterval);
  }, [gameStarted, gameOver]);

  const shoot = () => {
    if (!canShoot || !gameStarted || gameOver) return;
    setCanShoot(false);
    setBullets((prev) => [
      ...prev,
      { id: Date.now(), x: droneX, y: 85, type: "player" },
    ]);
    setTimeout(() => setCanShoot(true), 300);
  };

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const gameLoop = () => {
      const now = Date.now();

      if (now - lastEnemyMoveTime.current > 100) {
        setEnemies((prev) => {
          if (prev.length === 0) return prev;

          const leftmost = Math.min(...prev.map((e) => e.x));
          const rightmost = Math.max(...prev.map((e) => e.x));
          let newDirection = enemyDirection;
          let moveDown = false;

          if (enemyDirection === "right" && rightmost > 90) {
            newDirection = "left";
            moveDown = true;
          } else if (enemyDirection === "left" && leftmost < 10) {
            newDirection = "right";
            moveDown = true;
          }

          if (moveDown) {
            setEnemyDirection(newDirection);
            return prev.map((e) => ({
              ...e,
              y: e.y + 3,
              x: e.x + (newDirection === "right" ? enemySpeed : -enemySpeed),
            }));
          }

          return prev.map((e) => ({
            ...e,
            x: e.x + (enemyDirection === "right" ? enemySpeed : -enemySpeed),
          }));
        });
        lastEnemyMoveTime.current = now;
      }

      if (enemies.length > 0 && now - lastEnemyShootTime.current > 2000) {
        const randomEnemy = enemies[Math.floor(Math.random() * enemies.length)];
        setBullets((prev) => [
          ...prev,
          {
            id: Date.now() + 100000,
            x: randomEnemy.x,
            y: randomEnemy.y,
            type: "enemy",
          },
        ]);
        lastEnemyShootTime.current = now;
      }

      // Move bullets and check collisions
      setBullets((prevBullets) => {
        const movedBullets = prevBullets
          .map((bullet) => ({
            ...bullet,
            y: bullet.type === "player" ? bullet.y - 2 : bullet.y + 1.5,
          }))
          .filter((bullet) => bullet.y > 0 && bullet.y < 100);

        // Check player bullets hitting enemies
        const hitEnemies = new Set<number>();
        const remainingBullets = movedBullets.filter((bullet) => {
          if (bullet.type !== "player") {
            // Check if enemy bullet hits player
            const distance = Math.sqrt(
              Math.pow(bullet.x - droneX, 2) + Math.pow(bullet.y - 85, 2)
            );
            if (distance < 4) {
              setGameOver(true);
              return false;
            }
            return true;
          }

          // Check if player bullet hits enemy
          const hitEnemy = enemies.find((enemy) => {
            const distance = Math.sqrt(
              Math.pow(bullet.x - enemy.x, 2) + Math.pow(bullet.y - enemy.y, 2)
            );
            return distance < 4;
          });

          if (hitEnemy) {
            hitEnemies.add(hitEnemy.id);
            return false;
          }
          return true;
        });

        // Update enemies, score, and speed if any were hit
        if (hitEnemies.size > 0) {
          setEnemies((prev) => prev.filter((e) => !hitEnemies.has(e.id)));
          setScore((s) => s + hitEnemies.size * 10);
          setEnemySpeed((s) => Math.min(s + hitEnemies.size * 0.02, 1.5));
        }

        return remainingBullets;
      });

      if (enemies.some((e) => e.y > 80)) {
        setGameOver(true);
      }

      if (enemies.length === 0 && gameStarted) {
        initializeEnemies();
        setEnemySpeed(0.3);
      }

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animationFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameStarted, gameOver, enemies, bullets, droneX, enemyDirection, enemySpeed]);

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setDroneX(50);
    setBullets([]);
    setEnemyDirection("right");
    setEnemySpeed(0.3);
    initializeEnemies();
    lastEnemyMoveTime.current = Date.now();
    lastEnemyShootTime.current = Date.now();
  };

  const resetGame = () => {
    setGameStarted(false);
    setGameOver(false);
    setScore(0);
    setDroneX(50);
    setBullets([]);
    setEnemies([]);
    setEnemyDirection("right");
    setEnemySpeed(0.3);
  };

  return (
    <div className="w-full">
      {/* Game Stats */}
      <div className="flex justify-center gap-2 sm:gap-3 md:gap-4 lg:gap-6 mb-2 sm:mb-3 md:mb-4 lg:mb-6">
        <div className="liquid-glass rounded-lg sm:rounded-xl px-3 py-1.5 sm:px-4 sm:py-2 md:px-5 md:py-2.5 lg:px-6 lg:py-3 text-center">
          <p className="text-[10px] sm:text-xs md:text-sm text-gray-400 mb-0.5 sm:mb-1">{t("game.score") || "Score"}</p>
          <p className="text-lg sm:text-xl md:text-2xl font-bold">{score}</p>
        </div>
        <div className="liquid-glass rounded-lg sm:rounded-xl px-3 py-1.5 sm:px-4 sm:py-2 md:px-5 md:py-2.5 lg:px-6 lg:py-3 text-center">
          <p className="text-[10px] sm:text-xs md:text-sm text-gray-400 mb-0.5 sm:mb-1">{t("game.enemies") || "Enemies"}</p>
          <p className="text-lg sm:text-xl md:text-2xl font-bold">{enemies.length}</p>
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
                {t("game.ready") || "Ready to Fight?"}
              </h2>
              <p className="text-gray-300 mb-2 sm:mb-3 md:mb-4 text-xs sm:text-sm md:text-base leading-relaxed">
                {t("game.instructions2") || "Move with mouse/touch or arrow keys. Click/Space to shoot. Destroy all enemies!"}
              </p>
              <div className="text-left text-[10px] sm:text-xs md:text-sm text-gray-400 mb-3 sm:mb-4 md:mb-5 lg:mb-6 space-y-0.5 sm:space-y-1">
                <p>🖱️ Mouse/Touch: Move drone</p>
                <p>🖱️ Click/Tap: Shoot</p>
                <p>⌨️ Arrow Keys: Move</p>
                <p>⌨️ Space/Up: Shoot</p>
              </div>
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

        {enemies.map((enemy) => (
          <div
            key={enemy.id}
            className="absolute z-10"
            style={{
              left: `${enemy.x}%`,
              top: `${enemy.y}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <div className="w-8 h-8 bg-red-500/90 rounded-lg border-2 border-red-400 shadow-lg shadow-red-500/50 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
              </svg>
            </div>
          </div>
        ))}

        {bullets.map((bullet) => (
          <div
            key={bullet.id}
            className={`absolute w-2 h-4 rounded-full ${
              bullet.type === "player"
                ? "bg-cyan-400 shadow-lg shadow-cyan-400/50"
                : "bg-red-400 shadow-lg shadow-red-400/50"
            }`}
            style={{
              left: `${bullet.x}%`,
              top: `${bullet.y}%`,
              transform: "translate(-50%, -50%)",
            }}
          />
        ))}

        {gameStarted && (
          <div
            className="absolute z-10 transition-all duration-100 ease-out"
            style={{
              left: `${droneX}%`,
              top: "85%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <div className="relative w-12 h-12">
              <Image
                src="/assets/logo.png"
                alt="Drone"
                width={48}
                height={48}
                className="w-full h-full object-contain drop-shadow-lg"
              />
              <div className="absolute inset-0 border-2 border-cyan-400/30 rounded-full animate-spin-slow" />
            </div>
          </div>
        )}

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
            {t("game.controls2") || "🖱️ Move mouse/touch to move • 🖱️ Click/Tap or ⌨️ Space to shoot • ⚔️ Destroy all enemies!"}
          </p>
        </div>
      )}
    </div>
  );
}

