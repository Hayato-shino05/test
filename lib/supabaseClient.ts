import { createClient } from '@supabase/supabase-js';

// Singleton Supabase client to be reused across the app
// Requires NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in the environment.

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// During static build, env vars may be undefined. Use placeholder to allow build to succeed.
const finalUrl: string = (supabaseUrl as string) ?? "https://placeholder.supabase.co";
const finalKey: string = (supabaseAnonKey as string) ?? "public-anon-key";

export const supabase = createClient(finalUrl, finalKey);
