import type { PostgrestError } from '@supabase/postgrest-js';
import type { GameUser } from '../d';
import { supabase } from '../supabase';

class GameUserRepository {
  async listGames(_userId: string | undefined): Promise<GameUser[]> {
    // todo find joiner_id name
    const { data } = await supabase
      .from('games_profiles')
      .select('*')
      .eq('host_id', _userId);
    return data as GameUser[];
  }

  async deleteRelation(_gameId: string): Promise<PostgrestError | null> {
    const { error } = await supabase
      .from('games_profiles')
      .delete()
      .eq('game_id', _gameId);
    return error;
  }

  async canUserInsertGame(_userId: string | undefined): Promise<boolean> {
    if (_userId == typeof undefined) return false;
    const numberOfGames = await supabase
      .from('games_profiles')
      .select('host_id', { count: 'exact' })
      .eq('host_id', _userId);

    const count = numberOfGames.count || 0;
    return count < 3;
  }

  async insertGameUser(_gameId: string, _hostId: string) {
    const { error } = await supabase
      .from('games_profiles')
      .insert([{ game_id: _gameId, host_id: _hostId }]);
    return { error };
  }
}

export default new GameUserRepository();
