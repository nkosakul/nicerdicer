import { supabase } from '@/supabase';

class GameRepository {
  async insertGame() {
    const { data, error } = await supabase.from('games').insert([{}]);

    return { data, error };
  }

  async markGameFinished(_gameId: string) {
    const { error } = await supabase
      .from('games')
      .update({ finished: true })
      .match({ id: _gameId });
    return { error };
  }

  async insertGameUser(_gameId: string, _hostId: string) {
    const { error } = await supabase
      .from('games_profiles')
      .insert([{ game_id: _gameId, host_id: _hostId }]);
    return { error };
  }
}

export default new GameRepository();
