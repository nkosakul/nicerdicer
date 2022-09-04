import { supabase } from '@/supabase';

class ProfileRepository {
  async canUserInsertGame(_userId: string | undefined): Promise<boolean> {
    if (_userId == typeof undefined) return false;
    const numberOfGames = await supabase
      .from('games_profiles')
      .select('host_id', { count: 'exact' })
      .eq('host_id', _userId);

    const count = numberOfGames.count || 0;
    return count < 3;
  }
}

export default new ProfileRepository();
