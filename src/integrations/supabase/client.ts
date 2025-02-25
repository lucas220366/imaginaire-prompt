
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://yqbepcvnnnujsgvqmvno.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlxYmVwY3Zubm51anNndnFtdm5vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAzMTE3NjEsImV4cCI6MjA1NTg4Nzc2MX0.Grq-F9BU9Hft4RAcYACbeIN7AQgoo-9nJtEFFAjeOEk";

// Initialize the Supabase client with retry mechanism
const initSupabaseClient = () => {
  return createClient<Database>(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        storage: localStorage,
        storageKey: 'sb-auth-token'
      }
    }
  );
};

export const supabase = initSupabaseClient();

// Utility function to verify client connection
export const verifyConnection = async () => {
  try {
    const { error } = await supabase.auth.getSession();
    if (error) {
      console.error('Supabase connection error:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed to verify Supabase connection:', err);
    return false;
  }
};

// Get current session with connection verification
export const getCurrentSession = async () => {
  try {
    const isConnected = await verifyConnection();
    if (!isConnected) {
      throw new Error('Failed to connect to Supabase');
    }
    
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  } catch (err) {
    console.error('Error getting session:', err);
    return null;
  }
};
