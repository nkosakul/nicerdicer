import { supabase } from './../supabase';
class GameProfileBoardRepo {
  async initBoard(_player_id: string | undefined, _game_id: string) {
    return await supabase
      .from('games_profiles_boards')
      .insert([{ game_id: _game_id, player_id: _player_id, board: null }]);
  }

  async fetchBoard(_player_id: string, _game_id: string) {
    const { data } = await supabase
      .from('games_profiles_boards')
      .select('board')
      .eq('game_id', _game_id)
      .eq('player_id', _player_id);

    if (!data || data.length < 1) return false;

    return data[0]['board'];
  }

  async updateBoard(
    _player_id: string,
    _game_id: string,
    _board: Array<Array<number>>
  ) {
    const { data } = await supabase
      .from('games_profiles_boards')
      .update({ board: _board })
      .eq('game_id', _game_id)
      .eq('player_id', _player_id);

    if (!data || data.length < 1) return false;

    return true;
  }

  async delete(_game_id: string) {
    const { error } = await supabase
      .from('games_profiles_boards')
      .delete()
      .match({ game_id: _game_id });

    return error ? false : true;
  }
}

export default new GameProfileBoardRepo();
