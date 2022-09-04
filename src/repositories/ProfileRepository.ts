import { supabase } from '@/supabase';

class ProfileRepository {
  async getProfile(_userId: string) {
    return await supabase.from('profiles').select('*').eq('id', _userId);
  }
}

export default new ProfileRepository();
