"use client";
import dynamic from "next/dynamic";

// Avoid SSR; chat depends on browser realtime
export const dynamic = "force-dynamic";

const ChatRoom = dynamic(() => import("@/features/community/ChatRoom"), {
  ssr: false,
});

export default function CommunityPage() {
  return (
    <main className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Cộng đồng</h1>
      <ChatRoom />
    </main>
  );
}
