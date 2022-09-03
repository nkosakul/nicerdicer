<script setup lang="ts">
import TheLogin from './components/TheLogin.vue';
import TheWorld from './components/TheWorld.vue';
import { store } from './store';
import { supabase } from './supabase';
</script>

<template>
  <h1>LETS GO!</h1>
  <TheWorld v-if="Object.keys(store.user).length !== 0" />
  <TheLogin v-if="Object.keys(store.user).length === 0" />
  <button
    v-if="Object.keys(store.user).length !== 0"
    @click="supabase.auth.signOut()"
  >
    Logout
  </button>
</template>
