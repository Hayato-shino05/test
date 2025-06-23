"use client";
import { useEffect, useRef } from "react";

const rand = (min: number, max: number) => Math.random() * (max - min) + min;

export default function Firefly({ count = 40 }: { count?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const container = ref.current;
    if (!container) return;
    container.innerHTML = "";
    for (let i = 0; i < count; i++) {
      const dot = document.createElement("span");
      dot.className = "pointer-events-none fixed top-0 left-0 animate-firefly";
      const size = rand(3, 6);
      dot.style.width = `${size}px`;
      dot.style.height = `${size}px`;
      dot.style.left = `${rand(0, 100)}vw`;
      dot.style.top = `${rand(0, 100)}vh`;
      dot.style.backgroundColor = "#ffe082";
      dot.style.borderRadius = "50%";
      dot.style.opacity = `${rand(0.6, 1)}`;
      dot.style.animationDuration = `${rand(4, 10)}s`;
      dot.style.animationDelay = `${rand(0, 6)}s`;
      container.appendChild(dot);
    }
    return () => {
      container.innerHTML = "";
    };
  }, [count]);

  return (
    <>
      <style jsx global>{`
        @keyframes fireflyFloat {
          0% { transform: translateY(0) translateX(0); }
          25% { transform: translateY(-20px) translateX(10px); }
          50% { transform: translateY(0) translateX(20px); }
          75% { transform: translateY(20px) translateX(10px); }
          100% { transform: translateY(0) translateX(0); }
        }
        .animate-firefly {
          animation: fireflyFloat linear infinite;
          box-shadow: 0 0 6px 2px rgba(255, 224, 130, 0.8);
        }
      `}</style>
      <div ref={ref} className="pointer-events-none fixed inset-0 overflow-hidden -z-10" />
    </>
  );
}
