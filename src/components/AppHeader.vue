<template>
  <header class="py-4 bg-ci">
    <div class="container flex items-center justify-between text-white">
      <p>TODO: LOGO</p>
      <nav aria-labelledby="nav-label">
        <span id="nav-label" class="sr-only">Main Navigation</span>
        <ul class="flex items-center gap-6">
          <li>
            <button
              v-if="gameStore.user !== null"
              @click="supabase.auth.signOut()"
            >
              Logout
            </button>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>
<script setup lang="ts">
import { useGameStore } from '@/stores/gameStore';
import { supabase } from '@/supabase';

const gameStore = useGameStore();
</script>
