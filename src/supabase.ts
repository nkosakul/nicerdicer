import { createClient } from '@supabase/supabase-js';
import { store } from './store';

const supabaseUrl = import.meta.env.VITE_SUPABASE_BASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  autoRefreshToken: true,
  persistSession: true,
  localStorage,
});

supabase.auth.onAuthStateChange((event, session) => {
  store.user = session?.user || supabase.auth.user();
});
