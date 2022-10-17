import { createClient, type User } from '@supabase/supabase-js';
import { useGameStore } from '@/stores/gameStore';
import ProfileRepository from '@/repositories/ProfileRepository';
import type { Profile } from '@/d';

const supabaseUrl = import.meta.env.VITE_SUPABASE_BASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    storage: localStorage,
  },
});

supabase.auth.onAuthStateChange(async (event, session) => {
  const gameStore = useGameStore();

  if (event === 'SIGNED_IN') {
    const profile = await ProfileRepository.getProfile(session?.user.id);
    const resolve = session?.user as User & Profile;
    resolve.name = profile.name;
    gameStore.setUser(resolve);
    return;
  }

  if (event === 'SIGNED_OUT') {
    gameStore.resetGameStore();
  }
});
