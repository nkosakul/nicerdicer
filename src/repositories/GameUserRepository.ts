import type { GameUser } from '../d';
import { supabase } from '../supabase';

class GameUserRepository {
  async listGames(_userId: string | undefined): Promise<GameUser[]> {
    // todo find joiner_id name
    const { data } = await supabase
      .from('games_profiles')
      .select('*')
      .or(`host_id.eq.${_userId},joiner_id.eq.${_userId}`);
    return data as GameUser[];
  }

  async deleteRelation(
    _gameId: string,
    _deleter_id: string | undefined
  ): Promise<boolean | null> {
    if (_deleter_id == typeof undefined) return null;
    const { data } = await supabase
      .from('games_profiles')
      .delete()
      .match({ game_id: _gameId, host_id: _deleter_id });
    return data?.length ? true : false;
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

  async joinGame(
    _game_id: string,
    _joiner_id: string | undefined
  ): Promise<boolean> {
    if (_joiner_id == typeof undefined) return false;
    const { data } = await supabase
      .from('games_profiles')
      .select('*')
      .eq('game_id', _game_id)
      .limit(1);

    if (!data || data.length < 1) return false;

    const joiner_id = data[0].joiner_id;
    if (joiner_id === _joiner_id) return true;

    if (joiner_id === null) {
      const { error } = await supabase
        .from('games_profiles')
        .update({ joiner_id: _joiner_id })
        .eq('game_id', _game_id);

      if (!error) return true;
    }

    if (data[0].host_id === _joiner_id) return true;

    return false;
  }
}

export default new GameUserRepository();
