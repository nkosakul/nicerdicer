import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import type { GameUser } from '@/d';
import { supabase } from '@/supabase';
import GameProfileBoardRepository from '@/repositories/GameProfileBoardRepository';
import ProfileRepository from '@/repositories/ProfileRepository';

class GameProfileRepository {
  async listGames(_userId: string | undefined): Promise<GameUser[]> {
    const { data } = await supabase
      .from('games_profiles')
      .select('*')
      .or(`host_id.eq.${_userId},joiner_id.eq.${_userId}`);

    const list = data?.map(async function (_data) {
      if (_userId == _data['joiner_id'] && _data['host_id']) {
        const hoster = await ProfileRepository.getProfile(_data['host_id']);

        if (!hoster) return _data;
        _data['other_player_name'] = hoster['name'];

        return _data;
      }

      if (_userId == _data['host_id'] && _data['joiner_id']) {
        const joiner = await ProfileRepository.getProfile(_data['joiner_id']);
        if (!joiner) return _data;
        _data['other_player_name'] = joiner['name'];

        return _data;
      }

      return _data;
    });

    const awaited_list = await Promise.all(list || []).then(_r => _r);

    return awaited_list as GameUser[];
  }

  async isOwnerOfGame(
    _deleter_id: string | undefined,
    _gameId: string
  ): Promise<boolean | null> {
    if (_deleter_id == typeof undefined) return null;

    const { data: isOwner } = await supabase
      .from('games_profiles')
      .select('host_id')
      .eq('host_id', _deleter_id)
      .eq('game_id', _gameId);

    if (!isOwner || isOwner.length < 1) return false;

    return true;
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

    await GameProfileBoardRepository.initBoard(_hostId, _gameId, true);

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
    const host_id = data[0].host_id;
    if (host_id === _joiner_id) return true;

    if (joiner_id === null) {
      await GameProfileBoardRepository.initBoard(_joiner_id, _game_id, false);

      const { error } = await supabase
        .from('games_profiles')
        .update({ joiner_id: _joiner_id })
        .eq('game_id', _game_id);

      if (!error) return true;
    }

    if (data[0].host_id === _joiner_id) return true;

    return false;
  }

  async getOtherPlayer(
    _game_id: string | undefined,
    _user_id: string | undefined
  ) {
    if (_user_id == typeof undefined || _game_id == typeof undefined)
      return false;

    const { data } = await supabase
      .from('games_profiles')
      .select('joiner_id,host_id')
      .eq('game_id', _game_id);

    if (!data || data.length < 1) return false;

    const host = data[0].host_id;
    const joiner = data[0].joiner_id;

    if (joiner === _user_id) return host;
    if (host === _user_id) return joiner;

    return false;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  subscribeJoiner(_game_id: string | undefined, thus: any, callback: any) {
    supabase
      .channel('public:games_profiles')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'games_profiles',
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

export default new GameProfileRepository();
