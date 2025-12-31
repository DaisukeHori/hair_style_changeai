import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase環境変数が設定されていません。開発モードで動作します。');
}

export const supabase = createClient<Database>(
  supabaseUrl || 'http://localhost:54321',
  supabaseAnonKey || 'development-key',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  }
);

export type SupabaseClient = typeof supabase;
