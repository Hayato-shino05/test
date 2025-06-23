"use client";
import { useEffect, useRef } from "react";
import useSeasonTheme, { Season } from "./useSeasonTheme";
import LeafFall from "./LeafFall";
import PetalFall from "./PetalFall";
import SnowFall from "./SnowFall";
import Firefly from "./Firefly";

// Utility to create a random integer between min–max
const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

interface Particle {
  id: number;
  x: number;
  size: number;
  duration: number;
}

function createParticles(count = 30): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: rand(0, 100),
    size: rand(6, 14),
    duration: rand(8, 16),
  }));
}

export default function SeasonEffect() {
  const season = useSeasonTheme();
  if (season === "autumn") return <LeafFall count={40} />;
  if (season === "spring") return <PetalFall count={40} />;
  if (season === "winter") return <SnowFall count={60} />;
  if (season === "summer") return <Firefly count={40} />;
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.innerHTML = "";
    if (!season) return;

    const colorMap: Record<Season, string> = {
      spring: "#f8b6d2", // pink petals
      summer: "#ffe082", // light yellow dots (fireflies)
      autumn: "#d2691e", // brown leaves
      winter: "#ffffff", // white snowflakes
    };

    const particles = createParticles(40);
    particles.forEach((p) => {
      const el = document.createElement("span");
      el.className = "pointer-events-none fixed top-0 left-0 animate-fall";
      el.style.left = `${p.x}vw`;
      el.style.width = `${p.size}px`;
      el.style.height = `${p.size}px`;
      el.style.backgroundColor = colorMap[season];
      el.style.borderRadius = season === "winter" ? "50%" : "2px";
      el.style.opacity = "0.8";
      el.style.animationDuration = `${p.duration}s`;
      el.style.animationDelay = `${rand(0, 10)}s`;
      el.style.filter = "drop-shadow(0 0 2px rgba(0,0,0,0.2))";
      container.appendChild(el);
    });
    return () => {
      container.innerHTML = "";
    };
  }, [season]);

  return <div ref={containerRef} className="pointer-events-none fixed inset-0 overflow-hidden -z-10" />;
}
