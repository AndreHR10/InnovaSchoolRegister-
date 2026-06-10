/// <reference types="vite/client" />

import { createClient } from "@supabase/supabase-js";

declare global {
  interface ImportMetaEnv {
    readonly VITE_SUPABASE_URL: string;
    readonly VITE_SUPABASE_ANON_KEY: string;
  }
}

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_URL ||
  import.meta.env.EXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.EXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Faltan las variables de entorno VITE_SUPABASE_URL/NEXT_PUBLIC_SUPABASE_URL/EXT_PUBLIC_SUPABASE_URL o VITE_SUPABASE_ANON_KEY/NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY/EXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
