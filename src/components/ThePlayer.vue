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
import type { Profile } from '@/d';
import type { User } from '@supabase/supabase-js';

export default defineComponent({
  name: 'ThePlayer',
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
    board: {
      type: Array<Array<number>>,
      default: function () {
        return [[], [], []];
      },
    },
  },
  data() {
    return {
      rolledValue: 0 as number,
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
      const newBoard = this.pushInCol(_column);

      if (newBoard.length) {
        this.reset();
        this.syncBoard(newBoard);
        this.syncTurn();
      }
    },
    // push dice in column array
    pushInCol(_col: number): number[][] {
      if (this.board[_col].length !== 3 && this.rolledValue !== 0) {
        const copy = this.board.slice();
        copy[_col].push(this.rolledValue);
        return copy;
      }

      return [];
    },
    // reset the dice
    reset() {
      this.rolledValue = 0;
    },
    async syncBoard(_board: number[][]) {
      if (this.gameStore.game === null) return false;
      await GameProfileBoardRepository.updateBoard(
        this.player?.id,
        this.gameStore.game?.id,
        _board
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
  },
});
</script>

<style scoped></style>
