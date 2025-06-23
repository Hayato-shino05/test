"use client";
import { useEffect, useRef, useState } from "react";

export default function ScratchCardGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [revealed, setRevealed] = useState(false);
  const width = 320;
  const height = 200;

  useEffect(() => {
    const canvas = canvasRef.current!;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    if (!ctx) return;

    // Draw mask
    ctx.fillStyle = "#9ca3af";
    ctx.fillRect(0, 0, width, height);
    ctx.globalCompositeOperation = "destination-out";

    let scratching = false;
    function scratch(e: PointerEvent) {
      if (!scratching) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      ctx.beginPath();
      ctx.arc(x, y, 16, 0, Math.PI * 2);
      ctx.fill();
    }
    const start = () => {
      scratching = true;
    };
    const end = () => {
      scratching = false;
      // Check reveal percent
      const imgData = ctx.getImageData(0, 0, width, height);
      let transparent = 0;
      for (let i = 3; i < imgData.data.length; i += 4) {
        if (imgData.data[i] === 0) transparent++;
      }
      const percent = (transparent / (width * height)) * 100;
      if (percent > 50 && !revealed) {
        setRevealed(true);
      }
    };

    canvas.addEventListener("pointerdown", start);
    canvas.addEventListener("pointermove", scratch);
    window.addEventListener("pointerup", end);

    return () => {
      canvas.removeEventListener("pointerdown", start);
      canvas.removeEventListener("pointermove", scratch);
      window.removeEventListener("pointerup", end);
    };
  }, [revealed]);

  return (
    <div className="flex flex-col items-center gap-4 select-none">
      <h2 className="text-xl font-semibold">Scratch Card</h2>
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className="border-2 border-amber-500 rounded"
        />
        {!revealed && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="text-lg font-medium text-white drop-shadow">Cào để nhận quà!</p>
          </div>
        )}
        {revealed && (
          <div className="absolute inset-0 flex items-center justify-center bg-emerald-600 text-white text-2xl font-bold animate-pulse rounded">
            🎉 Bạn đã trúng phần quà! 🎉
          </div>
        )}
      </div>
    </div>
  );
}


