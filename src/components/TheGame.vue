<template>
  <button :disabled="loading || !canCreateGame" @click="createGame">
    {{ loading ? 'Loading' : 'Create Game' }}
  </button>
  <div v-if="!canCreateGame">
    you have reached the limit, delete some games.
  </div>
  <br />
  <input
    v-model="joinLink"
    class="inputField"
    type="text"
    placeholder="Game URL"
  />
  <button @click="joinGame(joinLink)">Join Game</button>
  <br />
  <div>{{ gameLink !== '' ? 'find the game over: ... ' + gameLink : '' }}</div>

  <div>List Of Games:</div>
  <div v-for="(game, index) in listOfGames" :key="index">
    {{ game.game_id }}, {{ game.other_player_name }}
    <button @click="deleteGame(game.game_id)">Delete Game</button>
    <button @onclick="joinGame(game.game_id)">Join Game</button>
  </div>
</template>

<script lang="ts">
import type { Game, GameUser } from '@/d';
import { useGameStore } from '@/stores/gameStore';
import { defineComponent } from 'vue';
import GameRepository from '../repositories/GameRepository';
import GameUserRepository from '../repositories/GameUserRepository';
import LocalStorageRepository from '../repositories/LocalStorageRepository';

export default defineComponent({
  name: 'TheGame',
  data() {
    return {
      listOfGames: [] as Array<GameUser>,
      gameLink: '',
      loading: false,
      canCreateGame: true,
      localStorageGame: '',
      joinLink: '',
      gameStore: useGameStore(),
    };
  },
  methods: {
    async createGame() {
      // otherwise define create game
      try {
        this.loading = true;

        // insert game
        const { data, error } = await GameRepository.insertGame();
        if (error) throw error;

        if (data) {
          this.gameStore.setGame(data[0]);
          // insert game - user relation
          const gameId = this.gameStore.game?.id;
          const userId = this.gameStore.user?.id;
          if (gameId && userId) {
            const { error } = await GameUserRepository.insertGameUser(
              gameId,
              userId
            );
            if (error) throw error;
            this.gameLink = this.gameStore.game?.url || '';
          }
          LocalStorageRepository.setLocalGame();
        }
      } catch (error) {
        const e = error as Error;
        alert(e.message);
      } finally {
        this.loading = false;
      }
    },
    async joinGame(_game_id: string) {
      const game = await this.fetchGame(_game_id);
      // join game, returns boolean
      const hasJoinedSuccessfully = await GameUserRepository.joinGame(
        game.id,
        this.gameStore.user?.id
      );
      if (hasJoinedSuccessfully) {
        // set it in store, local storage
        this.gameStore.game = game;
        LocalStorageRepository.setLocalGame();
      }

      return;
    },
    getLocalGame(): Game | null {
      // local game in storage
      return LocalStorageRepository.getLocalGame();
    },
    async deleteGame(_game_id: string) {
      try {
        // todo delete from database
        const error = await GameRepository.deleteGame(
          _game_id,
          this.gameStore.user?.id
        );
        if (error) throw error;
        this.gameStore.setGame(null);
        LocalStorageRepository.deleteLocalGame();
        this.gameLink = '';

        this.refreshList();
        this.refreshCanCreateGame();
      } catch (error) {
        const e = error as Error;
        alert(e.message);
      }
    },
    async refreshList() {
      this.listOfGames = await GameUserRepository.listGames(
        this.gameStore.user?.id
      );
    },
    async refreshCanCreateGame() {
      this.canCreateGame = await GameUserRepository.canUserInsertGame(
        this.gameStore.user?.id
      );
    },
    async fetchGame(_game_id: string) {
      const game = await GameRepository.getGame(_game_id);
      return game;
    },
    async gameInUrl() {
      const url = window.location.pathname.split('/').filter(x => x);
      if (url.length == 2) {
        if (url[0] !== 'game') return;
        if (url[1] === '') return;

        // fetch the game, join it, remove it from URL
        this.joinGame(url[1]);
        window.location.href = window.location.origin;
      }
    },
  },
  async created() {
    this.refreshList();
    this.refreshCanCreateGame();

    // if url has game id in it
    this.gameInUrl();
  },
});
</script>
