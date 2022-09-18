import { supabase } from '@/supabase';
import type { PostgrestError } from '@supabase/supabase-js';
import GameUserRepository from './GameUserRepository';

class GameRepository {
  async insertGame() {
    const { data, error } = await supabase.from('games').insert([{}]);

    return { data, error };
  }

  async deleteGame(
    _gameId: string,
    _deleter_id: string | undefined
  ): Promise<PostgrestError | null> {
    if (_deleter_id == typeof undefined) return null;
    const isDeleted = await GameUserRepository.deleteRelation(
      _gameId,
      _deleter_id
    );
    if (!isDeleted) {
      return {
        message: 'You have to be the host to delete',
        details: '',
        hint: '',
        code: '',
      };
    }

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
