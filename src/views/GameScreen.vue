<template>
  <p>
    <ThePlayer
      ref="playerOne"
      :name="'Player-One'"
      :is-player-turn="isPlayerOneTurn"
      @played-my-turn="playedMyTurn"
    />
  </p>
  <hr />
  <p>
    <ThePlayer
      ref="playerTwo"
      :name="'Player-Two'"
      :is-player-turn="isPlayerTwoTurn"
      @played-my-turn="playedMyTurn"
    />
  </p>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ThePlayer from '@/components/ThePlayer.vue';

export default defineComponent({
  name: 'TheWorld',
  components: {
    ThePlayer,
  },
  data() {
    return {
      isPlayerOneTurn: true,
      isPlayerTwoTurn: false,
    };
  },
  methods: {
    playedMyTurn() {
      if (this.isPlayerOneTurn) {
        this.isPlayerOneTurn = false;
        this.isPlayerTwoTurn = true;
        return;
      }

      if (this.isPlayerTwoTurn) {
        this.isPlayerOneTurn = true;
        this.isPlayerTwoTurn = false;
        return;
      }
    },
  },
});
</script>
