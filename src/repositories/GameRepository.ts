import { supabase } from '@/supabase';
import type { PostgrestError } from '@supabase/supabase-js';
import GameProfileRepository from '@/repositories/GameProfileRepository';

class GameRepository {
  async insertGame() {
    const { data, error } = await supabase
      .from('games')
      .insert([{}])
      .select('*');

    if (error) throw error;
    if (!data || data.length < 1) return false;

    return data[0];
  }

  async deleteGame(
    _gameId: string,
    _deleter_id: string | undefined
  ): Promise<PostgrestError | null> {
    if (_deleter_id == typeof undefined) return null;
    const isOwnerOfGame = await GameProfileRepository.isOwnerOfGame(
      _deleter_id,
      _gameId
    );

    if (!isOwnerOfGame) throw Error('Only the host can delete the game.');
    const { error } = await supabase.from('games').delete().eq('id', _gameId);

    return error;
  }

  async markGameFinished(_gameId: string) {
    const { error } = await supabase
      .from('games')
      .update({ finished: true })
      .match({ id: _gameId });
    return { error };
  }

  async getGame(_game_id: string) {
    const { data } = await supabase
      .from('games')
      .select('*')
      .eq('id', _game_id)
      .limit(1);
    if (data && data?.length > 0) return data[0];
    return null;
  }
}

export default new GameRepository();
