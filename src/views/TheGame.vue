<template>
  <TheGame v-if="store.user !== null && Object.keys(store.game).length === 0" />
  <TheWorld
    v-if="store.user !== null && Object.keys(store.game).length !== 0"
  />
  <TheLogin v-if="store.user === null" />
  <button v-if="store.user !== null" @click="supabase.auth.signOut()">
    Logout
  </button>
</template>

<script setup lang="ts">
import { store } from '@/store';
import { supabase } from '@/supabase';
import TheGame from '../components/TheGame.vue';
import TheLogin from '../components/TheLogin.vue';
import TheWorld from '../components/TheWorld.vue';
</script>
