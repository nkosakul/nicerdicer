<template>
  <div class="flex items-center justify-start min-h-full">
    <div class="container w-full px-8 py-6 text-left bg-white shadow-lg">
      <!-- List of games -->
      <div class="">
        <label class="labels">Your list of games:</label>
        <table
          class="w-full flex flex-row flex-no-wrap sm:bg-white rounded-lg overflow-hidden sm:shadow-lg my-5"
        >
          <thead class="border-b">
            <tr
              class="flex-col flex-no wrap sm:table-row rounded-l-lg sm:rounded-none mb-2 sm:mb-0 hidden"
            >
              <th class="font-medium text-inherit px-4 py4 text-left">
                Created at
              </th>
              <th class="font-medium text-inherit px-4 py4 text-left">
                Opponent
              </th>
              <th class="font-medium text-inherit px-4 py4 text-left">Code</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody class="flex-1 sm:flex-none">
            <tr
              v-for="(game, index) in listOfGames"
              :key="index"
              class="flex flex-col flex-no wrap sm:table-row mb-2 sm:mb-0"
              :class="game.game_id == localGameLink ? 'bg-gray-300' : ''"
            >
              <td
                class="border-grey-light border sm:border-none p-3"
                link="{{ game.game_id }}"
              >
                {{ game.other_player_name || 'share code >>' }}
              </td>
              <td
                class="border-grey-light border sm:border-none p-3"
                link="{{ game.game_id }}"
                @click="shareLink(game.game_id)"
              >
                <button
                  class="bg-green-100 text-gray-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-gray-200 dark:text-gray-800 dark:hover:bg-gray-300"
                >
                  {{ shortenLink(game.game_id) }}
                </button>
              </td>
              <td class="border-grey-light border sm:border-none p-3">
                <button
                  class="bg-green-100 text-green-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-green-200 dark:text-green-800 dark:hover:bg-green-300"
                  @click="joinGame(game.game_id)"
                >
                  Join
                </button>
              </td>
              <td class="border-grey-light border sm:border-none p-3">
                <button
                  class="bg-red-100 text-red-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-red-200 dark:text-red-800 dark:hover:bg-red-300"
                  @click="deleteGame(game.game_id)"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- Creating -->
      <div>
        <div class="flex space-x-1 justify-end">
          <button
            class="buttons"
            :class="!canCreateGame ? 'disabled-buttons' : ''"
            :disabled="loading || !canCreateGame"
            @click="createGame"
          >
            {{ loading ? 'Loading' : 'Create Game' }}
          </button>
        </div>
        <div v-if="!canCreateGame" class="text-xs flex space-x-1 justify-end">
          you have reached the limit, delete some games.
        </div>
      </div>
      <!-- Joining -->
      <div class="mt-2">
        <label class="labels">Join with link</label>
        <input
          v-model="joinLink"
          class="input-fields"
          type="text"
          placeholder="Game URL"
        />
        <button class="buttons" @click="joinGame(joinLink)">Join Game</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import type { GameUser } from '@/d';
import { useGameStore } from '@/stores/gameStore';
import { defineComponent } from 'vue';
import GameRepository from '@/repositories/GameRepository';
import GameProfileRepository from '@/repositories/GameProfileRepository';
import LocalStorageRepository from '@/repositories/LocalStorageRepository';

export default defineComponent({
  name: 'TheGame',
  data() {
    return {
      listOfGames: [] as Array<GameUser>,
      loading: false,
      canCreateGame: true,
      localStorageGame: '',
      joinLink: '',
      gameStore: useGameStore(),
    };
  },
  computed: {
    localGameLink() {
      const game = LocalStorageRepository.getLocalGame();
      return game?.id ?? '';
    },
  },
  methods: {
    async createGame() {
      // otherwise define create game
      try {
        this.loading = true;

        // insert game
        const game = await GameRepository.insertGame();

        if (game) {
          this.gameStore.setGame(game);
          // insert game - user relation
          const gameId = this.gameStore.game?.id;
          const userId = this.gameStore.user?.id;
          if (gameId && userId) {
            const { error } = await GameProfileRepository.insertGameUser(
              gameId,
              userId
            );
            if (error) throw error;
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
      const hasJoinedSuccessfully = await GameProfileRepository.joinGame(
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

        this.refreshList();
        this.refreshCanCreateGame();
      } catch (error) {
        const e = error as Error;
        alert(e.message);
      }
    },
    async refreshList() {
      this.listOfGames = await GameProfileRepository.listGames(
        this.gameStore.user?.id
      );
    },
    async refreshCanCreateGame() {
      this.canCreateGame = await GameProfileRepository.canUserInsertGame(
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
    formatDate(date: string) {
      const dateObj = new Date(date);
      const year = dateObj.getFullYear();
      const month = dateObj.getMonth();
      const day = dateObj.getDay();
      const hour = dateObj.getHours();
      const minutes = dateObj.getMinutes();

      return `${hour}:${minutes} ${day}-${month}-${year}`;
    },
    shareLink(link: string) {
      navigator.clipboard.writeText(link);
      alert('link is copied!');
    },
    shortenLink(link: string) {
      return link.split('-')[0];
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
