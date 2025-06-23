"use client";
import { useEffect, useRef } from "react";

const rand = (min: number, max: number) => Math.random() * (max - min) + min;

export default function PetalFall({ count = 40 }: { count?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const container = ref.current;
    if (!container) return;
    container.innerHTML = "";

    for (let i = 0; i < count; i++) {
      const petal = document.createElement("span");
      petal.className = "pointer-events-none fixed top-0 left-0 animate-petalFall";
      const size = rand(6, 14);
      petal.style.width = `${size}px`;
      petal.style.height = `${size}px`;
      petal.style.left = `${rand(0, 100)}vw`;
      petal.style.backgroundColor = "#f8b6d2";
      petal.style.borderRadius = "50% 50% 40% 60%";
      petal.style.opacity = "0.8";
      petal.style.animationDuration = `${rand(6, 12)}s`;
      petal.style.animationDelay = `${rand(0, 8)}s`;
      petal.style.transformOrigin = "50% -20%";
      container.appendChild(petal);
    }
    return () => {
      container.innerHTML = "";
    };
  }, [count]);

  return (
    <>
      <style jsx global>{`
        @keyframes petalFall {
          0% { transform: translateY(-10vh) rotate(0deg); }
          100% { transform: translateY(110vh) rotate(360deg); }
        }
        .animate-petalFall {
          animation-name: petalFall, swayPetal;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        @keyframes swayPetal {
          0% { transform: translateX(0); }
          50% { transform: translateX(-30px); }
          100% { transform: translateX(0); }
        }
      `}</style>
      <div ref={ref} className="pointer-events-none fixed inset-0 overflow-hidden -z-10" />
    </>
  );
}
