import type { Game, LocalStorageSession } from '../d';
import { store } from '../store';

class LocalStorageRepository {
  getLocalGame(): Game | null {
    console.log('localgame');
    const game = localStorage.getItem('supabase_games');
    return game ? JSON.parse(game) : null;
  }

  setLocalGame() {
    localStorage.setItem('supabase_games', JSON.stringify(store.game));
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
