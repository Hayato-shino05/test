"use client";
import { useEffect, useState } from "react";
import { PostgrestError } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";

export interface Bulletin {
  id: string;
  user_id: string;
  content: string;
  like_count: number;
  created_at: string;
}

export function useBulletins() {
  const [posts, setPosts] = useState<Bulletin[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<PostgrestError | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("bulletins")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) setError(error);
      else setPosts(data || []);
      setLoading(false);
    };
    fetchPosts();

    // realtime subscription
    const channel = supabase
      .channel("bulletins")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bulletins" },
        (payload) => {
          setPosts((prev) => {
            switch (payload.eventType) {
              case "INSERT":
                return [payload.new as Bulletin, ...prev];
              case "UPDATE":
                return prev.map((p) =>
                  p.id === (payload.new as Bulletin).id ? (payload.new as Bulletin) : p
                );
              case "DELETE":
                return prev.filter((p) => p.id !== (payload.old as Bulletin).id);
              default:
                return prev;
            }
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const createPost = async (content: string) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setError({ name: "AuthError", message: "Bạn cần đăng nhập để đăng bài", details: "", hint: "", code: "auth" });
      return;
    }
    const { error } = await supabase.from("bulletins").insert({ content, user_id: user.id });
    if (error) setError(error);
  };

  const likePost = async (id: string, currentLike: number) => {
    const { error } = await supabase
      .from("bulletins")
      .update({ like_count: currentLike + 1 })
      .eq("id", id);
    if (error) setError(error);
  };

  const deletePost = async (id: string) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    const { error } = await supabase.from("bulletins").delete().eq("id", id);
    if (error) setError(error);
  };

  return { posts, loading, error, createPost, likePost, deletePost };
}
