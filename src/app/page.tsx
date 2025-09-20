"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function Home() {
  const [gameState, setGameState] = useState<"start" | "playing" | "finished">("start");
  const [currentHage, setCurrentHage] = useState<string | null>(null);
  const [revealLevel, setRevealLevel] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const startGame = () => {
    const randomIndex = Math.floor(Math.random() * 20) + 1;
    setCurrentHage(`/images/hages/hage1.jpg`);
    setRevealLevel(0);
    setIsPaused(false);
    setGameState("playing");
  };

  useEffect(() => {
    if (gameState !== "playing" || isPaused) return;
    const interval = setInterval(() => {
      setRevealLevel((prev) => Math.min(prev + 1, 100));
    }, 300);
    return () => clearInterval(interval);
  }, [gameState, isPaused]);

  return (
    <main
      className="flex flex-col items-center justify-center min-h-screen w-full relative p-4 sm:p-8"
      style={{
        backgroundImage: "url('/images/hageback.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 flex flex-col items-center w-full max-w-md">
        {gameState === "start" && (
          <button
            onClick={startGame}
            className="w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-4 bg-yellow-400 text-black rounded-lg shadow-lg hover:bg-yellow-500 transition text-lg sm:text-2xl"
          >
            スタート
          </button>
        )}

        {gameState === "playing" && currentHage && (
          <div className="flex flex-col items-center gap-6 w-full">
            {/* 丸いハゲ画像 */}
            <div className="relative w-1/3 aspect-square rounded-full overflow-hidden shadow-lg min-w-[120px] max-w-[200px] sm:min-w-[150px] sm:max-w-[250px]">
              <Image
                src={currentHage}
                alt="hage"
                fill
                className="object-cover"
                style={{
                  clipPath: `inset(0 0 ${100 - revealLevel}% 0)`,
                  transition: "clip-path 0.3s linear",
                }}
              />
            </div>
            {/* 進行状況 */}
            <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
              <div
                className="bg-yellow-400 h-4 transition-all duration-300"
                style={{ width: `${revealLevel}%` }}
              />
            </div>
            <p className="text-white text-sm sm:text-base mt-1">
              {Math.floor(revealLevel)}% 見えてます
            </p>

            {/* 操作ボタン */}
            <div className="flex flex-wrap justify-center gap-3 mt-2 w-full">
              <button
                onClick={() => setIsPaused((prev) => !prev)}
                className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm sm:text-base"
              >
                {isPaused ? "再開" : "停止"}
              </button>
              <button
                onClick={() => {
                  setRevealLevel(100);
                  setIsPaused(true);
                }}
                className="flex-1 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition text-sm sm:text-base"
              >
                正解！
              </button>
              <button
                onClick={() => setGameState("start")}
                className="flex-1 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm sm:text-base"
              >
                リトライ
              </button>
            </div>
          </div>
        )}

        {gameState === "finished" && currentHage && (
          <div className="flex flex-col items-center gap-6 w-full">
            <div className="relative w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] rounded-full overflow-hidden shadow-lg">
              <Image
                src={currentHage}
                alt="hage"
                fill
                className="object-cover"
              />
            </div>
            <button
              onClick={() => setGameState("start")}
              className="w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-4 bg-red-400 text-white rounded-lg shadow-lg hover:bg-red-500 transition text-lg sm:text-2xl"
            >
              リトライ
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
