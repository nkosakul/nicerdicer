<template>
  <div class="prose text-center max-w-full">
    <h1>Welcome to NicerDicer!</h1>
    <p>
      A dice game, base on the mini-game "knucklebones" from the game "Cult of
      the lamp", which you can play with your friends (or enemies)!
      <br />
      Make sure to
      <router-link :to="{ name: 'manual' }">learn about the game</router-link>
      first, before start playing!
    </p>
  </div>

  <game-mode />
</template>

<script setup lang="ts">
import GameMode from '@/components/GameMode.vue';
</script>
