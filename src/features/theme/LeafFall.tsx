"use client";
import { useEffect, useRef } from "react";

// Utility
const rand = (min: number, max: number) => Math.random() * (max - min) + min;

export default function LeafFall({ count = 30 }: { count?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const container = ref.current;
    if (!container) return;
    container.innerHTML = "";

    const colors = [
      "#FF4500",
      "#FF8C00",
      "#CD5C5C",
      "#B22222",
      "#D2691E",
    ];

    for (let i = 0; i < count; i++) {
      const leaf = document.createElement("span");
      leaf.className = "pointer-events-none fixed top-0 left-0 animate-leafFall";
      const size = rand(8, 18);
      leaf.style.width = `${size}px`;
      leaf.style.height = `${size * 0.8}px`;
      leaf.style.left = `${rand(0, 100)}vw`;
      leaf.style.backgroundColor = colors[Math.floor(rand(0, colors.length))];
      leaf.style.borderRadius = "20% 80% 30% 70%";
      leaf.style.opacity = "0.8";
      leaf.style.animationDuration = `${rand(8, 16)}s`;
      leaf.style.animationDelay = `${rand(0, 10)}s`;
      leaf.style.transformOrigin = "50% -20%";
      container.appendChild(leaf);
    }
    return () => {
      container.innerHTML = "";
    };
  }, [count]);

  return (
    <>
      <style jsx global>{`
        @keyframes leafFall {
          0% {
            transform: translateY(-10vh) rotate(0deg);
          }
          100% {
            transform: translateY(110vh) rotate(360deg);
          }
        }
        .animate-leafFall {
          animation-name: leafFall, swayLeaf;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        @keyframes swayLeaf {
          0% { transform: translateX(0); }
          50% { transform: translateX(40px); }
          100% { transform: translateX(0); }
        }
      `}</style>
      <div
        ref={ref}
        className="pointer-events-none fixed inset-0 overflow-hidden -z-10"
      />
    </>
  );
}
