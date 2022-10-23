import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { supabase } from '@/supabase';
import {
  fillBoard,
  removeTheVoid,
  playerAttackOnSubArr,
} from '@/helpers/common';

class GameProfileBoardRepo {
  async initBoard(
    _player_id: string | undefined,
    _game_id: string,
    _is_turn: boolean
  ) {
    return await supabase.from('games_profiles_boards').insert([
      {
        game_id: _game_id,
        player_id: _player_id,
        board: [
          [0, 0, 0],
          [0, 0, 0],
          [0, 0, 0],
        ],
        is_turn: _is_turn,
      },
    ]);
  }

  async fetchBoard(_player_id: string, _game_id: string) {
    const { data } = await supabase
      .from('games_profiles_boards')
      .select('board')
      .eq('game_id', _game_id)
      .eq('player_id', _player_id);

    if (!data || data.length < 1) return false;

    return removeTheVoid(data[0]['board']);
  }

  async updateBoard(
    _player_id: string,
    _game_id: string,
    _board: Array<Array<number>>,
    _column: number
  ) {
    const { data: otherPlayer } = await supabase
      .from('games_profiles_boards')
      .select('board,player_id')
      .eq('game_id', _game_id)
      .neq('player_id', _player_id);

    if (!otherPlayer) return false;

    const otherPlayerNewBoard = playerAttackOnSubArr(
      _board,
      fillBoard(otherPlayer[0]['board']),
      _column
    );

    const { error } = await supabase
      .from('games_profiles_boards')
      .update({ board: fillBoard(_board) })
      .eq('game_id', _game_id)
      .eq('player_id', _player_id);

    if (error) throw error;

    const { error: err } = await supabase
      .from('games_profiles_boards')
      .update({ board: fillBoard(otherPlayerNewBoard) })
      .eq('game_id', _game_id)
      .eq('player_id', otherPlayer[0]['player_id']);

    if (err) throw err;

    return true;
  }

  async delete(_game_id: string) {
    const { error } = await supabase
      .from('games_profiles_boards')
      .delete()
      .match({ game_id: _game_id });

    return error ? false : true;
  }

  async fetchTurn(_player_id: string, _game_id: string | undefined) {
    const { data } = await supabase
      .from('games_profiles_boards')
      .select('is_turn')
      .eq('game_id', _game_id)
      .eq('player_id', _player_id);

    if (!data || data.length < 1) return false;

    return data[0]['is_turn'];
  }

  async updateTurn(
    _player_id: string,
    _game_id: string | undefined,
    _is_turn: boolean
  ) {
    const { error } = await supabase
      .from('games_profiles_boards')
      .update({ is_turn: _is_turn })
      .eq('game_id', _game_id)
      .eq('player_id', _player_id);

    const { error: er } = await supabase
      .from('games_profiles_boards')
      .update({ is_turn: !_is_turn })
      .eq('game_id', _game_id)
      .neq('player_id', _player_id);

    if (error || er) return false;

    return true;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  subscribeBoard(thus: any, callback: any) {
    supabase
      .channel('public:games_profiles_boards')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'games_profiles_boards',
        },
        (
          payload: RealtimePostgresChangesPayload<{
            [key: string]: unknown;
          }>
        ) => {
          if (payload.new) {
            callback(thus, payload.new);
          }
        }
      )
      .subscribe();
  }
}

export default new GameProfileBoardRepo();
