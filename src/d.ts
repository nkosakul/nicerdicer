import type { User } from '@supabase/supabase-js';

export interface Game {
  id: string;
  url: string;
}

export interface Profile {
  name: string;
}

export interface GameUser {
  id: string;
  host_id: string;
  game_id: string;
  joiner_id: string;
  other_player_name: string;
  created_at: string;
}

export interface LocalStorageSession {
  user: User & Profile;
}

export interface BoardSubsctiption {
  board: number[][];
  player_id: string;
  is_turn: boolean;
}
