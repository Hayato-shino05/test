"use client";
import dynamic from "next/dynamic";
import { useT } from "@/providers/I18nProvider";

// Create separate Loading component
function Loading() {
  const t = useT();
  return <p className="text-center py-8">{t("game_loading")}</p>;
}

const FlappyBalloon = dynamic(() => import("@/features/games/FlappyBalloon"), {
  ssr: false,
  loading: () => <Loading />
});

export default function FlappyGamePage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <FlappyBalloon />
    </main>
  );
}
