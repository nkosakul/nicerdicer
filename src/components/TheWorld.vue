<template>
  <p>Join on this code: {{ gameStore.game?.id || '' }}</p>
  <p>
    <ThePlayer
      ref="playerOne"
      :is-player-turn="localPlayerTurn"
      :board="localBoard"
      :other-player="otherPlayer"
      :player="localPlayer"
    />
  </p>
  <hr />
  <p>
    <ThePlayer
      v-if="otherPlayer"
      ref="playerTwo"
      :is-player-turn="otherPlayerTurn"
      :board="otherBoard"
      :player="otherPlayer"
    />
  </p>
</template>

<script lang="ts">
import ThePlayer from '@/components/ThePlayer.vue';
import LocalStorageRepository from '@/repositories/LocalStorageRepository';
import ProfileRepository from '@/repositories/ProfileRepository';
import { useGameStore } from '@/stores/gameStore';
import { defineComponent } from 'vue';
import type { User } from '@supabase/supabase-js';
import type { BoardSubsctiption, GameUser, Profile } from '@/d';
import GameProfileBoardRepository from '@/repositories/GameProfileBoardRepository';
import GameProfileRepository from '@/repositories/GameProfileRepository';
import { removeTheVoid } from '@/helpers/arrayHelper';
import { shareLink, shortenLink } from '@/helpers/common';

export default defineComponent({
  name: 'TheWorld',
  components: {
    ThePlayer,
  },
  data() {
    return {
      gameStore: useGameStore(),
      otherPlayer: null as (User & Profile) | null,
      localPlayerTurn: true,
      otherPlayerTurn: false,
      localBoard: [[], [], []] as Array<Array<number>>,
      otherBoard: [[], [], []] as Array<Array<number>>,
    };
  },
  computed: {
    localPlayer(): User & Profile {
      const localSession = LocalStorageRepository.getLocalUserSession();

      if (!localSession) throw new Error();
      const localSessionUser = localSession?.user;

      return this.gameStore.user || localSessionUser;
    },
  },
  methods: {
    async playedMyTurn(player_id: string, is_turn: boolean) {
      if (this.localPlayer.id === player_id) {
        this.localPlayerTurn = is_turn;
        this.otherPlayerTurn = !is_turn;
      } else {
        this.localPlayerTurn = !is_turn;
        this.otherPlayerTurn = is_turn;
      }
    },
    async fetchOtherPlayer() {
      // find other users connected to this game.
      const _game_id = this.gameStore.game?.id;
      const otherplayer = await ProfileRepository.getOtherPlayer(
        _game_id,
        this.gameStore.user?.id
      ).then(_ => _);

      if (!otherplayer) return;

      this.otherPlayer = otherplayer;
      return otherplayer;
    },
    async fetchPlayersTurns() {
      this.localPlayerTurn = await GameProfileBoardRepository.fetchTurn(
        this.localPlayer.id,
        this.gameStore.game?.id
      );

      this.otherPlayerTurn = !this.localPlayerTurn;
    },
    async fetchBoards() {
      if (this.gameStore.game === null) return false;

      const localBoard = await GameProfileBoardRepository.fetchBoard(
        this.localPlayer.id,
        this.gameStore.game?.id
      );
      if (localBoard) {
        this.localBoard = localBoard;
      }

      if (this.otherPlayer) {
        const otherBoard = await GameProfileBoardRepository.fetchBoard(
          this.otherPlayer.id,
          this.gameStore.game?.id
        );
        if (otherBoard) {
          this.otherBoard = otherBoard;
        }
      }

      return true;
    },
    subscribeJoiner() {
      GameProfileRepository.subscribeJoiner(
        this.gameStore.game?.id,
        this,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        async function callbackFunciton(thus: any, joiner: GameUser) {
          if (joiner.joiner_id) {
            await thus.fetchOtherPlayer();
            await thus.fetchBoards();
          }
        }
      );
    },
    subscribeBoard() {
      GameProfileBoardRepository.subscribeBoard(
        this,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        function callbackFunciton(thus: any, board: BoardSubsctiption) {
          if (!board.board) return;

          if (board.player_id === thus.localPlayer.id) {
            if (board.is_turn != thus.localPlayerTurn) {
              // it is a turn update
              thus.playedMyTurn(board.player_id, board.is_turn);
              return;
            }
            // it is a board update
            thus.localBoard = removeTheVoid(board.board);
            return;
          }

          if (board.player_id === thus.otherPlayer.id) {
            if (board.is_turn != thus.otherPlayerTurn) {
              // it is a turn update
              thus.playedMyTurn(board.player_id, board.is_turn);
              return;
            }
            // it is a board update
            thus.otherBoard = removeTheVoid(board.board);
            return;
          }
        }
      );
    },
    shareLink(link: string) {
      shareLink(link);
    },
    shortenLink(link: string) {
      return shortenLink(link);
    },
  },
  async created() {
    await this.fetchOtherPlayer();
    await this.fetchPlayersTurns();
    await this.fetchBoards();
  },
  mounted() {
    this.subscribeJoiner();
    this.subscribeBoard();
  },
});
</script>
