<template>
  <h2 style="color: blue">{{ player?.name }}</h2>
  <button :disabled="!isPlayerTurn" @click="roll">ROLL!</button>
  <div style="padding: 5px">{{ rolledValue }}</div>
  <div class="dice"></div>

  <TheBoard
    :board="board"
    :rotated-view-board="rotatedBoard"
    :sum="sum"
    :column-one-sum="columnOneSum"
    :column-two-sum="columnTwoSum"
    :column-three-sum="columnThreeSum"
    @set-board-from-child="setBoardFromChild"
  />
</template>

<script lang="ts">
import TheBoard from '@/components/TheBoard.vue';
import GameProfileBoardRepository from '@/repositories/GameProfileBoardRepository';
import {
  countOccurencesInArray,
  randomize,
  removeTheVoid,
  rotateNestedArray,
  sumColumn,
} from '@/helpers/common';
import { defineComponent } from 'vue';
import { useGameStore } from '@/stores/gameStore';

export default defineComponent({
  name: 'ThePlayer',
  emits: ['playedMyTurn', 'fetchMeBoss'],
  components: {
    TheBoard,
  },
  props: {
    isPlayerTurn: Boolean,
    // eslint-disable-next-line vue/require-default-prop
    player: null,
  },
  data() {
    return {
      rolledValue: 0 as number,
      board: [[], [], []] as Array<Array<number>>,
      rotatedBoard: [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
      ] as Array<Array<number>>,
      sum: 0 as number,
      selectedCol: 0 as number,
      columnOneSum: 0 as number,
      columnTwoSum: 0 as number,
      columnThreeSum: 0 as number,
      gameStore: useGameStore(),
    };
  },
  methods: {
    // roll the dice and set rolledValue
    roll(): number {
      if (this.isPlayerTurn && this.rolledValue === 0) {
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
        this.calculateSum();
        this.syncBoard();
        this.$emit('playedMyTurn');
      }
    },
    // push dice in column array
    pushInCol(_col: number): boolean {
      if (this.board[_col].length !== 3 && this.rolledValue !== 0) {
        this.board[_col].push(this.rolledValue);
        this.rotatedBoard = rotateNestedArray(this.board);
        return true;
      }

      return false;
    },
    // calculate sum, by column then reduce to all board
    calculateSum(): number {
      return (this.sum = this.board
        .map((column: number[], index: number) => {
          // [number => count]
          const map_number_count: number[] = countOccurencesInArray(column);
          const columnSum = sumColumn(map_number_count);

          // set columns sums
          if (index === 0) {
            this.columnOneSum = columnSum;
          }
          if (index === 1) {
            this.columnTwoSum = columnSum;
          }
          if (index === 2) {
            this.columnThreeSum = columnSum;
          }

          return columnSum;
        })
        .reduce((acc, _count) => {
          return acc + _count;
        }, 0));
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
        // rotating the original to get the rotated view
        this.rotatedBoard = rotateNestedArray(_board);
        // remove the zeros from the orignal
        this.board = removeTheVoid(_board);
        this.calculateSum();
      }
      return true;
    },
    async syncBoard() {
      if (this.gameStore.game === null) return false;
      // rotating the rotated to get the original
      const db_board = rotateNestedArray(this.rotatedBoard);
      await GameProfileBoardRepository.updateBoard(
        this.player?.id,
        this.gameStore.game?.id,
        db_board
      );
    },
  },
  watch: {
    async player() {
      await this.fetchBoard();
    },
  },
  async created() {
    this.$emit('fetchMeBoss');
    await this.fetchBoard();
  },
});
</script>

<style scoped></style>
