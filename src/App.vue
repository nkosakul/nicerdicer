<template>
  <app-header></app-header>

  <main class="mt-10">
    <router-view></router-view>
  </main>

  <app-footer></app-footer>
</template>

<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue';
import AppFooter from '@/components/AppFooter.vue';
</script>
