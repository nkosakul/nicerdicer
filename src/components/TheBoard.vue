<template>
  <h3>The Board</h3>
  <div>
    <button @click="setOnBoard(0)">1</button>
    <button @click="setOnBoard(1)">2</button>
    <button @click="setOnBoard(2)">3</button>

    <table>
      <tbody>
        <tr>
          <th style="padding: 5px">{{ columnOneSum }}</th>
          <th style="padding: 5px">{{ columnTwoSum }}</th>
          <th style="padding: 5px">{{ columnThreeSum }}</th>
        </tr>

        <tr v-for="(columns, index) in viewedBoard" :key="index">
          <td
            v-for="(cell, subindex) in columns"
            :key="subindex"
            style="padding: 5px"
          >
            {{ cell }}
          </td>
        </tr>
      </tbody>
    </table>

    <div>
      <b>Sum: {{ sum }}</b>
    </div>
  </div>
</template>

<script lang="ts">
import {
  countOccurencesInArray,
  rotateNestedArray,
  sumColumn,
} from '@/helpers/common';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'TheBoard',
  emits: ['setBoardFromChild'],
  props: {
    board: {
      // data structure is array of arrays
      type: Array<Array<number>>,
      default: function () {
        return [[], [], []];
      },
    },
  },
  data() {
    return {
      columnOneSum: 0,
      columnTwoSum: 0,
      columnThreeSum: 0,
    };
  },
  computed: {
    viewedBoard(): number[][] {
      return rotateNestedArray(this.board);
    },
    sum(): number {
      return this.board
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
        }, 0);
    },
  },
  methods: {
    setOnBoard(_column: number) {
      this.$emit('setBoardFromChild', _column);
    },
  },
});
</script>

<style scoped></style>
