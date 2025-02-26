
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://yqbepcvnnnujsgvqmvno.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlxYmVwY3Zubm51anNndnFtdm5vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAzMTE3NjEsImV4cCI6MjA1NTg4Nzc2MX0.Grq-F9BU9Hft4RAcYACbeIN7AQgoo-9nJtEFFAjeOEk";

const site_url = "https://yqbepcvnnnujsgvqmvno.lovable.ai";

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
      storage: localStorage,
      storageKey: 'sb-auth-token',
      // Instead of defaultOptions, we can pass redirectTo directly
      redirectTo: `${site_url}/auth`
    }
  }
);
