import { supabase } from '@/supabase';
import type { PostgrestError } from '@supabase/supabase-js';
import GameUserRepository from './GameUserRepository';

class GameRepository {
  async insertGame() {
    const { data, error } = await supabase.from('games').insert([{}]);

    return { data, error };
  }

  async deleteGame(_gameId: string): Promise<PostgrestError | null> {
    await GameUserRepository.deleteRelation(_gameId);

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
}

export default new GameRepository();
