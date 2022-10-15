import type { Game, LocalStorageSession } from '@/d';
import { useGameStore } from '@/stores/gameStore';

class LocalStorageRepository {
  getLocalGame(): Game | null {
    const game = localStorage.getItem('supabase_games');
    return game ? JSON.parse(game) : null;
  }

  setLocalGame() {
    const gameStore = useGameStore();
    localStorage.setItem('supabase_games', JSON.stringify(gameStore.game));
  }

  deleteLocalGame() {
    localStorage.removeItem('supabase_games');
  }

  getLocalUserSession(): LocalStorageSession | null {
    const session = localStorage.getItem('supabase.auth.token');
    return session ? JSON.parse(session) : null;
  }
}

export default new LocalStorageRepository();
