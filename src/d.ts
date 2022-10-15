import type { User } from '@supabase/supabase-js';

export interface Game {
  id: string;
  url: string;
}

export interface GameUser {
  id: string;
  host_id: string;
  game_id: string;
  joiner_id: string;
  other_player_name: string;
}

export interface LocalStorageSession {
  currentSession: Record<'user', User>;
}
