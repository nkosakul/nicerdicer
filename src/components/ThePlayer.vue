<template>
  <h2 style="color: blue">{{ name }} {{ playerId }}</h2>
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
import ProfileRepository from '@/repositories/ProfileRepository';
import {
  countOccurencesInArray,
  randomize,
  removeTheVoid,
  rotateNestedArray,
  sumColumn,
} from '@/helpers/common';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ThePlayer',
  emits: ['playedMyTurn', 'fetchMeBoss'],
  components: {
    TheBoard,
  },
  props: {
    isPlayerTurn: Boolean,
    name: { type: String, default: 'Player' },
    playerId: { type: String, default: '' },
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
      if (this.playerId === null || this.playerId === '') return false;

      const _board = await ProfileRepository.fetchBoard(this.playerId);
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
      // rotating the rotated to get the original
      const db_board = rotateNestedArray(this.rotatedBoard);
      await ProfileRepository.updateBoard(this.playerId, db_board);
    },
  },
  watch: {
    async playerId() {
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
