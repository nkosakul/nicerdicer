import { supabase } from '@/supabase';
import GameUserRepository from './GameUserRepository';

class ProfileRepository {
  async getProfile(_userId: string) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', _userId);

    if (!data || data.length < 1) return false;

    return data[0];
  }

  async getOtherPlayer(
    _game_id: string | undefined,
    _user_id: string | undefined
  ) {
    const _other_player_id = await GameUserRepository.getOtherPlayer(
      _game_id,
      _user_id
    );
    const { data } = await this.getProfile(_other_player_id);
    if (!data || data.length < 1) return null;

    return data[0].id;
  }

  async fetchBoard(_player_id: string) {
    const { data } = await supabase
      .from('profiles')
      .select('board')
      .eq('id', _player_id)
      .limit(1);

    if (!data || data.length < 1) return null;
    return data[0].board;
  }

  async updateBoard(_player_id: string, _board: Array<Array<number>>) {
    if (supabase.auth.user()?.id !== _player_id) return false;
    const { data } = await supabase
      .from('profiles')
      .update({ board: _board })
      .eq('id', _player_id);

    if (!data || data.length < 1) return false;

    return true;
  }
}

export default new ProfileRepository();
