<template>
  <h2 style="color: blue">{{ player.name }}</h2>
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
        this.calculateSum();
        this.syncBoard();
        this.syncTurn();
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
    // set board
    setBoard(_board: number[][]) {
      // rotating the original to get the rotated view
      this.rotatedBoard = rotateNestedArray(_board);
      // remove the zeros from the orignal
      this.board = removeTheVoid(_board);
      this.calculateSum();
    },
    async fetchBoard() {
      if (this.player === null) return false;
      if (this.gameStore.game === null) return false;

      const _board = await GameProfileBoardRepository.fetchBoard(
        this.player.id,
        this.gameStore.game?.id
      );
      if (_board) {
        this.setBoard(_board);
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
            thus.setBoard(board.board);
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
