<template>
  <button @click="roll">You can roll this once!</button>
  <div>{{ num }}</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'TheDice',
  data() {
    return {
      num: 0 as number,
      isRolled: false as boolean,
    };
  },
  methods: {
    randomize(): number {
      // max is 6, min is 1
      const random = Math.floor(Math.random() * (6 - 1) + 1);
      this.num = random;

      return random;
    },
    roll(): number {
      if (!this.isRolled) {
        this.isRolled = true;

        return this.randomize();
      }

      return this.num;
    },
  },
});
</script>

<style scoped></style>
