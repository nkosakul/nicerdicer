import type { User } from '@supabase/supabase-js';

export interface Game {
  id: string;
  url: string;
}

export interface LocalStorageSession {
  currentSession: Record<'user', User>;
}
