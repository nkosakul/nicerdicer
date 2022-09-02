<template>
  <h1>The Board</h1>
  <div>
    <button @click="setOnBoard(0)">Push In Column 1</button>
    <button @click="setOnBoard(1)">Push In Column 2</button>
    <button @click="setOnBoard(2)">Push In Column 3</button>

    <table>
      <tbody>
        <tr>
          <th>{{ columnOneSum }}</th>
          <th>{{ columnTwoSum }}</th>
          <th>{{ columnThreeSum }}</th>
        </tr>

        <tr v-for="(columns, index) in rotatedViewBoard" :key="index">
          <td v-for="(cell, subindex) in columns" :key="subindex">
            {{ cell }}
          </td>
        </tr>
      </tbody>
    </table>

    <div>board sum: {{ sum }}</div>
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
        return [[], [], []];
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
