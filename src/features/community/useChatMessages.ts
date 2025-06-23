"use client";
import { useEffect, useState } from "react";
import { PostgrestError } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";

export interface ChatMessage {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
}

export function useChatMessages() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<PostgrestError | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) setError(error);
      else setMessages(data || []);
      setLoading(false);
    };
    fetchMessages();

    const channel = supabase
      .channel("messages")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "messages" },
        (payload) => {
          setMessages((prev) => {
            if (payload.eventType === "INSERT") {
              return [payload.new as ChatMessage, ...prev].slice(0, 50);
            }
            return prev;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setError({ name: "Auth", message: "Login required", details: "", hint: "", code: "auth" });
      return;
    }
    await supabase.from("messages").insert({ content });
  };

  return { messages, loading, error, sendMessage };
}
