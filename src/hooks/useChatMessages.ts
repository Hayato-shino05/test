import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export interface ChatMessage {
  id: string;
  sender_id: string | null;
  text: string;
  created_at: string;
}

export default function useChatMessages(limit = 50) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("messages")
        .select("id,sender_id,text,created_at")
        .order("created_at", { ascending: false })
        .limit(limit);
      if (data) setMessages(data.reverse());
    }
    load();

    const channel = supabase
      .channel("rt:messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          const newMsg = payload.new as unknown as ChatMessage;
          setMessages((prev) => [...prev, newMsg]);
        }
      )
      .subscribe();
    return () => {
      channel.unsubscribe();
    };
  }, [limit]);

  return messages;
}
