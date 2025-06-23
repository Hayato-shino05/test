"use client";
import dynamic from "next/dynamic";

const FlappyBalloon = dynamic(() => import("@/features/games/FlappyBalloon"), {
  ssr: false,
  loading: () => {
    const { useT } = require("@/providers/I18nProvider");
    const t = useT();
    return <p className="text-center py-8">{t("game_loading")}</p>;
  },
});

export default function FlappyGamePage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <FlappyBalloon />
    </main>
  );
}
