<template>
  <app-header></app-header>

  <main class="mt-10 container">
    <router-view></router-view>
  </main>

  <app-footer></app-footer>
</template>

<script setup lang="ts">
import AppFooter from '@/components/AppFooter.vue';
import AppHeader from '@/components/AppHeader.vue';
</script>
