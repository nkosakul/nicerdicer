import type { Game, LocalStorageSession } from '@/d';
import { useGameStore } from '@/stores/gameStore';

const defaultLocalKey = `sb-${
  new URL(import.meta.env.VITE_SUPABASE_BASE_URL).hostname.split('.')[0]
}-auth-token`;
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

  getLocalUserSession(): LocalStorageSession {
    const session = localStorage.getItem(defaultLocalKey);
    return session ? JSON.parse(session) : false;
  }
}

export default new LocalStorageRepository();
