<template>
  <TheGame v-if="gameStore.user !== null && gameStore.game === null" />
  <TheWorld v-if="gameStore.user !== null && gameStore.game !== null" />
  <TheLogin v-if="gameStore.user === null" />
</template>

<script setup lang="ts">
import TheGame from '@/components/TheGame.vue';
import TheLogin from '@/components/TheLogin.vue';
import TheWorld from '@/components/TheWorld.vue';
import { useGameStore } from '@/stores/gameStore';

const gameStore = useGameStore();
</script>
