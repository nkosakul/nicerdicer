<template>
  <app-header />

  <main class="mt-10 container">
    <router-view />
  </main>

  <app-footer />
</template>

<script setup lang="ts">
import AppFooter from '@/components/AppFooter.vue';
import AppHeader from '@/components/AppHeader.vue';
</script>
