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

        <tr v-for="(columns, index) in rotatedViewBoard" :key="index">
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
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'TheBoard',
  emits: ['setBoardFromChild'],
  props: {
    board: {
      // data structure is array of arrays with push and pop
      type: Array<Array<number>>,
      default: function () {
        return [[], [], []];
      },
    },
    rotatedViewBoard: {
      // data structure is array of arrays with push and pop
      type: Array<Array<number>>,
      default: function () {
        return [
          [0, 0, 0],
          [0, 0, 0],
          [0, 0, 0],
        ];
      },
    },
    sum: {
      type: [Number],
      default: 0,
    },
    columnOneSum: {
      type: Number,
      default: 0,
    },
    columnTwoSum: {
      type: Number,
      default: 0,
    },
    columnThreeSum: {
      type: Number,
      default: 0,
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
