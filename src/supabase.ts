import { createClient } from '@supabase/supabase-js';
import { useGameStore } from '@/stores/gameStore';

const supabaseUrl = import.meta.env.VITE_SUPABASE_BASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  autoRefreshToken: true,
  persistSession: true,
  localStorage,
});

supabase.auth.onAuthStateChange((_, session) => {
  const user = session?.user || supabase.auth.user();
  const gameStore = useGameStore();
  gameStore.setUser(user);
});
