<template>
  <div class="flex justify-center gap-10 mt-10">
    <button
      class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      @click="createGame"
    >
      Create Game
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { addGameToLocalStorage } from '@/helpers/localStorage';
import type { GameInfoType } from '@/helpers/localStorage';

export default defineComponent({
  name: 'GameMode',
  methods: {
    createGame() {
      const timestamp = Date.now(); // get current timestamp
      const gameId = timestamp.toString(36); // convert numbers into letters
      const playerInfo: GameInfoType = {
        gameId,
        playerId: 1,
      };

      addGameToLocalStorage(playerInfo);
      // TODO: add game to database
      // TODO: when game is created in database, redirect to game page (else throw error)
    },
  },
});
</script>
