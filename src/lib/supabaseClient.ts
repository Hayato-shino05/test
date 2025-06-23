import { createClient } from "@supabase/supabase-js";

// Centralised Supabase client for client-side usage
// We fallback to placeholder strings during `next build` when env vars are not injected
// so that static generation does not fail. At runtime (browser) the real values must
// exist via NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY.

const supabaseUrl: string =
  (process.env.NEXT_PUBLIC_SUPABASE_URL as string) ||
  "https://placeholder.supabase.co";
const supabaseAnonKey: string =
  (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string) || "public-anon-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
