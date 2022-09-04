import type { User } from '@supabase/supabase-js';
import type { Game } from '@/d';
import { defineStore } from 'pinia';

export const useGameStore = defineStore('gameStore', {
  state: () => {
    return {
      user: null as User | null,
      game: {} as Game,
    };
  },
  actions: {
    setUser(user: User | null) {
      this.user = user;
    },
    setGame(game: Game) {
      this.game = game;
    },
    deleteUser() {
      this.user = null as User | null;
    },
    deleteGame() {
      this.game = {} as Game;
    },
  },
});
