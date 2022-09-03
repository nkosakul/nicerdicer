<template>
  <app-header></app-header>
  <TheWorld />
  <router-view></router-view>
</template>

<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue';
import TheWorld from './components/TheWorld.vue';
</script>
