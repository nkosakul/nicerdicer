import { supabase } from '@/supabase';
import GameProfileRepository from './GameProfileRepository';

class ProfileRepository {
  async getProfile(_userId: string | undefined) {
    if (_userId == typeof undefined || !_userId) return null;

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
    const _other_player_id = await GameProfileRepository.getOtherPlayer(
      _game_id,
      _user_id
    );

    if (!_other_player_id) return false;

    const data = await this.getProfile(_other_player_id);

    if (!data || data.length < 1) return false;

    return data;
  }
}

export default new ProfileRepository();
