"use client";
import { useEffect, useRef } from "react";

const rand = (min: number, max: number) => Math.random() * (max - min) + min;

export default function SnowFall({ count = 60 }: { count?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const container = ref.current;
    if (!container) return;
    container.innerHTML = "";
    for (let i = 0; i < count; i++) {
      const flake = document.createElement("span");
      flake.className = "pointer-events-none fixed top-0 left-0 animate-snowFall";
      const size = rand(4, 8);
      flake.style.width = `${size}px`;
      flake.style.height = `${size}px`;
      flake.style.left = `${rand(0, 100)}vw`;
      flake.style.backgroundColor = "#ffffff";
      flake.style.borderRadius = "50%";
      flake.style.opacity = `${rand(0.6, 1)}`;
      flake.style.animationDuration = `${rand(8, 18)}s`;
      flake.style.animationDelay = `${rand(0, 10)}s`;
      container.appendChild(flake);
    }
    return () => {
      container.innerHTML = "";
    };
  }, [count]);

  return (
    <>
      <style jsx global>{`
        @keyframes snowFall {
          0% {
            transform: translateY(-10vh);
          }
          100% {
            transform: translateY(110vh);
          }
        }
        .animate-snowFall {
          animation-name: snowFall, swaySnow;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        @keyframes swaySnow {
          0% { transform: translateX(0); }
          50% { transform: translateX(20px); }
          100% { transform: translateX(0); }
        }
      `}</style>
      <div ref={ref} className="pointer-events-none fixed inset-0 overflow-hidden -z-10" />
    </>
  );
}
