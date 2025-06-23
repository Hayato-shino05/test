"use client";
import { useEffect, useState } from "react";

export type Season = "spring" | "summer" | "autumn" | "winter";

function detectSeason(date = new Date()): Season {
  const m = date.getMonth();
  if (m >= 2 && m <= 4) return "spring";
  if (m >= 5 && m <= 7) return "summer";
  if (m >= 8 && m <= 10) return "autumn";
  return "winter";
}

export default function useSeasonTheme() {
  const [season, setSeason] = useState<Season>(() => detectSeason());

  useEffect(() => {
    const clsList = document.body.classList;
    const seasons: Season[] = ["spring", "summer", "autumn", "winter"];
    seasons.forEach((s) => clsList.remove(s));
    clsList.add(season);
  }, [season]);

  // update season at midnight
  useEffect(() => {
    const id = setInterval(() => {
      setSeason(detectSeason());
    }, 60 * 60 * 1000);
    return () => clearInterval(id);
  }, []);

  return season;
}
