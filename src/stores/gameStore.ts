import type { Game } from '@/d';
import type { User } from '@supabase/supabase-js';
import { defineStore } from 'pinia';

export const useGameStore = defineStore('gameStore', {
  state: () => {
    return {
      user: null as User | null,
      game: null as Game | null,
    };
  },
  actions: {
    setUser(user: User | null) {
      this.user = user;
    },
    setGame(game: Game | null) {
      this.game = game;
    },
    deleteUser() {
      this.user = null as User | null;
    },
    deleteGame() {
      this.game = {} as Game;
    },
    resetGameStore() {
      this.user = null as User | null;
      this.game = null as Game | null;
    },
  },
});
