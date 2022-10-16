import { createClient } from '@supabase/supabase-js';
import { useGameStore } from '@/stores/gameStore';

const supabaseUrl = import.meta.env.VITE_SUPABASE_BASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    storage: localStorage,
  },
});

supabase.auth.onAuthStateChange((_, session) => {
  const gameStore = useGameStore();
  gameStore.setUser(session?.user || null);
});
