<template>
  <h2 style="color: blue">{{ player.name }}</h2>
  <button :disabled="!isPlayerTurn" @click="roll">ROLL!</button>
  <div style="padding: 5px">{{ rolledValue }}</div>
  <div class="dice"></div>

  <TheBoard :board="board" @set-board-from-child="setBoardFromChild" />
</template>

<script lang="ts">
import TheBoard from '@/components/TheBoard.vue';
import GameProfileBoardRepository from '@/repositories/GameProfileBoardRepository';
import { randomize } from '@/helpers/common';
import { defineComponent } from 'vue';
import { useGameStore } from '@/stores/gameStore';
import type { BoardSubsctiption, Profile } from '@/d';
import type { User } from '@supabase/supabase-js';

export default defineComponent({
  name: 'ThePlayer',
  emits: ['playedMyTurn'],
  components: {
    TheBoard,
  },
  props: {
    isPlayerTurn: Boolean,
    player: {
      type: Object as () => User & Profile,
      default: {} as User & Profile,
    },
    otherPlayer: {
      type: Object as () => (User & Profile) | null,
      default: null,
    },
  },
  data() {
    return {
      rolledValue: 0 as number,
      board: [[], [], []] as Array<Array<number>>,
      selectedCol: 0 as number,
      gameStore: useGameStore(),
    };
  },
  methods: {
    // roll the dice and set rolledValue
    roll(): number {
      if (this.isPlayerTurn && this.rolledValue === 0 && this.otherPlayer) {
        this.rolledValue = randomize();

        return this.rolledValue;
      }

      return this.rolledValue;
    },
    // emitted by the board, pushInCol, reset, calculateSum
    setBoardFromChild(_column: number) {
      const success = this.pushInCol(_column);

      if (success) {
        this.reset();
        this.syncBoard();
        this.syncTurn();
      }
    },
    // push dice in column array
    pushInCol(_col: number): boolean {
      if (this.board[_col].length !== 3 && this.rolledValue !== 0) {
        this.board[_col].push(this.rolledValue);
        return true;
      }

      return false;
    },
    // reset the dice
    reset() {
      this.rolledValue = 0;
    },
    async fetchBoard() {
      if (this.player === null) return false;
      if (this.gameStore.game === null) return false;

      const _board = await GameProfileBoardRepository.fetchBoard(
        this.player.id,
        this.gameStore.game?.id
      );
      if (_board) {
        this.board = _board;
      }
      return true;
    },
    async syncBoard() {
      if (this.gameStore.game === null) return false;
      await GameProfileBoardRepository.updateBoard(
        this.player?.id,
        this.gameStore.game?.id,
        this.board
      );
    },
    async syncTurn() {
      if (this.gameStore.game === null) return false;
      await GameProfileBoardRepository.updateTurn(
        this.player?.id,
        this.gameStore.game?.id,
        !this.isPlayerTurn
      );
    },
    subscribeBoard() {
      GameProfileBoardRepository.subscribeBoard(
        this.player.id,
        this,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        function callbackFunciton(thus: any, board: BoardSubsctiption) {
          if (board.player_id === thus.player?.id && board.board) {
            thus.board = board.board;
            thus.$emit('playedMyTurn', {
              player: board.player_id,
              is_turn: board.is_turn,
            });
          }
        }
      );
    },
  },
  watch: {
    async player() {
      await this.fetchBoard();
    },
  },
  async created() {
    await this.fetchBoard();
  },
  mounted() {
    this.subscribeBoard();
  },
});
</script>

<style scoped></style>
