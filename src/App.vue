<template>
  <app-header />

  <main class="mt-10 container">
    <the-game></the-game>
  </main>

  <app-footer />
</template>

<script setup lang="ts">
import AppFooter from '@/components/AppFooter.vue';
import AppHeader from '@/components/AppHeader.vue';
import TheGame from '@/components/TheGame.vue';
</script>
