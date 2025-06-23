"use client";
import { useState, useRef, useEffect } from "react";
import { useChatMessages } from "./useChatMessages";

export default function ChatRoom() {
  const { messages, loading, error, sendMessage } = useChatMessages();
  const [content, setContent] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendMessage(content);
    setContent("");
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="border rounded shadow-sm flex flex-col h-[60vh] sm:h-[70vh]">
      <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-neutral-50 dark:bg-neutral-900">
        {loading ? (
          <p className="text-neutral-500 text-sm">Loading...</p>
        ) : (
          messages.map((m) => (
            <div key={m.id} className="flex flex-col text-sm leading-tight">
              <span className="text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap break-words">
                {m.content}
              </span>
              <span className="text-xs text-neutral-400">
                {new Date(m.created_at).toLocaleTimeString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>
      {error && <p className="text-red-500 text-xs p-2">{error.message}</p>}
      <form onSubmit={handleSend} className="flex p-2 gap-2 border-t">
        <input
          className="flex-1 border rounded p-2 text-sm"
          placeholder="Nhắn gì đó..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button
          type="submit"
          className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm"
          disabled={!content.trim()}
        >
          Gửi
        </button>
      </form>
    </div>
  );
}
