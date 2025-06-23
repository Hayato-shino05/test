"use client";
import { useState } from "react";
import confetti from "canvas-confetti";

export default function SocialShare() {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== "undefined" ? window.location.origin : "";

  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Happy Birthday!",
          text: "Chúc mừng sinh nhật! Hãy xem website đặc biệt này ❤",
          url,
        });
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      } catch (err) {
        // user cancelled
      }
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="max-w-md mx-auto text-center space-y-4">
      <h2 className="text-xl font-semibold">Chia sẻ lời chúc</h2>
      <p className="text-sm text-neutral-600">
        Gửi website này cho bạn bè &amp; người thân để lan tỏa niềm vui!
      </p>
      <button
        onClick={handleShare}
        className="px-6 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white transition disabled:opacity-50"
      >
        {typeof navigator.share === "function" ? "Chia sẻ" : copied ? "Đã sao chép!" : "Sao chép link"}
      </button>
      {!navigator.share && (
        <p className="text-xs text-gray-400">
          Trình duyệt không hỗ trợ chia sẻ trực tiếp, link sẽ được sao chép.
        </p>
      )}
    </div>
  );
}

