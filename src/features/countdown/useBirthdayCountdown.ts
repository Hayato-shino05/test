import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export interface BirthdayPerson {
  name: string;
  month: number; // 1-12
  day: number; // 1-31
  message: string;
}

export interface CountdownState {
  person: BirthdayPerson | null; // who the countdown is for (today or next)
  targetDate: Date; // exact next birthday date
  timeLeft: {
    total: number;
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  };
  isToday: boolean; // true if today is someone's birthday
}

const DEFAULT_BIRTHDAYS: BirthdayPerson[] = [
  { name: "Dũng", month: 12, day: 7, message: "🎉 Ê Dũng, sinh nhật vui quá nha mày! 🎉" },
  { name: "Hiệp", month: 10, day: 2, message: "🎉 Ê Hiệp, sinh nhật vui quá nha mày! 🎉" },
  { name: "Thành", month: 2, day: 27, message: "🎂 Hội mẹ bầu đơn thân Chúc mừng sinh nhật bé Thành nha 🎂" },
  { name: "Đức", month: 8, day: 19, message: "🎈 Đức ơi, sinh nhật mày tới rồi kìa, quẩy tung nóc đi nha! 🎈" },
  { name: "Tiển", month: 7, day: 26, message: "🎉 Tiển ơi, sinh nhật mày phải quẩy cho đã nha thằng khỉ! 🎉" },
  { name: "Viện", month: 6, day: 24, message: "🎉 Ê Viện, sinh nhật vui quá nha mày! 🎉" },
  { name: "Diệu", month: 8, day: 5, message: "🎂 Diệu xinh đẹp, sinh nhật vui nha nhỏ bạn! 🎂" },
  { name: "Hiền", month: 5, day: 8, message: "🎈 Hiền ơi, sinh nhật mày quẩy tưng bừng luôn nha! 🎈" },
  { name: "Uyên", month: 11, day: 19, message: "🎉 Uyên ơi, sinh nhật mày tới rồi, quẩy banh nóc đi nha nhỏ! 🎈" },
  { name: "Như", month: 10, day: 12, message: "🎉 Như ơi, sinh nhật mày tới rồi, quẩy banh nóc đi nha nhỏ! 🎈" },
];

// helper to compute difference
function diffToParts(target: Date) {
  const total = target.getTime() - Date.now();
  const positive = Math.max(0, total);
  const secs = Math.floor(positive / 1000);
  return {
    total: positive,
    days: Math.floor(secs / 86400),
    hours: Math.floor((secs % 86400) / 3600),
    minutes: Math.floor((secs % 3600) / 60),
    seconds: secs % 60,
  } as CountdownState["timeLeft"];
}

function findNextBirthday(now: Date, list: BirthdayPerson[]): { person: BirthdayPerson; date: Date } {
  let nearest: BirthdayPerson | null = null;
  let nearestDate: Date | null = null;
  let smallestDiff = Number.POSITIVE_INFINITY;

  for (const p of list) {
    let bd = new Date(now.getFullYear(), p.month - 1, p.day);
    if (bd < now) bd = new Date(now.getFullYear() + 1, p.month - 1, p.day);
    const diff = bd.getTime() - now.getTime();
    if (diff < smallestDiff) {
      smallestDiff = diff;
      nearest = p;
      nearestDate = bd;
    }
  }
  return { person: nearest!, date: nearestDate! };
}

export function useBirthdayCountdown(birthdays: BirthdayPerson[] = DEFAULT_BIRTHDAYS): CountdownState {
  const [remoteBirthdays, setRemoteBirthdays] = useState<BirthdayPerson[] | null>(null);

  // Fetch birthdays from Supabase once
  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("birthdays")
        .select("name,dob,message");
      if (error || !data) return;
      const mapped = data.map((r) => {
        const d = new Date(r.dob as unknown as string);
        return {
          name: r.name as string,
          month: d.getUTCMonth() + 1,
          day: d.getUTCDate(),
          message: (r as Record<string, string>).message ?? "",
        } as BirthdayPerson;
      });
      if (mapped.length) setRemoteBirthdays(mapped);
    })();
  }, []);

  const list = remoteBirthdays ?? birthdays;
  const now = useMemo(() => new Date(), []);

  const todayPerson = useMemo(() => {
    return list.find(p => p.month === now.getMonth() + 1 && p.day === now.getDate()) || null;
  }, [list, now]);

  const { person, date } = useMemo(() => {
    if (todayPerson) {
      return { person: todayPerson, date: new Date(now.getFullYear(), now.getMonth(), now.getDate()) };
    }
    return findNextBirthday(now, list);
  }, [todayPerson, list, now]);

  const [timeLeft, setTimeLeft] = useState(() => diffToParts(date));

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(diffToParts(date)), 1000);
    return () => clearInterval(id);
  }, [date]);

  return {
    person,
    targetDate: date,
    timeLeft,
    isToday: !!todayPerson,
  };
}
