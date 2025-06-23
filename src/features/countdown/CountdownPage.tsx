"use client";
import React, { useEffect, useState, useMemo, useRef } from "react";
import dynamic from "next/dynamic";
import confetti from "canvas-confetti";
import { useBirthdayCountdown } from "./useBirthdayCountdown";

// Lazy load Cake3D client-side only
const Cake3D = dynamic(() => import("../cake3d/Cake3D"), { ssr: false });
const MicBlowCandle = dynamic(() => import("../blow/MicBlowCandle"), { ssr: false });

interface Props {
  /** Birthday ISO date, e.g. 2025-12-31 */
  date?: string;
}

// Calculate remaining time from now until the target date
function getTimeLeft(target: Date) {
  const total = target.getTime() - Date.now();
  const seconds = Math.max(0, Math.floor(total / 1000));
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return { total, days, hours, minutes, seconds: secs };
}

export default function CountdownPage({ date }: Props) {
  const [blown, setBlown] = useState(false);
  const confettiFired = useRef(false);
  const {
    timeLeft: autoLeft,
    targetDate: autoTarget,
    person,
    isToday,
  } = useBirthdayCountdown();
    const target = useMemo(() => new Date(date ?? autoTarget), [date, autoTarget]);
  const [timeLeft, setTimeLeft] = useState(() => (date ? getTimeLeft(target) : autoLeft));

  useEffect(() => {
    if (date) {
      const id = setInterval(() => setTimeLeft(getTimeLeft(target)), 1000);
      return () => clearInterval(id);
    }
    // else passive updates from hook
  }, [date, target]);

  // Fire confetti once on birthday
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!isToday || confettiFired.current) return;
    confettiFired.current = true;
    confetti({
      particleCount: 200,
      spread: 120,
      origin: { y: 0.6 },
    });
  }, [isToday]);

  return (
    <section className="flex flex-col items-center gap-6 px-4 text-center">
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
        {isToday && !date ? `Happy Birthday ${person?.name}!` : "Happy Birthday Countdown"}
      </h1>
      <p className="text-sm opacity-70">until {target.toDateString()}</p>
      <div className="grid grid-flow-col gap-3 md:gap-4 auto-cols-max font-mono text-xl md:text-2xl">
        <div className="flex flex-col">
          <span className="countdown-days" aria-label="days">
            {timeLeft.days.toString().padStart(2, "0")}
          </span>
          <span className="text-xs">Days</span>
        </div>
        <div className="flex flex-col">
          <span className="countdown-hours" aria-label="hours">
            {timeLeft.hours.toString().padStart(2, "0")}
          </span>
          <span className="text-xs">Hours</span>
        </div>
        <div className="flex flex-col">
          <span className="countdown-mins" aria-label="minutes">
            {timeLeft.minutes.toString().padStart(2, "0")}
          </span>
          <span className="text-xs">Minutes</span>
        </div>
        <div className="flex flex-col">
          <span className="countdown-secs" aria-label="seconds">
            {timeLeft.seconds.toString().padStart(2, "0")}
          </span>
          <span className="text-xs">Seconds</span>
        </div>
      </div>
      {isToday && !date && (
        <>
          <div className="w-64 md:w-full max-w-md mt-8">
            <Cake3D extinguish={blown} />
          </div>
          {!blown && (
            <MicBlowCandle onExtinguish={() => setBlown(true)} />
          )}
        </>
      )}
    </section>
  );
}
