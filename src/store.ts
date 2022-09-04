import type { User } from '@supabase/supabase-js';
import { reactive } from 'vue';
import type { Game } from './d';

export const store = reactive({
  user: null as User | null,
  game: { id: '', url: '' } as Game,
});
