<template>
  <button :disabled="loading && canCreateGame" @click="createGame">
    {{ loading ? 'Loading' : 'Create Game' }}
  </button>
  <button @click="joinGame">Join Game</button>
  <div>{{ gameLink !== '' ? 'find the game over: ... ' + gameLink : '' }}</div>
  <button @click="deleteGame">Delete Game</button>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import GameRepository from '../repositories/GameRepository';
import LocalStorageRepository from '../repositories/LocalStorageRepository';
import ProfileRepository from '../repositories/ProfileRepository';
import { store } from '../store';

export default defineComponent({
  name: 'TheGame',
  data() {
    return {};
  },
  setup() {
    const loading = ref(false);
    const gameLink = ref('');
    const canCreateGame = ref(false);

    const localGame = LocalStorageRepository.getLocalGame();
    console.log(localGame);
    if (localGame) {
      store.game = localGame;
      gameLink.value = store.game.url;
      return {
        gameLink,
      };
    }

    // otherwise define create game
    const createGame = async () => {
      try {
        loading.value = true;
        canCreateGame.value = true;

        const canUserInsert = await ProfileRepository.canUserInsertGame(
          store.user?.id
        );
        if (!canUserInsert) {
          canCreateGame.value = false;
          alert('You have created many games, please wait 12 hours.');
          return;
        }

        // insert game
        const { data, error } = await GameRepository.insertGame();
        if (error) throw error;

        if (data) {
          store.game = data[0];
          // insert game - user relation
          const gameId = store.game?.id;
          const userId = store.user?.id;
          if (gameId && userId) {
            const { error } = await GameRepository.insertGameUser(
              gameId,
              userId
            );
            if (error) throw error;
            gameLink.value = store.game?.url;
          }
          console.log('set local game');
          LocalStorageRepository.setLocalGame();
        }
      } catch (error) {
        const e = error as Error;
        alert(e.message);
      } finally {
        loading.value = false;
      }
    };

    return {
      loading,
      gameLink,
      canCreateGame,
      createGame,
    };
  },
  methods: {
    joinGame() {
      return;
    },
    deleteGame() {
      store.game = { id: '', url: '' };
      LocalStorageRepository.deleteLocalGame();
      this.gameLink = '';
      // todo delete from database
    },
  },
});
</script>
