<template>
  <button @click="createGame">Create Game</button>
  <button @click="joinGame">Join Game</button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'TheGame',
  data() {
    return {};
  },
  methods: {
    createGame() {
      return;
    },
    joinGame() {
      return;
    },
    created() {
      // check if game data in localstorage and join it
    },
  },
});
</script>
