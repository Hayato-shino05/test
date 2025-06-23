"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { PostgrestError } from "@supabase/supabase-js";

export interface Invite {
  id: string;
  code: string;
  accepted: boolean;
  created_at: string;
}

export function useInvites() {
  const [invites, setInvites] = useState<Invite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<PostgrestError | null>(null);

  useEffect(() => {
    const fetchInvites = async () => {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setError({
          name: "AuthError",
          message: "Login required",
          details: "",
          hint: "",
          code: "auth",
        });
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from("invites")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) setError(error);
      else setInvites(data || []);
      setLoading(false);
    };
    fetchInvites();

    const channel = supabase
      .channel("invites")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "invites" },
        (payload) => {
          setInvites((prev) => {
            switch (payload.eventType) {
              case "INSERT":
                return [payload.new as Invite, ...prev];
              case "UPDATE":
                return prev.map((p) =>
                  p.id === (payload.new as Invite).id ? (payload.new as Invite) : p
                );
              case "DELETE":
                return prev.filter((p) => p.id !== (payload.old as Invite).id);
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

  const createInvite = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setError({
        name: "AuthError",
        message: "Login required",
        details: "",
        hint: "",
        code: "auth",
      });
      return null;
    }
    // simple random code
    const code = Math.random().toString(36).substring(2, 8);
    const { data, error } = await supabase
      .from("invites")
      .insert({ code })
      .select()
      .single();
    if (error) {
      setError(error);
      return null;
    }
    return data as Invite;
  };

  return { invites, loading, error, createInvite };
}
