"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function Home() {
  const maxRounds = 5;
  const [gameState, setGameState] = useState<"start" | "playing" | "finished">("start");
  const [currentHage, setCurrentHage] = useState<string | null>(null);
  const [revealLevel, setRevealLevel] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [round, setRound] = useState(1);
  const [usedImages, setUsedImages] = useState<number[]>([]);

  const startGame = () => {
    if (usedImages.length >= maxRounds) {
      setGameState("finished");
      return;
    }

    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * 19) + 1; // 1~19
    } while (usedImages.includes(randomIndex));

    setCurrentHage(`/images/hages/${randomIndex}.jpg`);
    setRevealLevel(0);
    setIsPaused(false);
    setUsedImages((prev) => [...prev, randomIndex]);
    setGameState("playing");
  };

  useEffect(() => {
    if (gameState !== "playing" || isPaused) return;
    const interval = setInterval(() => {
      setRevealLevel((prev) => Math.min(prev + 1, 100));
    }, 300);
    return () => clearInterval(interval);
  }, [gameState, isPaused]);

  const handleNext = () => {
    if (round < maxRounds) {
      setRound(round + 1);
      startGame();
    } else {
      setGameState("finished");
    }
  };

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

      <div className="relative z-10 flex flex-col items-center w-full max-w-md gap-6">
        {/* スタート画面 */}
        {gameState === "start" && (
          <button
            onClick={startGame}
            className="w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-4 bg-yellow-400 text-black rounded-lg shadow-lg hover:bg-yellow-500 transition text-lg sm:text-2xl"
          >
            スタート
          </button>
        )}

        {/* プレイ画面 */}
        {gameState === "playing" && currentHage && (
          <div className="flex flex-col items-center gap-4 w-full">
            {/* 丸いハゲ画像＋黄色オーバーレイ */}
            <div className="relative w-1/3 aspect-square rounded-full overflow-hidden shadow-lg min-w-[120px] max-w-[200px] sm:min-w-[150px] sm:max-w-[250px]">
            <Image
                key={currentHage + round} // ← keyを変える
                src={currentHage}
                alt="hage"
                fill
                className="object-cover"
                style={{
                  clipPath: `inset(0 0 ${100 - revealLevel}%)`,
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
            <div className="flex flex-wrap justify-center gap-3 w-full">
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
                onClick={handleNext}
                className="flex-1 px-4 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition text-sm sm:text-base"
              >
                次へ
              </button>
              <button
                onClick={() => {
                  setGameState("start");
                  setRound(1);
                  setUsedImages([]);
                }}
                className="flex-1 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm sm:text-base"
              >
                リトライ
              </button>
            </div>
            <p className="text-white mt-2">ラウンド: {round}/{maxRounds}</p>
          </div>
        )}

        {/* 終了画面 */}
        {gameState === "finished" && currentHage && (
          <div className="flex flex-col items-center gap-6 w-full">
            <p className="text-white text-lg">全てのラウンドが終了しました！</p>
            <button
              onClick={() => {
                setGameState("start");
                setRound(1);
                setUsedImages([]);
              }}
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
