import type { User } from '@supabase/supabase-js';
import { reactive } from 'vue';

export const store = reactive({
  user: null as User | null,
  game: {} as { id: string; url: string },
});
