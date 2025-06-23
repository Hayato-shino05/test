"use client";
import { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";

export default function ECardGenerator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("Chúc mừng sinh nhật!");

  // Vẽ mỗi khi state thay đổi
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;

    // nền gradient
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, "#f9a8d4");
    grad.addColorStop(1, "#fef08a");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // khung trắng
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 4;
    ctx.strokeRect(20, 20, w - 40, h - 40);

    // text
    ctx.fillStyle = "#fff";
    ctx.font = "28px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(message, w / 2, h / 2);

    ctx.font = "20px sans-serif";
    ctx.fillText(`- ${name || "Bạn"} -`, w / 2, h / 2 + 40);
  }, [name, message]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "ecard.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
    confetti({ particleCount: 150, spread: 60 });
  };

  return (
    <div className="w-full max-w-lg mx-auto space-y-4">
      <h2 className="text-xl font-semibold text-center">Tạo Thiệp Chúc Mừng</h2>
      <div className="flex flex-col gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded"
          placeholder="Tên bạn"
        />
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="border p-2 rounded"
          rows={3}
        />
        <button
          onClick={handleDownload}
          className="px-4 py-2 rounded bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          Tải PNG
        </button>
      </div>
      <div className="mx-auto max-w-sm border-2 rounded shadow">
        <canvas ref={canvasRef} width={400} height={250} />
      </div>
    </div>
  );
}
