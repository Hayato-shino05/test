export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      birthdays: {
        Row: {
          id: string;
          name: string;
          dob: string;
          message: string | null;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          dob: string;
          message?: string | null;
          created_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          dob?: string;
          message?: string | null;
          created_by?: string | null;
          created_at?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          sender_id: string | null;
          birthday_id: string | null;
          text: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          sender_id?: string | null;
          birthday_id?: string | null;
          text: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          sender_id?: string | null;
          birthday_id?: string | null;
          text?: string;
          created_at?: string;
        };
      };
      media: {
        Row: {
          id: string;
          type: string;
          path: string;
          tags: string[] | null;
          owner_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          type: string;
          path: string;
          tags?: string[] | null;
          owner_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          type?: string;
          path?: string;
          tags?: string[] | null;
          owner_id?: string | null;
          created_at?: string;
        };
      };
      audio_messages: {
        Row: {
          id: string;
          sender_id: string | null;
          birthday_id: string | null;
          audio_url: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          sender_id?: string | null;
          birthday_id?: string | null;
          audio_url: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          sender_id?: string | null;
          birthday_id?: string | null;
          audio_url?: string;
          created_at?: string;
        };
      };
      video_messages: {
        Row: {
          id: string;
          sender_id: string | null;
          birthday_id: string | null;
          video_url: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          sender_id?: string | null;
          birthday_id?: string | null;
          video_url: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          sender_id?: string | null;
          birthday_id?: string | null;
          video_url?: string;
          created_at?: string;
        };
      };
      gifts: {
        Row: {
          id: string;
          sender_id: string | null;
          birthday_id: string | null;
          emoji: string;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          sender_id?: string | null;
          birthday_id?: string | null;
          emoji: string;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          sender_id?: string | null;
          birthday_id?: string | null;
          emoji?: string;
          created_at?: string | null;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
} 